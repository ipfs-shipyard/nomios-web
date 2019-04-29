import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import { readAsArrayBuffer } from 'promise-file-reader';
import { FlowModal, FlowModalStep, Button, TextButton } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import { IdentityInfo, IdentityDevice, Feedback } from './create-identity-steps';
import { ImportManualRecovery, ImportConfirmIdentity, ImportFeedback } from './import-identity-steps';
import SetupDeviceStep from '../../shared/steps/setup-device-step';

const initialState = {
    currentStepId: 'generic',
    currentFlow: undefined,
    promise: undefined,
    data: {},
};

class NewIdentityFlow extends Component {
    state = initialState;

    render() {
        const { currentStepId } = this.state;

        return (
            <FlowModal
                { ...this.props }
                variant="advanced"
                step={ currentStepId }
                onExited={ this.handleExited }>
                <FlowModalStep id="generic">
                    <GenericStep onNextStep={ this.handleChooseFlow } />
                </FlowModalStep>
                { this.renderFlowSteps() }
            </FlowModal>
        );
    }

    renderFlowSteps() {
        const { currentFlow } = this.state;

        switch (currentFlow) {
        case 'create':
            return this.renderCreateSteps();
        case 'import':
            return this.renderImportSteps();

        default: return null;
        }
    }

    renderCreateSteps() {
        const { promise } = this.state;

        const identityFirstName =
            this.state.data['create-identity-info'] &&
            this.state.data['create-identity-info'].name &&
            this.state.data['create-identity-info'].name.split(' ')[0];

        return (
            <Fragment>
                <FlowModalStep id="create-identity-info">
                    <IdentityInfo
                        nextStepId="create-identity-device"
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-device">
                    <IdentityDevice
                        nextStepId="create-identity-feedback"
                        onNextStep={ this.handleNextStep }
                        identityFirstName={ identityFirstName } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-feedback">
                    <PromiseState promise={ promise }>
                        { ({ status }) => (
                            <Feedback
                                status={ status }
                                successActions={ this.renderCreateFeedbackSuccessActions() }
                                errorActions={ this.renderCreateFeedbackErrorActions() } />
                        ) }
                    </PromiseState>
                </FlowModalStep>
            </Fragment>
        );
    }

    renderImportSteps() {
        const { promise } = this.state;
        const identityFirstName =
            this.state.data['import-manual-recovery'] &&
            this.state.data['import-manual-recovery'].profileDetails &&
            this.state.data['import-manual-recovery'].profileDetails.name &&
            this.state.data['import-manual-recovery'].profileDetails.name.split(' ')[0];

        const profileDetails = this.state.data['import-manual-recovery'] &&
            this.state.data['import-manual-recovery'].profileDetails;

        const setupDeviceText = {
            title: '2. Your Device Details',
            description: 'You will be importing this identity to this device.',
            buttonText: 'Continue',
        };

        return (
            <Fragment>
                <FlowModalStep id="import-manual-recovery">
                    <ImportManualRecovery
                        nextStepId="import-confirm-identity"
                        onNextStep={ this.handleNextStep }
                        peekIdentity={ this.props.peekIdentity } />
                </FlowModalStep>
                <FlowModalStep id="import-confirm-identity">
                    <ImportConfirmIdentity
                        nextStepId="import-identity-device"
                        previousStepId="import-manual-recovery"
                        identityData={ profileDetails }
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="import-identity-device">
                    <SetupDeviceStep
                        nextStepId="import-success-feedback"
                        onNextStep={ this.handleImportSubmitForm }
                        identityFirstName={ identityFirstName }
                        stepData={ setupDeviceText } />
                </FlowModalStep>
                <FlowModalStep id="import-success-feedback">
                    <PromiseState promise={ promise }>
                        { ({ status }) => (
                            <ImportFeedback
                                status={ status }
                                successActions={ this.renderImportFeedbackSuccessActions() }
                                errorActions={ this.renderImportFeedbackErrorActions() } />
                        ) }
                    </PromiseState>
                </FlowModalStep>
            </Fragment>
        );
    }

    renderCreateFeedbackSuccessActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleGoToBackupFlow }>Backup my identity</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip, for now</TextButton>
            </Fragment>
        );
    }

    renderCreateFeedbackErrorActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleRetryCreateClick }>Retry</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip this step</TextButton>
            </Fragment>
        );
    }

    renderImportFeedbackSuccessActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.props.onRequestClose }>Go to Homepage</Button>
            </Fragment>
        );
    }

    renderImportFeedbackErrorActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleRetryImport }>Retry</Button>
                <TextButton onClick={ this.props.onRequestClose }>Close</TextButton>
            </Fragment>
        );
    }

    async createIdentity(data) {
        const { createIdentity } = this.props;

        const identityInfo = data['create-identity-info'];
        const deviceInfo = data['create-identity-device'];

        const profileDetails = {
            '@context': 'https://schema.org',
            '@type': identityInfo.type,
            name: identityInfo.name,
        };

        // Read image from File object to an ArrayBuffer
        if (identityInfo.image) {
            profileDetails.image = {
                type: identityInfo.image.type,
                data: await readAsArrayBuffer(identityInfo.image),
            };
        }

        return createIdentity({
            profileDetails,
            deviceInfo,
        });
    }

    async importIdentity(data) {
        const { importIdentity } = this.props;

        const mnemonic = this.state.data['import-manual-recovery'].mnemonic;
        const deviceInfo = data['import-identity-device'];

        console.log('deviceInfo', deviceInfo);
        console.log('mnemonic', mnemonic);

        return importIdentity({
            mnemonic,
            deviceInfo,
        });
    }

    createFlowPromise = (currentStepId, data) => {
        const { currentFlow } = this.state;
        const isLastCreateStep = currentFlow === 'create' && currentStepId === 'create-identity-feedback';

        if (isLastCreateStep) {
            return this.createIdentity(data);
        }

        const isLastImportStep = currentFlow === 'import' && currentStepId === 'import-identity-feedback';

        if (isLastImportStep) {
            return this.importIdentity(data);
        }
    };

    handleChooseFlow = (flow) => {
        const createIdentityFirstStepId = flow === 'create' ? 'create-identity-info' : 'import-identity-mnemonic';

        this.setState({ currentFlow: flow, currentStepId: createIdentityFirstStepId });
    };

    handleNextStep = (nextStepId, currentStepData) => {
        this.setState((prevState) => {
            const data = { ...prevState.data, [prevState.currentStepId]: currentStepData };
            const currentStepId = nextStepId;
            const promise = this.createFlowPromise(currentStepId, data);

            return {
                currentStepId,
                data,
                promise,
            };
        });
    };

    handleRetryCreateClick = () => {
        this.setState((state) => ({
            promise: this.createIdentity(state.data),
        }));
    };

    handleRetryImportClick = () => {
        this.setState((state) => ({
            promise: this.importIdentity(state.data),
        }));
    };

    handleGoToBackupFlow = () => {
        alert('Not yet implemented');
    };

    handleExited = () => {
        this.setState(initialState);
        this.props.onExited && this.props.onExited();
    };
}

NewIdentityFlow.propTypes = {
    createIdentity: PropTypes.func.isRequired,
    peekIdentity: PropTypes.func.isRequired,
    importIdentity: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    onExited: PropTypes.func,
};

export default connectIdmWallet((idmWallet) => {
    const createIdentity = (params) => idmWallet.identities.create('ipid', params);
    const peekIdentity = (params) => idmWallet.identities.peek('ipid', params);
    const importIdentity = (params) => idmWallet.identities.import('ipid', params);

    return () => ({
        createIdentity,
        peekIdentity,
        importIdentity,
    });
})(NewIdentityFlow);
