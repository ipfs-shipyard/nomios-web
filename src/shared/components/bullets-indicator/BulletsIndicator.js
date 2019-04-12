import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './BulletsIndicator.css';

const BulletsIndicator = (props) => (
    <div className={ classNames(styles.wrapper, props.className) }>
        {
            props.bulletCallbacks.map((callback, index) => {
                const bulletClasses = classNames(styles.bullet, props.activeIndex === index && styles.active);

                return <div key={ index } className={ bulletClasses } onClick={ callback } />;
            })
        }
    </div>
);

BulletsIndicator.propTypes = {
    bulletCallbacks: PropTypes.array.isRequired,
    activeIndex: PropTypes.number,
    className: PropTypes.string,
};

BulletsIndicator.defaultProps = {
    activeIndex: 0,
};

export default BulletsIndicator;
