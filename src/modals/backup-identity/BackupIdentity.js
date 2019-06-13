import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlowModal, FlowModalStep } from '@nomios/web-uikit';
import { Passphrase, PaperKey, WriteWords } from './steps';
import { connectIdmWallet } from 'react-idm-wallet';
// import styles from './BackupIdentity.css';

const arrayMnemonic = ['pedro', 'miguel', 'sousa', 'santos', 'paulo', 'marcos', 'gil', 'domingues', 'andre', 'cruz', 'silva', 'ferreira'];

class BackupIdentity extends Component {
    state = { currentStepId: 'passphrase' };

    render() {
        const { unlock } = this.props;
        const { currentStepId } = this.state;

        return (
            <FlowModal
                { ...this.props }
                variant="simple"
                step={ currentStepId }>
                <FlowModalStep id="passphrase">
                    <Passphrase
                        unlock={ unlock }
                        nextStepId="paper-key"
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="paper-key">
                    <PaperKey
                        nextStepsId={ { manual: 'write-words', automatic: '' } }
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="write-words">
                    <WriteWords
                        mnemonic={ arrayMnemonic }
                        nextStepId="verify-mnemonic"
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="verify-mnemonic">
                    <p>pedro</p>
                </FlowModalStep>
            </FlowModal>
        );
    }

    handleNextStep = (nextStepId) => {
        this.setState({ currentStepId: nextStepId });
    };
}

BackupIdentity.propTypes = {
    unlock: PropTypes.func,
};

export default connectIdmWallet((idmWallet) => {
    const unlock = (type, input) => idmWallet.locker.getLock(type).unlock(input);

    return () => ({
        unlock,
    });
})(BackupIdentity);
