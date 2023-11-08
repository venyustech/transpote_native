import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { colors } from '../../../../common/theme'
import moment from 'moment'

const { height } = Dimensions.get('window')

const Information = (show, close) => {
  const [state] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })

  useEffect(() => {
    const dataCurrent = moment()
    const dataLimit = moment('2020-12-04')
    if (dataCurrent.isAfter(dataLimit) === false && show) {
      openModal()
    } else {
      closeModal()
    }
  }, [])

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 5,
        useNativeDriver: false
      })
    ]).start(() => {})
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
        useNativeDriver: false
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: false
      })
    ]).start()
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: state.opacity,
          transform: [
            {
              translateY: state.container
            }
          ]
        }
      ]}
    >
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: state.modal }]
          }
        ]}
      >
        <ScrollView style={styles.ScrollView}>
          <View style={styles.indicator} />
          {/* <Text style={styles.txtInfo}>O Aplicativo começara a funcionar a partir do dia 20/11 até lá acompanhe nossas novidades</Text> */}
          <Text style={styles.txtInfo}>Obrigado por baixar nosso App</Text>
          <Text style={styles.txtInfo}>
            Estamos analisando os cadastros de motorista na sua Região.
          </Text>
          <Text style={styles.txtInfo}>
            O aplicativo começará a funcionar a partir do dia 05/12! Até lá,
            acompanhe nossas novidades.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={() => closeModal()}>
            <Text style={{ color: '#fff' }}>Fechar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    minHeight: 100,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20
  },
  ScrollView: {
    flexGrow: 1,
    padding: 10
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 5
  },
  containerAnimated: {
    flexGrow: 1
  },
  txtInfo: {
    marginTop: 20,
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.GREY.default,
    textAlign: 'center'
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.BLUE.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  }
})

export default Information
