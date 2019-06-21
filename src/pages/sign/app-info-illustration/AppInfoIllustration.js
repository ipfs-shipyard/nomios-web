import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TypeOption, WriteIcon, ArrowRightIcon } from '@nomios/web-uikit';
import AppInfo from '../../../shared/components/app-info';
import styles from './AppInfoIllustration.css';

const AppInfoIllustration = (props) => (
    <div className={ classNames(styles.container, props.className) }>
        <AppInfo label={ props.name } iconUrl={ props.iconUrl } />
        <ArrowRightIcon className={ styles.arrow } />
        <TypeOption label="Sign data" selectable={ false } className={ styles.typeOption }>
            <WriteIcon />
        </TypeOption>
    </div>
);

AppInfoIllustration.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    iconUrl: PropTypes.string,
};

export default AppInfoIllustration;
