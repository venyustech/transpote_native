import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    minHeight: 100,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  ScrollView: {
    flexGrow: 1,
    padding: 10,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  containerAnimated: {
    flexGrow: 1,
  }
});

export default styles;
