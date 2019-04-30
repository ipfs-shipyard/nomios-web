import React, { Component } from 'react';
import { TextInput, Button, FeedbackMessage, WarningIcon, InfoIcon } from '@nomios/web-uikit';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './SetPassphrase.css';

class SetPassphrase extends Component {
    password = '';
    passwordInputTimeout = undefined;
    confirmation = '';
    confirmationInputTimeout = undefined;

    state = {
        result: {
            score: 0,
            suggestions: [],
            warning: null,
        },
        matchFeedback: null,
        continueDisabled: true,
        feedback: 'none',
        submitError: false,
    };

    componentWillUnmount() {
        clearTimeout(this.passwordInputTimeout);
        clearTimeout(this.confirmationInputTimeout);
    }

    render() {
        const { matchFeedback,
            continueDisabled,
            feedback,
            submitError } = this.state;
        const { score: strength } = this.state.result;

        const passphraseFeedback = this.deriveFeedbackFromStrength();
        const confirmationFeedback = matchFeedback === false ? {
            message: 'Passwords don\'t match.',
            type: 'error',
        } : null;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.title }>Setup your locker.</h2>
                <p>Please define a passphrase which will be used to encrypt all the data stored in this app.</p>
                <TextInput className={ styles.passwordInput }
                    label="Enter Passphrase"
                    placeholder="Enter your passphrase"
                    type="password"
                    helperText="Minimum of 8 characters"
                    lineStrength={ strength }
                    lineType="dashed"
                    feedback={ passphraseFeedback }
                    onChange={ this.handlePasswordChange }
                    onKeyDown={ this.handleKeyDown } />
                <TextInput className={ styles.confirmationInput }
                    label="Confirm Passphrase"
                    placeholder="Enter passphrase confirmation"
                    type="password"
                    feedback={ confirmationFeedback }
                    lineStrength={ matchFeedback ? 1 : -1 }
                    onChange={ this.handleConfirmationChange }
                    onKeyDown={ this.handleKeyDown } />
                <FeedbackMessage
                    variant="large"
                    type="error"
                    className={ classNames(styles.writeError, submitError && styles.show) }>
                    There was a problem saving your password. Please try again later.
                </FeedbackMessage>
                <div className={ styles.continueButton }>
                    <Button onClick={ this.handleContinue } disabled={ continueDisabled } feedback={ feedback } >Continue</Button>
                </div>
            </div>
        );
    }

    analyzePassword = async () => {
        const { analyzePasswordQuality } = this.props;

        // Cancel promise analyePasswordQuality promise if there already is a reference to one

        analyzePasswordQuality(this.password)
        .then((result) => this.setState({ result }))
        .catch((error) => this.setState({ result: error }))
        .finally(() => this.validatePasswordMatch());
    };

    validatePasswordMatch = () => {
        if (this.confirmation === '') {
            this.setState({ continueDisabled: true, matchFeedback: null });

            return;
        }

        if (this.password !== this.confirmation) {
            this.setState({ continueDisabled: true, matchFeedback: false });

            return;
        }

        if (this.state.result.score > 0.5) {
            this.setState({ continueDisabled: false, matchFeedback: true });
        } else {
            this.setState({ continueDisabled: true, matchFeedback: null });
        }
    };

    deriveFeedbackFromStrength = () => {
        const { score: strength, warning, suggestions } = this.state.result;

        const normalizedStrength = Math.ceil(4 * strength);

        let passphraseFeedback = null;

        switch (normalizedStrength) {
        case 1:
            passphraseFeedback = {
                message: 'Poor',
                type: 'info',
            };
            break;
        case 2:
            passphraseFeedback = {
                message: 'Weak',
                type: 'info',
            };
            break;
        case 3:
            passphraseFeedback = {
                message: 'Fair',
            };
            break;
        case 4:
            return {
                message: 'Strong',
            };
        case 0:
            return null;
        default:
            passphraseFeedback = null;
        }

        const tooltipSuggestionLines = [];

        if (suggestions.length !== 0 || warning != null) {
            if (suggestions.length !== 0) {
                suggestions.map((suggestion) => tooltipSuggestionLines.push(suggestion.message));
            }
            passphraseFeedback.tooltip = (
                <div className={ styles.tooltip }>
                    <div className={ styles.suggestions }>
                        {warning != null &&
                            <div><WarningIcon className={ styles.warning } /> { warning.message }</div> }
                        { tooltipSuggestionLines.map((elem, index) =>
                            <div key={ index }><InfoIcon /> { elem }</div>) }
                    </div>
                </div>
            );
        }

        return passphraseFeedback;
    };

    handlePasswordChange = (event) => {
        const { continueDisabled } = this.state;

        clearTimeout(this.passwordInputTimeout);
        this.password = event.target.value;
        !continueDisabled && this.setState({ continueDisabled: true });

        this.passwordInputTimeout = setTimeout(this.analyzePassword, 400);
    };

    handleConfirmationChange = (event) => {
        const { continueDisabled } = this.state;

        clearTimeout(this.confirmationInputTimeout);
        this.confirmation = event.target.value;
        !continueDisabled && this.setState({ continueDisabled: true });

        this.confirmationInputTimeout = setTimeout(this.validatePasswordMatch, 400);
    };

    handleContinue = async () => {
        const { continueDisabled } = this.state;
        const { onNextStep, enablePassword } = this.props;

        if (continueDisabled) {
            return;
        }

        this.setState({ feedback: 'loading' });
        try {
            await enablePassword(this.password);
        } catch {
            this.setState({ feedback: 'error', submitError: true });

            return;
        }

        onNextStep({ password: this.password });
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleContinue();
        }
    };
}

SetPassphrase.propTypes = {
    onNextStep: PropTypes.func.isRequired,
    analyzePasswordQuality: PropTypes.func.isRequired,
    enablePassword: PropTypes.func.isRequired,
};

export default SetPassphrase;
