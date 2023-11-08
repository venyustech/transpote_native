import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import faker from 'faker';
import { Icon } from 'react-native-elements';

import { colors, theme } from '../../../common/theme';

faker.locale = 'pt_BR';

const MotherQuiz = ({ user, quizAnswer }) => {

  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    let name01 = faker.name.findName('', '', 1);
    let name02 = faker.name.findName('', '', 1);

    let mother = user?.cpfApi?.mother;

    let itens = [
      {
        key: '2',
        name: name02,
      },
      {
        key: '1',
        name: mother,
      },
      {
        key: '3',
        name: name01,
      }
    ];

    setQuiz(itens.sort(() =>  Math.random() - 0.3));
  }, []);

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Qual o nome da sua mãe ?</Text>
      <Text style={styles.txtAlert}>* Responda corretamente para validar seu perfil *</Text>
      <View style={styles.content}>
        <View>
          <Icon name={'account-box'} type='MaterialIcons' size={50} color={colors.GREY.default} />
        </View>
        {quiz.map(item => (
          <TouchableOpacity
            style={styles.option}
            key={item.key}
            onPress={() => {
              quizAnswer(item.name, 'mother');
            }}
          >
            <Text style={styles.optionTxt} >{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    marginTop: 20,
  },
  title: {
    fontFamily: theme.FONT_ONE,
    fontWeight: 'bold',
    color: colors.GREY.default,
    fontSize: 18,
    textAlign: 'center'
  },
  option: {
    marginVertical: 8,
    backgroundColor: colors.GREY.default,
    padding: 15,
  },
  optionTxt: {
    fontFamily: theme.FONT_ONE,
    color: colors.GREY.default,
    fontSize: 16,
    textAlign: 'center',
    color: colors.WHITE,
  },
  txtAlert: {
    fontFamily: theme.FONT_ONE,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.BLACK,
    textAlign: 'center',
  },
});

export default MotherQuiz;
