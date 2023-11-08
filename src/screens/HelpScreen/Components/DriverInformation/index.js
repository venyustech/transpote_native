import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { colors } from '../../../../common/theme';


const { height } = Dimensions.get('window');

const DriverInformation = ({ show, close, ride}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })

  const [driver, setDriver] = useState({});

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
      openModal()
    } else {
      closeModal()
    }
  }, [show]);

  useEffect(() => {
    if(show && ride && ride.length > 0) {
      getDriver();
    }
  }, [ride, show])


  const getDriver = async () => {
    // let driverId = 'kseotksZ0pfuCMr7CaCsWLfCvwr2';
    let driverId = ride[0]?.driver;
    if (driverId) {
      firebase.database().ref(`/users/${driverId}`).on('value', driverData => {
        if (driverData.val()) {
          setDriver(driverData.val());
        }
      });
    } else {
      setDriver({});
    }
  };


  return (
    <Animated.View
      style={[styles.container, {
        opacity: state.opacity,
        transform: [
          { translateY: state.container }
        ]
      }]}
    >
      <TouchableOpacity style={styles.touchClose} onPress={() => closeModal()} />
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}>
        <View style={styles.indicator} />
        <ScrollView
          style={styles.content}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          >
          <View style={styles.contentTitle}>
            <Text style={styles.title}>Informação Motorista</Text>
          </View>

          <View style={styles.containerList}>
            <Text style={styles.titlePrinc} >
              Motorista:
              <Text style={styles.secondary}>
                {' '}
                {driver?.firstName || ''}
                {' '}
                {driver?.lastName || ''}
              </Text>
            </Text>
          </View>

          <View style={styles.containerList}>
            <Text style={styles.titlePrinc} >
              Carro:
              <Text style={styles.secondary}>
                {' '}
                {driver?.carType || ''}
              </Text>
            </Text>
          </View>

          <View style={styles.containerList}>
            <Text style={styles.titlePrinc} >
              Telefone:
              <Text style={styles.secondary}>
                {' '}
                {driver?.mobile || ''}
              </Text>
            </Text>
          </View>

          <View style={styles.containerList}>
            <Text style={styles.titlePrinc} >
              Email:
              <Text style={styles.secondary}>
                {' '}
                {driver?.email || ''}
              </Text>
            </Text>
          </View>


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
    height: '60%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25
  },
  touchClose: {
    height: '40%',
    width: '100%',
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
  containerList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  contentTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  titlePrinc: {
    color: colors.BLACK,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  secondary: {
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  }
});

export default DriverInformation;
