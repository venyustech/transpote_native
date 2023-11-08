import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  AsyncStorage,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform
} from 'react-native';
import axios from "axios";
import Background from './Background';
import { Icon, Button, Header, Input } from 'react-native-elements'
import { colors } from '../common/theme';
import * as firebase from 'firebase'; //Database
var { height } = Dimensions.get('window');
import languageJSON from '../common/language';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { TextInputMask } from 'react-native-masked-text';

export default class Registration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fname: this.props.reqData ? this.props.reqData.profile.first_name : '',
      lname: this.props.reqData ? this.props.reqData.profile.last_name : '',
      email: this.props.reqData ? this.props.reqData.profile.email : '',
      mobile: this.props.reqData ? this.props.reqData.profile.mobile : '',
      image: this.props.reqData ? this.props?.reqData?.profile?.image : '',
      cpf: '',
      cpfField: '',
      refferalId: '',
      // image: null,
      fnameValid: true,
      lnameValid: true,
      mobileValid: true,
      emailValid: true,
      imageValid: true,
      cpfValid: true,
      reffralIdValid: true,
      loadingModal: false,
      settings: {},
      counterrors: 0,
    }
  }

  componentDidMount() {
    setInterval(() => {
      this._retrieveSettings();
    }, 3000);
  }

  _retrieveSettings = async () => {
    try {
      var curuser = firebase.auth().currentUser;
      const userData = firebase.database().ref('users/' + curuser.uid);
      userData.once('value', userData => {
        const settings = firebase.database().ref('settings');
        settings.once('value', settingsData => {
          this.setState({ settings: settingsData.val() });
        })
      })
    } catch (error) {
      console.log("Asyncstorage issue 31");
    }
  };

  // first name validation
  validateFirstName() {
    const { fname } = this.state
    const fnameValid = fname.length > 0
    LayoutAnimation.easeInEaseOut()
    this.setState({ fnameValid })
    fnameValid || this.fnameInput.shake();
    return fnameValid
  }

  validateLastname() {
    const { lname } = this.state
    const lnameValid = lname.length > 0
    LayoutAnimation.easeInEaseOut()
    this.setState({ lnameValid })
    lnameValid || this.lnameInput.shake();
    return lnameValid
  }

  // image upload validation
  validateImage() {
    const { image } = this.state;
    const imageValid = (image != null);
    LayoutAnimation.easeInEaseOut()
    this.setState({ imageValid })
    imageValid;
    return imageValid
  }

  // mobile number validation
  validateMobile() {
    const { mobile } = this.state
    const mobileValid = (mobile.length > 0)
    LayoutAnimation.easeInEaseOut()
    this.setState({ mobileValid })
    mobileValid || this.mobileInput.shake();
    return mobileValid
  }

  // email validation
  validateEmail() {
    const { email } = this.state
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const emailValid = re.test(email)
    LayoutAnimation.easeInEaseOut()
    this.setState({ emailValid })
    emailValid || this.emailInput.shake()
    return emailValid
  }


  validateCPF() {
    LayoutAnimation.easeInEaseOut()
    let resp = this.cpfField.isValid();
    if (!resp) {
      this.setState({ cpfValid: false });
    }
    return resp;
  }

  detectPhoto = async (foto, fotoUri) => {
    try {
      let url = this.state.settings?.azurefaceurl + "/face/v1.0/detect?returnFaceId=true";

      const headers = {
        'Ocp-Apim-Subscription-Key': this.state?.settings?.azurefacekey,
        'Content-Type': 'application/json'
      }

      const data = JSON.stringify({ url: foto })

      // await axios.post(url, data, { headers: headers }).then((res) => {
      //   if (Array.isArray(res.data)) {
      //     if (res.data.length === 0) {
      //       alert("Não foi possível identificar um rosto na imagem. Certifique-se de estar em um local claro e que a foto não esteja tremida e tente novamente.");
      //       return;
      //     } else if (res.data.length > 1) {
      //       alert("Foi identificado mais um rosto na foto. Certifique-se de estar sozinho e em um local claro e que a foto não esteja tremida e tente novamente.");
      //       return;
      //     }
      //   } else {
      //     alert("Não foi possível confirmar sua identidade. Certifique-se de estar em um local claro e que a foto não esteja tremida.")
      //     return;
      //   }

        this.setState({ image: fotoUri });
      // }).catch((error) => {
      //   console.log('Error no network', this.state.counterrors, error);
      //   console.log('xxxxxxxxxxxxxx', this.state.settings);
      //   if (Number(this.state.counterrors) > 3) {
      //     alert("Ocorreram vários erros, continue tentando ou procure ajuda em nosso site..")
      //   } else {
      //     const total = Number(this.state.counterrors) + 1;
      //     this.setState({ counterrors: total });
      //     setTimeout(() => {
      //       this.detectPhoto(foto, fotoUri);
      //     }, 1000);
      //   }
      // })
    } catch (error) {
      console.log('Erro na requisição', error);
    }
  }

  detectPhotoCamera = async (fotouri) => {
    this.setState({ loadingModal: true })
    try {
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
        xhr.open('GET', fotouri, true); // fetch the blob from uri in async mode
        xhr.send(null); // no initial data
      });

      var imageRef = firebase.storage().ref().child(`users/temp/${firebase.auth().currentUser.uid}`)
      return imageRef.put(blob).then(() => {
        blob.close()
        return imageRef.getDownloadURL()
      }).then((dwnldurl) => {
        this.detectPhoto(dwnldurl, fotouri)
        this.setState({ loadingModal: false })
      }).catch(error => {
        this.setState({ loadingModal: false })
        alert(JSON.stringify(error));
      });
    } catch (error) {
      console.log('axxxxxxx', error);
      this.setState({ loadingModal: false })
      alert('Erro ao detectar foto da camera');
    }
  }

  //imagepicker for license upload
  CapturePhoto = async () => {
    //permission check
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA)
    const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraStatus === 'granted' && cameraRollStatus === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        base64: true,
        cameraType: 'front',
        quality: 0.6
      });
      if (!result.cancelled) {
        // this.setState({ image: result.uri });
        this.detectPhotoCamera(result.uri);
      }
    } else {
      throw new Error('Camera permission not granted');
    }
  }

  //upload cancel
  cancelPhoto = () => {
    this.setState({ image: null });
  }

  //register button press for validation
  async onPressRegister() {
    const { onPressRegister } = this.props;
    LayoutAnimation.easeInEaseOut();
    const fnameValid = this.validateFirstName();
    const lnameValid = this.validateLastname();
    const emailValid = this.validateEmail();
    const mobileValid = this.validateMobile();
    const cpfValid = this.validateCPF();
    const imageValid = this.validateImage();

    if (fnameValid && lnameValid && emailValid && mobileValid && cpfValid && imageValid) {
      if (this.state.refferalId != '') {
        this.setState({ loadingModal: true })

        const userRoot = firebase.database().ref('users/');
        userRoot.once('value', userData => {
          if (userData.val()) {
            let allUsers = userData.val();
            var flag = false;

            for (key in allUsers) {
              if (allUsers[key].refferalId) {
                if (this.state.refferalId.toLowerCase() == allUsers[key].refferalId) {
                  flag = true;
                  var referralVia = {
                    userId: key,
                    refferalId: allUsers[key].refferalId
                  }
                  break;
                } else {
                  flag = false;
                }
              }
            }

            if (flag == true) {
              this.setState({ reffralIdValid: true, loadingModal: false });
              onPressRegister(
                this.state.fname,
                this.state.lname,
                this.state.email,
                this.state.mobile,
                true,
                referralVia,
                this.state.image,
                this.state.cpf,
              );
              this.setState({ fname: '', lname: '', email: '', mobile: '', password: '', confPassword: '', refferalId: '', image: '' })
            } else {
              this.refferalInput.shake();
              this.setState({ reffralIdValid: false, loadingModal: false });
            }
          }
        })

      } else {
        //refferal id is blank
        onPressRegister(
          this.state.fname,
          this.state.lname,
          this.state.email,
          this.state.mobile,
          false, null,
          this.state.image,
          this.state.cpf,
        );

        this.setState({ fname: '', lname: '', email: '', mobile: '', refferalId: '', image: '' })
      }

    }
  }

  loading() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.loadingModal}
        onRequestClose={() => {
          this.setState({ loadingModal: false })
        }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(22,22,22,0.8)", justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', backgroundColor: "#DBD7D9", borderRadius: 10, flex: 1, maxHeight: 70 }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" }}>
              <Image
                style={{ width: 80, height: 80, backgroundColor: colors.TRANSPARENT }}
                source={require('../../assets/images/loader.gif')}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#000", fontSize: 16, }}>{languageJSON.refferal_code_validation_modal}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  render() {

    const { onPressBack, loading } = this.props
    const { image } = this.state;

    return (
      <Background>
        <Header
          backgroundColor={colors.TRANSPARENT}
          leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', color: colors.WHITE, size: 35, component: TouchableWithoutFeedback, onPress: onPressBack }}
          containerStyle={styles.headerContainerStyle}
          innerContainerStyles={styles.headerInnerContainer}
        />
        <ScrollView style={styles.scrollViewStyle}>
          <View style={styles.logo}>
            <Image source={require('../../assets/images/logo.png')} />
          </View>
          <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : "padding"} style={styles.form}>
            <View style={styles.containerStyle}>
              <Text style={styles.headerStyle}>{languageJSON.registration_title}</Text>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name='user'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.fnameInput = input)}
                  editable={this.props.reqData.profile.first_name ? false : true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.first_name_placeholder}
                  placeholderTextColor={colors.WHITE}
                  value={this.state.fname}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ fname: text }) }}
                  errorMessage={this.state.fnameValid ? null : languageJSON.first_name_blank_error}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => { this.validateFirstName(); this.lnameInput.focus() }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name='user'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.lnameInput = input)}
                  editable={this.props.reqData.profile.last_name ? false : true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.last_name_placeholder}
                  placeholderTextColor={colors.WHITE}
                  value={this.state.lname}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ lname: text }) }}
                  errorMessage={this.state.lnameValid ? null : languageJSON.last_name_blank_error}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => { this.validateLastname(); this.emailInput.focus() }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={[styles.textInputContainerStyle, { marginRight: 10, flex: 1 }]}>
                <Icon
                  name='user-circle'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />

                <View style={{ width: '100%' }}>
                  <TextInputMask
                    ref={input => (this.cpfField = input)}
                    type={'cpf'}
                    editable={true}
                    underlineColorAndroid={colors.TRANSPARENT}
                    placeholder={'CPF'}
                    value={this.state.cpf}
                    includeRawValueInChangeText={true}
                    onChangeText={(maskedText, rawText) => {
                      this.setState({ cpf: rawText });
                    }}
                    keyboardType={'number-pad'}
                    inputContainerStyle={styles.inputContainerStyle}
                    placeholderTextColor={colors.WHITE}
                    style={[styles.inputContainerStyle, , styles.inputMaskCpf]}
                    containerStyle={styles.textInputStyle}
                  />
                  {this.state.cpfValid === false ? (
                    <Text style={styles.txtError}>CPF inválido</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name='mobile-phone'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.mobileInput = input)}
                  editable={this.props.reqData.profile.mobile ? false : true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.mobile_no_placeholder}
                  placeholderTextColor={colors.WHITE}
                  value={this.state.mobile}
                  keyboardType={'number-pad'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ mobile: text }) }}
                  errorMessage={this.state.mobileValid ? null : languageJSON.mobile_no_blank_error}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => { this.validateMobile(); this.passwordInput.focus() }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>
              <View style={styles.textInputContainerStyle}>
                <Icon
                  name='envelope-o'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={23}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.emailInput = input)}
                  editable={this.props.reqData.profile.email ? false : true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.email_placeholder}
                  placeholderTextColor={colors.WHITE}
                  value={this.state.email}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ email: text }) }}
                  errorMessage={this.state.emailValid ? null : languageJSON.valid_email_check}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => { this.validateEmail(); this.mobileInput.focus() }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name='lock'
                  type='font-awesome'
                  color={colors.WHITE}
                  size={30}
                  containerStyle={styles.iconContainer}
                />

                <Input
                  ref={input => (this.refferalInput = input)}
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.referral_id_placeholder}
                  placeholderTextColor={colors.WHITE}
                  value={this.state.refferalId}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={(text) => { this.setState({ refferalId: text }) }}
                  errorMessage={this.state.reffralIdValid == true ? null : languageJSON.refferal_id_not_match_error}
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>
              {
                image ?
                  <View style={styles.imagePosition}>
                    <TouchableOpacity style={styles.photoClick} onPress={this.cancelPhoto}>
                      <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                    </TouchableOpacity>
                    <Image source={{ uri: image }} style={styles.photoResult} resizeMode={'cover'} />
                  </View>
                  :
                  <View style={styles.capturePhoto}>
                    <View>
                      {
                        this.state.imageValid ?
                          <Text style={styles.capturePhotoTitle}>{languageJSON.upload_driving_lisence}</Text>
                          :
                          <Text style={styles.errorPhotoTitle}>{languageJSON.upload_driving_lisence}</Text>
                      }
                    </View>
                    <Image style={{ paddingBottom: 20, width: "100%", resizeMode: "stretch" }} source={require('../../assets/images/cadastro.png')} />
                    <View style={styles.capturePicClick}>
                      <TouchableOpacity style={styles.flexView1} onPress={this.CapturePhoto}>
                        <View>
                          <View style={styles.imageFixStyle}>
                            <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.myView}>
                        <View style={styles.myView1} />
                      </View>
                      <View style={styles.myView2}>
                        <View style={styles.myView3}>
                          <Text style={styles.textStyle}>{languageJSON.image_size_warning}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
              }

              <View style={styles.buttonContainer}>
                <Button
                  onPress={() => { this.onPressRegister() }}
                  title={languageJSON.register_button}
                  loading={loading}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={styles.registerButton}
                />
              </View>
              <View style={styles.gapView} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        {this.loading()}
      </Background>
    );
  }
};

const styles = {
  headerContainerStyle: {
    backgroundColor: colors.TRANSPARENT,
    borderBottomWidth: 0,
    marginTop: 0
  },
  headerInnerContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.WHITE
  },
  textInputStyle: {
    marginLeft: 10,
  },
  iconContainer: {
    paddingTop: 8
  },
  gapView: {
    height: 40,
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 40
  },
  registerButton: {
    backgroundColor: colors.SKY,
    width: 180,
    height: 50,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 15,
  },
  buttonTitle: {
    fontSize: 16
  },
  inputTextStyle: {
    color: colors.WHITE,
    fontSize: 13,
    marginLeft: 0,
    height: 32,
  },
  errorMessageStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 0
  },
  containerStyle: {
    flexDirection: 'column',
    marginTop: 20
  },
  form: {
    flex: 1,
  },
  capturePhoto: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    backgroundColor: colors.WHITE,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 15
  },
  capturePhotoTitle: {
    color: colors.BLACK,
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 15,

  },
  errorPhotoTitle: {
    color: colors.RED,
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 15,
  },
  photoResult: {
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: 15,
    width: '50%',
    height: 250
  },
  imagePosition: {
    position: 'relative'
  },
  photoClick: {
    paddingRight: 48,
    position: 'absolute',
    zIndex: 1,
    marginTop: 18,
    alignSelf: 'flex-end'
  },
  capturePicClick: {
    paddingTop: 10,
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1
  },
  pickerStyle: {
    color: 'white',
    width: 200,
    fontSize: 15,
    height: 40,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.WHITE,
  },
  imageStyle: {
    width: 30,
    height: height / 15
  },
  flexView1: {
    flex: 12
  },
  imageFixStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle2: {
    width: 150,
    height: height / 15
  },
  logo: {
    width: '100%',
    justifyContent: "flex-start",
    marginTop: 10,
    alignItems: 'center',
  },
  scrollViewStyle: {
    height: height
  },
  textInputContainerStyle: {
    flexDirection: 'row',
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
    padding: 15,
  },
  headerStyle: {
    fontSize: 18,
    color: colors.WHITE,
    textAlign: 'center',
    flexDirection: 'row',
    marginTop: 0
  },
  txtError: {
    fontSize: 12,
    color: 'red',
    marginLeft: 25,
    marginTop: 5,
  },
  inputMaskCpf: {
    flex: 1,
    marginLeft: 20,
    paddingBottom: 10,
    color: colors.WHITE,
    marginRight: 20,
  },
}
