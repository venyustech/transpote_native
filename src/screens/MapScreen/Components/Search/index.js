import React, { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View } from 'react-native';

// import { colors } from '../common/theme';
import { google_map_key } from '../../../../common/key';
import styles from './styles';

const Search = ({ onLocationSelected, searchType, origin, fromText }) => {

  const [searchFocused, setSearchFocused] = useState(null);
  const [fromTextLabel, setFromTextLabel] = useState('');

  useEffect(() => {
    setFromTextLabel(fromText);
  }, [fromText]);

  return (
    <>
      <View style={styles.containerView}>
        <GooglePlacesAutocomplete
          placeholder="Para onde vamos?"
          onPress={onLocationSelected}
          returnKeyType={'search'}
          currentLocation={true}
          currentLocationLabel={fromTextLabel}
          query={{
            key: google_map_key,
            language: 'pt-BR'
          }}
          textInputProps={{
            onFocus: () => { setSearchFocused('auto') },
            onBlur: () => { setSearchFocused(null) },
            autoCapitalize: 'none',
            autoCorrect: false
          }}
          listViewDisplayed={searchFocused}
          fetchDetails
          enablePoweredByContainer={false}
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
      </View>
    </>
  );
}

export default React.memo(Search);

