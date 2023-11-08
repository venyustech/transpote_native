import React, { useState, useEffect, useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from 'react-native'
import * as firebase from 'firebase'
import Geocoder from 'react-native-geocoding'
import carImageIcon from '../../../../../assets/images/available_car.png'
import markerBlueImage from '../../../../../assets/images/maps/markerblue.png'
import markerRedImage from '../../../../../assets/images/maps/markerred.png'
import markerYellowImage from '../../../../../assets/images/maps/markeryellow.png'

import { colors } from '../../../../common/theme'
import { googleMapKey } from '../../../../common/key'
import {
  Styles,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall
} from './styles'
import Directions from './../Directions'
import { getPixelSize } from './../../Utils'
import languageJSON from '../../../../common/language'
import distanceCalc from '../../../../common/distanceCalc'

/** Service */
import { geoReverseHereApi } from '../../../../common/HereApi'
import { getDriverAvailable } from '../../../../services/Driver/available'

let timerIntervalCars = null

const MapComponent = ({ navigation, mapRegion, routesList, mapAllInfo }) => {
  const [permissionLocation, setPermissionLocation] = useState(undefined)
  const [region, setRegion] = useState(undefined)
  // const [destination, setDestination] = useState(undefined)
  const [mapViewRef, setMapViewRef] = useState(undefined)
  const [raceDuration, setRaceDuration] = useState(undefined)
  // const [searchType, setSearchType] = useState(undefined)
  const [curuser] = useState(firebase.auth()?.currentUser?.uid)
  const [geolocationFetchComplete, setGeolocationFetchComplete] = useState(
    false
  )
  // const [mainCarTypes, setMainCarTypes] = useState([])
  const [allCars, setAllCars] = useState([])
  const [nearby, setNearby] = useState([])
  const [freeCars, setFreeCars] = useState([])
  const [checkCallLocation, setCheckCallLocation] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  // const [mapMoved, setMapMoved] = useState(false)
  const [selected, setSelected] = useState('drop')

  const [passData, setPassData] = useState({
    droplatitude: 0,
    droplongitude: 0,
    droptext: '',
    whereText: '',
    wherelatitude: 0,
    wherelongitude: 0,
    carType: ''
  })

  const passDataCurrent = useRef(passData)
  const mainCarTypes = useRef([])

  useEffect(() => {
    // console.log('Usuário atual', firebase.auth().currentUser.uid)

    // setRegion(mapRegion);
    Geocoder.init(googleMapKey)
    setTimeout(() => {
      _getLocationAsync()
      // setCuruser(firebase.auth().currentUser.uid);
    }, 1000)

    const listenInterval = async () => {
      await allCarsData()
      timerIntervalCars = setInterval(() => {
        if (passData?.wherelatitude) {
          setCheckCallLocation('interval')
          allCarsData()
          // getDrivers()
          getDriversMongoDb()
        }
      }, 30000)

      // await AsyncStorage.removeItem('logged')
      // const value = await AsyncStorage.getItem('logged')
      // alert(JSON.stringify(value))
      // Reconhecimento facial assim que logar
      // if (value === null || value === 'false') {
      //   navigation.navigate('PhotoVerify')
      // }
    }
    listenInterval()

    return () => {
      console.log('clear interval', 411)
      clearInterval(timerIntervalCars)
    }
  }, [])

  useEffect(() => {
    if (routesList && routesList[0]) {
      setRegion(routesList[0])
      let obj = {}
      obj = passData
      obj.wherelatitude = routesList[0].latitude
      obj.wherelongitude = routesList[0].longitude
      obj.whereText = routesList[0]?.title || ''
      setPassData(obj)
    }

    if (routesList?.length > 1) {
      let obj = {}
      obj = passData
      obj.droplatitude = routesList[routesList.length - 1].latitude
      obj.droplongitude = routesList[routesList.length - 1].longitude
      obj.droptext = routesList[routesList.length - 1]?.title || ''
      setPassData(obj)
    }

    if (routesList?.length <= 1) {
      if (selected !== 'pickup') {
        setSelected('pickup')
      }
    } else {
      if (selected !== 'drop') {
        setSelected('drop')
      }
    }

    // setCuruser(firebase.auth().currentUser.uid);

    setTimeout(() => {
      _getLocationAsync()
      if (passData?.wherelatitude) {
        setCheckCallLocation('interval')
        allCarsData()
        // getDrivers()
        getDriversMongoDb()
      }
    }, 1000)
  }, [routesList])

  const allCarsData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const cars = firebase.database().ref('rates/car_type')
        await cars.once('value', async allCars => {
          if (allCars.val()) {
            const cars = allCars.val()
            const arr = []
            for await (const car of cars) {
              car.minTime = ''
              car.available = true
              car.active = false
              car.name = `${car.name}`.trim()
              arr.push(car)
            }
            mainCarTypes.current.values = arr
          }
        })
        resolve(true)
      } catch (error) {
        console.log('Error', error)
        reject(error)
      }
    })
  }

  const _getLocationAsync = async () => {
    // check permissions
    const { status, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    )
    if (status !== 'granted') {
      if (permissions?.location?.foregroundStatus !== 'granted') {
        alert(
          `Não conseguimos sua localização: ${status}/${permissions?.location?.foregroundStatus}`
        )
        return
      }
    }

    setPermissionLocation(permissions?.location?.foregroundStatus || status)
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        // success
        if (latitude && longitude) {
          if (passData?.wherelatitude === 0) {
            // let latlng = latitude + ',' + longitude;
            const addressTxt = await geoReverseHereApi(latitude, longitude)
            setGeolocationFetchComplete(true)

            let obj = {}
            obj = passData
            obj.wherelatitude = latitude
            obj.wherelongitude = longitude
            obj.whereText = addressTxt
            setPassData(obj)
            setCheckCallLocation('navigation')
            mapAllInfo(allCars, passData, 'pass')

            if (routesList?.length <= 0) {
              const originRoute = {
                latitude,
                longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
                title: addressTxt
              }
              routesList = []
              routesList.push([originRoute])
              setRegion(originRoute)
            }

            // getDrivers()
            getDriversMongoDb()

            firebase
              .database()
              .ref('users/' + curuser + '/location')
              .update({
                add: addressTxt,
                lat: latitude,
                lng: longitude
              })
          } else {
            let obj = {}
            obj = passData
            obj.wherelatitude = latitude
            obj.wherelongitude = longitude
            obj.whereText = passData?.whereText
            setPassData(obj)
            setCheckCallLocation('navigation')
            mapAllInfo(allCars, passData, 'pass')

            if (routesList?.length <= 0) {
              const originRoute = {
                latitude,
                longitude,
                latitudeDelta: 0.009,
                longitudeDelta: 0.009,
                title: passData?.whereText
              }
              setRegion(originRoute)
              routesList = []
              routesList.push(originRoute)
            }

            // getDrivers()
            getDriversMongoDb()

            firebase
              .database()
              .ref('users/' + curuser + '/location')
              .update({
                lat: latitude,
                lng: longitude
              })
          }
        }
      },
      () => {}, // error
      {
        timeout: 5000,
        enableHighAccuracy: false,
        maximumAge: 3000
      }
    )
  }

  const getDriversMongoDb = async () => {
    try {
      if (!routesList[0]?.latitude || !routesList[0]?.longitude) {
        return
      }

      const allUsers = await getDriverAvailable(
        routesList[0]?.latitude,
        routesList[0]?.longitude
      )

      if (!allUsers || allUsers.status === false) {
        return Alert.alert('Oops', 'Nenhum motorista localizado')
      }

      const availableDrivers = []
      const freeCars = []
      const arr = {}
      const riderLocation = [routesList[0]?.latitude, routesList[0]?.longitude]
      const startLoc =
        '"' + routesList[0]?.latitude + ', ' + routesList[0]?.longitude + '"'

      for (const driverCurrent of allUsers) {
        let driver = driverCurrent
        const additionalData = driverCurrent?.additionalData || {}
        driver = { ...additionalData, ...driver }

        if (driver.additionalData.languageJSON) {
          delete driver.additionalData.languageJSON
        }

        const driverLocation = [
          driver.location.coordinates[1],
          driver.location.coordinates[0]
        ]

        const distance = distanceCalc(riderLocation, driverLocation)
        freeCars.push(driver)

        const destLoc =
          '"' +
          driver.location.coordinates[1] +
          ', ' +
          driver.location.coordinates[0] +
          '"'
        driver.arriveDistance = distance
        driver.arriveTime = {}
        const carType = driver.carType

        if (arr[carType] && arr[carType].drivers) {
          arr[carType].drivers.push(driver)
          if (arr[carType].minDistance > distance) {
            arr[carType].minDistance = distance
            arr[carType].minTime = driver.arriveTime?.timein_text
            arr[carType].startLoc = startLoc
            arr[carType].destLoc = destLoc
          }
        } else {
          arr[carType] = {}
          arr[carType].drivers = []
          arr[carType].drivers.push(driver)
          arr[carType].minDistance = distance
          arr[carType].minTime = driver.arriveTime?.timein_text
          arr[carType].startLoc = startLoc
          arr[carType].destLoc = destLoc
        }
        availableDrivers.push(driver)
      }

      const allCarsList = mainCarTypes.current.values

      const listCarUpdate = []
      for await (const car of allCarsList) {
        if (arr[car.name]) {
          car.nearbyData = arr[car.name].drivers
          car.minTime = arr[car.name].minTime
          car.available = true
          car.startLoc = arr[car.name].startLoc
          car.destLoc = arr[car.name].destLoc
        } else {
          car.minTime = ''
          car.available = false
        }
        car.active = passData.carType === car.name
        listCarUpdate.push(car)
      }

      if (allCarsList.length === listCarUpdate.length) {
        await setAllCars(listCarUpdate)
        mapAllInfo(listCarUpdate, passData, 'car')
      }

      setNearby(availableDrivers)
      setFreeCars(freeCars)

      if (availableDrivers.length <= 0) {
        if (
          checkCallLocation === 'navigation' ||
          checkCallLocation === 'moveMarker'
        ) {
          Alert.alert(
            languageJSON.no_driver_found_alert_title,
            languageJSON.no_driver_found_alert_messege,
            [
              {
                text: languageJSON.no_driver_found_alert_OK_button,
                onPress: () => setLoadingModal(false)
              },
              {
                text: languageJSON.no_driver_found_alert_TRY_AGAIN_button,
                onPress: () => {
                  // getDrivers()
                  getDriversMongoDb()
                },
                style: 'cancel'
              }
            ],
            { cancelable: true }
          )
        }
      }
    } catch (err) {
      console.log('Fail in getDriversMongoDb', err.message)
    }
  }

  const showSelectAddress = type => {
    navigation.navigate('Search', {
      type,
      routesList: routesList?.length > 0 ? routesList : [region]
    })
  }

  const onRegionChangeComplete = async region => {
    await waiting(300)

    if (
      !passDataCurrent.current ||
      passDataCurrent.current?.wherelatitude !== region.latitude
    ) {
      // console.log('Alterado Novamente ...')
      const passDataUpdate = passData
      passDataUpdate.wherelatitude = region.latitude
      passDataUpdate.wherelongitude = region.longitude
      passDataCurrent.current = passDataUpdate

      const addressTxt = await geoReverseHereApi(
        region.latitude,
        region.longitude
      )

      passDataUpdate.whereText = addressTxt
      passDataCurrent.current = passDataUpdate

      const regionUpdate = region
      regionUpdate.title = addressTxt

      // setMapMoved(false)
      setRegion(regionUpdate)

      if (routesList?.length > 1) {
        const routesListUpdate = routesList.slice(1)
        routesList = [regionUpdate, ...routesListUpdate]
      } else {
        routesList = [regionUpdate]
      }

      setPassData(passDataUpdate)
      setCheckCallLocation('moveMarker')
      setGeolocationFetchComplete(true)
      mapAllInfo(allCars, passData, 'pass')
    }
  }

  const waiting = async (time = 300) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, time)
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          maxHeight: 120,
          backgroundColor: colors.GREEN.mediumSea
        }}
      >
        <TouchableOpacity onPress={() => showSelectAddress('from')}>
          <Text numberOfLines={1} style={Styles.containerFrom}>
            {region?.title
              ? region?.title
              : languageJSON.map_screen_where_input_text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showSelectAddress('to')}>
          <Text numberOfLines={1} style={Styles.containerTo}>
            {routesList[routesList.length - 1]?.title
              ? routesList[routesList.length - 1]?.title
              : languageJSON.map_screen_drop_input_text}
          </Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={{ flex: 1 }}
        // initialRegion={(routesList.length >= 2) ? routesList[0] : region}
        region={routesList.length >= 2 ? routesList[0] : region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        onRegionChangeComplete={onRegionChangeComplete}
        // onPanDrag={onPanDrag}
        ref={ref => setMapViewRef(ref)}
      >
        {routesList.length >= 2 && (
          <>
            <Directions
              origin={routesList[0]}
              waypoints={routesList?.length > 2 ? routesList.slice(1, -1) : []}
              destination={routesList[routesList.length - 1]}
              onReady={result => {
                const duration = Math.floor(result.duration)
                setRaceDuration(duration)
                mapViewRef.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(50)
                  }
                })
              }}
            />
            <Marker
              coordinate={routesList[routesList.length - 1]}
              anchor={{ x: 0, y: 0 }}
            >
              <Image
                source={markerBlueImage}
                style={{ height: 24, width: 24 }}
              />
              <LocationBox>
                <LocationText>
                  {routesList[routesList.length - 1].title}
                </LocationText>
              </LocationBox>
            </Marker>
            <Marker coordinate={routesList[0]} anchor={{ x: 0, y: 0 }}>
              <Image
                source={markerRedImage}
                style={{ height: 24, width: 24 }}
              />
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{raceDuration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>
                  {routesList && routesList.length > 0 && routesList[0]?.title
                    ? routesList[0]?.title
                    : 'Local da partida'}
                </LocationText>
              </LocationBox>
            </Marker>
            {routesList.length >= 3 && (
              <Marker coordinate={routesList[1]} anchor={{ x: 0, y: 0 }}>
                <Image
                  source={markerYellowImage}
                  style={{ height: 24, width: 24 }}
                />
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>1ª</LocationTimeText>
                    <LocationTimeTextSmall>PARADA</LocationTimeTextSmall>
                  </LocationTimeBox>
                </LocationBox>
              </Marker>
            )}
            {routesList.length >= 4 && (
              <Marker coordinate={routesList[2]} anchor={{ x: 0, y: 0 }}>
                <Image
                  source={markerYellowImage}
                  style={{ height: 24, width: 24 }}
                />
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>2ª</LocationTimeText>
                    <LocationTimeTextSmall>PARADA</LocationTimeTextSmall>
                  </LocationTimeBox>
                </LocationBox>
              </Marker>
            )}
          </>
        )}

        {nearby
          ? nearby.map((item, index) => {
              return (
                <Marker.Animated
                  coordinate={{
                    latitude: item?.location?.coordinates
                      ? item.location.coordinates[1]
                      : 0.0,
                    longitude: item?.location?.coordinates
                      ? item.location.coordinates[0]
                      : 0.0
                  }}
                  key={index}
                >
                  <Image
                    source={carImageIcon}
                    style={{ height: 40, width: 40 }}
                  />
                </Marker.Animated>
              )
            })
          : null}
      </MapView>
      {selected === 'pickup' ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 70,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <Image
            pointerEvents="none"
            style={{ height: 40, resizeMode: 'contain' }}
            source={require('../../../../../assets/images/green_pin.png')}
          />
        </View>
      ) : null}
    </View>
  )
}

export default React.memo(MapComponent)
