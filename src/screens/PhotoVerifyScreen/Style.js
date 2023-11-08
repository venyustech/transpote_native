import { StyleSheet } from 'react-native';

import { colors } from '../../common/theme';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  containerBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1, 
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200
  },
  button: {
    marginTop: 20,
    width: 100,
    height: 100
  },
  title: {
    color: `${colors.SKY}`,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 22,
  },
  description: {
    color: `${colors.SKY}`,
    marginBottom: 10,
    width: '80%',
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 18,
  },
})

export default Styles;

