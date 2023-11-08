import React from 'react'
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  ActivityIndicator
} from 'react-native'
import { Icon, Button, Header, Input } from 'react-native-elements'
import { colors } from '../common/theme'
import languageJSON from '../common/language'
import * as firebase from 'firebase'
import { TextInputMask } from 'react-native-masked-text'

/** Service */
import apiCpf from '../services/cpfApi'

/** UTIL */
import { cpfMask } from '../utils'
const { height } = Dimensions.get('window')

export default class EditUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      cpf: '',
      cpfField: '',
      cpfValid: true,
      cpfEditable: false,
      fnameValid: true,
      lnameValid: true,
      mobileValid: true,
      emailValid: true,
      loginType: '',
      load: false,
      verified: false,
      quiz: null,
      cpfApi: null
    }
  }

  async componentWillMount() {
    const curuser = firebase.auth().currentUser
    const userData = firebase.database().ref('users/' + curuser.uid)
    if (curuser.email) this.setState({ loginType: 'email' })
    userData.once('value', userData => {
      const userVal = userData.val()
      this.setState({
        fname: userVal.firstName,
        lname: userVal.lastName,
        email: userVal.email,
        mobile: userVal.mobile,
        cpf: cpfMask(userVal?.cpf),
        cpfEditable: !(userVal?.cpf && `${userVal.cpf}`.length >= 11),
        verified: userVal?.verified || false,
        quiz: userVal?.quiz || null,
        cpfApi: userVal?.cpfApi || null
      })
    })
  }

  // first name validation
  validateFirstName() {
    const { fname } = this.state
    const fnameValid = fname.length > 0
    LayoutAnimation.easeInEaseOut()
    this.setState({ fnameValid })
    fnameValid || this.fnameInput.shake()
    return fnameValid
  }

  // last name validation
  validateLastname() {
    const { lname } = this.state
    const lnameValid = lname.length > 0
    LayoutAnimation.easeInEaseOut()
    this.setState({ lnameValid })
    lnameValid || this.lnameInput.shake()
    return lnameValid
  }

  // mobile number validation
  validateMobile() {
    /* const { mobile } = this.state;
    const mobileValid = (mobile.length == 10)
    LayoutAnimation.easeInEaseOut()
    this.setState({ mobileValid })
    mobileValid || this.mobileInput.shake();
    return mobileValid; */
    return true
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

  // CPF Validação
  validateCPF() {
    LayoutAnimation.easeInEaseOut()
    const resp = this.cpfField.isValid()
    if (!resp) {
      this.setState({ cpfValid: false })
    } else {
      this.setState({ cpfValid: true })
    }

    return resp
  }

  // register button press for validation
  async onPressRegister() {
    const { onPressRegister } = this.props
    LayoutAnimation.easeInEaseOut()
    const fnameValid = this.validateFirstName()
    const lnameValid = this.validateLastname()
    const mobileValid = this.validateMobile()
    const emailValid = this.validateEmail()
    const cpfValid = this.validateCPF()

    if (fnameValid && lnameValid && mobileValid && emailValid && cpfValid) {
      // register function of smart component

      let quiz = this.state.quiz
      let cpfApi = this.state.cpfApi

      if (
        !this.state.verified &&
        (!quiz || quiz.status !== true) &&
        (!cpfApi || !cpfApi.cpf)
      ) {
        quiz = { status: false }
        const respCpf = await apiCpf(this.state.cpf)

        if (respCpf) {
          cpfApi = respCpf
        }
      } else {
        console.log('Sem necessidade de processamento novamente ....')
      }

      onPressRegister(
        this.state.fname,
        this.state.lname,
        this.state.mobile,
        this.state.email,
        this.state.cpf,
        quiz,
        cpfApi
      )

      // this.setState({fname: '', lname: '', mobile: '', email: '' });
    }
  }

  render() {
    const { onPressBack } = this.props
    return (
      <View style={styles.main}>
        <Header
          backgroundColor={colors.TRANSPARENT}
          leftComponent={{
            icon: 'md-close',
            type: 'ionicon',
            color: colors.BLACK,
            size: 35,
            component: TouchableWithoutFeedback,
            onPress: onPressBack
          }}
          containerStyle={styles.headerContainerStyle}
          innerContainerStyles={styles.headerInnerContainer}
        />
        <ScrollView style={styles.scrollViewStyle}>
          {/* <View style={styles.logo}>
                        <Image source={require('../../assets/images/logo.png')} />
                    </View> */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={styles.form}
          >
            <View style={styles.containerStyle}>
              <Text style={styles.headerStyle}>
                {languageJSON.update_profile_title}
              </Text>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="user"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.fnameInput = input)}
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.first_name_placeholder}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.fname}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={text => {
                    this.setState({ fname: text })
                  }}
                  errorMessage={
                    this.state.fnameValid
                      ? null
                      : languageJSON.first_name_blank_error
                  }
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    this.validateFirstName()
                    this.lnameInput.focus()
                  }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="user"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={30}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.lnameInput = input)}
                  editable={true}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.last_name_placeholder}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.lname}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={text => {
                    this.setState({ lname: text })
                  }}
                  errorMessage={
                    this.state.lnameValid
                      ? null
                      : languageJSON.last_name_blank_error
                  }
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    this.validateLastname()
                    this.mobileInput.focus()
                  }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>
              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="mobile-phone"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={40}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.mobileInput = input)}
                  editable={this.state.loginType === 'email'}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.mobile_no_placeholder}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.mobile}
                  keyboardType={'number-pad'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={text => {
                    this.setState({ mobile: text })
                  }}
                  errorMessage={
                    this.state.mobileValid
                      ? null
                      : languageJSON.mobile_no_blank_error
                  }
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    this.validateMobile()
                  }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="user-circle"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={35}
                  containerStyle={styles.iconContainer}
                />

                <View style={{ width: '100%' }}>
                  <TextInputMask
                    ref={input => (this.cpfField = input)}
                    type={'cpf'}
                    editable={this.state.cpfEditable}
                    underlineColorAndroid={colors.TRANSPARENT}
                    placeholder={'CPF'}
                    value={this.state.cpf}
                    includeRawValueInChangeText={true}
                    onChangeText={(maskedText, rawText) => {
                      this.setState({ cpf: rawText })
                    }}
                    keyboardType={'number-pad'}
                    inputContainerStyle={styles.inputContainerStyle}
                    placeholderTextColor={colors.WHITE}
                    style={[styles.inputContainerStyle, styles.inputMaskCpf]}
                    containerStyle={styles.textInputStyle}
                  />
                  {this.state.cpfValid === false ? (
                    <Text style={styles.txtError}>CPF inválido</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.textInputContainerStyle}>
                <Icon
                  name="envelope"
                  type="font-awesome"
                  color={colors.GREY.secondary}
                  size={25}
                  containerStyle={styles.iconContainer}
                />
                <Input
                  ref={input => (this.emailInput = input)}
                  editable={this.state.loginType !== 'email'}
                  underlineColorAndroid={colors.TRANSPARENT}
                  placeholder={languageJSON.email_placeholder}
                  placeholderTextColor={colors.GREY.secondary}
                  value={this.state.email}
                  keyboardType={'email-address'}
                  inputStyle={styles.inputTextStyle}
                  onChangeText={text => {
                    this.setState({ email: text })
                  }}
                  errorMessage={
                    this.state.emailValid
                      ? null
                      : languageJSON.valid_email_check
                  }
                  secureTextEntry={false}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    this.validateEmail()
                  }}
                  errorStyle={styles.errorMessageStyle}
                  inputContainerStyle={styles.inputContainerStyle}
                  containerStyle={styles.textInputStyle}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => this.onPressRegister()}
                >
                  {this.load === true ? (
                    <ActivityIndicator size="small" color={colors.WHITE} />
                  ) : (
                    <Text style={styles.buttonTitle}>
                      {languageJSON.update_button}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.gapView} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }
}

const styles = {
  main: {
    backgroundColor: colors.BLACK
  },
  headerContainerStyle: {
    backgroundColor: colors.TRANSPARENT,
    borderBottomWidth: 0
  },
  headerInnerContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  inputContainerStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.BLACK
  },
  textInputStyle: {
    marginLeft: 10
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
    backgroundColor: colors.YELLOW.primary,
    width: 180,
    height: 45,
    borderColor: colors.TRANSPARENT,
    borderWidth: 0,
    marginTop: 30,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTitle: {
    fontSize: 16
    // color: colors.WHITE
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 13,
    marginLeft: 0,
    height: 32
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
    flex: 1
  },
  logo: {
    width: '90%',
    justifyContent: 'flex-start',
    marginTop: 10,
    alignItems: 'center'
  },
  scrollViewStyle: {
    height: height
  },
  textInputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 15
  },
  headerStyle: {
    fontSize: 18,
    color: colors.BLACK,
    textAlign: 'center',
    flexDirection: 'row',
    marginTop: 0
  },
  txtError: {
    fontSize: 12,
    color: 'red',
    marginLeft: 25,
    marginTop: 5
  },
  inputMaskCpf: {
    flex: 1,
    marginLeft: 20,
    paddingBottom: 10,
    color: colors.BLACK,
    marginRight: 20
  }
}
