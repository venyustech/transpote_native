import React from 'react';
import * as firebase from 'firebase';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  AsyncStorage,
  TouchableOpacity,
  BackHandler,
  TouchableHighlight
} from "react-native";
import { colors } from '../common/theme';
import MaterialButtonDark from "../components/MaterialButtonDark";
import axios from "axios";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class PhotoVerifyScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      face1: {},
      face2: {},
      counterrors: 0,
      loadingModal: false,
      settings: {}
    }
  }

  componentDidMount() {
    // this.props.navigation.navigate('Map') // APAGAR essa linha!!! Somente para testar o mapa 
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    // ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
    return true;
  }


  async componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);

    var curuser = firebase.auth().currentUser;
    const userData = firebase.database().ref('users/' + curuser.uid);
    if (curuser.email) this.setState({ loginType: 'email' });
    userData.once('value', userData => {
      this.setState({ user: userData.val() })

      const settings = firebase.database().ref('settings');
      settings.once('value', settingsData => {
        this.setState({ settings: settingsData.val() })
        this.DetectPhoto(userData.val().profile_image, "user")

      })
    })
  }

  async DetectPhoto(foto, de) {

    let url = this.state.settings.azurefaceurl + "/face/v1.0/detect?returnFaceId=true"

    // alert(url)

    const headers = {
      'Ocp-Apim-Subscription-Key': this.state.settings.azurefacekey,
      'Content-Type': 'application/json'
    }

    const data = JSON.stringify({ url: foto })

    await axios.post(url, data, { headers: headers }).then((res) => {

      if (de == "user") {
        this.setState({ face1: res.data[0].faceId })
      }

      if (de == "camera") {
        this.VerifyPhoto(res.data[0].faceId)
      }



    }).catch((error) => {
      // this.props.navigation.navigate('Map')

      // this.setState({counterrors:counterrors+1})

      if (this.state.counterrors < 3) {
        alert("Não foi possível confirmar sua identidade. Certifique-se de estar em um local claro e que a foto não esteja tremida.")
      }
      else {
        alert("Ocorreram vários erros, continue tentando ou procure ajuda em nosso site..")
      }


    })

  }

  async DetectPhotoCamera(fotourl) {

    this.setState({ loadingModal: true })
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Image blob conversion issue'));
        //this.setState({ loading: false });
        alert(languageJSON.upload_image_error);
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', fotourl, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    var timestamp = new Date().getTime()

    var imageRef = firebase.storage().ref().child(`users/temp/${firebase.auth().currentUser.uid}`)
    return imageRef.put(blob).then(() => {
      blob.close()
      return imageRef.getDownloadURL()
    }).then((dwnldurl) => {

      this.DetectPhoto(dwnldurl, "camera")
      this.setState({ loadingModal: false })

    }).catch(error => {
      this.setState({ loadingModal: false })
      alert(JSON.stringify(error));
    });

  }

  async VerifyPhoto(face2) {

    this.setState({ loadingModal: true })


    let url = this.state.settings.azurefaceurl + "/face/v1.0/verify"


    const headers = {
      'Ocp-Apim-Subscription-Key': this.state.settings.azurefacekey,
      'Content-Type': 'application/json'
    }
    const data = {
      faceId1: this.state.face1,
      faceId2: face2
    }

    axios.post(url, data, { headers: headers }).then((res) => {

      if (res.data.isIdentical == true) {
        this.setState({ loadingModal: false })
        AsyncStorage.setItem('logged', "true")
        //const value = await AsyncStorage.getItem('logged');
        this.props.navigation.navigate('Map')

      }
      else {
        this.setState({ loadingModal: false })
        alert("Não foi possível confirmar sua identidade, a foto não tem semelhança com a foto enviada no cadastro. ")
      }

    }).catch((error) => {
      this.setState({ loadingModal: false })
      alert("Ocorreu um erro ao ler a imagem." + JSON.stringify(error))
    })

  }


  CapturePhoto = async () => {
    //permission check
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA)
    const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [3, 3],
        base64: true,
        cameraType: 'front',
        quality: 0.6

      });
      if (!result.cancelled) {

        //let data = 'data:image/jpeg;base64,'+ result.base64

        //const sourceData = 'data:image/jpeg;base64,' + result.base64;

        this.DetectPhotoCamera(result.uri);

        // console.log("aaa" + result.base64)

      }
    } else {
      throw new Error('Camera permission not granted');
    }
  }



  render() {
    return (
      <View style={styles.viewStyle}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loadingModal}
          onRequestClose={() => {
            this.setState({ loadingModal: false })
          }}>
          <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
                <Image
                  style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                  source={require('../../assets/images/loader.gif')}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#000", fontSize: 16, }}>Aguarde... verificando a imagem</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.imageViewStyle} >
          <Text></Text>
          <View style={{ paddingBottom: 20, width: "100%", justifyContent: "center", alignItems: "center", alignItems: 'center', alignSelf: 'center' }}>
            <Image source={require('../../assets/images/instrucoes.png')}
            />
          </View>
          <Text style={{ color: "#ffffff", textAlign: "justify", fontSize: 15, fontWeight: "bold" }}>
            Tire uma foto da sua face para confirmar sua identidade. Preencha o quadrado com seu rosto e assegure-se de estar em um local iluminado.
          </Text>
        </View>
        <View style={styles.imageViewStyle}>

          <Text></Text>


          <Image source={this.state.user.profile_image ? { uri: this.state.user.profile_image } : require('../../assets/images/profilePic.png')} style={{ borderRadius: 10, width: 200, height: 200 }} />

        </View>




        <TouchableHighlight style={{ paddingTop: 20, width: "70%" }} onPress={() => { this.CapturePhoto() }} >

          <Image style={{ width: "100%", resizeMode: "stretch" }} source={require('../../assets/images/tirarfoto.png')} />

        </TouchableHighlight>

      </View>


    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: colors.GREY.secondary
  },
  materialButtonDark: {
    height: 35,
    marginTop: 22,
    marginLeft: 35,
    marginRight: 35
  },
  imageParentView: {
    borderRadius: 10,
    backgroundColor: colors.GREY.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageViewStyle: {
    borderRadius: 10,
    width: "90%",
    justifyContent: 'center',
    alignItems: 'center'
  }
})