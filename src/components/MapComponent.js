import React, { Component } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Image } from 'react-native'

import carImageIcon from '../../assets/images/available_car.png'

export default class MapComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      marginBottom: 0
    }
  }

  render() {
    const {
      mapRegion,
      mapStyle,
      nearby,
      onRegionChangeComplete,
      onPanDrag
    } = this.props
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        loadingEnabled
        showsMyLocationButton={true}
        style={[mapStyle, { marginBottom: this.state.marginBottom }]}
        region={mapRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        onPanDrag={onPanDrag}
        onMapReady={() => this.setState({ marginBottom: 1 })}
        // scrollEnabled={false}
      >
        {nearby
          ? nearby.map((item, index) => {
              return (
                <Marker.Animated
                  coordinate={{
                    latitude: item.location ? item.location.lat : 0.0,
                    longitude: item.location ? item.location.lng : 0.0
                  }}
                  key={index}
                  tracksViewChanges={this.state.tracksViewChanges}
                >
                  <Image
                    source={carImageIcon}
                    style={{ height: 40, width: 40 }}
                  />
                </Marker.Animated>
              )
            })
          : null}
      </MapView>
    )
  }
}
