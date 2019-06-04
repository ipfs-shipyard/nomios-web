import React from 'react';
import PropTypes from 'prop-types';
import styles from './PageLayout.css';

const PageLayout = (props) => {
    const { children } = props;

    return (
        <div className={ styles.layoutWrapper }>
            <div className={ styles.layout }>
                { children }
            </div>
        </div>
    );
};

PageLayout.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default PageLayout;
