import React, { Component } from 'react';
import { Platform, StatusBar, Button } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '../common/theme';
import { google_map_key } from '../common/key';

export default class SearchScreen extends Component {
    componentWillMount() {
        let from = this.props.navigation.getParam('from');
        let whereText = this.props.navigation.getParam('whereText');
        let dropText = this.props.navigation.getParam('dropText');
        this.setState({
            from: from,
            whereText: whereText,
            dropText: dropText
        })
    }

    goMap(data,from) {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + data.place_id + '&key=' + google_map_key)
        .then((response) => response.json())
        .then((responseJson) => {
            let details = responseJson.results[0];
            if(from=="where") {
                let searchObj = {
                    searchDetails: details, 
                    searchFrom: from,
                    whereText: data.description,
                    dropText: this.state.dropText
                }
                let oldData = this.props.navigation.getParam('old');
                oldData.wherelatitude = details.geometry.location.lat,
                oldData.wherelongitude = details.geometry.location.lng,
                oldData.whereText = data.description; 
                this.props.navigation.replace('Map',{ searchObj: searchObj,old:oldData});     
            }
            else if(from=='drop'){
                let searchObj = {
                    searchDetails: details, 
                    searchFrom: from,
                    whereText: this.state.whereText,
                    dropText: data.description
                }
                let oldData = this.props.navigation.getParam('old');
                oldData.droplatitude = details.geometry.location.lat,
                oldData.droplongitude = details.geometry.location.lng,
                oldData.droptext = data.description
                this.props.navigation.replace('Map',{ searchObj: searchObj,old:oldData});
            }
        });

    }
    render() {
  return (
        <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'  // true/false/undefined
            fetchDetails={true}
            renderLeftButton={() => <Button
                title="Back"
                onPress={() => { this.props.navigation.goBack(); }}
              />
            }
            textInputProps={{ clearButtonMode: 'while-editing' }}
            onPress={(data) => { // 'details' is provided when fetchDetails = true
                this.goMap(data,this.state.from);
            }}
            
            // getDefaultValue={() => ''}
            
            query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: google_map_key,
                language: 'en', // language of the results
                // types: '(cities)' 
               // components: "country:ng", // country name
            }}
            
            styles={{
                container: {
                    marginTop: Platform.OS=='android' ? StatusBar.currentHeight : 44,
                    backgroundColor: colors.GREY.default
                },
                textInputContainer: {
                    width: '100%',
                },
                description: {
                    fontWeight: 'bold'
                },
                description: {
                    color: colors.WHITE
                },
                predefinedPlacesDescription: {
                    color: colors.BLUE.light
                },
            }}
            renderDescription={(row) => row.description || row.formatted_address || row.name}
            //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            //currentLocationLabel="Current location"
           // nearbyPlacesAPI='none' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            /*GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                key: google_map_key,
                language: 'en',  
            }}*/
            fetchDetails={false}
            /*GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'establishment'
            }}*/
            minLength = {4}
            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
    );
    }
}
