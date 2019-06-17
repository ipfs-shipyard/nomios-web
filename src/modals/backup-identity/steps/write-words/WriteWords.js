import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MnemonicBox from './mnemonic-box';
import { Button } from '@nomios/web-uikit';
import styles from './WriteWords.css';

class WriteWords extends Component {
    render() {
        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Your paper key</h2>
                <p>It&apos;s important to save your recovery key in a safe place to backup your identity.</p>
                <MnemonicBox mnemonic={ this.props.mnemonic } />
                <div className={ styles.buttonsWrapper }>
                    <Button variant="secondary" disabled>Get PDF file</Button>
                    <Button onClick={ this.handleNextStep }>Continue</Button>
                </div>
            </div>
        );
    }

    handleNextStep = () => this.props.onNextStep(this.props.nextStepId);
}

WriteWords.propTypes = {
    mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
    nextStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default WriteWords;
