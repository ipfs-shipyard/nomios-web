import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FadeContainer from '../../../shared/components/fade-container';
import credentialScopes from '../credentialScopes';
import { TypeOption, Logo, Svg, Button } from '@nomios/web-uikit';
import styles from './Feedback.css';

const fadingLogo = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/brand-fading-symbol.svg');

class Feedback extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.status !== state.status) {
            return {
                status: props.status,
                activeStep: props.status === 'pending' ? 0 : 1,
            };
        }

        return null;
    }

    state = {
        activeStep: undefined,
        status: undefined,
    };

    render() {
        const { activeStep, status } = this.state;

        return (
            <FadeContainer activeIndex={ activeStep }>
                <div className={ styles.feedbackContainer }>
                    <h2 className={ styles.title }>Please wait for the authentication…</h2>
                </div>
                { status === 'fulfilled' ?
                    this.renderSuccessContent() :
                    this.renderErrorContent() }
            </FadeContainer>
        );
    }

    renderSuccessContent() {
        return (
            <Fragment>
                <div className={ styles.header }>
                    <Logo className={ styles.logo } variant="symbol" />
                </div>
                <h2 className={ styles.feedbackMessage }>
                    Thank you! You’ve granted access to the following info:
                </h2>
                <div className={ styles.infoGrid }>
                    { this.props.credentialScopes.map((scope, index) => {
                        const { name, icon: Icon } = credentialScopes[scope];

                        return (
                            <TypeOption
                                key={ index }
                                label={ name }
                                selectable={ false }
                                className={ styles.typeOption }>
                                <Icon />
                            </TypeOption>
                        );
                    }) }
                </div>
            </Fragment>
        );
    }

    renderErrorContent() {
        return (
            <div className={ styles.errorContainer }>
                <Svg svg={ fadingLogo } className={ styles.illustration } />
                <p className={ styles.message }>Something went wrong while authenticating...</p>
                <Button variant="primary" onClick={ this.handleRetryAuthentication }>Try again</Button>
            </div>
        );
    }

    handleRetryAuthentication = () => this.props.onRetry();
}

Feedback.propTypes = {
    credentialScopes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
    onRetry: PropTypes.func.isRequired,
};

export default Feedback;
