import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PdfBox from './pdf-box';
import PdfActionItem from './pdf-action-item';
import { PrintIcon, DownloadIcon, TextButton, EditIcon, Button } from '@nomios/web-uikit';
import styles from './PaperKey.css';

class PaperKey extends Component {
    render() {
        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Your paper key</h2>
                <p>It&apos;s important to save your recovery key in a safe place to backup your identity.</p>
                <PdfBox title="Get PDF file" description="Download or print a file with your key.">
                    <div className={ styles.boxActionsContainer }>
                        <PdfActionItem
                            onClick={ this.handleDownloadClick }
                            icon={ <DownloadIcon className={ styles.icon } /> }>
                            Download
                        </PdfActionItem>
                        <PdfActionItem
                            onClick={ this.handlePrintClick }
                            icon={ <PrintIcon className={ styles.icon } /> }>
                            Print
                        </PdfActionItem>
                    </div>
                </PdfBox>
                <div className={ styles.buttonsWrapper }>
                    <div className={ styles.container }>
                        <TextButton
                            onClick={ this.handleSaveKeyManually }
                            variant="small"
                            iconPosition="left"
                            icon={ <EditIcon /> }>
                            Or do it manually
                        </TextButton>
                        <Button disabled>Continue</Button>
                    </div>
                </div>
            </div>
        );
    }

    handlePrintClick = () => alert('Print not implemented yet');
    handleDownloadClick = () => alert('Download not implemented yet');

    handleSaveKeyManually = () => {
        const { manual: manualStepId } = this.props.nextStepsId;

        this.props.onNextStep(manualStepId);
    };
}

PaperKey.propTypes = {
    nextStepsId: PropTypes.shape({
        manual: PropTypes.string,
        automatic: PropTypes.string,
    }).isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default PaperKey;
