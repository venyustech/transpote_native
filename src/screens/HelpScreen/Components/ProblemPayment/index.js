import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, TextInput,
  Alert
} from 'react-native'
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '../../../../common/theme';
import * as firebase from 'firebase';

const { height } = Dimensions.get('window');

const ProblemPayment = ({ show, close, ride, alertSendMesage}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  });

  const [message, setMessage] = useState('');

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

    setMessage('');
    close();
  }

  useEffect(() => {
    if (show) {
      openModal()
    } else {
      closeModal()
    }
  }, [show]);


  const sendText = async () => {
    try {
      let rideCurrent = null;

      if (ride && ride.length > 0) {
        rideCurrent = ride[0];
      }

      if (!rideCurrent) {
        return Alert.alert('Não conseguimos identificar a corrida para relatar o problema');
      }

      let bookingId = rideCurrent?.bookingId || null;
      let user = firebase.auth().currentUser.uid

      if (!bookingId || !user) {
        return Alert.alert('Não conseguimos identificar a corrida para relatar o problema');
      }

      if (!message || message.length <= 5) {
        return Alert.alert('Informe um texto com pelo menos 5 caracteres');
      }

      let newProblem = await firebase.database().ref().child('/payment_problems').push({
        bookingId: bookingId,
        user: user,
        message: message,
        type: 'payment',
      });

      close();
      alertSendMesage();
    } catch (err) {
      // console.log('Err', err);
      Alert.alert('Falha no Envio', 'Não foi possível enviar informações');
      close();
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
            <Text style={styles.title}>Informe o Problema</Text>
          </View>

          <View style={styles.containerList}>
            <TextInput
              style={styles.textArea}
              underlineColorAndroid="transparent"
              placeholder="Informe o problema"
              multiline={true}
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={sendText}>
          <Text style={{ color: '#fff' }}>Enviar</Text>
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
  },
  textAreaContainer: {
    borderColor: colors.GREY.default,
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  }
});

export default ProblemPayment;
