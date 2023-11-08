import React, { useState, useEffect, useCallback } from 'react';
import {
  View, FlatList, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as firebase from 'firebase';

import { colors, theme } from '../../../../common/theme';

const ListCardPayments = ({ modalConfirm }) => {
  const [listCard, setListCard] = useState([]);
  const [userId] = useState(firebase.auth().currentUser.uid);
  const [conections, setConections] = useState({
    paymentCard: null,
  });

  useEffect(() => {
    getPaymentCard();
    return () => {
      try {
        if (conections.paymentCard) {
          conections.paymentCard.off();
        }
      } catch (err) { }
    };
  }, []);

  const removeCard = async (item) => {
    // await firebase.database()
    //   .ref(`/payment_card/${userId}/${item._id}`).update({
    //     status: false,
    //   }).then(() => {}).catch(() => {
    //     Alert.alert('Remover Cartão', 'Não foi possível remover o cartão...');
    //   });
    modalConfirm(item);
  };

  const getPaymentCard = () => {
    const ref = firebase.database().ref(`/payment_card/${userId}`)
      .orderByChild('status')
      .equalTo(true)
      .on('value', (snapshot) => {
        let list = snapshot.val();
        let newList = [];
        if (list) {
          for (const index in list) {
            newList.push({
              _id: index,
              ...list[index],
            });
          }
        }

        setListCard(newList.reverse());
      });

    setConections({
      ...conections,
      paymentCard: ref
    });
  };

  // const

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View>
          <Text style={styles.cardText} numberOfLines={1}>{item?.nameCard}</Text>
          <Text style={styles.cardText} numberOfLines={1}>
            {'Cartão '}
            {item?.cardNumber}
          </Text>
          <Text style={styles.cardText} numberOfLines={1}>
            {'Validade '}
            {item?.expireDate}
          </Text>
        </View>
        <TouchableOpacity style={styles.cardDeleteIcon} onPress={() => removeCard(item)}>
          <Icon name={'delete'} size={30} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {listCard ? (
        <FlatList
          style={styles.container}
          data={listCard}
          keyExtractor={(item) => `${item._id}`}
          renderItem={renderItem}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  cardDeleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardText: {
    fontFamily: theme.FONT_ONE,
    fontSize: 15,
    color: colors.GREY.Trolley_Grey,
  },
});

export default ListCardPayments;
