import React from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { TypeOption, getInitials } from '@nomios/web-uikit';
import styles from './AppInfo.css';

const renderIcon = memoizeOne((name, iconUrl) => {
    if (!iconUrl) {
        return <span>{ getInitials(name) }</span>;
    }

    return <img alt={ name } src={ iconUrl } className={ styles.icon } />;
});

const AppInfo = ({ label, iconUrl }) => (
    <TypeOption label={ label } selectable={ false } className={ styles.typeOption }>
        { renderIcon(label, iconUrl) }
    </TypeOption>
);

AppInfo.propTypes = {
    label: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
};

export default AppInfo;
