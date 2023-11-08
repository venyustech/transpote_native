import { StyleSheet } from 'react-native';
import { colors } from '../../../common/theme';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 10,
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20
  },
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0
  },
  content: {
    flexGrow: 1,
    flexDirection: 'column',
    margin: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  inputText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 10,
    fontSize: 16,
    borderBottomWidth: 0.5,
  },
  payContainer: {
    backgroundColor: colors.SKY,
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payTitle: {
    color: colors.WHITE,
    fontSize: 16,
  },
});

export default Styles;
