import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextButton, Button, EditIcon, PdfIcon } from '@nomios/web-uikit';
import styles from './AutomaticRecovery.css';

class AutomaticRecovery extends Component {
    render() {
        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Import your Identity</h2>
                <p>
                    It&apos;s improtant to save your recovery key in a safe place to backup your identity.
                </p>
                <div className={ styles.identityWrapper }>
                    <div className={ styles.top }>
                        <div className={ styles.background } />
                        <h3 className={ styles.title }>Import using PDF file</h3>
                        <div className={ styles.caption }>Upload PDF with your recovery key.</div>
                        <PdfIcon className={ styles.pdfIcon } />
                    </div>
                    <div className={ styles.bottom } />
                </div>
                <div className={ styles.advance }>
                    <TextButton
                        onClick={ this.handleSecondaryStep }
                        iconPosition="left"
                        icon={ <EditIcon /> }>
                        Or do it manually
                    </TextButton>
                    <Button onClick={ this.handleNextStep } disabled className={ styles.primaryButton }>Continue</Button>
                </div>
            </div>
        );
    }

    handleNextStep = () => {
        const { nextStepId } = this.props;

        this.props.onNextStep(nextStepId);
    };

    handleSecondaryStep = () => {
        const { secondaryStepId } = this.props;

        this.props.onNextStep(secondaryStepId);
    };
}

AutomaticRecovery.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    secondaryStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default AutomaticRecovery;
