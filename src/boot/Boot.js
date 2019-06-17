import React, { Component, Fragment } from 'react';
import pTimeout from 'p-timeout';
import PropTypes from 'prop-types';
import { PromiseState } from 'react-promiseful';
import { CSSTransition } from 'react-transition-group';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorScreen from '../shared/components/error-screen';
import LoadingScreen from '../shared/components/loading-screen';
import styles from './Boot.css';

const CSS_TRANSITION_PROPS = {
    timeout: 300,
    appear: true,
    mountOnEnter: true,
    unmountOnExit: true,
    classNames: {
        appear: styles.enter,
        appearActive: styles.enterActive,
        appearDone: styles.enterDone,
        enter: styles.enter,
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exit: styles.exit,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
    },
};

class Boot extends Component {
    state = {
        promise: undefined,
    };

    constructor(props) {
        super(props);

        this.state.promise = pTimeout(props.promise, props.timeout);
    }

    render() {
        const { promise } = this.state;

        return (
            <PromiseState
                promise={ promise }>
                { ({ status, value }) => (
                    <Fragment>
                        <CSSTransition in={ status === 'pending' } { ...CSS_TRANSITION_PROPS }>
                            <div className={ styles.boot }>
                                { this.renderLoading() }
                            </div>
                        </CSSTransition>

                        <CSSTransition in={ status === 'rejected' } { ...CSS_TRANSITION_PROPS }>
                            <div className={ styles.boot }>
                                { status === 'rejected' ? this.renderError(value) : null }
                            </div>
                        </CSSTransition>

                        <CSSTransition in={ status === 'fulfilled' } { ...CSS_TRANSITION_PROPS }>
                            <div className={ styles.boot }>
                                { status === 'fulfilled' ? this.renderSuccess(value) : null }
                            </div>
                        </CSSTransition>
                    </Fragment>
                ) }
            </PromiseState>
        );
    }

    renderLoading() {
        return <LoadingScreen />;
    }

    renderError(error) {
        return (
            <ErrorScreen
                text="We're having a hard time booting the app."
                error={ error }
                onRetry={ this.handleRetry } />
        );
    }

    renderSuccess(value) {
        return (
            <Router>
                { this.props.children(value) }
            </Router>
        );
    }

    handleRetry = () => {
        window.location.reload();
    };
}

Boot.propTypes = {
    promise: PropTypes.shape({
        then: PropTypes.func.isRequired,
        catch: PropTypes.func.isRequired,
    }).isRequired,
    timeout: PropTypes.number,
    preventThrottling: PropTypes.bool,
    children: PropTypes.func.isRequired,
};

Boot.defaultProps = {
    timeout: 30000,
};

export default Boot;
