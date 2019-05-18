import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './StatusIndicator.css';

const StatusIndicator = (props) => {
    const { text, status, dotSide } = props;

    const partialClassName = classNames(styles[status], styles[dotSide]);

    return (
        <div className={ styles.statusIndicator }>
            { dotSide === 'left' &&
                <div className={ classNames(styles.statusDot, partialClassName) } />}
            <span className={ classNames(styles.statusText, partialClassName) }>
                { text }
            </span>
            { dotSide === 'right' &&
                <div className={ classNames(styles.statusDot, partialClassName) } />}
        </div>
    );
};

StatusIndicator.propTypes = {
    text: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dotSide: PropTypes.oneOf(['left', 'right']),
};

StatusIndicator.defaultProps = {
    dotSide: 'right',
};

export default StatusIndicator;
