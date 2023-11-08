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

const FullName = ({ user, quizAnswer }) => {
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {

    let genre =  user?.cpfApi?.genre;
    let number = 0;

    if (genre === 'M') {
      number = 0
    } else if (genre === 'F') {
      number = 1
    }

    let full_name = user?.cpfApi?.full_name;
    let name01 = faker.name.findName('', '', number);
    let name02 = faker.name.findName('', '', number);

    let itens = [
      {
        key: '2',
        name: name02,
      },
      {
        key: '1',
        name: full_name,
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
      <Text style={styles.title}>Seu Nome Completo ?</Text>
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
              quizAnswer(item.name, 'full_name');
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

export default FullName;
