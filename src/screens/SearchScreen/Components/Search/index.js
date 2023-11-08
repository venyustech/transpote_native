import React, { useState, useEffect, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  View, TouchableOpacity, Text, KeyboardAvoidingView, Modal
} from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../../../common/theme';

import { google_map_key } from '../../../../common/key';
import styles, { LocationTimeBox, ButtonSearchText } from './styles';

/** Service */
import { googleSearchAddres } from '../../../../common/GoogleApi';

/** Components */
import MapMarker from '../MapMarker';

const SearchComponent = ({ onLocationSelected, prePlaces, searchModal }) => {

  const [searchFocused, setSearchFocused] = useState(null);
  const [placeTitle, setPlaceTitle] = useState('');
  const [mapModal, setMapModal] = useState(false);
  const [address, setAddress] = useState('');
  const ref = useRef();

  useEffect(() => {
    setPlaceTitle(prePlaces?.title);

    const time = setTimeout(() => {
      ref.current?.focus;
    }, 500);

    return () => {
      clearTimeout(time);
    };
  }, []);


  const searchName = async () => {
    let address = ref.current?.getAddressText();
    if (!address) {
      return;
    }

    let result = await googleSearchAddres(address);
    if (result) {
      onLocationSelected(result, result);
      searchModal(false);
    }
  };

  const goMarkerUser = async (txt) => {
    let result = await googleSearchAddres(address);
    if (result) {
      onLocationSelected(result, result);
      setMapModal(false);
      searchModal(false);
    }
  };

  const inMapMarker = () => {
    let addressResp = ref.current?.getAddressText();
    console.log('endereço enviado', address);

    setAddress(addressResp);
    setMapModal(true);
  };

  const renderHeaderComponent = ({ }) => {
    return (
      <>
        {ref.current?.getAddressText() ? (
          <TouchableOpacity
            onPress={() => inMapMarker()}
            style={styles.headerContainer}
          >
            <View>
              <Icon
                name='location-on'
                type='MaterialIcons'
                size={30}
                color={colors.GREEN.default}
              />
            </View>
            <Text style={styles.headerText} numberOfLines={1} >Mostrar no mapa</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.containerView}
        behavior={'padding'}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={mapModal}
          onRequestClose={() => setMapModal(false)}>
          <MapMarker modal={setMapModal} address={address} goMarkerUser={goMarkerUser} />
        </Modal>

        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Para onde vamos?"
          autoFocus={true}
          onPress={onLocationSelected}
          returnKeyType={'search'}
          debounce={400}
          minLength={2}
          predefinedPlaces={(prePlaces) ? [{
            description: prePlaces?.title,
            geometry: { location: { lat: prePlaces?.latitude, lng: prePlaces?.longitude } },
          }] : []}
          query={{
            key: google_map_key,
            language: 'pt-BR'
          }}
          textInputProps={{
            onFocus: () => { setSearchFocused('auto') },
            onBlur: () => { setSearchFocused(null) },
            autoCapitalize: 'none',
            defaultValue: placeTitle,
            autoCorrect: false
          }}
          listViewDisplayed={searchFocused}
          fetchDetails
          enablePoweredByContainer={false}
          renderHeaderComponent={renderHeaderComponent}
          styles={
            {
              container: styles.containerFrom,
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput,
              listView: styles.listView,
              description: styles.description,
              row: styles.row,
            }}
        />
        <View style={styles.containerOptions}>
          <TouchableOpacity style={styles.closeOptions} onPress={() => searchModal(false)} >
            <Text style={styles.titleOptions}>Fechar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => searchName()}>
            <Text style={styles.titleOptions} >Concluido</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

export default SearchComponent;
