import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { ModalTrigger } from '@nomios/web-uikit';
import EditProfile from '../../modals/edit-profile';

const Identity = ({ match, isLoaded }) => {
    if (!isLoaded) {
        return null;
    }

    return (
        <Fragment>
            <div>This is the identity page of { match.params.id }!</div>
            <ModalTrigger modal={ <EditProfile id={ match.params.id } /> }>
                <button>Edit Profile</button>
            </ModalTrigger>
        </Fragment>
    );
};

Identity.propTypes = {
    match: PropTypes.object.isRequired,
    isLoaded: PropTypes.bool.isRequired,
};

export default connectIdmWallet((idmWallet) => () => ({
    isLoaded: idmWallet.identities.isLoaded(),
}))(Identity);
