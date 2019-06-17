import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { TextInput, Button, Svg } from '@nomios/web-uikit';
import { notEmpty } from '../../../../shared/form-validators';
import { ButtonPromiseState } from '../../../../shared/components/button-promise-state';
import styles from './Passphrase.css';

const RESET_PROMISE_TIMEOUT = 1000;
const shieldSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../../shared/media/illustrations/shield.svg');

class Passphrase extends Component {
    state = { promise: undefined };

    componentWillUnmount() {
        clearTimeout(this.resetPromiseTimeout);
    }

    render() {
        const { promise } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Backup my Identity</h2>
                <p>Type in the same passphrase you choose when you set up the locker.</p>
                <Form onSubmit={ this.handleSubmit }>
                    { ({ handleSubmit, submitError, dirtySinceLastSubmit, submitting }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit } className={ styles.form }>
                            <Field name="passphrase" validate={ notEmpty }>
                                { ({ input, meta }) => {
                                    const feedback = this.getTextInputFeedback(meta, submitError, dirtySinceLastSubmit, submitting);
                                    const lineStrength = feedback && feedback.type === 'error' ? 0 : undefined;

                                    return (
                                        <TextInput
                                            { ...input }
                                            type="password"
                                            feedback={ feedback }
                                            label="Enter Passphrase"
                                            lineStrength={ lineStrength }
                                            placeholder="Enter your passphrase"
                                            className={ styles.passphraseInput } />
                                    );
                                } }
                            </Field>
                            <div className={ styles.buttonContainer }>
                                <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                                    { ({ status }) => (
                                        <Button feedback={ status }>Continue</Button>
                                    ) }
                                </ButtonPromiseState>
                            </div>
                        </form>
                    ) }
                </Form>
                <Svg svg={ shieldSvg } className={ styles.illustration } />
            </div>
        );
    }

    getTextInputFeedback(meta, submitError, dirtySinceLastSubmit, submitting) {
        if (dirtySinceLastSubmit || submitting) {
            return undefined;
        }

        if (meta.touched && meta.error) {
            return { message: meta.error, type: 'error' };
        }

        if (submitError && submitError.code === 'UNLOCK_INPUT_MISMATCH') {
            return { message: 'Invalid passphrase', type: 'error' };
        }

        return undefined;
    }

    handleSubmit = ({ passphrase }) => {
        const promise = this.props.unlock('passphrase', passphrase);

        this.setState({ promise });

        return promise.catch((err) => ({
            [FORM_ERROR]: err,
        }));
    };

    handleSettle = ({ status }) => {
        if (status === 'fulfilled') {
            this.props.onNextStep(this.props.nextStepId);
        }

        this.resetPromiseTimeout = setTimeout(() => this.setState({ promise: undefined }), RESET_PROMISE_TIMEOUT);
    };
}

Passphrase.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
    unlock: PropTypes.func.isRequired,
};

export default Passphrase;
