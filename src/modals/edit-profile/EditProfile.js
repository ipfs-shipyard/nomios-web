import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import memoizeOne from 'memoize-one';
import { StandardModal } from '@nomios/web-uikit';
import ProfileForm from './profile-form';
import styles from './EditProfile.css';

const EditProfile = (props) => {
    const { details, save } = props;

    return (
        <StandardModal { ...props } className={ styles.modal } contentClassName={ styles.modalContent }>
            <h2 className={ styles.heading }>
                Edit Profile
            </h2>
            <ProfileForm onRequestClose={ props.onRequestClose } profileDetails={ details } saveProfile={ save } />
        </StandardModal>
    );
};

EditProfile.propTypes = {
    id: PropTypes.string.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    details: PropTypes.object.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const getSetProperties = memoizeOne((id) => (properties) => idmWallet.identities.get(id).profile.setProperties(properties));

    return ({ id }) => ({
        details: idmWallet.identities.get(id).profile.getDetails(),
        save: getSetProperties(id),
    });
})(EditProfile);
