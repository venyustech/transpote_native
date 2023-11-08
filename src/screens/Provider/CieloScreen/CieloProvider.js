import React, {useState} from 'react';
import {
  View, Text, TouchableWithoutFeedback, TextInput, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import axios from 'axios'
import { TextInputMask } from 'react-native-masked-text';
import moment from 'moment';
import * as firebase from 'firebase';
import Constants from 'expo-constants';

/** Styles */
import styles from './Style';
import { colors } from '../../../common/theme';
import dateStyle from '../../../common/dateStyle';

import { cloud_function_server_url } from '../../../common/serverUrl';


const CieloProvider = ({navigation}) => {
  const [paydata] = useState(navigation.getParam('payData'));
  const [userdata] = useState(navigation.getParam('userdata'));
  const [loadBtn, setLoadBtn] = useState(false);

  /** Form  */
  const [cardNumber, setCardNumber] = useState('');
  const [CardField, setCardField] = useState(null);
  const [nameCard, setNameCard] = useState('');
  const [cvv, setCvv] = useState('');
  const [cvvField, setCvvField] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [expireDateField, setExpireDateField] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [cpfCnpjField, setCpfCnpjField] = useState('');

  const sendPay = async () => {
    try {
      const production = Constants?.manifest?.extra?.production || false;

      let listValidate = [
        cpfCnpjField.isValid(),
        expireDateField.isValid(),
        cvvField.isValid(),
        CardField.isValid(),
      ];

      const isValid = listValidate.every((element, index) => {
        return element === true;
      });

      if (!isValid) {
        return Alert.alert('Error Formulário', 'Preencha os dados corretamente');
      }

      if (!nameCard || `${nameCard}`.length < 5) {
        return Alert.alert('Error Formulário', 'Informe Nome impresso no cartão');
      }

      setLoadBtn(true);

      let customerName = userdata?.firstName;
      customerName += userdata?.lastName ?? '';
      let url = `${cloud_function_server_url}checkoutCielo`;

      const {data: response} =  await axios.post(url, {
        sandbox: !production,
        amount: formatNumber(paydata?.amount),
        cardNumber: cardNumber,
        userCard: nameCard,
        expirationDate: expireDate,
        securityCode: cvv,
        customerName,
        cpf: cpfCnpj,
        userId: firebase.auth().currentUser.uid,
      });

      setLoadBtn(false);

      if (response && response.status && response.status === true ) {
        // return Alert.alert('Sucesso', 'Pagamento Realizado com Sucesso!!')
        return navigation.navigate("wallet", {});
      }

      let message = 'Pagamento Não Autorizado';
      if (response && response.message) {
        message = response.message;
      }

      Alert.alert('Error', message);
    } catch (err) {
      let error = err;
      let messageError = 'Não foi possível efetuar pagamento';

      if (err.response && err.response.data) {
        error =  err.response.data;
        // console.log('Error response', err.response);
        if (error.message) {
          messageError = error.message
        }
      }

      // console.log('Error Payment', error);
      Alert.alert('Error Pagamento', messageError);
      setLoadBtn(false);
    }
  };

  const formatNumber = (value) => {
    try {
      let amount = `${value}`.replace(/,/g,'.');
      amount = Number(`${Math.abs(amount)}`);
      return amount;
    } catch (err) {
      return 0;
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

  return (
    <View style={styles.container}>
       <Header
        backgroundColor={colors.GREEN.mediumSea}
        leftComponent={{
          icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30,
          component: TouchableWithoutFeedback, onPress: () => { navigation.toggleDrawer(); }
        }}
        centerComponent={
          <Text style={styles.headerTitleStyle}>Metodo de Pagamento</Text>
        }
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />
      <ScrollView contentContainerStyle={styles.content} >
        <View>
          <Text>Cartão de Crédito</Text>
        </View>
        <View style={{marginBottom: 20}}>
          <Text>Valor R$ {paydata?.amount}</Text>
        </View>

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

        <TouchableOpacity disabled={loadBtn} style={styles.payContainer} onPress={() => sendPay()} >
          <Text style={styles.payTitle}>
            {loadBtn ? 'Carregando' : 'Pagar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CieloProvider;
