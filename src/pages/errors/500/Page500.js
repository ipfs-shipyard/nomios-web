import React from 'react';
import PropTypes from 'prop-types';
import Error from '../../../shared/components/error';

const Page500 = (props) => (
    <Error
        text="An unexpected error has occurred, please try again or report the error."
        onRetry={ props.onRetry }
        error={ props.error } />
);

Page500.propTypes = {
    error: PropTypes.shape({ message: PropTypes.string.isRequired, code: PropTypes.string }).isRequired,
    onRetry: PropTypes.func,
};

export default Page500;
