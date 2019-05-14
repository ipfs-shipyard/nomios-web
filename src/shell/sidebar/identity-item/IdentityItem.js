import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@nomios/web-uikit';
import styles from './IdentityItem.css';

const IdentityItem = ({ identity, in: in_, staggerDelay, className, ...rest }) => (
    <li { ...rest } className={ classNames(styles.identityItem, in_ && styles.in, className) }>
        <NavLink
            to={ `/identity/${identity.id}` }
            activeClassName={ styles.active }>
            <Avatar image={ identity.image } name={ identity.name } className={ styles.avatar } />
            <div
                style={ in_ && staggerDelay ? { transitionDelay: `${staggerDelay}ms` } : undefined }
                className={ styles.name }>
                <span className={ styles.text }>{ identity.name }</span>
            </div>
        </NavLink>
    </li>
);

IdentityItem.propTypes = {
    identity: PropTypes.object.isRequired,
    in: PropTypes.bool,
    staggerDelay: PropTypes.number,
    className: PropTypes.string,
};

export default IdentityItem;
