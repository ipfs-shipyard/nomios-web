import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import memoizeOne from 'memoize-one';
import { StandardModal } from '@nomios/web-uikit';
import ProfileForm from './profile-form';
import styles from './EditProfile.css';

const EditProfile = (props) => {
    const { info, setProperty } = props;

    return (
        <StandardModal { ...props } className={ styles.modal } contentClassName={ styles.modalContent }>
            <h2 className={ styles.heading }>
                Edit Profile
            </h2>
            <ProfileForm onRequestClose={ props.onRequestClose } profileInfo={ info } setProperty={ setProperty } />
        </StandardModal>
    );
};

EditProfile.propTypes = {
    id: PropTypes.string.isRequired,
    onRequestClose: PropTypes.func,
    setProperty: PropTypes.func,
    info: PropTypes.object,
};

export default connectIdmWallet((idmWallet) => {
    const setProperty = memoizeOne((id) => (key, value) => idmWallet.identities.get(id).profile.setProperty(key, value));

    return ({ id }) => ({
        info: idmWallet.identities.get(id).profile.getDetails(),
        setProperty: setProperty(id),
    });
})(EditProfile);
