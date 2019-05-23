import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PromiseState, getPromiseState } from 'react-promiseful';
import geocoder from './nodeGeocoder';
import { TextInput, LocationIcon } from '@nomios/web-uikit';
import styles from './LocationInput.css';

const GET_GEOLOCATION_TIMEOUT = 10000;
const FEEDBACK = {
    message: 'Unable to find your location',
    type: 'error',
};

class LocationInput extends Component {
    state = {
        isGeolocationAvailable: undefined,
        locationPromise: undefined,
    };

    geoLocationTimer = undefined;

    constructor() {
        super();

        this.state.isGeolocationAvailable = !!navigator.geolocation;
    }

    componentDidMount() {
        clearTimeout(this.geoLocationTimer);
    }

    render() {
        const { isGeolocationAvailable, locationPromise } = this.state;
        const { onLocationInfered, ...rest } = this.props;

        return (
            <PromiseState promise={ locationPromise } onSettle={ this.handlePromiseLocationSettle }>
                { ({ status }) => (
                    <div className={ styles.locationFieldContainer }>
                        { isGeolocationAvailable && <LocationIcon className={ styles.icon } onClick={ this.handleLocationClick } /> }
                        <TextInput { ...this.getTextInputProps(rest, status) } />
                    </div>
                ) }
            </PromiseState>
        );
    }

    getTextInputProps(props, status) {
        if (!this.state.isGeolocationAvailable) {
            return props;
        }

        switch (status) {
        case 'pending':
            return { ...props, value: '', placeholder: 'Loading...', disabled: true };
        case 'rejected':
            return { ...props, feedback: FEEDBACK };
        default:
            return props;
        }
    }

    maybeResolveLocation = (position, resolve, reject) => {
        const { latitude, longitude } = position.coords;

        this.geoLocationTimer = setTimeout(() => {
            const error = new Error('Geolocation error: timeout expired');

            return this.rejectLocation(error, reject);
        }, GET_GEOLOCATION_TIMEOUT);

        geocoder.reverse({ lat: latitude, lon: longitude }, (error, response) => {
            clearTimeout(this.geoLocationTimer);

            return error ? this.rejectLocation(error, reject) : this.resolveLocation(response, resolve);
        });
    };

    resolveLocation = (data, resolve) => resolve(data.raw.address);
    rejectLocation = (error, reject) => reject(error);

    handleLocationClick = () => {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.locationPromise).status === 'pending') {
            return;
        }

        const locationPromise = new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => this.maybeResolveLocation(position, resolve, reject),
                (error) => this.rejectLocation(error, reject)
            );
        });

        this.setState({ locationPromise });
    };

    handlePromiseLocationSettle = ({ status, value }) => {
        const { name } = this.props;

        if (status === 'rejected') {
            return console.warn('Geolocation error:', value.message);
        }

        const location = `${value.county}, ${value.country}`;

        this.props.onLocationInfered(name, location);
    };
}

LocationInput.propTypes = {
    onLocationInfered: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default LocationInput;
