import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';
import * as firebase from 'firebase';
const creditCardType = require('credit-card-type');
import axios from 'axios'
import { cloud_function_server_url } from '../../../../common/serverUrl';
import Constants from 'expo-constants';

import { colors, theme } from '../../../../common/theme';

const NewCardPayment = ({updateTask}) => {
  const [loadBtn, setLoadBtn] = useState(false);

  /** Form */
  const [cardNumber, setCardNumber] = useState('');
  const [CardField, setCardField] = useState('');
  const [nameCard, setNameCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [cvvField, setCvvField] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [expireDateField, setExpireDateField] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cpfCnpjField, setCpfCnpjField] = useState('');

  const newCard = async () => {
    try {
      let listValidate = [
        cpfCnpjField.isValid(),
        expireDateField.isValid(),
        cvvField.isValid(),
        CardField.isValid(),
      ];

      if (CardField.isValid() === false || !cardNumber) {
        return Alert.alert('Error Formulário', 'Informe um cartão válido');
      }

      if (!nameCard || `${nameCard}`.length < 5) {
        return Alert.alert('Error Formulário', 'Informe Nome impresso no cartão');
      }

      if (cvvField.isValid() === false || !cvv) {
        return Alert.alert('Error Formulário', 'Informe codigo cartão corretamente');
      }

      if (expireDateField.isValid() == false) {
        return Alert.alert('Error Formulário', 'Data de validade inválida');
      }

      if (cpfCnpjField.isValid() == false) {
        return Alert.alert('Error Formulário', 'Informe um CPF válido');
      }

      const isValid = listValidate.every((element, index) => {
        return element === true;
      });

      if (!isValid) {
        return Alert.alert('Error Formulário', 'Preencha os dados corretamente');
      }

      let userId = firebase.auth().currentUser.uid;

      if (!userId) {
        return Alert.alert('Error Formulário', 'Não conseguimos identificar o usuário, verifique se está logado ...');
      }

      let cardN = `${cardNumber}`.replace(/ /g, '');
      let brand = null;

      const firstNumbers = cardN.slice(0, 4);
      const brandType = creditCardType(firstNumbers);

      if (brandType && brandType.length > 0) {
        brand = brandType[0].niceType;
      }

      if (!brand || brand === null) {
        return Alert.alert('Error Formulário', 'Não conseguimos identicar a bandeira do cartão');
      }

      setLoadBtn(true);
      brand = getBrand(brand);

      let cardToken = await getToken(
        nameCard,
        cardNumber,
        expireDate,
        brand,
        cvv
      );

      if (!cardToken) {
        setLoadBtn(false);
        return Alert.alert('Não foi possível gerar Token Cartão ...');
      }

      cardN = cardN.replace(/\d(?=\d{4})/g, "*");

      let newResponse = await firebase.database().ref().child(`/payment_card/${userId}`).push({
        cardNumber: cardN,
        cardToken: cardToken,
        brand: brand,
        nameCard: nameCard,
        cvv,
        expireDate,
        cpf: cpfCnpj,
        type: 'CreditCard',
        status: true,
        createdAt: moment().utc(false).format('YYYY-MM-DD HH:mm:ss')
      });

      setLoadBtn(false);

      if (!newResponse) {
        return Alert.alert('Não foi possível salvar informação');
      }

      return updateTask('list');
    } catch (err) {
      let error = err;
      let messageError = 'Não foi possível cadastrar';

      if (err.response && err.response.data) {
        error = err.response.data;
        if (error.message) {
          messageError = error.message
        }
      }

      // console.log('erro cad', err);
      Alert.alert('Error Pagamento', messageError);
      setLoadBtn(false);
    }
  }

  const getToken = async (name, cardNumber, expireDate, brand, securityCode) => {
    try {
      const production = Constants?.manifest?.extra?.production || false;
      let url = `${cloud_function_server_url}cardTokenCielo`;

      const {data: response} = await axios.post(url, {
        sandbox: !production,
        CustomerName: name,
        CardNumber: cardNumber,
        Holder: name,
        ExpirationDate: expireDate,
        Brand: brand,
        SecurityCode: securityCode,
      });

      if (!response || !response.cardToken) {
        return null;
      }

      return response.cardToken;
    } catch (err) {
      return null;
    }
  };

  const validExpireDate = value => {
    try {
      if (value === undefined || value === null) {
        return false;
      }

      let listArray = value.split('/');

      if (!Array.isArray(listArray) || listArray.length !== 2) {
        return false;
      }

      let month = listArray[0];
      let year = listArray[1];

      if (month < 1 || month > 12) {
        return false;
      }

      let dataCurrent = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').utc();
      let monthCurrent = dataCurrent.format('MM');
      let yearCurrent = dataCurrent.format('YY');

      if (yearCurrent > year || (yearCurrent >= year && monthCurrent >= month)) {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  };

  const getBrand = (brand) => {
    if (
      `${brand.toLocaleLowerCase()}` === 'mastercard' ||
      `${brand.toLocaleLowerCase()}` === 'maestro'
    ) {
      return 'Master';
    }

    return brand;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Número do Cartão</Text>
        <TextInputMask
          type={'credit-card'}
          value={cardNumber}
          onChangeText={maskedText => {
            setCardNumber(maskedText);
          }}
          ref={setCardField}
          style={styles.textInput}
          keyboardType={'number-pad'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Nome impresso no cartão</Text>
        <TextInput
          onChangeText={setNameCard}
          value={nameCard}
          autoCompleteType={'name'}
          returnKeyType={'next'}
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>CVV</Text>
        <TextInputMask
          type={'custom'}
          options={{
            mask: '999',
          }}
          value={cvv}
          onChangeText={maskedText => {
            setCvv(maskedText);
          }}
          ref={setCvvField}
          style={styles.textInput}
          keyboardType={'number-pad'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>Validade</Text>
        <TextInputMask
          type={'custom'}
          options={{
            mask: '99/99',
            validator: function (value, settings) {
              return validExpireDate(value);
            },
          }}
          value={expireDate}
          includeRawValueInChangeText={true}
          onChangeText={(maskedText, rawText) => {
            setExpireDate(maskedText);
          }}
          ref={setExpireDateField}
          style={styles.textInput}
          keyboardType={'number-pad'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>CPF</Text>
        <TextInputMask
          type={'cpf'}
          value={cpfCnpj}
          includeRawValueInChangeText={true}
          onChangeText={(maskedText, rawText) => {
            setCpfCnpj(rawText);
          }}
          ref={setCpfCnpjField}
          style={styles.textInput}
          keyboardType={'number-pad'}
        />
      </View>

      <TouchableOpacity
        disabled={loadBtn}
        style={[styles.payContainer, loadBtn ? styles.btnDisabled : null]}
        onPress={() => newCard()}>
        <Text style={styles.payTitle}>
          {loadBtn ? 'Processando ...' : 'Cadastrar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    flexDirection: 'column',
    margin: 20,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  inputText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: theme.FONT_ONE,
  },
  textInput: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: theme.FONT_ONE,
    borderBottomWidth: 0.5,
  },
  payContainer: {
    backgroundColor: colors.SKY,
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: colors.GREY.default,
  },
  payTitle: {
    color: colors.WHITE,
    fontSize: 16,
  },
  txtAlert: {
    color: colors.RED,
    fontFamily: theme.FONT_ONE,
    fontSize: 11,
  },
});

export default NewCardPayment;
