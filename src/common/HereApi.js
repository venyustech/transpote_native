import axios from 'axios'
import { AsyncStorage } from 'react-native'
import * as firebase from 'firebase'

// const apiKey = 'f1Wpp1zITw02ASBaDq1a-Od1WMtbxLuWGsXUu9_FJKs';
// const ulr = 'https://intermodal.router.hereapi.com/v8';

// export const getHeroDriverTime = async (origin, destination) => {
//   try {
//     const {data: response} = axios.get(
//       `${url}/routes?apiKey=${apiKey}&origin=${origin}&destination=${destination}`
//     );

//     return response;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

const getCredentical = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let settings = await AsyncStorage.getItem('settings')
      if (settings) {
        settings = JSON.parse(settings)
      }

      if (settings && settings.hereApi) {
        return resolve(settings.hereApi)
      }

      settings = firebase.database().ref('settings')
      settings.once('value', settingsData => {
        const data = settingsData.val()
        if (data && data.hereApi) {
          AsyncStorage.setItem('settings', JSON.stringify(data))
          return resolve(data.hereApi)
        }

        resolve(null)
      })
    } catch (error) {
      console.log('Asyncstorage issue 5')
      resolve(null)
    }
  })
}

export const geoReverseHereApi = async (latitude, longitude) => {
  try {
    const credential = await getCredentical()

    if (credential && credential.apiKey) {
      const latLong = `${Number(latitude)},${Number(longitude)}`
      const lang = 'PT'

      const { data: response } = await axios.get(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?apiKey=${credential.apiKey}&at=${latLong}&lang=${lang}`
      )

      if (response && response.items && response.items.length) {
        return response.items[0]?.address?.label
      }
    }

    return ''
  } catch (err) {
    return ''
  }
}
