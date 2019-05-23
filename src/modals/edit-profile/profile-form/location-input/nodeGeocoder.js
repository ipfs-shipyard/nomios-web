import nodeGeocoder from 'node-geocoder';

const options = {
    provider: 'openstreetmap',
    format: 'json',
    zoom: 18,
    addressdetails: 1,
    'accept-language': 'en-US',
};

const geocoder = nodeGeocoder(options);

export default geocoder;
