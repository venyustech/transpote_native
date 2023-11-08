import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  Modal,
  Image
} from 'react-native'
import { Icon, Button, Header } from 'react-native-elements'
import Polyline from '@mapbox/polyline'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import * as firebase from 'firebase'
import RNPickerSelect from 'react-native-picker-select'
import moment from 'moment'
import { StackActions, NavigationActions } from 'react-navigation'

import styles from './FareStyles'
import { colors } from '../../common/theme'
import { farehelper } from '../../common/FareCalculator'
import { RequestPushMsg } from '../../common/RequestPushMsg'
import { googleMapKey } from '../../common/key'
import languageJSON from '../../common/language'
import { formatterAmount } from '../../utils'

/** Components */
import AlertConfirm from '../../components/Alert/AlertConfirm'

/** Service */
import { getDriverAvailable } from '../../services/Driver/available'

export default class Fare extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alertModalVisible: false,
      alertModalValueVisible: false,
      region: {},
      coords: [],
      wayPoints: [],
      routesPrice: [],
      settings: {
        code: '',
        symbol: '',
        cash: false,
        wallet: false,
        otp_secure: false
      },
      userDetails: {},
      buttonDisabled: false,
      valorproposta: 0,
      modalpropostavisible: false,
      txtproposta: '',
      paymentmethod: 'Cash',
      amountPassenger: 1,
      observation: '',
      distance: 0,
      fareCost: 0,
      estimateFare: 0,
      estimateTime: 0,
      convenience_fees: 0,
      walletConfirm: false,
      walletMessage: 'Sem Saldo na carteira'
    }
  }

  async _retrieveSettings() {
    try {
      const value = await AsyncStorage.getItem('settings')
      if (value !== null) {
        this.setState({ settings: JSON.parse(value) })
      }
    } catch (error) {
      console.log('Asyncstorage issue 8 ')
    }
  }

  componentDidMount() {
    const getCroods = this.props.navigation.getParam('data')
    const carType = this.props.navigation.getParam('carType')
    const carImage = this.props.navigation.getParam('carImage')
    const bookLater = this.props.navigation.getParam('bookLater')
    const bookingDate = this.props.navigation.getParam('bookingDate')
    // Pontos de passagem (Quando usuário adiciona paradas)
    const wayPoints = this.props.navigation.getParam('waypoints')

    const Data = firebase.database().ref('rates/')
    Data.once('value', rates => {
      if (rates.val()) {
        const carTypeWiseRate = rates.val()
        for (let i = 0; i < carTypeWiseRate.car_type.length; i++) {
          const carName = `${carTypeWiseRate.car_type[i].name}`.trim()

          if (carName === carType) {
            var rates = carTypeWiseRate.car_type[i]
            this.setState(
              {
                region: getCroods,
                wayPoints: wayPoints,
                curUID: firebase.auth().currentUser,
                rateDetails: rates,
                carType: carType,
                carImage: carImage,
                bookLater: !!bookLater,
                bookingDate: bookingDate || null
              },
              async () => {
                // this.getDirections('"' + this.state.region.wherelatitude + ', ' + this.state.region.wherelongitude + '"', '"' + this.state.region.droplatitude + ', ' + this.state.region.droplongitude + '"')
                this.calcFareByWayPoints()
                const userData = firebase
                  .database()
                  .ref('users/' + this.state.curUID.uid)
                userData.once('value', userData => {
                  this.setState({ userDetails: userData.val() })
                })
              }
            )
          }
        }
      }
    })

    this._retrieveSettings()
  }

  async calcFareByWayPoints() {
    return new Promise(async (resolve, reject) => {
      try {
        const wayPoints = this.state.wayPoints || []

        if (!Array.isArray(wayPoints)) {
          return
        }

        for (const key in wayPoints) {
          if (
            wayPoints[key]?.latitude &&
            wayPoints[key]?.longitude &&
            wayPoints[Number(key) + 1]?.latitude &&
            wayPoints[Number(key) + 1]?.longitude
          ) {
            const startLoc = `${wayPoints[key]?.latitude},${wayPoints[key]?.longitude}`
            const destLoc = `${wayPoints[Number(key) + 1]?.latitude},${
              wayPoints[Number(key) + 1]?.longitude
            }`

            const resp = await fetch(
              `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${googleMapKey}`
            )
            const respJson = await resp.json()
            const fareCalculation = await farehelper(
              respJson.routes[0].legs[0].distance.value,
              respJson.routes[0].legs[0].duration.value,
              this.state.rateDetails ? this.state.rateDetails : 1
            )
            const ajustepico = 1
            const currentTime = new Date(
              moment().year(),
              moment().month(),
              moment().day(),
              moment().hour(),
              moment().minute(),
              moment().seconds()
            )

            if (this.state.settings.picos != null) {
              this.state.settings.picos.map(pico => {
                const start_time = new Date(
                  moment().year(),
                  moment().month(),
                  moment().day(),
                  pico.de.toString().substring(0, 2),
                  pico.de.toString().substring(3, 5),
                  0
                )
                const end_time = new Date(
                  moment().year(),
                  moment().month(),
                  moment().day(),
                  pico.ate.toString().substring(0, 2),
                  pico.ate.toString().substring(3, 5),
                  0
                )
                if (moment(currentTime).isBetween(start_time, end_time)) {
                  ajustepico = pico.percentagem
                }
              })
            }

            const routePriceItem = {
              distance: respJson.routes[0].legs[0].distance.value,
              fareCost: fareCalculation
                ? parseFloat(fareCalculation.totalCost).toFixed(2)
                : 0,
              estimateFare: fareCalculation
                ? ajustepico === 1
                    ? parseFloat(Number(fareCalculation.grandTotal)).toFixed(2)
                    : parseFloat(
                      Number(
                        fareCalculation.grandTotal +
                          (fareCalculation.grandTotal / 100) * ajustepico
                      )
                    ).toFixed(2)
                : 0,
              estimateTime: respJson.routes[0].legs[0].duration.value,
              convenience_fees: fareCalculation
                ? Number(
                    parseFloat(fareCalculation.convenience_fees).toFixed(2)
                  )
                : 0
            }

            this.setState({
              routesPrice: [...this.state.routesPrice, routePriceItem],
              distance:
                this.state.distance + respJson.routes[0].legs[0].distance.value,
              fareCost: fareCalculation
                ? Number(this.state.fareCost) +
                  Number(parseFloat(fareCalculation.totalCost).toFixed(2))
                : this.state.fareCost,
              estimateFare: fareCalculation
                ? ajustepico === 1
                    ? parseFloat(
                      Number(this.state.estimateFare) +
                        Number(fareCalculation.grandTotal)
                    ).toFixed(2)
                    : parseFloat(
                      Number(this.state.estimateFare) +
                        Number(
                          fareCalculation.grandTotal +
                            (fareCalculation.grandTotal / 100) * ajustepico
                        )
                    ).toFixed(2)
                : parseFloat(this.state.estimateFare).toFixed(2),
              estimateTime:
                this.state.estimateTime +
                respJson.routes[0].legs[0].duration.value,
              convenience_fees: fareCalculation
                ? Number(this.state.convenience_fees) +
                  parseFloat(fareCalculation.convenience_fees).toFixed(2)
                : this.state.convenience_fees
            })

            const points = Polyline.decode(
              respJson.routes[0].overview_polyline.points
            )
            const coords = points.map(point => {
              return {
                latitude: point[0],
                longitude: point[1]
              }
            })

            this.setState({ coords: [...this.state.coords, ...coords] }, () => {
              setTimeout(() => {
                this.map.fitToCoordinates(
                  [
                    {
                      latitude: this.state.region.wherelatitude,
                      longitude: this.state.region.wherelongitude
                    },
                    {
                      latitude: this.state.region.droplatitude,
                      longitude: this.state.region.droplongitude
                    }
                  ],
                  {
                    edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                    animated: true
                  }
                )
              }, 1500)
            })
          }
        }
        return resolve(this.state.coords)
      } catch (error) {
        if (error === "TypeError: Cannot read property 'legs' of undefined") {
          Alert.alert(
            languageJSON.err,
            languageJSON.route_not_found,
            [
              {
                text: languageJSON.no_driver_found_alert_OK_button,
                onPress: () => this.props.navigation.goBack()
              }
            ],
            { cancelable: false }
          )
        } else {
          Alert.alert(
            languageJSON.err,
            languageJSON.route_not_found,
            [
              {
                text: languageJSON.no_driver_found_alert_OK_button,
                onPress: () => this.props.navigation.goBack()
              }
            ],
            { cancelable: false }
          )
        }
        return error
      }
    })
  }

  // FOR ROOT DIRECTIONS
  async getDirections(startLoc, destLoc) {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${googleMapKey}`
      )
      const respJson = await resp.json()

      const fareCalculation = await farehelper(
        respJson.routes[0].legs[0].distance.value,
        respJson.routes[0].legs[0].duration.value,
        this.state.rateDetails ? this.state.rateDetails : 1
      )
      let ajustepico = 1
      const currentTime = new Date(
        moment().year(),
        moment().month(),
        moment().day(),
        moment().hour(),
        moment().minute(),
        moment().seconds()
      )

      if (this.state.settings.picos != null) {
        this.state.settings.picos.map(pico => {
          const start_time = new Date(
            moment().year(),
            moment().month(),
            moment().day(),
            pico.de.toString().substring(0, 2),
            pico.de.toString().substring(3, 5),
            0
          )
          const end_time = new Date(
            moment().year(),
            moment().month(),
            moment().day(),
            pico.ate.toString().substring(0, 2),
            pico.ate.toString().substring(3, 5),
            0
          )
          if (moment(currentTime).isBetween(start_time, end_time)) {
            ajustepico = pico.percentagem
          }
        })
      }

      this.setState(
        {
          distance: respJson.routes[0].legs[0].distance.value,
          fareCost: fareCalculation
            ? parseFloat(fareCalculation.totalCost).toFixed(2)
            : 0,
          estimateFare: fareCalculation
            ? ajustepico === 1
              ? parseFloat(fareCalculation.grandTotal).toFixed(2)
              : parseFloat(
                  fareCalculation.grandTotal +
                    (fareCalculation.grandTotal / 100) * ajustepico
                ).toFixed(2)
            : 0,
          estimateTime: respJson.routes[0].legs[0].duration.value,
          convenience_fees: fareCalculation
            ? parseFloat(fareCalculation.convenience_fees).toFixed(2)
            : 0
        },
        () => {}
      )
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      )
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({ coords: coords }, () => {
        setTimeout(() => {
          this.map.fitToCoordinates(
            [
              {
                latitude: this.state.region.wherelatitude,
                longitude: this.state.region.wherelongitude
              },
              {
                latitude: this.state.region.droplatitude,
                longitude: this.state.region.droplongitude
              }
            ],
            {
              edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
              animated: true
            }
          )
        }, 1500)
      })
      return coords
    } catch (error) {
      if (error == "TypeError: Cannot read property 'legs' of undefined") {
        Alert.alert(
          languageJSON.err,
          languageJSON.route_not_found,
          [
            {
              text: languageJSON.no_driver_found_alert_OK_button,
              onPress: () => this.props.navigation.goBack()
            }
          ],
          { cancelable: false }
        )
      } else {
        Alert.alert(
          languageJSON.err,
          languageJSON.route_not_found,
          [
            {
              text: languageJSON.no_driver_found_alert_OK_button,
              onPress: () => this.props.navigation.goBack()
            }
          ],
          { cancelable: false }
        )
      }
      return error
    }
  }

  // on press Ride later
  onPressCancel() {
    this.setState({ buttonDisabled: false })
    this.props.navigation.goBack()
  }

  alertModal() {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.alertModalVisible}
        onRequestClose={() => {
          this.setState({ alertModalVisible: false })
        }}
      >
        <View style={styles.alertModalContainer}>
          <View style={styles.alertModalInnerContainer}>
            <View style={styles.alertContainer}>
              <Text style={styles.rideCancelText}>{languageJSON.sorry}</Text>
              <View style={styles.horizontalLLine} />
              <View style={styles.msgContainer}>
                <Text style={styles.cancelMsgText}>
                  {languageJSON.multipleBooking}
                </Text>
              </View>
              <View style={styles.okButtonContainer}>
                <Button
                  title={languageJSON.no_driver_found_alert_OK_button}
                  titleStyle={styles.signInTextStyle}
                  onPress={() => {
                    this.setState(
                      { alertModalVisible: false, buttonDisabled: false },
                      () => {
                        this.props.navigation.popToTop()
                      }
                    )
                  }}
                  buttonStyle={styles.okButtonStyle}
                  containerStyle={styles.okButtonContainerStyle}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  // CONFRIM BOOKING
  async bookNow() {
    this.setState({
      modalpropostavisible: false,
      valorproposta: this.state.txtproposta || 0,
      buttonDisabled: true
    })

    const curuser = firebase.auth().currentUser.uid

    const pickUp = {
      lat: this.state.region.wherelatitude,
      lng: this.state.region.wherelongitude,
      add: this.state.region.whereText
    }
    const drop = {
      lat: this.state.region.droplatitude,
      lng: this.state.region.droplongitude,
      add: this.state.region.droptext
    }
    if (this.state.settings.otp_secure) {
      var otp = Math.floor(Math.random() * 90000) + 10000
    } else {
      var otp = false
    }

    const today = new Date().toString()

    let customerVerified = false
    if (this.state.userDetails?.verified) {
      customerVerified = this.state.userDetails?.verified
    }
    const data = {
      amount_passenger: this.state.amountPassenger,
      bookingDate: today,
      bookLater: this.state.bookLater,
      carImage: this.state.carImage,
      carType: this.state.carType,
      customer: curuser,
      customer_image: this.state.userDetails?.profile_image || '',
      customer_name:
        this.state.userDetails?.firstName +
        ' ' +
        this.state.userDetails?.lastName,
      customerVerified: customerVerified,
      distance: this.state.distance,
      driver: '',
      driver_image: '',
      driver_name: '',
      drop: drop,
      estimate: this.state.estimateFare,
      estimateDistance: this.state.distance,
      observation: this.state.observation,
      otp: otp,
      pickup: pickUp,
      proposal: this.state.txtproposta,
      payment_mode: this.state.paymentmethod,
      serviceType: 'pickUp',
      status: 'NEW',
      total_trip_time: 0,
      trip_cost: 0,
      trip_end_time: '00:00',
      trip_start_time: '00:00',
      tripdate: this.state.bookLater
        ? this.state.bookingDate.toString()
        : today,
      wayPoints: this.state.wayPoints,
      routesPrice: this.state.routesPrice
    }

    const MyBooking = {
      amount_passenger: this.state.amountPassenger,
      bookingDate: today,
      bookLater: this.state.bookLater,
      carType: this.state.carType,
      carImage: this.state.carImage,
      coords: this.state.coords,
      driver: '',
      driver_image: '',
      driver_name: '',
      drop: drop,
      estimate: this.state.estimateFare,
      estimateDistance: this.state.distance,
      observation: this.state.observation,
      otp: otp,
      payment_mode: this.state.paymentmethod,
      pickup: pickUp,
      proposal: this.state.txtproposta,
      serviceType: 'pickUp',
      status: 'NEW',
      total_trip_time: 0,
      trip_cost: 0,
      trip_end_time: '00:00',
      trip_start_time: '00:00',
      tripdate: this.state.bookLater
        ? this.state.bookingDate.toString()
        : today,
      wayPoints: this.state.wayPoints,
      routesPrice: this.state.routesPrice,
      customerVerified: customerVerified
    }

    firebase
      .database()
      .ref('bookings/')
      .push(data)
      .then(res => {
        const bookingKey = res.key
        firebase
          .database()
          .ref('users/' + curuser + '/my-booking/' + bookingKey + '/')
          .set(MyBooking)
          .then(res => {
            this.setState({ currentBookingId: bookingKey }, () => {
              if (this.state.bookLater) {
                Alert.alert(
                  languageJSON.alert,
                  languageJSON.booking_taken + bookingKey,
                  [
                    {
                      text: 'OK',
                      onPress: () => this.props.navigation.navigate('RideList')
                    }
                  ],
                  { cancelable: false }
                )
              } else {
                this.sendNewOfferDriver(bookingKey, data)
              }
            })
          })
      })
  }

  async sendNewOfferDriver(bookingKey, data) {
    try {
      const wayPoints = this.state.wayPoints || []
      const arr = []

      if (!wayPoints) {
        return
      }

      const allUsers = await getDriverAvailable(
        wayPoints[0]?.latitude,
        wayPoints[0]?.longitude,
        `${this.state.carType}`.trim()
      )

      if (!allUsers || allUsers.status === false) {
        return Alert.alert('Aviso', 'Desculpe Nenhum prestador encontrado')
      }

      for (const userDriver of allUsers) {
        userDriver.driverUid = userDriver?.idFirebase
        arr.push(userDriver.driverUid)

        firebase
          .database()
          .ref(
            `users/${userDriver?.idFirebase}/waiting_riders_list/${bookingKey}`
          )
          .set(data)
          .then(() => {
            this.sendPushNotification(
              userDriver?.idFirebase,
              bookingKey,
              languageJSON.new_booking_request_push_notification,
              'new_race'
            )
          })
          .catch(err => {
            console.log(
              'Não foi possível gravar waiting_riders_list',
              err.message
            )
          })
      }

      const bookingData = {
        bokkingId: bookingKey,
        coords: this.state.coords
      }

      // console.log('bookingKey current', bookingKey)

      setTimeout(() => {
        if (arr.length > 0) {
          firebase
            .database()
            .ref(`bookings/${bookingKey}`)
            .update({
              requestedDriver: arr
            })
            .then(res => {
              this.setState({ buttonDisabled: false })
              this.props.navigation.navigate('BookedCab', {
                passData: bookingData
              })
            })
        } else {
          alert(languageJSON.driver_not_found)
        }
      }, 300)
    } catch (err) {
      console.log('Fail in sendNewOfferDriver', err.message)
    }
  }

  // Saldo na Carteira
  async walletBalanceCurrent(price) {
    return new Promise((resolve, reject) => {
      const userId = firebase.auth().currentUser.uid

      firebase
        .database()
        .ref(`/users/${userId}`)
        .once('value', snaphost => {
          const cliValue = snaphost.val()
          if (!cliValue) {
            return resolve({
              status: false,
              message: 'Usuário não encontrado'
            })
          }

          if (!cliValue.walletBalance || cliValue.walletBalance == 0) {
            return resolve({
              status: false,
              message: 'Sem saldo na carteira, recarregue para continuar'
            })
          }

          if (price > cliValue.walletBalance) {
            return resolve({
              status: false,
              message:
                'Seu saldo é insuficiente para esta corrida, recarregue para continuar'
            })
          }

          return resolve({ status: true })
        })
    })
  }

  // Add promo user details to promo node
  addDetailsToPromo(offerkey, curUId) {
    const promoData = firebase.database().ref('offers/' + offerkey)
    promoData.once('value', promo => {
      if (promo.val()) {
        const promoData = promo.val()
        const user_avail = promoData.user_avail
        if (user_avail) {
          firebase
            .database()
            .ref('offers/' + offerkey + '/user_avail/details')
            .push({
              userId: curUId
            })
            .then(() => {
              firebase
                .database()
                .ref('offers/' + offerkey + '/user_avail/')
                .update({ count: user_avail.count + 1 })
            })
        } else {
          firebase
            .database()
            .ref('offers/' + offerkey + '/user_avail/details')
            .push({
              userId: curUId
            })
            .then(() => {
              firebase
                .database()
                .ref('offers/' + offerkey + '/user_avail/')
                .update({ count: 1 })
            })
        }
      }
    })
  }

  sendPushNotification(customerUID, bookingId, msg, type) {
    const customerRoot = firebase.database().ref('users/' + customerUID)
    customerRoot.once('value', customerData => {
      if (customerData.val()) {
        const allData = customerData.val()
        const token = allData.pushToken ? allData.pushToken : null

        if (token) {
          RequestPushMsg(
            allData.pushToken ? allData.pushToken : null,
            msg,
            bookingId,
            type
          )
        }
      }
    })
  }

  async validateNewValueToRace() {
    return new Promise(async (resolve, reject) => {
      try {
        const propost = this.state.txtproposta
        const estimate = this.state.estimateFare

        if (Number(propost) < 1) {
          alert('Valor não pode ser inferior a R$ 1,00')
          return resolve(false)
        }

        const minPropost = Number(estimate) * 0.6
        if (Number(propost) < parseFloat(minPropost).toFixed(2)) {
          alert(
            `Valor mínimo permitido: R$ ${parseFloat(minPropost).toFixed(2)}`
          )
          return resolve(false)
        }

        if (this.state.paymentmethod === 'AppCredit') {
          let money = this.state.estimateFare
          if (this.state.txtproposta) {
            money = this.state.txtproposta
          }

          money = formatterAmount(money)
          const walletResposne = await this.walletBalanceCurrent(money)
          if (walletResposne.status === false) {
            this.setState({
              walletConfirm: true,
              modalpropostavisible: false,
              walletMessage: walletResposne?.message
            })
          } else {
            this.bookNow()
          }
        } else {
          this.bookNow()
        }

        return resolve(true)
      } catch (error) {
        console.log('Error new value', error)
        resolve(false)
      }
    })
  }

  goWallet() {
    this.setState({
      walletConfirm: false
    })

    return this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'wallet',
            params: {}
          })
        ]
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          position={'center'}
          animated={true}
          transparent={true}
          visible={this.state.modalpropostavisible}
        >
          <View style={styles.modalView}>
            <View
              style={{
                flex: 0,
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                alignSelf: 'center',
                alignContent: 'center'
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  paddingTop: 5,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontFamily: 'Roboto-Regular',
                  fontSize: 18,
                  fontWeight: 'bold'
                }}
              >
                Confirme as informações e faça sua proposta
              </Text>
            </View>
            <View style={styles.paymentMethodOption}>
              <Text style={styles.paymentMethodLabel}>Valor</Text>
              <View style={styles.paymentMethodView}>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                >
                  R${' '}
                </Text>
                <TextInput
                  autoFocus={false}
                  keyboardType={'numeric'}
                  style={styles.textPropositValue}
                  maxLength={6}
                  value={this.state.txtproposta}
                  onChangeText={text => this.setState({ txtproposta: text })}
                />
              </View>
            </View>
            <View style={styles.paymentMethodOption}>
              <Text style={styles.paymentMethodLabel}>Método de pagamento</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#EDEFEE',
                  borderRadius: 5,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '98%'
                }}
              >
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={value =>
                    this.setState({ paymentmethod: value })
                  }
                  value={this.state.paymentmethod}
                  items={[
                    { label: 'Dinheiro', value: 'Cash' },
                    { label: 'Maquininha do Motorista', value: 'OwnMachine' },
                    { label: 'Credito no Aplicativo', value: 'AppCredit' }
                  ]}
                />
              </View>
            </View>
            <View style={styles.paymentMethodOption}>
              <Text style={styles.paymentMethodLabel}>
                Quantidade de passageiros
              </Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#EDEFEE',
                  borderRadius: 5,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '98%'
                }}
              >
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={value =>
                    this.setState({ amountPassenger: value })
                  }
                  items={[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 }
                  ]}
                />
              </View>
            </View>
            <View style={styles.paymentMethodOption}>
              <Text style={styles.paymentMethodLabel}>Obs. ?</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#EDEFEE',
                  borderRadius: 5,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '98%'
                }}
              >
                <TextInput
                  placeholder="Alguma observação? Digite aqui"
                  numberOfLines={4}
                  multiline={true}
                  onChangeText={text => this.setState({ observation: text })}
                  value={this.state.observation}
                  style={{
                    width: '100%',
                    paddingLeft: 10
                  }}
                  maxLength={200}
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: 30,
                paddingBottom: 30,
                height: 30,
                alignContent: 'center',
                alignItems: 'center',
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: '100%'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalpropostavisible: false })
                }}
                style={styles.modalViewButtonOptions}
              >
                <Text style={styles.modalViewButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.validateNewValueToRace()
                }}
                style={styles.modalViewButtonOptions}
              >
                <Text style={styles.modalViewButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Header
          backgroundColor={colors.GREEN.mediumSea}
          leftComponent={{
            icon: 'md-menu',
            type: 'ionicon',
            color: colors.WHITE,
            size: 30,
            component: TouchableWithoutFeedback,
            onPress: () => {
              this.props.navigation.toggleDrawer()
            }
          }}
          centerComponent={
            <Text style={styles.headerTitleStyle}>
              {languageJSON.confirm_booking}
            </Text>
          }
          // rightComponent={{ icon: 'ios-notifications', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.navigate('Notifications'); } }}
          containerStyle={styles.headerStyle}
          innerContainerStyles={styles.headerInnerStyle}
        />

        <View style={styles.topContainer}>
          <View style={styles.topLeftContainer}>
            <View style={styles.circle} />
            <View style={styles.staightLine} />
            <View style={styles.square} />
          </View>
          <View style={styles.topRightContainer}>
            <TouchableOpacity style={styles.whereButton}>
              <View style={styles.whereContainer}>
                <Text numberOfLines={1} style={styles.whereText}>
                  {this.state.region.whereText}
                </Text>
                <Icon
                  name="gps-fixed"
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropButton}>
              <View style={styles.whereContainer}>
                <Text numberOfLines={1} style={styles.whereText}>
                  {this.state.region.droptext}
                </Text>
                <Icon
                  name="search"
                  type="feather"
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mapcontainer}>
          {this.state.region && this.state.region.wherelatitude ? (
            <MapView
              ref={map => {
                this.map = map
              }}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: this.state.region.wherelatitude,
                longitude: this.state.region.wherelongitude,
                latitudeDelta: 0.9922,
                longitudeDelta: 1.9421
              }}
            >
              <Marker
                coordinate={{
                  latitude: this.state.region.wherelatitude,
                  longitude: this.state.region.wherelongitude
                }}
                title={this.state.region.whereText}
              >
                <Image
                  source={require('../../../assets/images/rsz_2red_pin.png')}
                  style={{ height: 40, width: 40 }}
                />
              </Marker>
              <Marker
                coordinate={{
                  latitude: this.state.region.droplatitude,
                  longitude: this.state.region.droplongitude
                }}
                title={this.state.region.droptext}
                pinColor={colors.GREEN.default}
              >
                <Image
                  source={require('../../../assets/images/rsz_2red_pin.png')}
                  style={{ height: 40, width: 40 }}
                />
              </Marker>

              {this.state.coords ? (
                <MapView.Polyline
                  coordinates={this.state.coords}
                  strokeWidth={4}
                  strokeColor={colors.BLUE.default}
                />
              ) : null}
            </MapView>
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.offerContainer}>
            <TouchableOpacity>
              <Text style={styles.offerText}>
                {' '}
                {languageJSON.estimate_fare_text}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceDetailsContainer}>
            <View style={styles.priceDetailsLeft}>
              <View style={styles.priceDetails}>
                <View style={styles.totalFareContainer}>
                  <Text style={styles.totalFareText}>
                    {languageJSON.suggested_price}
                  </Text>
                </View>
                <Icon
                  name="info"
                  color={colors.WHITE}
                  type="simple-line-icon"
                  size={15}
                  containerStyle={styles.infoIcon}
                />
              </View>

              <View style={styles.iconContainer}>
                <Text style={styles.priceText}>
                  {this.state.settings.symbol}{' '}
                  {this.state.valorproposta > 0
                    ? this.state.valorproposta
                    : this.state.estimateFare}
                </Text>
              </View>
            </View>
            <View style={styles.priceDetailsMiddle}>
              <View style={styles.triangle} />
              <View style={styles.lineHorizontal} />
            </View>
            {/* <View style={styles.logoContainer}>
              <Image source={require('../../../assets/images/paytm_logo.png')} style={styles.logoImage} />
            </View> */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoContainerTxt}>
                Clique em continuar e Faça sua proposta!
              </Text>
            </View>
          </View>

          <View style={styles.btnOptions}>
            <TouchableOpacity
              style={styles.scheduleBtn}
              onPress={() => {
                this.onPressCancel()
              }}
            >
              <Text style={styles.scheduleBtnTxt}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goNowBtn}
              disabled={this.state.buttonDisabled}
              onPress={() => {
                this.setState({
                  modalpropostavisible: true,
                  txtproposta:
                    this.state.valorproposta > 0
                      ? this.state.valorproposta
                      : this.state.estimateFare
                })
              }}
            >
              <Text style={styles.goNowBtnTxt}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.alertModal()}

        <AlertConfirm
          show={this.state.walletConfirm}
          close={() => {
            this.setState({
              walletConfirm: false,
              modalpropostavisible: true
            })
          }}
          confirm={() => {
            this.goWallet()
          }}
          messageConfirm={'Recarregar'}
          messageClose={'Alterar método pagamento'}
          textInfo={this.state.walletMessage}
        />
      </View>
    )
  }
}
