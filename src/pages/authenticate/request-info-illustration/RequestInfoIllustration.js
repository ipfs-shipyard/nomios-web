import React from 'react';
import PropTypes from 'prop-types';
import { TypeOption, UserIcon, ArrowRightIcon, getInitials } from '@nomios/web-uikit';
import styles from './RequestInfoIllustration.css';

const renderIcon = (name, iconUrl) => {
    if (!iconUrl) {
        return <span>{ getInitials(name) }</span>;
    }

    return <img alt={ name } src={ iconUrl } className={ styles.icon } />;
};

const RequestInfoIllustration = (props) => (
    <div className={ styles.container }>
        <TypeOption label="Your info" selectable={ false } className={ styles.typeOption }>
            <UserIcon />
        </TypeOption>
        <ArrowRightIcon className={ styles.arrow } />
        <TypeOption label={ props.name } selectable={ false } className={ styles.typeOption }>
            { renderIcon(props.name, props.iconUrl) }
        </TypeOption>
    </div>
);

RequestInfoIllustration.propTypes = {
    name: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
};

export default RequestInfoIllustration;
