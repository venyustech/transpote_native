import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as firebase from 'firebase';

/** Components */
import DateOfBirth from './Components/DateOfBirth';
import MotherQuiz from './Components/MotherQuiz';
import FullName from './Components/FullName';

/** Styles */
import styles from './styles';

const { height } = Dimensions.get('window');

const Quiz = ({navigation, show, close, random}) => {

  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height)
  });

  const [stageCurrent, setStageCurrent] = useState(null);
  const [user, setUser] = useState({});

  const widthScreen = Dimensions.get('screen').width;
  const widthAnimated = useRef(new Animated.Value(widthScreen - 10)).current;

  // useEffect(() => {
  //   if (show) {
  //     openModal();
  //     settingAnimated();
  //   } else {
  //     closeModal()
  //   }
  // }, []);


  useEffect(() => {
    const curuser = firebase.auth().currentUser.uid;
    firebase.database().ref(`/users/${curuser}`).once('value', (snapshot) => {
      let userCurrent = snapshot.val();
      if (!user) {
        return;
      }

      let cpfApi = userCurrent?.cpfApi;
      let quiz = userCurrent?.quiz;
      let verified = userCurrent?.verified;
      let stage = 1;

      if (
          cpfApi && cpfApi.cpf && cpfApi.date_of_birth && cpfApi.full_name && cpfApi.genre &&
          !verified && (!quiz || quiz.status === false)) {
        stage = quiz.stage || 1;
        setUser(userCurrent);
        setStageCurrent(stage);
        openModal();
      } else {
        closeModal();
      }
    });
  }, [navigation, random]);


  const settingAnimated = useCallback(toValue => {
    Animated.parallel([
      Animated.timing(widthAnimated, {
        toValue: widthScreen,
        useNativeDriver: false,
        duration: 0,
      }),
      Animated.timing(widthAnimated, {
        toValue: 0,
        useNativeDriver: false,
        duration: 400,
      }),
    ]).start();
  }, []);

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
    ]).start(() => {
      settingAnimated();
    });
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
  }

  const quizAnswer = async (answer, type) => {
    // date_of_birth - 1
    // mother - 2
    // full_name - 3
    const curuser = firebase.auth().currentUser.uid;

    if ( stageCurrent === 1 && type === 'date_of_birth' && answer === user?.cpfApi?.date_of_birth ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 2,
        date_of_birth: {
          correct: true,
          answer,
        }
      });

      setStageCurrent(2);
      settingAnimated();
    } else if ( stageCurrent === 1 && type === 'date_of_birth' && answer !== user?.cpfApi?.date_of_birth ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 2,
        status: true,
        date_of_birth: {
          correct: false,
          answer,
        }
      });

      setStageCurrent(2);
      closeModal();
    }

    if ( stageCurrent === 2 && type === 'mother' && answer === user?.cpfApi?.mother ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 3,
        mother: {
          correct: true,
          answer,
        }
      });

      setStageCurrent(3);
      settingAnimated();
    } else if ( stageCurrent === 2 && type === 'mother' && answer !== user?.cpfApi?.mother ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 3,
        status: true,
        mother: {
          correct: false,
          answer,
        },
      });

      setStageCurrent(3);
      closeModal();
    }

    if ( stageCurrent === 3 && type === 'full_name' && answer === user?.cpfApi?.full_name ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 3,
        status: true,
        full_name: {
          correct: true,
          answer,
        }
      });

      await firebase.database().ref(`/users/${curuser}/`).update({
        verified: true,
      });

      closeModal();
    } else if ( stageCurrent === 3 && type === 'full_name' && answer !== user?.cpfApi?.full_name ) {
      await firebase.database().ref(`/users/${curuser}/quiz`).update({
        stage: 3,
        status: true,
        full_name: {
          correct: false,
          answer,
        },
      });

      setStageCurrent(3);
      closeModal();
    }
  };

  return (
    <Animated.View style={[
      styles.container, {
        opacity: state.opacity,
        transform: [
          {
            translateY: state.container
          }
        ]
      }
    ]} >
      <Animated.View
        style={[styles.modal, {
          transform: [
            { translateY: state.modal }
          ]
        }]}>
        <ScrollView style={styles.ScrollView}>
          <View style={styles.indicator} />
          <Animated.View style={[
            styles.containerAnimated,
            {
              left: widthAnimated
            }
          ]}>
            {stageCurrent && stageCurrent === 1 ? (
              <DateOfBirth user={user} quizAnswer={quizAnswer} />
            ) : null}

            {stageCurrent && stageCurrent === 2 ? (
              <MotherQuiz user={user} quizAnswer={quizAnswer} />
            ) : null}

            {stageCurrent && stageCurrent === 3 ? (
              <FullName user={user} quizAnswer={quizAnswer} />
            ) : null}

          </Animated.View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default Quiz;
