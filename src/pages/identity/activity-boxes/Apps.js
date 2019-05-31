import React from 'react';
import PropTypes from 'prop-types';
import GenericItem from './shared/GenericItem';
import GenericList from './shared/GenericList';
import { Svg } from '@nomios/Web-uikit';
import styles from './Apps.css';
import appIcon from '../../../shared/media/backgrounds/background-pattern-1440p.png';

const globeSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/globe.svg');

function iconFromApptype() {
    return (
        <div className={ styles.appIcon } style={ { backgroundImage: `url(${appIcon})` } } />
    );
}

const AppItem = (props) => {
    const { app, ...rest } = props;

    const appIcon = iconFromApptype();

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

// AppsBox.defaultProps = {
//     apps: [
//         {
//             name: 'Facebook',
//         },
//         {
//             name: 'Twitter',
//         },
//         {
//             name: 'Facebook',
//         },
//     ],
// };

export default AppsBox;
