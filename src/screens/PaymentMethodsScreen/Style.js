import {StyleSheet} from 'react-native';
import { colors } from '../../common/theme';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.GREY.grey_light,
    marginBottom: 10,
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
  newCardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: colors.GREY.Smoke_Grey,
    borderRadius: 10,
    elevation: 3,
  },
  newCardText: {
    fontSize: 16,
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
  },
});

export default Styles;
