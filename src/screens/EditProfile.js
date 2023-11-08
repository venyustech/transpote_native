import React from 'react';
import { EditUser } from '../components';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as firebase from 'firebase'


export default class EditProfilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  //register button click after all validation
  async clickRegister(fname, lname, mobile, email, cpf, quiz, cpfApi) {
    // set data set for update user
    let regData = {
      firstName: fname,
      lastName: lname,
      mobile: mobile,
      email: email,
      cpf: cpf,
      quiz,
      cpfApi,
    }

    let curuser = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + curuser).update(regData).then(() => {
      return this.props.navigation.pop();
    })
  }

  render() {
    return (
      <View style={styles.containerView}>
        <EditUser
          complexity={'complex'}
          onPressRegister={
            (fname, lname, mobile, email, cpf, quiz, cpfApi) => this.clickRegister(fname, lname, mobile, email, cpf, quiz, cpfApi)
          }
          onPress={() => { this.clickRegister() }}
          onPressBack={() => { this.props.navigation.goBack() }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    //marginTop: StatusBar.currentHeight
  },
  textContainer: { textAlign: "center" },
});
