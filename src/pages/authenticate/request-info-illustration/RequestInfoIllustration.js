import React from 'react';
import PropTypes from 'prop-types';
import AppInfo from '../../../shared/components/app-info';
import { TypeOption, UserIcon, ArrowRightIcon } from '@nomios/web-uikit';
import styles from './RequestInfoIllustration.css';

const RequestInfoIllustration = (props) => (
    <div className={ styles.container }>
        <TypeOption label="Your info" selectable={ false } className={ styles.typeOption }>
            <UserIcon />
        </TypeOption>
        <ArrowRightIcon className={ styles.arrow } />
        <AppInfo label={ props.name } iconUrl={ props.iconUrl } />
    </div>
);

RequestInfoIllustration.propTypes = {
    name: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
};

export default RequestInfoIllustration;
