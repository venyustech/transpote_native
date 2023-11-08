import React from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppContainer from './src/navigation/AppNavigator';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
} from "react-native";

import languageJSON from './src/common/language';
import { enableScreens } from 'react-native-screens';

var firebaseConfig = Constants.manifest.extra.firebaseConfig;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

enableScreens();

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
    updateMsg: ''
  };

  constructor() {
    super();
    console.disableYellowBox = true;
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.png'),
        require('./assets/images/logo.png'),
        require('./assets/images/bg.png'),
      ]),

      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };

  async componentDidMount() {
    if (__DEV__) {
      this.setState({ updateMsg: languageJSON.loading_assets });
      this._loadResourcesAsync().then(() => {
        this.setState({ assetsLoaded: true });
      });
    } else {
      try {
        this.setState({ updateMsg: languageJSON.checking_updates })
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          this.setState({ updateMsg: languageJSON.downloading_updates })
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        } else {
          this.setState({ updateMsg: languageJSON.loading_assets });
          this._loadResourcesAsync().then(() => {
            this.setState({ assetsLoaded: true });
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      this.state.assetsLoaded ?
        <AppContainer />
        :
        <View style={styles.container}>
          <ImageBackground
            source={require("./assets/images/intronew.png")}
            resizeMode="stretch"
            style={styles.imagebg}
          >
            <ActivityIndicator />
            <Text style={{ paddingBottom: 100 }}>{this.state.updateMsg}</Text>
          </ImageBackground>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  imagebg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});
