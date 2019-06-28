import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { FlowModal, FlowModalStep } from '@nomios/web-uikit';
import { Passphrase, PaperKey, WriteWords, VerifyMnemonicWords, Feedback } from './steps';
import { connectIdmWallet } from 'react-idm-wallet';
// import styles from './BackupIdentity.css';

const initialState = { currentStepId: 'passphrase' };

class BackupIdentity extends Component {
    state = initialState;

    getMnemonicArray = memoizeOne((data) => data && data.mnemonic.split(' '));

    constructor(props) {
        super(props);

        this.mnemonic = this.getMnemonicArray(props.backupData);
    }

    render() {
        const { unlock, profileDetails, onRequestClose, setComplete } = this.props;
        const { currentStepId } = this.state;
        const isBackedUp = !this.mnemonic;

        return (
            <FlowModal
                { ...this.props }
                variant="simple"
                step={ isBackedUp ? 'info' : currentStepId }
                onExited={ this.handleExited }>
                { isBackedUp ? (
                    <FlowModalStep id="info">
                        <Feedback
                            isBackedUp
                            onRequestClose={ onRequestClose }
                            profileDetails={ profileDetails } />
                    </FlowModalStep>
                ) : (
                    <Fragment>
                        <FlowModalStep id="passphrase">
                            <Passphrase
                                unlock={ unlock }
                                nextStepId="paper-key"
                                onNextStep={ this.handleNextStep } />
                        </FlowModalStep>
                        <FlowModalStep id="paper-key">
                            <PaperKey
                                onNextStep={ this.handleNextStep }
                                nextStepsId={ { manual: 'write-words', automatic: '' } } />
                        </FlowModalStep>
                        <FlowModalStep id="write-words">
                            <WriteWords
                                mnemonic={ this.mnemonic }
                                nextStepId="verify-mnemonic-words"
                                onNextStep={ this.handleNextStep } />
                        </FlowModalStep>
                        <FlowModalStep id="verify-mnemonic-words">
                            <VerifyMnemonicWords
                                nextStepId="feedback"
                                mnemonic={ this.mnemonic }
                                prevStepId="write-words"
                                setComplete={ setComplete }
                                onNextStep={ this.handleNextStep } />
                        </FlowModalStep>
                        <FlowModalStep id="feedback">
                            <Feedback
                                profileDetails={ profileDetails }
                                onRequestClose={ onRequestClose } />
                        </FlowModalStep>
                    </Fragment>
                ) }
            </FlowModal>
        );
    }

    handleNextStep = (nextStepId) => {
        this.setState({ currentStepId: nextStepId });
    };

    handleExited = () => {
        this.setState(initialState);
        this.mnemonic = this.getMnemonicArray(this.props.backupData);
        this.props.onExited && this.props.onExited();
    };
}

BackupIdentity.propTypes = {
    profileDetails: PropTypes.object.isRequired,
    setComplete: PropTypes.func.isRequired,
    unlock: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    onRequestClose: PropTypes.func,
    backupData: PropTypes.object,
    onExited: PropTypes.func,
};

export default connectIdmWallet((idmWallet) => {
    const getSetComplete = memoizeOne((id) => () => idmWallet.identities.get(id).backup.setComplete());
    const unlock = (type, input) => idmWallet.locker.getLock(type).unlock(input);

    return ({ id }) => ({
        profileDetails: idmWallet.identities.get(id).profile.getDetails(),
        backupData: idmWallet.identities.get(id).backup.getData(),
        setComplete: getSetComplete(id),
        unlock,
    });
})(BackupIdentity);
