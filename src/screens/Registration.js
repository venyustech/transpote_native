import React from 'react';
import { Registration } from '../components';
import { StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';
import GetPushToken from '../common/GetPushToken';
import apiCpf from '../services/cpfApi';

export default class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  //upload of picture
  async uploadmultimedia(useruid, url) {
    this.setState({ loading: true })
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
      xhr.open('GET', url, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    if ((blob.size / 1000000) > 2) {
      this.setState({ loading: false }, () => { alert(languageJSON.image_size_error) })
    }
    else {
      var timestamp = new Date().getTime()
      var imageRef = firebase.storage().ref().child(`users/${useruid}`);
      return imageRef.put(blob).then(() => {
        blob.close()
        return imageRef.getDownloadURL()
      }).then((dwnldurl) => {

        let regData = {
          profile_image: dwnldurl
        }
        firebase.database().ref(`users/${useruid}`).update(regData).then(() => {
        })

      }).catch(error => {
        console.log(error);
      });
    }

  }

  async clickRegister(fname, lname, email, mobile, viaRef, referralVia, image, cpf) {
    this.setState({ loading: true })

    let cpfApi = null;
    let respCpf = await apiCpf(cpf);

    if (respCpf) {
      cpfApi = respCpf;
    }

    var regData = {
      firstName: fname,
      lastName: lname,
      mobile: mobile,
      email: email,
      usertype: 'rider',
      signupViaReferral: viaRef,
      referarDetails: referralVia,
      cpf: cpf,
      cpfApi: cpfApi,
      verified: false,
      quiz: {
        status: false,
      },
      createdAt: new Date().toISOString(),
    }

    firebase.auth().currentUser.updateProfile({
      displayName: regData.firstName + ' ' + regData.lastName,
    }).then(() => {
      firebase.database().ref('users/').child(firebase.auth().currentUser.uid).set(regData).then((Userdata) => {
        this.uploadmultimedia(firebase.auth().currentUser.uid, image)
        this.SetLogged()
        this.props.navigation.navigate('Root');
      });
    });
  }

  async SetLogged() {
    await AsyncStorage.setItem('logged', "true")
  }



  render() {
    const registrationData = this.props.navigation.getParam("requireData");
    return (
      <View style={styles.containerView}>
        <Registration
          reqData={registrationData ? registrationData : ""}
          onPressRegister={
            (fname, lname, email, mobile, password, viaRef, referralVia, image, cpf) =>
            this.clickRegister(
              fname, lname, email, mobile, password, viaRef, referralVia, image, cpf
            )
          }
          onPress={() => { this.clickRegister() }}
          onPressBack={() => { this.props.navigation.goBack() }}
          loading={this.state.loading}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerView: { flex: 1 },
  textContainer: { textAlign: "center" },
});
