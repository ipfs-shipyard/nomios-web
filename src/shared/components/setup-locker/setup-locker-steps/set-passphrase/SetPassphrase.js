import React, { Component } from 'react';
import { TextInput, Button } from '@nomios/web-uikit';
import PropTypes from 'prop-types';

import styles from './SetPassphrase.css';

class SetPassphrase extends Component {
    password = '';
    passwordInputTimeout = undefined;
    confirmation = '';
    confirmationInputTimeout = undefined;

    state = {
        passwordStrength: 0,
        showMatchFeedback: undefined,
        validation: null,
        disableContinue: true,
        lockerSuggestion: null,
        goodEnough: false,
        feedback: 'none',
    };

    render() {
        const { passwordStrength, showMatchFeedback, disableContinue, lockerSuggestion, feedback } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup your locker.</h2>
                <p>Please define a passphrase which will be used to encrypt all the data stored in this app.</p>
                <TextInput className={ styles.passwordInput }
                    label="Enter Passphrase"
                    hint="Enter your passphrase"
                    type="password"
                    helperText={ lockerSuggestion }
                    lineStrength={ passwordStrength }
                    lineType="dashed"
                    onChange={ this.handlePasswordChange } />
                <TextInput className={ styles.confirmationInput }
                    label="Confirm Passphrase"
                    hint="Enter passphrase confirmation"
                    type="password"
                    lineStrength={ showMatchFeedback }
                    onChange={ this.handleConfirmationChange } />
                <div className={ styles.continueButton }>
                    <Button onClick={ this.handleContinue } disabled={ disableContinue } feedback={ feedback } >Continue</Button>
                </div>
            </div>
        );
    }

    analyzePassword = () => {
        const { analyzePasswordQuality } = this.props;
        const passwordCopy = this.password;
        const confirmationCopy = this.confirmation;

        analyzePasswordQuality(passwordCopy)
        .then((result) => this.handleSuccess(passwordCopy, confirmationCopy, result))
        .catch((error) => this.handleError(passwordCopy, confirmationCopy, error));
    };

    validatePassword = () => {
        console.log('this.password', this.password);
        console.log('this.confirmation', this.confirmation);
        if (this.confirmation === '') {
            this.setState({ disableContinue: true, showMatchFeedback: undefined });

            return;
        }

        if (this.password !== this.confirmation) {
            this.setState({ disableContinue: true, showMatchFeedback: 0 });

            return;
        }

        if (this.state.goodEnough) {
            this.setState({ disableContinue: false, showMatchFeedback: 1 });
        } else {
            this.setState({ disableContinue: true, showMatchFeedback: undefined });
        }
    };

    handleSuccess = (testedPassword, testedConfirmation, result) => {
        if (this.password !== testedPassword || this.confirmation !== testedConfirmation) {
            this.setState({ disableContinue: true });

            return null;
        }

        const score = result.score;
        const suggestions = result.suggestions.length !== 0 ? result.suggestions[0].message : null;
        const warning = result.warning;

        this.setState({ passwordStrength: score, lockerSuggestion: suggestions, lockerWarning: warning, goodEnough: true });
        this.validatePassword();
    };

    handleError = (testedPassword, testedConfirmation, result) => {
        const score = result.score;
        const suggestions = result.suggestions != null ? result.suggestions[0].message : null;
        const warning = result.warning;

        this.setState({ passwordStrength: score, lockerSuggestion: suggestions, lockerWarning: warning, goodEnough: false });
    };

    handlePasswordChange = (event) => {
        const { disableContinue } = this.state;

        if (this.passwordInputTimeout != null) {
            clearTimeout(this.passwordInputTimeout);
        }
        this.password = event.target.value;
        !disableContinue && this.setState({ disableContinue: true });

        this.passwordInputTimeout = setTimeout(this.analyzePassword, 400);
    };

    handleConfirmationChange = (event) => {
        const { disableContinue } = this.state;

        if (this.confirmationInputTimeout != null) {
            clearTimeout(this.confirmationInputTimeout);
        }
        this.confirmation = event.target.value;
        !disableContinue && this.setState({ disableContinue: true });

        this.confirmationInputTimeout = setTimeout(this.validatePassword, 400);
    };

    handleContinue = async () => {
        const { onNextStep, enablePassword } = this.props;

        this.setState({ feedback: 'loading' });
        try {
            await enablePassword(this.password);
        } catch {
            this.setState({ feedback: 'error' });

            return;
        }

        onNextStep({ password: this.password });
    };
}

SetPassphrase.propTypes = {
    onNextStep: PropTypes.func.isRequired,
    analyzePasswordQuality: PropTypes.func.isRequired,
    enablePassword: PropTypes.func.isRequired,
};

export default SetPassphrase;
