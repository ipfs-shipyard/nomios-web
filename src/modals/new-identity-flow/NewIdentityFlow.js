import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import { readAsArrayBuffer } from 'promise-file-reader';
import { FlowModal, FlowModalStep, Button, TextButton } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import { IdentityInfo, IdentityDevice, Feedback } from './create-identity-steps';

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
                                successActions={ this.renderCreateFeedbackActions() }
                                errorActions={ this.renderCreateFeedbackErrorActions() } />
                        ) }
                    </PromiseState>
                </FlowModalStep>
            </Fragment>
        );
    }

    renderImportSteps() {
        throw new Error('Not implemented');
    }

    renderCreateFeedbackActions() {
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

    importIdentity(data) {
        console.log('data', data);

        return Promise.reject(new Error('Not implemented'));
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

    handleExited = () => {
        this.setState(initialState);
        this.props.onExited && this.props.onExited();
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
}

NewIdentityFlow.propTypes = {
    createIdentity: PropTypes.func.isRequired,
    importIdentity: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    onExited: PropTypes.func,
};

export default connectIdmWallet((idmWallet) => {
    const createIdentity = (params) => idmWallet.identities.create('ipid', params);
    const importIdentity = (params) => idmWallet.identities.import('ipid', params);

    return () => ({
        createIdentity,
        importIdentity,
    });
})(NewIdentityFlow);
