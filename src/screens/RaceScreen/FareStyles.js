import {
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
var {
  width,
  height
} = Dimensions.get('window');

import {
  colors
} from '../../common/theme';

const styles = StyleSheet.create({
  paymentMethodOption: {
    paddingLeft: 5,
    flex: 0,
    flexDirection: "column",
    width: "100%",
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    alignContent: "flex-start",
  },
  paymentMethodLabel: {
    justifyContent: "flex-start",
    height: 30,
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentMethodView: {
    borderWidth: 2,
    borderColor: "#EDEFEE",
    height: 50,
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    width: "98%",
  },
  observationLimitStyle: {
    color: colors.LIGHT_RED,
    fontFamily: 'Roboto-Regular',
    fontSize: 16
  },
  textPropositValue: {
    fontWeight: 'bold',
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: "white",
    flex: 0,
    width: "60%",
    alignSelf: "center",
    alignContent: "center",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    marginTop: 75,
    borderWidth: 2,
    borderColor: "#EDEFEE",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  modalViewButtonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: "bold",
  },
  modalViewButtonOptions: {
    padding: 10,
    width: 150,
    borderWidth: 2,
    borderColor: "#EDEFEE",
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerStyle: {
    backgroundColor: colors.GREEN.mediumSea,
    borderBottomWidth: 0
  },
  headerInnerStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 18
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    //marginTop: StatusBar.currentHeight
  },
  topContainer: {
    flex: 1.5,
    flexDirection: 'row',
    borderTopWidth: 0,
    alignItems: 'center',
    backgroundColor: colors.GREEN.mediumSea,
    paddingEnd: 20
  },
  topLeftContainer: {
    flex: 1.5,
    alignItems: 'center'
  },
  topRightContainer: {
    flex: 9.5,
    justifyContent: 'space-between',
  },
  circle: {
    height: 12,
    width: 12,
    borderRadius: 15 / 2,
    backgroundColor: colors.YELLOW.light
  },
  staightLine: {
    height: height / 25,
    width: 1,
    backgroundColor: colors.YELLOW.light
  },
  square: {
    height: 14,
    width: 14,
    backgroundColor: colors.GREY.iconPrimary
  },
  whereButton: {
    flex: 1,
    justifyContent: 'center',
    borderBottomColor: colors.WHITE,
    borderBottomWidth: 1
  },
  whereContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  whereText: {
    flex: 9,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: colors.WHITE
  },
  iconContainer: {
    flex: 1
  },
  dropButton: {
    flex: 1,
    justifyContent: 'center'
  },
  mapcontainer: {
    flex: 7,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  bottomContainer: {
    flex: 2.5,
    alignItems: 'center'
  },
  offerContainer: {
    flex: 1,
    backgroundColor: colors.YELLOW.secondary,
    width: width,
    justifyContent: 'center',
    borderBottomColor: colors.YELLOW.primary,
    borderBottomWidth: Platform.OS == 'ios' ? 1 : 0
  },
  offerText: {
    alignSelf: 'center',
    color: colors.GREY.btnPrimary,
    fontSize: 12,
    fontFamily: 'Roboto-Regular'
  },
  offerCodeText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  priceDetailsContainer: {
    flex: 2.3,
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    position: 'relative',
    height: 150,
    zIndex: 1,
  },
  priceDetailsLeft: {
    flex: 19
  },
  priceDetailsMiddle: {
    flex: 2,
    height: 50,
    width: 1,
    alignItems: 'center'
  },
  priceDetails: {
    flex: 1,
    flexDirection: 'row'
  },
  totalFareContainer: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalFareText: {
    color: colors.GREY.btnPrimary,
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    marginLeft: 40
  },
  infoIcon: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  priceText: {
    alignSelf: 'center',
    color: colors.GREY.iconSecondary,
    fontFamily: 'Roboto-Bold',
    fontSize: 18
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: colors.TRANSPARENT,
    borderStyle: 'solid',
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 10,
    borderLeftColor: colors.TRANSPARENT,
    borderRightColor: colors.TRANSPARENT,
    borderBottomColor: colors.YELLOW.secondary,
    transform: [{
      rotate: '180deg'
    }],
    marginTop: -1,
    overflow: 'visible'
  },
  lineHorizontal: {
    height: height / 18,
    width: 1,
    backgroundColor: colors.BLACK,
    alignItems: 'center',
    marginTop: 10
  },
  logoContainer: {
    flex: 19,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoImage: {
    width: 70,
    height: 70
  },
  buttonsContainer: {
    flex: 1.5,
    flexDirection: 'row'
  },
  buttonText: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
    alignSelf: 'flex-end'
  },
  buttonStyle: {
    backgroundColor: colors.GREY.secondary,
    elevation: 0
  },
  buttonContainerStyle: {
    flex: 1,
    backgroundColor: colors.GREY.secondary
  },
  confirmButtonStyle: {
    backgroundColor: colors.GREY.btnPrimary,
    elevation: 0
  },
  confirmButtonContainerStyle: {
    flex: 1,
    backgroundColor: colors.GREY.btnPrimary
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.GREY.background,
    overflow: 'visible'
  },
  modalImageConttainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
    zIndex: 4,
    marginBottom: -40
  },
  modalImage: {
    width: 90,
    height: 90,
  },
  modalInnerContainer: {
    height: 400,
    width: (width - 85),
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 7,
    overflow: 'visible'
  },
  modalInner: {
    flex: 1,
    justifyContent: 'space-between',
    width: (width - 100),
    overflow: 'visible',
  },
  fareTextContainer: {
    flex: 0.7,
    borderBottomWidth: 5,
    borderBottomColor: colors.WHITE
  },
  fareText: {
    top: 40,
    color: colors.BLACK,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    alignSelf: 'center'
  },
  horizontalLine: {
    width: width - 120,
    height: 1,
    marginTop: 3,
    backgroundColor: colors.GREY.iconSecondary,
    alignSelf: 'center'
  },
  upperContainer: {
    flex: 3,
    alignItems: 'center'
  },
  fareDetailsContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  fareDetails: {
    flex: 1.2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingTop: 20
  },
  fareTitleText: {
    flex: 1,
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: colors.BLACK
  },
  verticalLine: {
    width: 0.8,
    height: 100,
    backgroundColor: colors.GREY.iconSecondary,
    marginLeft: 1
  },
  farePriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingTop: 20
  },
  farePriceText: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: '900',
    color: colors.BLACK
  },
  discountPriceText: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: '900',
    color: colors.LIGHT_RED
  },
  line: {
    width: width - 120,
    height: 1,
    backgroundColor: colors.GREY.iconSecondary,
    alignSelf: 'center',
    marginTop: 3
  },
  totalPriceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20
  },
  totalPrice: {
    flex: 1.5,
    alignItems: 'flex-start'
  },
  totalPriceText: {
    flex: 0.5,
    paddingTop: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    fontWeight: '900',
    color: colors.BLACK
  },
  taxText: {
    flex: 1,
    marginTop: 0,
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    fontWeight: '900',
    color: colors.GREY.secondary
  },
  totalPriceNumberContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  totalPriceNumber: {
    flex: 1,
    paddingTop: 10,
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    fontWeight: '900',
    color: colors.BLACK
  },
  termsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10
  },
  termsText: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: colors.GREY.btnSecondary
  },
  buttonContainer: {
    flex: 0.5,
    width: ((width - 85)),
    flexDirection: 'row',
    backgroundColor: colors.GREY.iconSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  doneButtonStyle: {
    backgroundColor: colors.GREY.iconSecondary,
    borderRadius: 0,
    elevation: 0
  },
  signInTextStyle: {
    fontFamily: 'Roboto-Bold',
    fontWeight: "700",
    color: colors.WHITE
  },
  flexView: {
    flex: 1
  },
  //alert modal
  alertModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.GREY.background
  },
  alertModalInnerContainer: {
    height: 200,
    width: (width * 0.85),
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 7
  },
  alertContainer: {
    flex: 2,
    justifyContent: 'space-between',
    width: (width - 100)
  },
  rideCancelText: {
    flex: 1,
    top: 15,
    color: colors.BLACK,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    alignSelf: 'center'
  },
  horizontalLLine: {
    width: (width - 110),
    height: 0.5,
    backgroundColor: colors.BLACK,
    alignSelf: 'center',
  },
  msgContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelMsgText: {
    color: colors.BLACK,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'center'
  },
  okButtonContainer: {
    flex: 1,
    width: (width * 0.85),
    flexDirection: 'row',
    backgroundColor: colors.GREY.iconSecondary,
    alignSelf: 'center'
  },
  okButtonStyle: {
    flexDirection: 'row',
    backgroundColor: colors.GREY.iconSecondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  okButtonContainerStyle: {
    flex: 1,
    width: (width * 0.85),
    backgroundColor: colors.GREY.iconSecondary,
  },
  infoContainer: {
    flex: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainerTxt: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Roboto-Regular',
    color: 'black',
  },
  btnOptions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  scheduleBtn: {
    borderWidth: 1.6,
    height: 40,
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 20,
    borderColor: colors.YELLOW.primary,
  },
  scheduleBtnTxt: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.YELLOW.primary,
  },
  goNowBtn: {
    borderWidth: 1.6,
    height: 40,
    flexDirection: 'row',
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 20,
    borderColor: colors.GREEN.default,
  },
  goNowBtnTxt: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.GREEN.default,
  },
});

export default styles;
