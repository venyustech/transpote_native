import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Icon, Button, Avatar, Header } from 'react-native-elements';
import { TouchableOpacity, BaseButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';

/** Styles */
import styles from './Styles';
import SearchComponent from './Components/Search'
import { colors } from '../../common/theme';
import languageJSON from '../../common/language';

const Search = ({ navigation }) => {

  const [modalAddressVisible, setModalAddressVisible] = useState(false);
  const [listRoutes, setListRoutes] = useState([]);
  const [addNewAddress, setAddNewAddress] = useState(0);
  const [indexInput, setIndexInput] = useState(0);
  const [predefinedPlaces, setPredefinedPlaces] = useState({});

  useEffect(() => {
    const routesList = navigation.getParam('routesList', []);
    setAddNewAddress(routesList.length - 1);

    if (Array.isArray(routesList) && routesList.length > 0) {
      setListRoutes(routesList);
    }
  }, [navigation]);

  const handleLocationSelected = async (data, { geometry }) => {
    try {
      const { location: { lat: latitude, lng: longitude } } = geometry;
      const newListRoutes = [];

      const locationAtual = {
        latitude,
        longitude,
        latitudeDelta: 0.9922,
        longitudeDelta: 0.9421,
        title: data.structured_formatting.main_text,
      };

      let hasAltered = false;
      for (const key in listRoutes) {
        if (Number(key) === Number(indexInput)) {
          hasAltered = true;
          newListRoutes.push(locationAtual);
        } else {
          newListRoutes.push(listRoutes[key]);
        }
      }

      if (!hasAltered) {
        newListRoutes.push(locationAtual);
      }

      setListRoutes(newListRoutes);
      setModalAddressVisible(false);
    } catch (err) {
      console.log('err handleLocationSelected', err);
    }
  }



  const showSelectAddress = (origin, index, type, prePlace) => {
    switch (origin) {
      case 'icon':
        if (type === 'close') {
          let removeAddres = listRoutes;
          removeAddres.splice(index, 1);
          setListRoutes([...removeAddres]);
          setAddNewAddress(removeAddres.length - 1);
        } else if (type === 'add') {
          setAddNewAddress(index);
        }
        break;
      default:
        setIndexInput(index);
        setPredefinedPlaces(prePlace);
        setModalAddressVisible(true);
        break;
    }
  }

  const backToMaps = (type) => {
    navigation.navigate('Map', { routesRace: listRoutes })
  }

  return (
    <>
      <Header
        backgroundColor={colors.GREEN.mediumSea}
        leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { navigation.openDrawer(); } }}
        centerComponent={<Text style={styles.headerTitleStyle}>Selecione o trajeto</Text>}
        containerStyle={styles.headerStyle}
        innerContainerStyles={styles.inrContStyle}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalAddressVisible}
        onRequestClose={() => { }}>
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
          <SearchComponent prePlaces={predefinedPlaces} onLocationSelected={handleLocationSelected} searchModal={setModalAddressVisible} />
        </View>
      </Modal>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 10 }}>
          <TouchableOpacity style={{ flexGrow: 1, minWidth: '85%', width: '85%' }}
            onPress={() => showSelectAddress('origin', 0, undefined, listRoutes[0])}>
            <Text numberOfLines={1} style={styles.containerFrom} >{(listRoutes[0]?.title) ? listRoutes[0]?.title : languageJSON.map_screen_where_input_text}</Text>
          </TouchableOpacity>
          {(listRoutes.length >= 1) && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexGrow: 1, minWidth: '85%' }}
                onPress={() => showSelectAddress('origin', 1, undefined, listRoutes[1])}>
                <Text numberOfLines={1} style={styles.containerFrom} >{(listRoutes[1]?.title) ? listRoutes[1]?.title : languageJSON.map_screen_drop_input_text}</Text>
              </TouchableOpacity>
              {(listRoutes[1]?.title) && (
                <TouchableOpacity style={{ flexGrow: 1, minWidth: '15%' }}
                  onPress={() => showSelectAddress('icon', 1, (addNewAddress >= 1) ? 'close' : 'add', undefined)}>
                  <Icon
                    name={(addNewAddress >= 1) ? 'close' : 'add-circle'}
                    color={colors.GREY.default}
                    size={23}
                    containerStyle={styles.iconContainer}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {(addNewAddress >= 1) && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexGrow: 1, minWidth: '85%' }}
                onPress={() => showSelectAddress('origin', 2, undefined, listRoutes[2])}>
                <Text numberOfLines={1} style={styles.containerFrom} placeholder={'Local de embarque'}>{listRoutes[2]?.title || languageJSON.map_screen_drop_input_text}</Text>
              </TouchableOpacity>
              {(listRoutes[2]?.title) && (
                <TouchableOpacity style={{ flexGrow: 1, minWidth: '15%' }}
                  onPress={() => showSelectAddress('icon', 2, (addNewAddress >= 2) ? 'close' : 'add', undefined)}>
                  <Icon
                    name={(addNewAddress >= 2) ? 'close' : 'add-circle'}
                    color={colors.GREY.default}
                    size={23}
                    containerStyle={styles.iconContainer}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          {(addNewAddress >= 2) && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexGrow: 1, minWidth: '85%' }}
                onPress={() => showSelectAddress('origin', 3, undefined, listRoutes[3])}>
                <Text numberOfLines={1} style={styles.containerFrom} placeholder={'Local de embarque'}>{listRoutes[3]?.title || languageJSON.map_screen_drop_input_text}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
          <Text style={{ fontSize: 26 }} >Faça paradas rápidas, de no máximo 2 minutos</Text>
          <Text style={{ fontSize: 18 }}>Em consideração com o tempo do seu motorista, limite cada parada a 3 minutos</Text>
          <TouchableOpacity style={styles.buttonRequestRace}
            onPress={() => backToMaps('routes')}>
            <Text style={styles.buttonRequestRaceText}>Pronto, continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
};

export default React.memo(Search);
