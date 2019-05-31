import pTimeout from 'p-timeout';
import pify from 'pify';
import geocoder from './nodeGeocoder';

const GET_GEOLOCATION_TIMEOUT = 10000;

const getLocation = async () => {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    const response = await pTimeout(pify(geocoder.reverse).call(geocoder, { lat: latitude, lon: longitude }), GET_GEOLOCATION_TIMEOUT);

    return response.raw.address;
};

export default getLocation;
