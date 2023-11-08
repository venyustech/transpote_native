import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { colors } from '../../../../common/theme';

const { height } = Dimensions.get('window');

const OtherHelp = ({ show, close }) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  })

  const [information, setInformation] = useState({});

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
      getInformation();
    } else {
      closeModal();
    }
  }, [show]);

  const getInformation = async () => {
    firebase.database().ref(`/About_Us`).on('value', about => {
      if (about.val()) {
        setInformation(about.val());
      }
    });
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
        <View style={styles.content}>
          <View style={styles.containerList}>
            <Icon
              name='phone'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.txtSecondary}>{information?.phone || ''}</Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </View>

          <View style={styles.containerList}>
            <Icon
              name='envelope'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.txtSecondary} >{information?.email || ''}</Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </View>
        </View>
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
    height: '50%',
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
  txtSecondary: {
    color: colors.GREY.Deep_Nobel,
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  }
});

export default OtherHelp;
