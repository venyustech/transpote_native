import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import faker from 'faker';
import moment from 'moment';
import { Icon } from 'react-native-elements';

import { colors, theme } from '../../../common/theme';

const DateOfBirth = ({ user, quizAnswer }) => {

  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    let data01 = moment(faker.date.between(
      '1970-01-01',
      moment().subtract(10, 'years').format('YYYY-MM-DD')
    )).format('DD/MM/YYYY');

    let data02 = moment(faker.date.between(
      '1970-01-01',
      moment().subtract(10, 'years').format('YYYY-MM-DD')
    )).format('DD/MM/YYYY');

    let  birth = user?.cpfApi?.date_of_birth;

    let itens = [
      {
        key: '1',
        date: birth,
      },
      {
        key: '2',
        date: data01,
      },
      {
        key: '3',
        date: data02
      }
    ];

    setQuiz(itens.sort(() =>  Math.random() - 0.3));
  }, []);

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Qual sua Data de Nascimeto ?</Text>
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
              quizAnswer(item.date, 'date_of_birth');
            }}
          >
            <Text style={styles.optionTxt} >{item.date}</Text>
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

export default DateOfBirth;
