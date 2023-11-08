import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  Text,
  Alert,
  Modal,
  Linking,
  AsyncStorage,
  ScrollView
} from 'react-native'
import {
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native-gesture-handler'
import { Button, Avatar, Header } from 'react-native-elements'
import * as firebase from 'firebase'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

/** Service */
import { getDriverTime } from '../../common/GoogleApi'

/** Styles */
import styles from './Styles'
import { colors } from '../../common/theme'
import languageJSON from '../../common/language'
import MapComponent from './Components/Map'

/** Components */
import Quiz from '../../components/Quiz'
import Information from './Components/Information'

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })
  const [routesList, setRoutesList] = useState([])
  const [allCars, setAllCars] = useState([])
  const [loadingModal, setLoadingModal] = useState(false)
  const [giftModal, setGiftModal] = useState(false)
  const [carType, setCarType] = useState('')
  const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  const [dateModalOpen, setDateModalOpen] = useState(false)
  const [dateMode, setDateMode] = useState('date')
  const [bonusAmmount, setBonusAmmount] = useState(0)
  const [banner, setBanner] = useState({})
  const [passData, setPassData] = useState({
    droplatitude: 0,
    droplongitude: 0,
    droptext: '',
    whereText: '',
    wherelatitude: 0,
    wherelongitude: 0,
    carType: ''
  })
  const [settings, setSettings] = useState({
    symbol: '',
    code: '',
    cash: false,
    wallet: false,
    banners: []
  })

  const [inProcess, setInProcess] = useState(false)
  const [random, setRandom] = useState(1)

  useEffect(() => {
    const init = async () => {
      onPressModal()
      setTimeout(() => {
        _retrieveSettings()
      }, 3000)
    }
    init()
  }, [])

  useEffect(() => {
    const routesRaceParams = navigation.getParam('routesRace', [])
    if (Array.isArray(routesRaceParams) && routesRaceParams.length >= 2) {
      setRoutesList(routesRaceParams)
    }
  }, [navigation])

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      setRandom(Math.random())
    })

    return () => {
      try {
        if (focusListener) {
          focusListener.remove()
        }
      } catch (err) {
        console.log('Fail remove event', err.message)
      }
    }
  }, [])

  const _retrieveSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('settings')
      if (value !== null) {
        setSettings(JSON.parse(value))
        if (JSON.parse(value)?.banners != null) {
          if (JSON.parse(value)?.banners?.length <= 0) {
            setTimeout(() => {
              _retrieveSettings()
            }, 3000)
            return
          } else {
            const randindex = Math.floor(
              Math.random() * JSON.parse(value)?.banners?.length
            )
            setBanner(JSON.parse(value)?.banners[randindex])
          }
        }
      }
    } catch (error) {
      console.log('Asyncstorage issue 9', error)
    }
  }

  const GotoLink = async () => {
    try {
      await Linking.openURL(banner?.link)
    } catch (error) {
      Alert.alert(
        languageJSON.alert,
        `Erro ao acessar a url: ${banner?.link}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      )
    }
  }

  const onPressModal = () => {
    const curuser = firebase.auth()?.currentUser?.uid
    const userRoot = firebase.database().ref('users/' + curuser)
    userRoot.once('value', userData => {
      if (userData.val()) {
        if (userData.val().refferalId === undefined) {
          const name = userData.val().firstName
            ? userData.val().firstName.toLowerCase()
            : ''
          const uniqueNo = Math.floor(Math.random() * 9000) + 1000
          const refId = name + uniqueNo
          userRoot
            .update({
              refferalId: refId
              // walletBalance: 0,
            })
            .then(() => {
              if (userData.val().signupViaReferral === true) {
                firebase
                  .database()
                  .ref('referral/bonus')
                  .once('value', referal => {
                    if (referal.val()) {
                      setBonusAmmount(referal.val().amount)
                      const bonus =
                        referal.val()?.amount > 0 ? referal.val()?.amount : 0
                      const walletBalance =
                        userData.val()?.walletBalance > 0
                          ? userData.val()?.walletBalance
                          : 0
                      userRoot
                        .update({
                          walletBalance: bonus + walletBalance
                        })
                        .then(() => {
                          setGiftModal(true)
                        })
                    }
                  })
              }
            })
        }
      }
    })
  }

  const bonusModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={giftModal}
        onRequestClose={() => setGiftModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(22,22,22,0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: '80%',
              backgroundColor: '#fffcf3',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              maxHeight: 350
            }}
          >
            <View style={{ marginTop: 0, alignItems: 'center' }}>
              <Avatar
                rounded
                size={200}
                source={require('../../../assets/images/gift.gif')}
                containerStyle={{
                  width: 200,
                  height: 200,
                  marginTop: 0,
                  alignSelf: 'center',
                  position: 'relative'
                }}
              />
              <Text
                style={{
                  color: '#0cab03',
                  fontSize: 28,
                  textAlign: 'center',
                  position: 'absolute',
                  marginTop: 170
                }}
              >
                {languageJSON.congratulation}
              </Text>
              <View>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    marginTop: 12,
                    textAlign: 'center'
                  }}
                >
                  {languageJSON?.refferal_bonus_messege_text || ''}{' '}
                  {settings.code} {bonusAmmount}
                </Text>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 16,
                    marginTop: 12,
                    textAlign: 'center'
                  }}
                >
                  {'Crédito adicionado na sua carteira'}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title={languageJSON.no_driver_found_alert_OK_button}
                  loading={false}
                  titleStyle={styles.buttonTitleText}
                  onPress={() => {
                    setGiftModal(false)
                  }}
                  buttonStyle={styles.cancelButtonStyle}
                  containerStyle={{ marginTop: 20 }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const selectCarType = (value, key) => {
    const newAllCars = allCars
    for (let i = 0; i < newAllCars.length; i++) {
      newAllCars[i].active = false
      if (`${i}` === `${key}`) {
        newAllCars[i].active = true
      } else {
        newAllCars[i].active = false
      }
    }

    passData.carType = value.name
    passData.carImage = value.image

    setPassData(passData)
    setAllCars(newAllCars)
    setCarType(value.name)
  }

  const loading = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={loadingModal}
        onRequestClose={() => {
          setLoadingModal(false)
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(22,22,22,0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: '85%',
              backgroundColor: '#DBD7D9',
              borderRadius: 10,
              flex: 1,
              maxHeight: 70
            }}
          >
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <Image
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.TRANSPARENT
                }}
                source={require('../../../assets/images/loader.gif')}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#000', fontSize: 16 }}>
                  {languageJSON.driver_finding_alert}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const hideDatePicker = () => {
    setDateModalOpen(false)
    setDateMode('date')
  }

  const handleDateConfirm = date => {
    setSelectedDateTime(date)
    setDateModalOpen(false)

    if (dateMode === 'date') {
      setTimeout(() => {
        setDateMode('time')
        setDateModalOpen(true)
      }, 1000)
    } else {
      setDateMode('date')

      setTimeout(() => {
        const date1 = new Date()
        const date2 = new Date(date)
        const diffTime = date2 - date1
        const diffMins = diffTime / (1000 * 60)
        if (diffMins < 15) {
          Alert.alert(
            languageJSON.alert,
            languageJSON.past_booking_error,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: true }
          )
        } else {
          navigation.navigate('FareDetails', {
            data: passData,
            waypoints: routesList,
            carType: passData.carType,
            carImage: passData.carImage,
            bookLater: true,
            bookingDate: date
          })
        }
      }, 1000)
    }
  }

  // Go to confirm booking page
  const onPressBook = () => {
    if (
      (passData.whereText === '' ||
        passData.wherelatitude === 0 ||
        passData.wherelongitude === 0) &&
      (passData.dropText === '' ||
        passData.droplatitude === 0 ||
        passData.droplongitude === 0)
    ) {
      alert(languageJSON.pickup_and_drop_location_blank_error)
    } else {
      if (
        passData.whereText === '' ||
        passData.wherelatitude === 0 ||
        passData.wherelongitude === 0
      ) {
        alert(languageJSON.pickup_location_blank_error)
      } else if (
        passData.dropText === '' ||
        passData.droplatitude === 0 ||
        passData.droplongitude === 0
      ) {
        alert(languageJSON.drop_location_blank_error)
      } else if (passData.carType === '' || passData.carType == undefined) {
        alert(languageJSON.car_type_blank_error)
      } else {
        let driver_available = false
        for (let i = 0; i < allCars.length; i++) {
          const car = allCars[i]
          if (car.name === passData.carType && car.minTime) {
            driver_available = true
            break
          }
        }

        if (driver_available) {
          navigation.navigate('FareDetails', {
            data: passData,
            waypoints: routesList,
            carType: passData.carType,
            carImage: passData.carImage
          })
        } else {
          alert(languageJSON.no_driver_found_alert_messege)
        }
      }
    }
  }

  const onPressBookLater = () => {
    if (
      (passData.whereText === '' ||
        passData.wherelatitude === 0 ||
        passData.wherelongitude === 0) &&
      (passData.dropText === '' ||
        passData.droplatitude === 0 ||
        passData.droplongitude === 0)
    ) {
      alert(languageJSON.pickup_and_drop_location_blank_error)
    } else {
      if (
        passData.whereText === '' ||
        passData.wherelatitude === 0 ||
        passData.wherelongitude === 0
      ) {
        alert(languageJSON.pickup_location_blank_error)
      } else if (
        passData.dropText === '' ||
        passData.droplatitude === 0 ||
        passData.droplongitude === 0
      ) {
        alert(languageJSON.drop_location_blank_error)
      } else if (passData.carType === '' || passData.carType === undefined) {
        alert(languageJSON.car_type_blank_error)
      } else {
        setDateMode('date')
        setDateModalOpen(true)
      }
    }
  }

  const handleAllInfo = async (cars, passData, type = 'pass') => {
    try {
      switch (type) {
        case 'pass':
          setPassData(passData)
          break
        case 'car':
          if (allCars.length !== cars.length) {
            await waitMs(300)
            if (inProcess === true) {
              return
            }

            setInProcess(true)
            setAllCars(cars)

            for await (const carItem of cars) {
              if (carItem.available) {
                let resp = null
                try {
                  resp = await getDriverTime(
                    carItem?.startLoc,
                    carItem?.destLoc
                  )
                } catch (err) {
                  console.log('oops fail in handleAllInfo', err.message)
                }

                if (resp && resp.timein_text) {
                  carItem.minTime = resp.timein_text
                }
              }
            }

            setAllCars(cars)
            await waitMs(1500)
            setInProcess(false)
          }
          break
        default:
          break
      }
    } catch (err) {
      console.log('Fail handleAllInfo', err.message)
    }
  }

  const waitMs = (ms = 400) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, ms)
    })
  }

  return (
    <View style={styles.mainViewStyle}>
      <Header
        backgroundColor={colors.GREEN.mediumSea}
        leftComponent={{
          icon: 'md-menu',
          type: 'ionicon',
          color: colors.WHITE,
          size: 30,
          component: TouchableWithoutFeedback,
          onPress: () => {
            navigation.openDrawer()
          }
        }}
        centerComponent={
          <Text style={styles.headerTitleStyle}>
            {languageJSON.where_we_going}
          </Text>
        }
        containerStyle={styles.headerStyle}
        innerContainerStyles={styles.inrContStyle}
      />

      <MapComponent
        mapRegion={region}
        routesList={routesList}
        navigation={navigation}
        mapAllInfo={handleAllInfo}
      />

      {banner && banner?.imagem ? (
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() => {
            GotoLink()
          }}
        >
          <Image
            style={{ width: '100%', height: 70 }}
            source={{ uri: banner.imagem }}
          ></Image>
        </TouchableOpacity>
      ) : null}

      {routesList?.length >= 2 && (
        <View style={styles.compViewStyle}>
          <Text style={styles.pickCabStyle}>
            {languageJSON.cab_selection_title}
          </Text>
          <Text style={styles.sampleTextStyle}>
            {languageJSON.cab_selection_subtitle}
          </Text>
          <ScrollView
            horizontal={true}
            style={styles.adjustViewStyle}
            showsHorizontalScrollIndicator={false}
          >
            {allCars.map((prop, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.cabDivStyle}
                  onPress={() => {
                    selectCarType(prop, key)
                  }}
                >
                  <View
                    style={[
                      styles.imageStyle,
                      {
                        backgroundColor:
                          prop.active === true
                            ? colors.YELLOW.secondary
                            : colors.WHITE
                      }
                    ]}
                  >
                    <Image
                      source={
                        prop.image
                          ? { uri: prop.image }
                          : require('../../../assets/images/microBlackCar.png')
                      }
                      style={styles.imageStyle1}
                    />
                  </View>
                  <View style={styles.textViewStyle}>
                    <Text style={styles.text1}>{prop.name.toUpperCase()}</Text>
                    <Text style={styles.text2}>
                      {prop.minTime !== ''
                        ? prop?.minTime
                        : languageJSON.not_available}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>

          <View style={styles.btnOptions}>
            <TouchableOpacity
              style={styles.scheduleBtn}
              onPress={() => {
                onPressBookLater()
              }}
            >
              <Text style={styles.scheduleBtnTxt}>Agendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goNowBtn}
              onPress={() => {
                onPressBook()
              }}
            >
              <Text style={styles.goNowBtnTxt}>Ir Agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* {bonusModal()}
      {loading()}
      <DateTimePickerModal
        date={selectedDateTime}
        minimumDate={new Date()}
        isVisible={dateModalOpen}
        mode={dateMode}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      {/* <Quiz show={true} navigation={navigation} random={random} />
      <Information show={true} /> */}
    </View>
  )
}

export default MapScreen
