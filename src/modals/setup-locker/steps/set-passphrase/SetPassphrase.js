import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { TextInput, Button, FeedbackMessage, WarningIcon, InfoIcon } from '@nomios/web-uikit';
import { ButtonPromiseState } from '../../../../shared/components/button-promise-state';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import memoize from 'memoize-one';
import pDebounce from 'p-debounce';
import styles from './SetPassphrase.css';

const createValidatePassphrase = (validatePassphrase) => {
    validatePassphrase = pDebounce(validatePassphrase, 200);

    return async (passphrase, _, meta) => {
        try {
            meta.data.validationResult = await validatePassphrase(passphrase);
        } catch (err) {
            meta.data.validationResult = err;

            return err.message;
        }
    };
};

const createValidatePassphraseConfirmation = () => {
    const validatePassphraseConfirmation = pDebounce(async (passphraseConfirmation, passphrase) => {
        if (passphraseConfirmation !== passphrase) {
            return 'Passphrases do not match';
        }
    }, 400);

    return async (passphraseConfirmation, allValues, meta) => {
        if (!passphraseConfirmation) {
            return;
        }

        const error = await validatePassphraseConfirmation(passphraseConfirmation, allValues.passphrase);

        meta.data.error = error;
        meta.data.validatedOnce = true;

        return error;
    };
};

const getPassphraseFeedback = (validationResult) => {
    const { score: strength, warning, suggestions } = validationResult;

    const normalizedStrength = Math.ceil(4 * strength);
    let feedback = null;

    switch (normalizedStrength) {
    case 1:
        feedback = { message: 'Poor', type: 'info' };
        break;
    case 2:
        feedback = { message: 'Weak', type: 'info' };
        break;
    case 3:
        feedback = { message: 'Fair' };
        break;
    case 4:
        feedback = { message: 'Strong' };
        break;
    default:
        return null;
    }

    if (!suggestions.length && !warning) {
        return feedback;
    }

    feedback.tooltip = (
        <div className={ styles.feedbackTooltip }>
            <div className={ styles.suggestions }>
                { warning &&
                    <div><WarningIcon className={ styles.warning } /> { warning.message }</div> }
                { suggestions.map((suggestion) =>
                    <div key={ suggestion.code }><InfoIcon /> { suggestion.message }</div>) }
            </div>
        </div>
    );

    return feedback;
};

class SetPassphrase extends Component {
    createValidatePassphrase = memoize(createValidatePassphrase);
    validatePassphraseConfirmation = createValidatePassphraseConfirmation();
    getPassphraseFeedback = memoize(getPassphraseFeedback);

    state = {
        promise: undefined,
    };

    componentDidMount() {
        findDOMNode(this)
        .querySelector('input')
        .focus();
    }

    render() {
        const { promise } = this.state;
        const { validatePassphrase } = this.props;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup your locker.</h2>
                <p>Please define a passphrase which will be used to encrypt all the data stored in this app.</p>

                <Form onSubmit={ this.handleSubmit }>
                    { ({ handleSubmit, hasValidationErrors, validating, submitting, submitError }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit }>
                            <Field name="passphrase" validate={ this.createValidatePassphrase(validatePassphrase) }>
                                { ({ input, meta }) => (
                                    <TextInput
                                        { ...input }
                                        label="Enter Passphrase"
                                        placeholder="Enter your passphrase"
                                        helperText="You may use any characters, including spaces"
                                        lineType="dashed"
                                        lineStrength={ meta.data.validationResult && meta.data.validationResult.score }
                                        feedback={ meta.data.validationResult && this.getPassphraseFeedback(meta.data.validationResult) }
                                        className={ styles.passphraseInput } />
                                ) }
                            </Field>

                            <Field name="confirmPassphrase" validate={ this.validatePassphraseConfirmation }>
                                { ({ input, meta }) => {
                                    let lineStrength;
                                    let feedback;

                                    if (meta.data.validatedOnce) {
                                        lineStrength = meta.data.error ? 0 : 1;
                                        feedback = meta.data.error && { message: 'Passphrases don\'t match.', type: 'error' };
                                    }

                                    return (
                                        <TextInput
                                            { ...input }
                                            type="password"
                                            label="Confirm Passphrase"
                                            placeholder="Enter passphrase confirmation"
                                            lineStrength={ lineStrength }
                                            feedback={ feedback }
                                            className={ styles.passphraseInput } />
                                    );
                                } }
                            </Field>

                            <div className={ styles.submitWrapper }>
                                <FeedbackMessage
                                    variant="large"
                                    type="error"
                                    className={ classNames(styles.saveError, submitError && styles.show) }>
                                    There was a problem saving your passphrase. Please try again later.
                                </FeedbackMessage>

                                <div className={ styles.continueButton }>
                                    <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                                        { ({ status }) => (
                                            <Button
                                                disabled={ hasValidationErrors || validating || submitting }
                                                feedback={ status }>
                                                Continue
                                            </Button>
                                        ) }
                                    </ButtonPromiseState>
                                </div>
                            </div>
                        </form>
                    ) }
                </Form>
            </div>
        );
    }

    handleSubmit = (data) => {
        const promise = this.props.enablePassphrase(data.passphrase);

        this.setState({ promise });

        return promise.catch((err) => {
            console.error(err);

            return {
                [FORM_ERROR]: err.message,
            };
        });
    };

    handleSettle = (state) => {
        if (state.status === 'fulfilled') {
            this.props.onNextStep();
        } else {
            this.setState({ promise: undefined });
        }
    };
}

SetPassphrase.propTypes = {
    onNextStep: PropTypes.func.isRequired,
    validatePassphrase: PropTypes.func.isRequired,
    enablePassphrase: PropTypes.func.isRequired,
};

export default SetPassphrase;
