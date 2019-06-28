import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PdfBox from '../../../../shared/components/pdf-box';
import PdfActionItem from '../../../../shared/components/pdf-box/pdf-action-item';
import { TextButton, Button, EditIcon, UploadIcon } from '@nomios/web-uikit';
import styles from './AutomaticRecovery.css';

class AutomaticRecovery extends Component {
    render() {
        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Import your Identity</h2>
                <p>
                    It&apos;s important to save your recovery key in a safe place to backup your identity.
                </p>
                <div className={ styles.import }>
                    <PdfBox title="Import using PDF file" description="Upload PDF with your recovery key.">
                        <PdfActionItem
                            onClick={ this.handleFileSelection }
                            icon={ <UploadIcon className={ styles.icon } /> }>
                            Browse or drag files
                        </PdfActionItem>
                    </PdfBox>
                </div>
                <div className={ styles.advance }>
                    <TextButton
                        variant="small"
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

    handleFileSelection = () => {
        alert('Feature not yet implemented');
    };
}

AutomaticRecovery.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    secondaryStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default AutomaticRecovery;
