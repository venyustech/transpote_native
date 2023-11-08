import axios from 'axios';
import { google_map_key } from './key';

export const getDriverTime = (startLoc, destLoc) => {
  return new Promise(function (resolve, reject) {
    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${startLoc}&destinations=${destLoc}&key=${google_map_key}`)
      .then((response) => response.json())
      .then((res) =>
        resolve({
          distance_in_meter: res.rows[0].elements[0].distance.value,
          time_in_secs: res.rows[0].elements[0].duration.value,
          timein_text: res.rows[0].elements[0].duration.text
        })
      )
      .catch(error => {
        reject(error);
      });
  });
}

export const googleSearchAddres = async (address) => {
  try {
    const region = 'br';
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?';
    url += `&address=${address}&language=pt-BR&region=${region}&key=${google_map_key}`;

    const {data: response} = await axios.get(url);

    if (!response || !response.results || response.results.length <=0) {
      return null;
    }

    let item = response.results[0];

    return {
      structured_formatting: {
        main_text: `${item.formatted_address}`,
      },
      address: `${item.formatted_address}`,
      geometry: item.geometry,
    }
  } catch (err) {
    console.log('falhou', err);
    return '';
  }
};
