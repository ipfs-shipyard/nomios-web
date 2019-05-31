import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PromiseState, getPromiseState } from 'react-promiseful';
import { TextInput, LocationIcon } from '@nomios/web-uikit';
import getLocation from './getLocation';
import styles from './LocationInput.css';

const FEEDBACK = {
    message: 'Unable to find your location',
    type: 'error',
};

class LocationInput extends Component {
    state = {
        isGeolocationAvailable: undefined,
        locationPromise: undefined,
    };

    constructor() {
        super();

        this.state.isGeolocationAvailable = !!navigator.geolocation;
    }

    render() {
        const { isGeolocationAvailable, locationPromise } = this.state;
        const { onLocationInferred, ...rest } = this.props;

        return (
            <div className={ styles.locationFieldContainer }>
                { isGeolocationAvailable && <LocationIcon className={ styles.icon } onClick={ this.handleLocationClick } /> }
                <PromiseState promise={ locationPromise } onSettle={ this.handlePromiseLocationSettle }>
                    { ({ status }) => (
                        <TextInput { ...this.getTextInputProps(rest, status) } />
                    ) }
                </PromiseState>
            </div>
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

    handleLocationClick = () => {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.locationPromise).status === 'pending') {
            return;
        }

        this.setState({ locationPromise: getLocation() });
    };

    handlePromiseLocationSettle = ({ status, value }) => {
        const { name } = this.props;

        if (status === 'rejected') {
            return console.warn('Geolocation error:', value.message);
        }

        const location = `${value.county}, ${value.country}`;

        this.props.onLocationInferred(name, location);
    };
}

LocationInput.propTypes = {
    onLocationInferred: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
};

export default LocationInput;
