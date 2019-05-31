import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './AddIdentityItem.css';

const AddIdentityItem = ({ in: in_, staggerDelay, className, ...rest }) => (
    <li { ...rest } className={ classNames(styles.addIdentityItem, in_ && styles.in, className) }>
        <div className={ styles.addCircle }>
            <div className={ styles.add } />
            <div className={ styles.circle }>
                <span><em /></span>
                <span><em /></span>
            </div>
        </div>
        <div
            style={ in_ && staggerDelay ? { transitionDelay: `${staggerDelay}ms` } : undefined }
            className={ styles.name }>
            <span className={ styles.text }>Add Identity</span>
        </div>
    </li>
);

AddIdentityItem.propTypes = {
    in: PropTypes.bool,
    staggerDelay: PropTypes.number,
    className: PropTypes.string,
};

export default AddIdentityItem;
