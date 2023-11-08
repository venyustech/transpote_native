import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView
} from 'react-native'

import * as firebase from 'firebase';

import RideList from '../../Components/RideList';
import { colors } from '../../../../common/theme';
import dateStyle from '../../../../common/dateStyle';

const { height } = Dimensions.get('window');

const LastRaces = ({ show, close, changeRide}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  });

  const [myrides, setMyrides] = useState([]);

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 5,
        useNativeDriver: false,
      })
    ]).start()
  }

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height,
        duration: 250,
        useNativeDriver: false
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: false,
      })
    ]).start()

    close();
  }

  useEffect(() => {
    if (show) {
      openModal();
      getMyRides();
    } else {
      closeModal()
    }
  }, [show])

  const getMyRides = () => {
    let currentUser = firebase.auth().currentUser;

    const ridesListPath = firebase.database().ref('/users/' + currentUser.uid + '/my-booking/');
    ridesListPath.on('value', myRidesData => {
      if (myRidesData.val()) {
        var ridesOBJ = myRidesData.val();
        var allRides = [];
        for (let key in ridesOBJ) {
          ridesOBJ[key].bookingId = key;
          var Bdate = new Date(ridesOBJ[key].tripdate);
          ridesOBJ[key].bookingDate = Bdate.toLocaleString(dateStyle);
          allRides.push(ridesOBJ[key]);
        }
        if (allRides) {
          setMyrides(allRides.reverse());
        }
      }
    });
  }

  return (
    <Animated.View
      style={[styles.container, {
        opacity: state.opacity,
        transform: [
          { translateY: state.container }
        ]
      }]}
    >
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}>
        <View style={styles.indicator} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.contentTitle}>
            <Text style={styles.title}>Ultimas Corridas</Text>
          </View>

          <RideList onPressButton={changeRide} data={myrides} />
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={close}>
          <Text style={{ color: '#fff' }}>Fechar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute'
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: '70%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  text: {
    marginTop: 50,
    textAlign: 'center'
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.BLUE.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  content: {
    flex: 1,
  },
  contentTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  }
});

export default LastRaces;
