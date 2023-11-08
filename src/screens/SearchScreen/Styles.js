import { StyleSheet } from 'react-native';
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
  containerFrom: {
    top: Platform.select({ ios: 8, android: 8}),
    // width: '100%',
    height: 50,
    margin: 0,
    borderRadius: 0,
    paddingTop: 10,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 18,
    backgroundColor: '#FFF',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  iconContainer: {
    flex: 1,
    height: 50,
    paddingTop: 15,
  },
  buttonRequestRace: {
    backgroundColor: colors.GREY.default,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    alignSelf: 'stretch',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonRequestRaceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Styles;
