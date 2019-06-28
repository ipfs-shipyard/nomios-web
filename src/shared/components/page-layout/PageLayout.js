import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './PageLayout.css';

const PageLayout = (props) => {
    const { className, children } = props;

    return (
        <div className={ classNames(styles.pageLayout, className) }>
            <div className={ styles.pageLayoutContent }>
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
