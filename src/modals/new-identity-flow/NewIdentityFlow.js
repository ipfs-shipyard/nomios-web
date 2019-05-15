import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { PromiseState, getPromiseState } from 'react-promiseful';

import { FlowModal, FlowModalStep, Button, TextButton } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import { IdentityType, IdentityInfo, Feedback } from './create-identity-steps';

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
            <FlowModal variant="advanced" step={ currentStepId } { ...this.props }>
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
            this.state.data['create-identity-type'] &&
            this.state.data['create-identity-type'].name &&
            this.state.data['create-identity-type'].name.split(' ')[0];

        return (
            <Fragment>
                <FlowModalStep id="create-identity-type">
                    <IdentityType
                        nextStepId="create-identity-info"
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-info">
                    <IdentityInfo
                        nextStepId="create-identity-feedback"
                        onNextStep={ this.handleSubmitForm }
                        identityFirstName={ identityFirstName } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-feedback">
                    <PromiseState promise={ promise } onSettle={ this.handlePromiseSettle }>
                        { ({ status }) => (
                            <Feedback
                                status={ status }
                                successActions={ this.renderFeedbackSuccessActions() }
                                errorActions={ this.renderFeedbackErrorActions() } />
                        ) }
                    </PromiseState>
                </FlowModalStep>
            </Fragment>
        );
    }

    renderFeedbackSuccessActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleChooseBackupFlow }>Backup my identity</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip, for now</TextButton>
            </Fragment>
        );
    }

    renderFeedbackErrorActions() {
        return (
            <Fragment>
                <Button variant="primary" onClick={ this.handleRetrySubmit }>Retry</Button>
                <TextButton onClick={ this.props.onRequestClose }>Skip this step</TextButton>
            </Fragment>
        );
    }

    handleChooseNextFlow = (flow) => {
        const createIdentityFirstStepId = 'create-identity-type';

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

    handleSubmitForm = (nextStepId, data) => {
        // Skip if there's a ongoing promise
        if (getPromiseState(this.state.promise).status !== 'none') {
            return;
        }

        const promise = new Promise((resolve, reject) => setTimeout(reject, 5000));
        const finalData = { ...this.state.data, [this.state.currentStepId]: data };

        this.setState({
            currentStepId: nextStepId,
            data: finalData,
            promise,
        });
    };

    handlePromiseSettle = ({ status }) => {
        console.log('PROMISE SETTLED WITH STATUS', status);
        console.log('MY FINAL DATA', this.state.data);
    };
}

NewIdentityFlow.propTypes = {
    onRequestClose: PropTypes.func,
};

export default NewIdentityFlow;
