import React from 'react';
import MapViewDirections from 'react-native-maps-directions';

import { google_map_key } from '../../../../common/key';

const Directions = ({ destination, origin, onReady, waypoints }) => (
  <MapViewDirections
    origin={origin}
    waypoints={waypoints}
    destination={destination}
    strokeWidth={3}
    strokeColor="hotpink"
    optimizeWaypoints={true}    
    onReady={onReady}
    apikey={google_map_key}
    strokeWidth={3}
    strokeColor="#222"
    onError={(errorMessage) => {
      console.log('GOT AN ERROR', errorMessage);
    }}
  />
);

export default Directions;