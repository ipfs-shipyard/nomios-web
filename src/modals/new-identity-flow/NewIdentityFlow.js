import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { PromiseState, getPromiseState } from 'react-promiseful';
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
                    <GenericStep onNextStep={ this.handleChooseNextFlow } />
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
                        onNextStep={ this.handleCreateSubmitForm }
                        identityFirstName={ identityFirstName } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-feedback">
                    <PromiseState promise={ promise } onSettle={ this.handleCreatePromiseSettle }>
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
                <Button variant="primary" onClick={ this.handleChooseBackupFlow }>Backup my identity</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip, for now</TextButton>
            </Fragment>
        );
    }

    renderCreateFeedbackErrorActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleRetrySubmit }>Retry</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip this step</TextButton>
            </Fragment>
        );
    }

    handleChooseNextFlow = (flow) => {
        const createIdentityFirstStepId = 'create-identity-info';

        this.setState({ currentFlow: flow, currentStepId: createIdentityFirstStepId });
    };

    handleChooseBackupFlow = () => {
        console.log('Go to Backup Identity Flow');
    };

    handleRetrySubmit = () => {
        console.log('Retry form submission');
    };

    handleNextStep = (nextStepId, data) => {
        this.setState((prevState) => ({
            currentStepId: nextStepId,
            data: { ...prevState.data, [prevState.currentStepId]: data },
        }));
    };

    handleCreateSubmitForm = (nextStepId, data) => {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.promise).status !== 'none') {
            return;
        }

        const promise = new Promise((resolve) => setTimeout(resolve, 5000));
        const finalData = { ...this.state.data, [this.state.currentStepId]: data };

        this.setState({
            currentStepId: nextStepId,
            data: finalData,
            promise,
        });
    };

    handleCreatePromiseSettle = ({ status }) => status;
}

NewIdentityFlow.propTypes = {
    onRequestClose: PropTypes.func,
};

export default NewIdentityFlow;
