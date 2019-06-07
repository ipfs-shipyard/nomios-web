import React from 'react';
import PropTypes from 'prop-types';
import Error from '../../shared/components/error';

const ErrorScreen = (props) => (
    <Error
        text="We're having a hard time loading the app."
        error={ props.error }
        onRetry={ props.onRetry }
        className={ props.className } />
);

ErrorScreen.propTypes = {
    error: PropTypes.shape({ message: PropTypes.string.isRequired, code: PropTypes.string }).isRequired,
    onRetry: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ErrorScreen;
