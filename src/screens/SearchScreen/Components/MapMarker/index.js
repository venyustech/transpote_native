import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icon } from 'react-native-elements';

/** Components */
import { colors, theme } from '../../../../common/theme';

/** Service */
import { googleSearchAddres } from '../../../../common/GoogleApi';
import { geoReverseHereApi } from '../../../../common/HereApi';

const MapMarker = ({ modal, address, goMarkerUser}) => {

  const [region, setRegion] = useState(null);

  useEffect(() => {
    const getCoord = async () => {
      let response = await googleSearchAddres(address);
      if (response) {
        setRegion({
          latitude: response.geometry.location.lat,
          longitude: response.geometry.location.lng,
          latitudeDelta: 0.009,
          longitudeDelta: 0.004,
          title: response.address,
        });
      }
    };

    getCoord();
  }, []);

  useEffect(() => {

  }, [address]);

  const goBack = () => {
    modal(false);
  };

  const finsh = () => {
    modal(false);
    goMarkerUser(region?.title);
  };

  const onRegionChangeComplete = async (regionValue) => {
    let addressTxt = await geoReverseHereApi(regionValue.latitude, regionValue.longitude);
    if (addressTxt) {
      setRegion({
        ...regionValue,
        title:  addressTxt,
      })
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        region={region}
        style={{ flex: 1 }}
        loadingEnabled
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {/* {region ? (
          <Marker coordinate={region} />
        ) : null} */}
      </MapView>

      <View pointerEvents="none" style={{
          position: 'absolute',
          top: -70,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        }}>
          <View style={styles.textMapView}>
            <Text numberOfLines={1} style={styles.textMap}>{region?.title}</Text>
          </View>
          <Image
            pointerEvents="none"
            style={{ height: 40, resizeMode: "contain" }}
            source={require('../../../../../assets/images/green_pin.png')}
          />
        </View>

      <TouchableOpacity style={styles.containerBack} onPress={() => goBack()}>
        <Icon
          name='navigate-before'
          type='MaterialIcons'
          size={40}
          color={colors.GREEN.default}
        />
      </TouchableOpacity>

      {region ? (
        <View style={styles.containerView}>
          <TouchableOpacity style={styles.containerBtn} onPress={() => finsh()}>
            <Text style={styles.btnTitle}>Concluído</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  containerView: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
  containerBtn: {
    backgroundColor: colors.GREEN.default,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    zIndex: 999,
    borderRadius: 20,
    width: '90%',
  },
  btnTitle: {
    fontSize: 16,
    fontFamily: theme.FONT_ONE,
    color: colors.WHITE,
  },
  containerBack: {
    top: 10,
    left: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.WHITE,
  },
  textMapView: {
    backgroundColor: colors.GREEN.default,
    paddingHorizontal: 20,
    marginBottom: 5,
    paddingVertical: 2,
    borderRadius: 10,
  },
  textMap: {
    fontFamily: theme.FONT_ONE,
    color: colors.WHITE,
    fontSize: 12,
  },
});

export default React.memo(MapMarker);
