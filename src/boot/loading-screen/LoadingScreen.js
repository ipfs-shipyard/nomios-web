import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Lottie from 'lottie-react-web';
import animationData from './animation.json';
import styles from './LoadingScreen.css';

const animationOptions = {
    animationData,
    loop: true,
    autoplay: true,
};

const LoadingScreen = ({ className }) => (
    <div className={ classNames(styles.loadingScreen, className) }>
        <Lottie options={ animationOptions } />
    </div>
);

LoadingScreen.propTypes = {
    className: PropTypes.string,
};

export default LoadingScreen;
