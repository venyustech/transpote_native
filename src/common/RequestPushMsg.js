import languageJSON from './language'
import axios from 'axios'
import { AsyncStorage } from 'react-native'
import * as firebase from 'firebase'

export function RequestPushMsg(token, msg, bookingId = null, type = null) {
  if (`${token}`.search('Expo') !== -1) {
    sendExpoPush(token, msg, bookingId)
  } else if (token) {
    sendFCM(token, msg, type)
  }
}

const sendExpoPush = (token, msg, bookingId = null) => {
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'accept-encoding': 'gzip, deflate',
      host: 'exp.host'
    },
    body: JSON.stringify({
      to: token,
      title: languageJSON.notification_title,
      body: msg,
      data: { msg: msg, title: languageJSON.notification_title },
      priority: 'high',
      sound: 'default',
      android: {
        sound: true
      },
      ios: {
        sound: true
      },
      channelId: 'messages',
      _displayInForeground: true
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson
    })
    .catch(error => {
      console.log(error)
    })
}

const sendFCM = async (token, msg, type) => {
  try {
    const credential = await getCredentical()

    const { data: response } = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        priority: 'high',
        to: token,
        notification: {
          body: msg
        },
        data: {
          msg: msg,
          title: languageJSON.notification_title,
          type: type
        },
        sound: 'default'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${credential}`
        }
      }
    )

    return response
  } catch (err) {
    console.log('fail sendFCM', err.message)
  }
}

const getCredentical = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let settings = await AsyncStorage.getItem('settings')
      if (settings) {
        settings = JSON.parse(settings)
      }

      if (settings && settings.tokenNotification) {
        return resolve(settings.tokenNotification)
      }

      settings = firebase.database().ref('settings')
      settings.once('value', settingsData => {
        const data = settingsData.val()
        if (data && data.tokenNotification) {
          AsyncStorage.setItem('settings', JSON.stringify(data))
          return resolve(data.tokenNotification)
        }

        resolve(null)
      })
    } catch (error) {
      resolve(null)
    }
  })
}
