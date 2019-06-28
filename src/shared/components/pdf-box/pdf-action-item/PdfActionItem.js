import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextButton } from '@nomios/web-uikit';
import styles from './PdfActionItem.css';

const PdfActionItem = ({ children, icon, className, ...rest }) => (
    <TextButton
        { ...rest }
        variant="small"
        iconPosition="left"
        className={ classNames(styles.textButton, className) }
        icon={ <div className={ styles.iconContainer }>{ icon }</div> }>
        { children }
    </TextButton>
);

PdfActionItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    icon: PropTypes.element,
};

export default PdfActionItem;
