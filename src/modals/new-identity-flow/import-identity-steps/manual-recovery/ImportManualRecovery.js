import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FeedbackMessage } from '@nomios/web-uikit';
import RecoveryTextArea from './RecoveryTextArea';
import { Form } from 'react-final-form';
import { ButtonPromiseState } from '../../../../shared/components/button-promise-state';
import { FORM_ERROR } from 'final-form';
import styles from './ImportManualRecovery.css';

const STEP_ANIMATION_DURATION = 1000;

class ImportManualRecovery extends Component {
    acceptedMnemonic = undefined;

    state = {
        promise: undefined,
    };

    componentWillUnmount() {
        clearTimeout(this.rollbackAnimationTimeout);
    }

    render() {
        const { promise } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Enter Secret Recovery Key</h2>
                <p>
                    Please enter, in the correct order, the 12 words you were asked
                    to save as your paper key.
                </p>
                <Form onSubmit={ this.handleSubmit }>
                    {({ handleSubmit, submitError }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit } className={ styles.form }>
                            <RecoveryTextArea className={ styles.input } />
                            <div className={ styles.advance }>
                                { submitError &&
                                    <FeedbackMessage className={ styles.error } type="error" variant="large">
                                        { this.errorMessage(submitError.code) }
                                    </FeedbackMessage>
                                }
                                <ButtonPromiseState
                                    promise={ promise }
                                    onSettle={ this.handleSettle }>
                                    { ({ status }) => (
                                        <Button
                                            feedback={ status }>
                                                Restore
                                        </Button>
                                    )}
                                </ButtonPromiseState>
                            </div>
                        </form>
                    )}
                </Form>
            </div>
        );
    }

    errorMessage(errorCode) {
        switch (errorCode) {
        case 'INVALID_DID':
            return 'Oops, seems that recovery key is not valid, please try again.';
        case 'PROFILE_REPLICATION_TIMEOUT':
            return 'Operation took too long to complete, please try again.';
        default:
            return 'An unexpected error has occurred, please try again.';
        }
    }

    handleSubmit = (data) => {
        const { mnemonic } = data;

        this.acceptedMnemonic = mnemonic;
        const promise = this.props.peekIdentity({ mnemonic });

        this.setState({ promise });

        return promise.catch((err) => {
            console.error(err);

            return {
                [FORM_ERROR]: err,
            };
        });
    };

    handleSettle = (state) => {
        const { nextStepId } = this.props;

        if (state.status === 'fulfilled') {
            this.props.onNextStep(nextStepId, { profileDetails: state.value.profileDetails, mnemonic: this.acceptedMnemonic });
        }

        this.rollbackAnimationTimeout = setTimeout(() => this.setState({ promise: undefined }), STEP_ANIMATION_DURATION);
    };
}

ImportManualRecovery.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
    peekIdentity: PropTypes.func.isRequired,
};

export default ImportManualRecovery;
