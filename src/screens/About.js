import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Linking,
  Image
} from 'react-native';
var { width } = Dimensions.get('window');
import * as firebase from 'firebase';
import languageJSON from '../common/language';
export default class AboutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const about = firebase.database().ref('About_Us/');
    about.once('value', aboutData => {
      if (aboutData.val()) {
        let data = aboutData.val()
        this.setState(data);
      }
    })
  }
  render() {
    return (
      <View style={styles.mainView}>
        <Header
          backgroundColor={colors.GREEN.mediumSea}
          leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { this.props.navigation.toggleDrawer(); } }}
          centerComponent={<Text style={styles.headerTitleStyle}>{languageJSON.about_us_menu}</Text>}
          containerStyle={styles.headerStyle}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />
        <View>
          <ScrollView styles={{ marginTop: 10 }}>
            <Text style={styles.aboutTitleStyle}>{this.state.heading ? this.state.heading : null}</Text>
            <View style={styles.aboutcontentmainStyle}>
              <Image
                style={{ width: '100%', height: 150 }}
                source={require('../../assets/images/about_us_1.png')}
              />
              <Text style={styles.aboutcontentStyle}>
                {this.state.contents ? this.state.contents : null}
              </Text>
              <Text style={styles.aboutTitleStyle}>{languageJSON.contact_details}</Text>
              <View style={styles.contact}>
                {(this.state?.email) && (
                  <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={styles.contacttype1}>{languageJSON.email_placeholder} :</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(`mailto:${this.state?.email}`) }}>
                      <Text style={styles.contacttypePhone}> {this.state.email ? this.state.email : null}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {(this.state?.phone) && (
                  <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={styles.contacttype2}>{languageJSON.phone} :</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(`tel:${this.state?.phone}`) }}>
                      <Text style={styles.contacttypePhone}> {this.state.phone ? this.state.phone : null}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    //marginTop: StatusBar.currentHeight,
  },
  headerStyle: {
    backgroundColor: colors.GREEN.mediumSea,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20
  },
  aboutTitleStyle: {
    color: colors.BLACK,
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  aboutcontentmainStyle: {
    marginTop: 12,
    marginBottom: 60
  },
  aboutcontentStyle: {
    color: colors.GREY.secondary,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    textAlign: "justify",
    alignSelf: 'center',
    width: width - 20,
    letterSpacing: 1,
    marginTop: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  contact: {
    marginTop: 6,
    marginLeft: 8,
    //flexDirection:'row',
    width: "100%",
    marginBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  contacttype1: {
    textAlign: 'left',
    color: colors.GREY.secondary,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
    // marginBottom: 5,
  },
  contacttypePhone: {
    textAlign: 'left',
    color: colors.SKY,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  contacttype2: {
    textAlign: 'left',
    marginTop: 4,
    color: colors.GREY.secondary,
    fontFamily: 'Roboto-Bold',
    fontSize: 15,
  }
})
