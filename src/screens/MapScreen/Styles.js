import { Dimensions, StyleSheet } from 'react-native';
var { height, width } = Dimensions.get('window');

import { colors } from '../../common/theme';

const Styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.GREEN.mediumSea,
    borderBottomWidth: 0,
    height: Platform.select({ android: 60 }),
    paddingBottom: 20
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 18
  },
  mapcontainer: {
    flex: 6,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  addressListView: {
    flex: 1,
  },
  inrContStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  mainViewStyle: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  myViewStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    borderTopWidth: 0,
    alignItems: 'center',
    backgroundColor: colors.GREY.default,
    paddingEnd: 20
  },
  coverViewStyle: {
    flex: 1.5,
    alignItems: 'center'
  },
  viewStyle1: {
    height: 12,
    width: 12,
    borderRadius: 15 / 2,
    backgroundColor: colors.YELLOW.light
  },
  viewStyle2: {
    height: height / 25,
    width: 1,
    backgroundColor: colors.YELLOW.light
  },
  viewStyle3: {
    height: 14,
    width: 14,
    backgroundColor: colors.GREY.iconPrimary
  },
  iconsViewStyle: {
    flex: 9.5,
    justifyContent: 'space-between'
  },
  contentStyle: {
    //flex: 1,
    justifyContent: 'center',
    borderBottomColor: colors.WHITE,
    borderBottomWidth: 1
  },
  textIconStyle: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textStyle: {
    flex: 9,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: colors.WHITE,
    marginTop: 10,
    marginBottom: 10
  },
  searchClickStyle: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  compViewStyle: {
    minHeight: 195,
    alignItems: 'center'
  },
  pickCabStyle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    fontWeight: '500',
    color: colors.BLACK
  },
  sampleTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    fontWeight: '300',
    color: colors.GREY.secondary
  },
  adjustViewStyle: {
    // flex: 9,
    flexDirection: 'row',
    //justifyContent: 'space-around',
    marginTop: 10
  },
  cabDivStyle: {
    flex: 1,
    width: width / 3.5,
    alignItems: 'center'
  },
  imageViewStyle: {
    flex: 2.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageStyle: {
    height: height / 14,
    width: height / 14,
    borderRadius: height / 14 / 2,
    borderWidth: 3,
    borderColor: colors.YELLOW.secondary,
    //backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textViewStyle: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
    fontWeight: '900',
    color: colors.BLACK
  },
  text2: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    fontWeight: '900',
    color: colors.GREY.secondary
  },
  imagePosition: {
    height: height / 14,
    width: height / 14,
    borderRadius: height / 14 / 2,
    borderWidth: 3,
    borderColor: colors.YELLOW.secondary,
    //backgroundColor: colors.YELLOW.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyleView: {
    height: height / 14,
    width: height / 14,
    borderRadius: height / 14 / 2,
    borderWidth: 3,
    borderColor: colors.YELLOW.secondary,
    //backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle1: {
    height: height / 20.5,
    width: height / 20.5
  },
  imageStyle2: {
    height: height / 20.5,
    width: height / 20.5
  },
  buttonContainer: {
    flex: 1
  },

  buttonTitleText: {
    color: colors.GREY.default,
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    alignSelf: 'flex-end'
  },

  cancelButtonStyle: {
    backgroundColor: "#edede8",
    elevation: 0,
    width: "60%",
    borderRadius: 5,
    alignSelf: "center"
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

export default Styles;
