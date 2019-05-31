import pTimeout from 'p-timeout';
import pify from 'pify';
import nodeGeocoder from 'node-geocoder';

const GET_GEOLOCATION_TIMEOUT = 10000;

const geocoder = nodeGeocoder({
    provider: 'openstreetmap',
    format: 'json',
    zoom: 18,
    addressdetails: 1,
    'accept-language': 'en-US',
});

const getLocation = async () => {
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    const response = await pTimeout(pify(geocoder.reverse).call(geocoder, { lat: latitude, lon: longitude }), GET_GEOLOCATION_TIMEOUT);

    return response.raw.address;
};

export default getLocation;
