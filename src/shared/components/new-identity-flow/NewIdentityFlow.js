import React, { Component, Fragment } from 'react';

import { FlowModal, FlowModalStep } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import { IdentityType, IdentityInfo } from './create-identity-steps';

// import styles from './NewIdentityFlow.css';

class NewIdentityFlow extends Component {
    state = {
        currentStepId: 'generic',
        currentFlow: undefined,
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
        const identityFirstName = this.state.data['create-identity-type'] && this.state.data['create-identity-type'].name && this.state.data['create-identity-type'].name.split(' ')[0];

        console.log('identityFirstName1', identityFirstName);

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
                        onNextStep={ this.handleNextStep }
                        identityFirstName={ identityFirstName } />
                </FlowModalStep>
                <FlowModalStep id="create-identity-feedback">
                    <IdentityInfo
                        nextStepId={ null }
                        onNextStep={ this.handleNextStep } />
                </FlowModalStep>
            </Fragment>
        );
    }

    handleChooseNextFlow = (flow) => {
        const createIdentityFirstStepId = 'create-identity-type';

        this.setState({ currentFlow: flow, currentStepId: createIdentityFirstStepId });
    };

    handleNextStep = (nextStepId, data) => {
        this.setState((prevState) => ({
            currentStepId: nextStepId,
            data: { ...prevState.data, [prevState.currentStepId]: data },
        }), () => console.log('this.state.data', this.state.data));
    };
}

export default NewIdentityFlow;
