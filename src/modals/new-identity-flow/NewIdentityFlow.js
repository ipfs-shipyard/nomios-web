import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import { FlowModal, FlowModalStep, Button, TextButton } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import { IdentityInfo, IdentityDevice, Feedback } from './create-identity-steps';

class NewIdentityFlow extends Component {
    state = {
        currentStepId: 'generic',
        currentFlow: undefined,
        promise: undefined,
        data: {},
    };

    render() {
        const { currentStepId } = this.state;

        return (
            <FlowModal { ...this.props } variant="advanced" step={ currentStepId }>
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

    createIdentity(data) {
        const { createIdentity } = this.props;

        const identityInfo = data['create-identity-info'];
        const deviceInfo = data['create-identity-device'];
        const { type, ...schema } = identityInfo;

        return createIdentity({
            schema: {
                '@context': 'https://schema.org',
                '@type': type,
                ...schema,
            },
            deviceInfo,
        })
        .catch((err) => {
            console.error('Failed to create identity', err);
            throw err;
        });
    }

    importIdentity(data) {
        console.log('data', data);

        return Promise.reject(new Error('Not implemented'));
    }

    handleChooseFlow = (flow) => {
        const createIdentityFirstStepId = flow === 'create' ? 'create-identity-info' : 'import-identity-mnemonic';

        this.setState({ currentFlow: flow, currentStepId: createIdentityFirstStepId });
    };

    handleNextStep = (nextStepId, currentStepData) => {
        const { currentFlow } = this.state;
        const isLastCreateStep = currentFlow === 'create' && nextStepId === 'create-identity-feedback';
        const isLastImportStep = currentFlow === 'import' && nextStepId === 'import-identity-feedback';

        this.setState((prevState) => {
            const data = { ...prevState.data, [prevState.currentStepId]: currentStepData };
            const currentStepId = nextStepId;
            let promise;

            if (isLastCreateStep) {
                promise = this.createIdentity(data);
            } else if (isLastImportStep) {
                promise = this.importIdentity(data);
            }

            return {
                currentStepId,
                data,
                promise,
            };
        });
    };

    handleRetryCreateClick = () => {
        this.setState((state) => ({
            promise: this.createIdentity(state.date),
        }));
    };

    handleRetryImportClick = () => {
        this.setState((state) => ({
            promise: this.importIdentity(state.date),
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
};

export default connectIdmWallet((idmWallet) => {
    const createIdentity = (parameters) => idmWallet.identities.create('ipid', parameters);
    const importIdentity = (parameters) => idmWallet.identities.import('ipid', parameters);

    return () => ({
        createIdentity,
        importIdentity,
    });
})(NewIdentityFlow);
