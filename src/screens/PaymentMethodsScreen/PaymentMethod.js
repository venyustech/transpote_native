import React, {useState, useCallback, useEffect} from 'react';
import {
  View, Text, TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import * as firebase from 'firebase';

/** Componentes */
import ListCardPayments from './Components/ListCardPayments';
import NewCardPayment from './Components/NewCardPayment';
import ConfirmRemove from './Components/ConfirmRemove';

/** Styles */
import styles from './Style';
import { colors } from '../../common/theme';
import dateStyle from '../../common/dateStyle';

const PaymentMethodScreen = ({ navigation }) => {
  const [task, setTask] = useState('list');
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemCurrent, setItemCurrent] = useState();

  useEffect(() => {
    setTask('list');
    return () => setTask('list');
  }, []);


  const updateTask = (taskName) => {
    setTask(`${taskName}`);
  };

  const removeItemConfirm = (item) => {
    setItemCurrent(item);
    setConfirmModal(true);
  };

  const removeCard = async () => {
    await firebase.database()
      .ref(`/payment_card/${firebase.auth().currentUser.uid}/${itemCurrent._id}`).update({
        status: false,
      }).then(() => {}).catch(() => {
        Alert.alert('Remover Cartão', 'Não foi possível remover o cartão...');
      });
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
          <Text style={styles.headerTitleStyle}>Meus cartões</Text>
        }
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />

      <View style={styles.content}>
        {task !== 'new' ? (
          <TouchableOpacity
            style={styles.newCardContainer}
            onPress={() => updateTask('new') }>
            <Text style={styles.newCardText}>Cadastrar Novo Cartão</Text>
          </TouchableOpacity>
        ) : null}

        {task === 'list' ? (
          <ListCardPayments modalConfirm={removeItemConfirm} />
        ) : null}

        {task === 'new' ? (
          <NewCardPayment updateTask={updateTask} />
        ) : null}

        <ConfirmRemove show={confirmModal} close={setConfirmModal} removeItem={removeCard} />
      </View>
    </View>
  );
};

export default PaymentMethodScreen;
