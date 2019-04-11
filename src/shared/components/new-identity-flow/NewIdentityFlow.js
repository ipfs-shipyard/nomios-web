import React, { Component } from 'react';

import { Modal, ModalFlow } from '@nomios/web-uikit';
import GenericStep from './generic-step';
import createIdentitySteps from './create-identity-steps';

// import styles from './NewIdentityFlow.css';

class NewIdentityFlow extends Component {
    state = {
        currentStepId: 'generic',
        currentFlow: undefined,
    };

    render() {
        const { currentStepId } = this.state;

        return (
            <Modal isOpen>
                <ModalFlow variant="advanced" step={ currentStepId }>
                    <GenericStep id="generic" onNextStep={ this.handleChooseNextFlow } />
                    { this.renderFlowSteps() }
                </ModalFlow>
            </Modal>
        );
    }

    renderFlowSteps = () => {
        const { currentFlow } = this.state;

        switch (currentFlow) {
        case 'create':
            return this.renderCreateSteps();
        case 'import':
            return this.renderImportSteps();

        default: return null;
        }
    };

    renderCreateSteps = () => createIdentitySteps.map(({ component: Step, props }, index) => <Step key={ index } { ...props } />);

    handleChooseNextFlow = (flow) => {
        const createIdentityFirstStepId = createIdentitySteps[0].props.id;

        console.log('createIdentityFirstStepId', createIdentityFirstStepId);
        console.log('flow', flow);

        this.setState({ currentFlow: flow, currentStepId: createIdentityFirstStepId });
    };

    handleNextStep = (nextStep) => this.setState({ currentStepId: nextStep });
}

export default NewIdentityFlow;
