import axios from 'axios';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

const url = 'https://api.cpfcnpj.com.br';

const apiCpf = async (cpf) => {
  try {
    let credential = await getCredentical();

    if (!credential || !credential.token) {
      return false;
    }

    let pacote = 2;
    if (credential.pacote) {
      pacote = credential.pacote;
    }

    let cleanCpf = `${cpf}`.replace(/\D/g,"")
    const {data: response} = await axios.get(`${url}/${credential.token}/${pacote}/${cleanCpf}`);

    if (!response.status || response.status !== 1) {
      return false;
    }

    return {
      cpf: `${response.cpf}`.replace(/\D/g,""),
      cpfMask: response.cpf,
      full_name: response?.nome || '',
      date_of_birth: response?.nascimento || '',
      mother: response?.mae || '',
      genre: response?.genero || '',
    }

  } catch (err) {
    return false;
  }
}

const getCredentical = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let settings = await AsyncStorage.getItem('settings');
      if (settings) {
        settings = JSON.parse(settings);
      }

      if (settings && settings.cpfCnpjApi) {
        return resolve(settings.cpfCnpjApi);
      }

      settings = firebase.database().ref('settings');
      settings.once('value', settingsData => {
        let data = settingsData.val();
        if (data && data.cpfCnpjApi) {
          AsyncStorage.setItem('settings', JSON.stringify(data));
          return resolve(data.cpfCnpjApi);
        }

        resolve(null);
      });
    } catch (error) {
      console.log("Asyncstorage issue 5");
      resolve(null);
    }
  });
}

export default apiCpf;
