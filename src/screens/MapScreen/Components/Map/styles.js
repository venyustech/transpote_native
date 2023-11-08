import { StyleSheet } from 'react-native';
import styled, { css } from "styled-components/native";
import { Platform } from "react-native";

export const Styles = StyleSheet.create({
  containerFrom: {
    top: Platform.select({ ios: 8, android: 8}),
    height: 45,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 0,
    paddingTop: 8,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 18,
    backgroundColor: '#FFF',
  },
  containerTo: {
    top: Platform.select({ ios: 8, android: 15}),
    marginLeft: 15,
    marginRight: 15,
    height: 45,
    borderRadius: 0,
    paddingTop: 8,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
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
});

export const LocationBox = styled.View`
  background: #fff;
  shadow-color: #000;
  shadow-offset: 0 0;
  shadow-opacity: 0.1;
  elevation: 1;
  border: 1px solid #ddd;
  border-radius: 3px;
  flex-direction: row;
  ${Platform.select({
    ios: css`
      margin-top: 20px;
    `,
    android: css`
      margin-top: 10px;
      margin-left: 10px;
    `
  })}
`;

export const LocationText = styled.Text`
  margin: 8px 10px;
  font-size: 14px;
  color: #333;
`;

export const LocationTimeBox = styled.View`
  background: #222;
  padding: 3px 8px;
`;

export const LocationTimeText = styled.Text`
  color: #fff;
  font-size: 12px;
  text-align: center;
`;

export const LocationTimeTextSmall = styled.Text`
  color: #fff;
  font-size: 10px;
  text-align: center;
`;

export const Back = styled.TouchableOpacity`
  position: absolute;
  top: ${Platform.select({ ios: 60, android: 40 })};
  left: 20px;
`;