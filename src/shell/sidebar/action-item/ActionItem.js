import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './ActionItem.css';

const ActionItem = ({ name, icon: Icon, in: in_, staggerDelay, className, ...rest }) => (
    <li { ...rest } className={ classNames(styles.actionItem, in_ && styles.in, className) }>
        <Icon className={ styles.icon } />
        <div
            style={ in_ && staggerDelay ? { transitionDelay: `${staggerDelay}ms` } : undefined }
            className={ styles.name }>
            <span className={ styles.text }>{ name }</span>
        </div>
    </li>
);

ActionItem.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    in: PropTypes.bool,
    staggerDelay: PropTypes.number,
    className: PropTypes.string,
};

export default ActionItem;
