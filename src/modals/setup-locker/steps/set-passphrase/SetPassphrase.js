import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import memoize from 'memoize-one';
import pDebounce from 'p-debounce';
import { TextInput, Button, FeedbackMessage, WarningIcon, InfoIcon } from '@nomios/web-uikit';
import { ButtonPromiseState } from '../../../../shared/components/button-promise-state';
import { notEmpty } from '../../../../shared/form-validators';
import styles from './SetPassphrase.css';

const createValidatePassphrase = (validatePassphrase) => {
    const debouncedValidatePassphrase = pDebounce(validatePassphrase, 200);

    return async (passphrase, _, meta) => {
        try {
            meta.data.validationResult = await (passphrase ? debouncedValidatePassphrase(passphrase) : validatePassphrase(''));
        } catch (err) {
            meta.data.validationResult = err;

            return err.message;
        } finally {
            meta.data.validatedOnceNonEmpty = meta.data.validatedOnceNonEmpty || !!passphrase;
        }
    };
};

const validatePassphraseConfirmation = (passphraseConfirmation, allValues) => {
    const error = notEmpty(passphraseConfirmation);

    if (error) {
        return error;
    }

    if (passphraseConfirmation !== allValues.passphrase) {
        return 'Passphrases do not match';
    }
};

const getPassphraseFeedback = (validationResult) => {
    const { score: strength, warning, suggestions } = validationResult;

    const normalizedStrength = Math.ceil(5 * strength);
    let feedback;

    switch (normalizedStrength) {
    case 0:
        feedback = { message: 'Required', type: 'error' };
        break;
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
        feedback = null;
    }

    if (!feedback) {
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
                    { ({ handleSubmit, submitError }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit }>
                            <Field name="passphrase" validate={ this.createValidatePassphrase(validatePassphrase) }>
                                { ({ input, meta }) => {
                                    const showFeedback = (meta.modified && meta.data.validatedOnceNonEmpty) || meta.touched;

                                    const lineStrength = showFeedback && meta.data.validationResult ? meta.data.validationResult.score : undefined;
                                    const feedback = showFeedback && meta.data.validationResult ? this.getPassphraseFeedback(meta.data.validationResult) : undefined;

                                    return (
                                        <TextInput
                                            { ...input }
                                            label="Enter Passphrase"
                                            placeholder="Enter your passphrase"
                                            helperText="You may use any characters, including spaces"
                                            lineType="dashed"
                                            lineStrength={ lineStrength }
                                            feedback={ feedback }
                                            className={ styles.passphraseInput } />
                                    );
                                } }
                            </Field>

                            <Field name="confirmPassphrase" validate={ validatePassphraseConfirmation }>
                                { ({ input, meta }) => {
                                    const lineStrength = meta.touched ? Number(!meta.error) : undefined;
                                    const feedback = meta.touched && meta.error ? { message: meta.error, type: 'error' } : undefined;

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
                                            <Button feedback={ status }>Continue</Button>
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
