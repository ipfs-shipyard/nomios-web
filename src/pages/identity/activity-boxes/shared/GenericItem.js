import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './GenericItem.css';

const GenericItem = (props) => {
    const { content, icon, status, variant } = props;

    if (variant === 'small') {
        return (
            <div className={ styles.item }>
                <div className={ styles.left }>
                    { React.cloneElement(icon, { className: classNames(styles.optional, styles.icon, icon.props.className) }) }
                    <span className={ styles.name }>
                        { content }
                    </span>
                </div>
                { status }
            </div>
        );
    }

    return (
        <div className={ styles.singleItem }>
            <div className={ styles.name }>
                { content }
                { status }
            </div>
            <div className={ styles.iconWrapper }>
                { React.cloneElement(icon, { className: classNames(styles.icon, icon.props.className) }) }
            </div>
        </div>
    );
};

GenericItem.propTypes = {
    content: PropTypes.node.isRequired,
    icon: PropTypes.node,
    status: PropTypes.node,
    variant: PropTypes.oneOf(['small', 'large']),
};

GenericItem.defaultProps = {
    variant: 'small',
};

export default GenericItem;
