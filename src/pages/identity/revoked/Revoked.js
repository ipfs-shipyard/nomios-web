import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { Avatar, Button, ModalTrigger } from '@nomios/web-uikit';
import NewIdentityFlow from '../../../modals/new-identity-flow';
import styles from './Revoked.css';

const Revoked = (props) => {
    const { name, image } = props.profileDetails;

    return (
        <div className={ styles.errorPage }>
            <div className={ styles.background } />
            <Avatar image={ image } name={ name } className={ styles.avatar } />
            <h1 className={ styles.title }>Access to { name } was revoked.</h1>
            <p className={ styles.body }>
            You&apos;ll still be able to use this identity in all your other devices, or import it again in this device.
            </p>
            <div className={ styles.actions }>
                <ModalTrigger
                    modal={ <NewIdentityFlow /> }>
                    <Button className={ styles.import } variant="secondary">Import</Button>
                </ModalTrigger>
                <Button className={ styles.delete } variant="primary" onClick={ () => alert('Delete identity') }>Delete</Button>
            </div>
        </div>
    );
};

Revoked.propTypes = {
    id: PropTypes.string.isRequired,
    profileDetails: PropTypes.object.isRequired,
    deleteIdentity: PropTypes.func.isRequired,
    onImport: PropTypes.func,
    onDelete: PropTypes.func,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    profileDetails: idmWallet.identities.get(ownProps.id).profile.getDetails(),
    deleteIdentity: () => idmWallet.identities.remove(ownProps.id),
}))(Revoked);

