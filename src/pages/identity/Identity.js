import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ModalTrigger } from '@nomios/web-uikit';
import EditProfile from '../../modals/edit-profile';

const Identity = ({ match }) => (
    <Fragment>
        <div>This is the identity page of { match.params.id }!</div>
        <ModalTrigger modal={ <EditProfile id={ match.params.id } /> }>
            <button>Edit Profile</button>
        </ModalTrigger>
    </Fragment>
);

Identity.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Identity;
