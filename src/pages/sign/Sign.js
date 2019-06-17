import React from 'react';
import PropTypes from 'prop-types';

const Sign = ({ app, identity, data, onAccept, onDeny }) => (
    <div>
        <button onClick={ onAccept }>Accept</button>
        <button onClick={ onDeny }>Deny</button>
    </div>
);

Sign.propTypes = {
    app: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    data: PropTypes.any.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
};

export default Sign;
