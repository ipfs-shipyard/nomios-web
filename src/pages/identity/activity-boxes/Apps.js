import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { Svg } from '@nomios/web-uikit';
import GenericItem from './shared/GenericItem';
import GenericList from './shared/GenericList';
import styles from './Apps.css';

const globeSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/globe.svg');

function iconFromApptype(url) {
    return (
        <div className={ styles.appIcon } style={ { backgroundImage: `url(${url})` } } />
    );
}

const AppItem = (props) => {
    const { app, ...rest } = props;

    const appIcon = app.iconUrl ? iconFromApptype(app.iconUrl) : null;

    return (
        <GenericItem
            icon={ appIcon }
            content={ app.name }
            { ...rest } />
    );
};

AppItem.propTypes = {
    app: PropTypes.object.isRequired,
};

const AppsBox = (props) => {
    const { apps } = props;

    if (!apps || !apps.length) {
        return (
            <div className={ styles.appsWrapper }>
                <h3 className={ styles.noApps }>
                    Start using Nomios with your Apps.
                </h3>
                <Svg svg={ globeSvg } className={ styles.globeSvg } />
            </div>
        );
    }

    return (
        <GenericList>
            { apps.map((app, index) =>
                <AppItem app={ app } key={ index } />
            )}
        </GenericList>
    );
};

AppsBox.propTypes = {
    apps: PropTypes.array,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    apps: idmWallet.identities.get(ownProps.id).apps.list(),
}))(AppsBox);
