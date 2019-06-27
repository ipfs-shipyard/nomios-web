import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './GenericList.css';

const GenericList = (props) => {
    const { children } = props;

    if (React.Children.count(children) === 1) {
        return (
            <div className={ styles.listWrapper }>
                { React.cloneElement(children[0], { variant: 'large' }) }
            </div>
        );
    }

    return (
        <div className={ styles.listWrapper }>
            { children.map((item, index) => {
                if (!index) {
                    return React.cloneElement(item, { key: index });
                }

                return (
                    <Fragment key={ index }>
                        { item }
                    </Fragment>
                );
            })}
        </div>
    );
};

GenericList.propTypes = {
    children: PropTypes.node.isRequired,
};

export default GenericList;
