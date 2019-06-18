import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const Authenticate = ({ identities, app, onAccept, onDeny }) => {
    const onAcceptCallback = useCallback(() => onAccept(identities[0].id), [identities, onAccept]);

    if (!identities.length) {
        return <div>No identities</div>;
    }

    return (
        <div>
            <pre><code>{ JSON.stringify(app, null, 2) }</code></pre>
            <button onClick={ onAcceptCallback }>Accept</button>
            <button onClick={ onDeny }>Deny</button>
        </div>
    );
};

Authenticate.propTypes = {
    identities: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
};

export default Authenticate;
