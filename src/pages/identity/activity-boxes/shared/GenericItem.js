import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { BoxedStar } from '@nomios/web-uikit';
import styles from './GenericItem.css';

const GenericItem = ({ id, content, icon, status, variant, onRemove }) => {
    if (variant === 'small') {
        if (icon) {
            icon = React.cloneElement(icon, {
                className: classNames(styles.optional, styles.icon, icon.props.className),
            });
        }

        return (
            <div className={ styles.smallItem }>
                <div className={ styles.left }>
                    { icon }
                    <span className={ styles.name }>
                        { content }
                    </span>
                </div>
                { status }
            </div>
        );
    }

    return (
        <div className={ styles.largeItem }>
            <div className={ styles.name }>
                { content }
                { status }
            </div>
            <BoxedStar id={ id } onRemove={ onRemove }>{ icon }</BoxedStar>
        </div>
    );
};

GenericItem.propTypes = {
    id: PropTypes.string,
    content: PropTypes.node.isRequired,
    icon: PropTypes.node,
    status: PropTypes.node,
    variant: PropTypes.oneOf(['small', 'large']),
    onRemove: PropTypes.func,
};

GenericItem.defaultProps = {
    variant: 'small',
};

export default GenericItem;
