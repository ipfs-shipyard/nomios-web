import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connectIdmWallet } from 'react-idm-wallet';
import { Button, ModalTrigger } from '@nomios/web-uikit';
import { ButtonPromiseState } from '../../../shared/components/button-promise-state';
import { IpfsAvatar } from '../../../shared/components/ipfs';
import NewIdentityFlow from '../../../modals/new-identity-flow';
import styles from './Revoked.css';

class Revoked extends Component {
    state = {
        promise: undefined,
        redirectToHomepage: false,
    };

    render() {
        const { name, image } = this.props.profileDetails;
        const { promise, redirectToHomepage } = this.state;

        if (redirectToHomepage) {
            return <Redirect to="/" />;
        }

        return (
            <div className={ styles.errorPage }>
                <div className={ styles.background } />
                <IpfsAvatar image={ image } name={ name } className={ styles.avatar } />
                <h1 className={ styles.title }>Access to { name } was revoked.</h1>
                <p className={ styles.body }>
                You&apos;ll still be able to use this identity in all your other devices, or import it again in this device.
                </p>
                <div className={ styles.actions }>
                    <ModalTrigger
                        modal={ <NewIdentityFlow /> }>
                        <Button className={ styles.import } variant="secondary">Import</Button>
                    </ModalTrigger>
                    <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                        { ({ status }) => (
                            <Button
                                feedback={ status }
                                className={ styles.delete }
                                variant="primary"
                                onClick={ this.handleDelete }>
                                Delete
                            </Button>
                        ) }
                    </ButtonPromiseState>
                </div>
            </div>
        );
    }

    handleDelete = () => {
        const { deleteIdentity } = this.props;

        this.setState({ promise: deleteIdentity() });
    };

    handleSettle = (state) => {
        if (state.status === 'fulfilled') {
            this.setState({ redirectToHomepage: true });
        } else {
            this.setState({ promise: undefined });
        }
    };
}

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
