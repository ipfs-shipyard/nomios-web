import React from 'react';
import PropTypes from 'prop-types';
import { PdfIcon } from '@nomios/web-uikit';
import styles from './PdfBox.css';

const PdfBox = ({ title, description, children }) => (
    <div className={ styles.box }>
        <div className={ styles.top }>
            <PdfIcon className={ styles.icon } />
            <h3 className={ styles.title }>{ title }</h3>
            { description && <p className={ styles.desc }>{ description }</p> }
        </div>
        <div className={ styles.bottom }>{ children }</div>
    </div>
);

PdfBox.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
};

export default PdfBox;
