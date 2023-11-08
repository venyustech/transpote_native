import { StyleSheet } from 'react-native';
import { colors } from '../../common/theme';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.GREY.grey_light,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20
  },
  headerStyle: {
    backgroundColor: colors.GREEN.mediumSea,
    borderBottomWidth: 0
  },
  content: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  containerList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  titleList: {
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  txtRangeRageContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
  },
  txtRangeRage: {
    color: colors.BLUE.primary,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
});

export default Styles;
