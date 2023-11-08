import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  // ActivityIndicator,
} from 'react-native'
import { colors } from '../../common/theme';

const { height } = Dimensions.get('window');

const AlertConfirm = ({show, close, confirm, messageConfirm, messageClose, textInfo}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })

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

    // close();
  }

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      closeModal();
    }
  }, [show]);

  return (
    <Animated.View
      style={[styles.container, {
        opacity: state.opacity,
        transform: [
          { translateY: state.container }
        ]
      }]}
    >
      <TouchableOpacity style={styles.touchClose} />
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}>
        <View style={styles.indicator} />
        <View style={styles.content}>
          {/* <ActivityIndicator color={'blue'} size={'large'} /> */}
          <Text style={styles.text}>{textInfo}</Text>

          <TouchableOpacity style={styles.btn} onPress={() => confirm()}>
            <Text style={styles.txtSecondary}>{messageConfirm}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => close()} >
            <Text style={styles.textLink}>{messageClose}</Text>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 99999,
  },
  modal: {
    bottom: 0,
    position: 'absolute',
    height: 200,
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25
  },
  touchClose: {
    height: '50%',
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
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    marginHorizontal: 20,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.BLUE.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  txtSecondary: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  textLink: {
    color: colors.BLUE.Deep_Blue,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginTop: 10,
  },
});

export default AlertConfirm;
