import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styled from "styled-components/native";
import {theme, colors} from '../../../../common/theme';

export const LocationTimeBox = styled.View`
  background: #222;
  padding: 8px;
`;

export const ButtonSearchText = styled.Text`
  color: #fff;
  font-size: 16px;
  text-align: center;
  padding: 5px 10px;
`;

const Styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    top: Platform.select({ ios: 20, android: 10}),
    width: '100%'
  },
  containerFrom: {
    position: 'absolute',
    top: Platform.select({ ios: 20, android: 10}),
    width: '100%'
  },
  containerTo: {
    position: 'absolute',
    top: Platform.select({ ios: 80, android: 70}),
    width: '100%'
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 54,
    marginHorizontal: 20,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 54,
    margin: 0,
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 18
  },
  listView: {
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    marginTop: 8
  },
  description: {
    fontSize: 16
  },
  row: {
    padding: 20,
    height: 58
  },
  containerOptions: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 0.6,
    borderColor: colors.GREY.default,
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
  },
  closeOptions: {
    padding: 10,
  },
  titleOptions: {
    fontFamily: theme.FONT_ONE,
    fontSize: 15,
    color: colors.GREEN.default,
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontFamily: theme.FONT_ONE,
    fontSize: 15,
    color: colors.GREEN.default,
    marginLeft: 10,
  },
  iconLocation: {
    color: colors.GREEN.default,
  }
})

export default Styles;
