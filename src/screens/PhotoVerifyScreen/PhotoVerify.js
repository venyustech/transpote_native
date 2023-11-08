import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  TouchableHighlight,
  Text,
  AsyncStorage,
  ImageBackground,
  BackHandler,
} from 'react-native';
import axios from "axios";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

import styles from './Style';
import { colors } from '../../common/theme';
import backImage from '../../../assets/images/screens/photoverify/background.png'
import userExample from '../../../assets/images/profilePic.png'
import buttonImage from '../../../assets/images/screens/photoverify/button-photo.png'

const PhotoVerify = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [face1, setFace1] = useState(null);
  const [face2, setFace2] = useState({});
  const [counterrors, setCounterrors] = useState(0);
  const [loadingModal, setLoadingModal] = useState(false);
  const [settings, setSettings] = useState({});
  const [loginType, setLoginType] = useState('');

  useEffect(() => {
    const init = async () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      var curuser = firebase.auth().currentUser;
      const userData = firebase.database().ref('users/' + curuser.uid);
      if (curuser.email) setLoginType('email');
      userData.once('value', userData => {
        setUser(userData.val());
        const settings = firebase.database().ref('settings');
        settings.once('value', settingsData => {
          setSettings(settingsData.val());
        })
      })
    }

    init();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }
  }, [counterrors]);

  useEffect(() => {
    if (settings?.azurefaceurl && user?.profile_image) {
      DetectPhoto(user?.profile_image, "user");
    }
  }, [settings, user]);

  const handleBackButton = () => {
    // ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
    return true;
  }

  const DetectPhoto = async (foto, de) => {
    try {
      let url = settings?.azurefaceurl + "/face/v1.0/detect?returnFaceId=true"
      const headers = {
        'Ocp-Apim-Subscription-Key': settings?.azurefacekey,
        'Content-Type': 'application/json'
      }

      const data = JSON.stringify({ url: foto })
      await axios.post(url, data, { headers: headers }).then((res) => {
        if (Array.isArray(res.data)) {
          if (res.data.length === 0) {
            alert("Não foi possível identificar um rosto na imagem. Certifique-se de estar em um local claro e que a foto não esteja tremida e tente novamente.");
            return;
          } else if (res.data.length > 1) {
            alert("Foi identificado mais um rosto na foto. Certifique-se de estar sozinho e em um local claro e que a foto não esteja tremida e tente novamente.");
            return;
          }
        } else {
          alert("Não foi possível confirmar sua identidade. Certifique-se de estar em um local claro e que a foto não esteja tremida.")
          return;
        }

        if (de == "user") {
          setFace1(res.data[0]?.faceId);
        }

        if (de == "camera") {
          VerifyPhoto(res.data[0]?.faceId, foto);
        }

      }).catch((error) => {
        if (Number(counterrors) > 3) {
          alert("Ocorreram vários erros, continue tentando ou procure ajuda em nosso site..")
        } else {
          const total = Number(counterrors) + 1;
          setCounterrors(total);
        }
      })
    } catch (error) {
      console.log('Erro na requisição', error);
    }
  }

  const DetectPhotoCamera = async (fotourl) => {
    setLoadingModal(true);
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
        };
        xhr.onerror = function () {
          reject(new TypeError('Image blob conversion issue'));
          //this.setState({ loading: false });
          alert(languageJSON.upload_image_error);
        };
        xhr.responseType = 'blob'; // use BlobModule's UriHandler
        xhr.open('GET', fotourl, true); // fetch the blob from uri in async mode
        xhr.send(null); // no initial data
      });

      var imageRef = firebase.storage().ref().child(`users/temp/${firebase.auth().currentUser.uid}`)
      return imageRef.put(blob).then(() => {
        blob.close()
        return imageRef.getDownloadURL()
      }).then((dwnldurl) => {
        DetectPhoto(dwnldurl, "camera")
        setLoadingModal(false);
      }).catch(error => {
        setLoadingModal(false);
        alert(JSON.stringify(error));
      });
    } catch (error) {
      setLoadingModal(false);
      alert('Erro ao detectar foto da camera');
    }
  }

  const VerifyPhoto = async (face2, foto = null) => {
    setLoadingModal(true);
    let url = settings?.azurefaceurl + "/face/v1.0/verify"
    const headers = {
      'Ocp-Apim-Subscription-Key': settings?.azurefacekey,
      'Content-Type': 'application/json'
    }

    let faceCompare = face1 !== null ? face1 : face2

    const data = {
      faceId1: faceCompare,
      faceId2: face2
    }

    axios.post(url, data, { headers: headers }).then(async (res) => {
      if (res.data.isIdentical === true) {
        setLoadingModal(false);
        AsyncStorage.setItem('logged', "true");

        if (faceCompare === face2 && foto) {
          await updatePhotouser(foto);
        }

        navigation.navigate('Map');
      } else {
        setLoadingModal(false);
        alert("Não foi possível confirmar sua identidade, a foto não tem semelhança com a foto enviada no cadastro. ")
      }
    }).catch((error) => {
      setLoadingModal(false);
      alert("Ocorreu um erro ao ler a imagem." + JSON.stringify(error))
    })
  }

  const CapturePhoto = async () => {
    //permission check
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA)
    const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [3, 3],
        base64: true,
        cameraType: 'front',
        quality: 0.6

      });
      if (!result.cancelled) {
        //let data = 'data:image/jpeg;base64,'+ result.base64
        //const sourceData = 'data:image/jpeg;base64,' + result.base64;
        DetectPhotoCamera(result.uri);
      }
    } else {
      alert('Não temos permissão para acessar sua camera.')
      throw new Error('Camera permission not granted');
    }
  }

  // link user photo
  const updatePhotouser = async (image) => {
    try {
      setLoadingModal(true);
      let blob = await getBlod(image);
      await up(blob);
      setLoadingModal(false);
    } catch (err) {
      console.log('fail updatePhotouser', err);
      setLoadingModal(false);
    }
  };


  const getBlod = async (image) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Image blob conversion issue'));
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', image, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });
  };

  const up = async (blob) => {
    return new Promise((resolve, _reject) => {
      let useruid = firebase.auth().currentUser.uid;

      var imageRef = firebase.storage().ref().child(`users/${useruid}`);
      return imageRef.put(blob).then(() => {
        blob.close()
        return imageRef.getDownloadURL()
      }).then((dwnldurl) => {
        let regData = {
          profile_image: dwnldurl
        }

        firebase.database().ref(`users/${useruid}`).update(regData).then(() => {
          resolve(true);
        })
      }).catch(error => {
        resolve(false);
      });
    });
  }


  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={loadingModal}
        onRequestClose={() => {
          setLoadingModal(false);
        }}>
        <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
              <Image
                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                source={require('../../../assets/images/loader.gif')}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#000", fontSize: 16, }}>Aguarde... verificando a imagem</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <ImageBackground source={backImage} style={styles.containerBackground}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>INSTRUÇÃO</Text>
            <Text style={styles.description}>Tire uma foto de sua face para confirmar sua identidade.</Text>
            <Text style={styles.description}>Preencha o quadrado com seu rosto e certifique-se de estar em um local bem iluminado.</Text>
            <Image style={styles.logo} source={user?.profile_image ? { uri: user?.profile_image } : userExample} />
            {settings?.azurefaceurl ? (
              <TouchableHighlight onPress={() => { CapturePhoto() }} >
                <Image style={styles.button} source={buttonImage} />
              </TouchableHighlight>
            ) : null}
          </View>
        </ImageBackground>
      </View>
    </>
  )
}

export default PhotoVerify;
