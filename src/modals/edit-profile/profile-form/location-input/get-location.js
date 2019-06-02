import pTimeout from 'p-timeout';
import pify from 'pify';

const GET_GEOLOCATION_TIMEOUT = 15000;

const getLocation = async () => {
    const nodeGeocoder = await pTimeout(
        import(/* webpackChunkName: "node-geocoder" */ 'node-geocoder'),
        GET_GEOLOCATION_TIMEOUT
    );

    const geocoder = nodeGeocoder.default({
        provider: 'openstreetmap',
        format: 'json',
        zoom: 18,
        addressdetails: 1,
        'accept-language': 'en-US',
    });

    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    const response = await pTimeout(
        pify(geocoder.reverse).call(geocoder, { lat: latitude, lon: longitude }),
        GET_GEOLOCATION_TIMEOUT
    );

    return response.raw.address;
};

export default getLocation;
