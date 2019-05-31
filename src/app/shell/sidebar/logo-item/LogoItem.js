import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Logo } from '@nomios/web-uikit';
import styles from './LogoItem.css';

const LogoItem = ({ in: in_, staggerDelay, className, ...rest }) => (
    <Link { ...rest } to="/" className={ classNames(styles.logoItem, in_ && styles.in, className) }>
        <Logo variant="symbol" className={ styles.symbol } />
        <Logo
            variant="logotype"
            style={ in_ && staggerDelay ? { transitionDelay: `${staggerDelay}ms` } : undefined }
            className={ styles.logotype } />
    </Link>
);

LogoItem.propTypes = {
    in: PropTypes.bool,
    staggerDelay: PropTypes.number,
    className: PropTypes.string,
};

export default LogoItem;
