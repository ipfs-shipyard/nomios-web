import React from 'react';
import PropTypes from 'prop-types';
import { StandardModal } from '@nomios/web-uikit';
import ProfileForm from './profile-form';
import styles from './EditProfile.css';

const mockedInfo = {
    type: 'person',
    name: 'Pedro Santos',
    image: 'https://en.gravatar.com/userimage/82191959/d19ac0b9d69bd38f1451cc524b77f290.jpg?size=200',
    nationality: 'Portuguese',
    gender: 'male',
    location: 'Lisbon, Portugal',
};

const EditProfile = (props) => (
    <StandardModal { ...props } className={ styles.modal } contentClassName={ styles.modalContent }>
        <h2 className={ styles.heading }>
                Edit Profile
        </h2>
        <ProfileForm onRequestClose={ props.onRequestClose } profileInfo={ mockedInfo } />
    </StandardModal>
);

EditProfile.propTypes = {
    onRequestClose: PropTypes.func,
};

export default EditProfile;
