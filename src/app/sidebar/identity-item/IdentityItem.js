import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { IpfsAvatar } from '../../../shared/components/ipfs';
import styles from './IdentityItem.css';

const IdentityItem = ({ id, details, in: in_, staggerDelay, className, ...rest }) => (
    <li { ...rest } className={ classNames(styles.identityItem, in_ && styles.in, className) }>
        <NavLink
            to={ `/identity/${id}` }
            activeClassName={ styles.active }>
            <IpfsAvatar
                image={ details.image }
                name={ details.name }
                className={ styles.avatar } />
            <div
                style={ in_ && staggerDelay ? { transitionDelay: `${staggerDelay}ms` } : undefined }
                className={ styles.name }>
                <span className={ styles.text }>{ details.name }</span>
            </div>
        </NavLink>
    </li>
);

IdentityItem.propTypes = {
    id: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired,
    in: PropTypes.bool,
    staggerDelay: PropTypes.number,
    className: PropTypes.string,
};

export default IdentityItem;
