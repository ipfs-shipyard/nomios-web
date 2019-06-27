import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { connectIdmWallet } from 'react-idm-wallet';
import { Svg, ConfirmModal, withModalGlobal } from '@nomios/web-uikit';
import GenericItem from './shared/GenericItem';
import GenericList from './shared/GenericList';
import styles from './Apps.css';

const globeSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/globe.svg');

class AppsBox extends Component {
    removeRequestId = undefined;

    render() {
        const { apps } = this.props;

        if (!apps || !apps.length) {
            return this.renderDescriptionPanel();
        }

        return <GenericList>{ apps.map(this.renderApp) }</GenericList>;
    }

    renderDescriptionPanel() {
        return (
            <div className={ styles.appsWrapper }>
                <h3 className={ styles.noApps }>
                    Start using Nomios with your Apps.
                </h3>
                <Svg svg={ globeSvg } className={ styles.globeSvg } />
            </div>
        );
    }

    renderApp = (app, index) => {
        const icon = app.iconUrl ? <img alt={ app.name } src={ app.iconUrl } /> : null;

        return (
            <GenericItem
                variant="large"
                key={ index }
                id={ app.id }
                icon={ icon }
                content={ app.name }
                onRemove={ this.handleAppRequestRemove } />
        );
    };

    handleAppRequestRemove = (event, id) => {
        this.removeRequestId = id;

        this.props.globalModal.openModal(
            <ConfirmModal
                title="Revoke app for this identity?"
                description="You're about to revoke this app for this identity but you'll be able to allow it again."
                cancelText="No, cancel."
                confirmText="Yes, proceed."
                onConfirm={ this.handleAppRequestRemoveConfirm }
                onCancel={ this.handleAppRequestRemoveCancel }
                onRequestClose={ this.handleAppRequestRemoveCancel } />
        );
    };

    handleAppRequestRemoveConfirm = () => {
        const { globalModal, revokeApp } = this.props;

        globalModal.closeModal();

        revokeApp(this.removeRequestId)
        .catch((error) => {
            console.warn(`Something went wrong revoking app: "${this.removeRequestId}".`, error);
        });

        this.removeRequestId = undefined;
    };

    handleAppRequestRemoveCancel = () => {
        this.props.globalModal.closeModal();
        this.removeRequestId = undefined;
    };
}

AppsBox.propTypes = {
    apps: PropTypes.array,
    revokeApp: PropTypes.func.isRequired,
    globalModal: PropTypes.object.isRequired,
};

const WrappedAppsBox = withModalGlobal(AppsBox);

export default connectIdmWallet((idmWallet) => {
    const getApps = memoizeOne((apps) => apps.slice(0, 2));

    return (ownProps) => ({
        apps: getApps(idmWallet.identities.get(ownProps.id).apps.list()),
        revokeApp: (id) => idmWallet.identities.get(ownProps.id).apps.revoke(id),
    });
})(WrappedAppsBox);
