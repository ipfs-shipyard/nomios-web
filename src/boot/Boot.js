import React, { Component, Fragment, cloneElement } from 'react';
import pDelay from 'delay';
import pTimeout from 'p-timeout';
import PropTypes from 'prop-types';
import { IdmWalletProvider } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ErrorScreen from './error-screen';
import LoadingScreen from './loading-screen';
import LockScreen from './lock-screen';
import ActivityDetector from './activity-detector';
import styles from './Boot.css';

const RETRY_DELAY = 1700;

const CSS_TRANSITION_PROPS = {
    timeout: 300,
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

const createIdmWallet = async () => {
    const createIdmWallet = await pTimeout(
        import(/* webpackChunkName: "idm-wallet" */ 'idm-wallet'),
        6000,
    );

    return createIdmWallet.default();
};

class Boot extends Component {
    state = {
        createWalletPromise: createIdmWallet(),
        loadWalletPromise: undefined,
    };

    render() {
        return (
            <PromiseState
                promise={ this.state.createWalletPromise }
                onSettle={ this.handleBuildPromiseSettle }>
                { ({ status, value }) => (
                    <Fragment>
                        <TransitionGroup component={ null }>
                            { status === 'pending' && (
                                <CSSTransition key="pending" { ...CSS_TRANSITION_PROPS }>
                                    <div className={ styles.boot }>{ this.renderLoading() }</div>
                                </CSSTransition>
                            ) }
                            { status === 'rejected' && (
                                <CSSTransition key="error" { ...CSS_TRANSITION_PROPS }>
                                    <div className={ styles.boot }>{ this.renderError(value) }</div>
                                </CSSTransition>
                            ) }
                            { status === 'fulfilled' && (
                                <CSSTransition key="fulfilled" { ...CSS_TRANSITION_PROPS }>
                                    <div className={ styles.boot }>{ this.renderSuccess(value) }</div>
                                </CSSTransition>
                            ) }
                        </TransitionGroup>
                    </Fragment>
                ) }
            </PromiseState>
        );
    }

    renderLoading() {
        return <LoadingScreen className={ styles.loadingScreen } />;
    }

    renderError(error) {
        return <ErrorScreen error={ error } onRetry={ this.handleRetry } className={ styles.errorScreen } />;
    }

    renderSuccess(idmWallet) {
        return (
            <IdmWalletProvider idmWallet={ idmWallet }>
                <LockScreen />
                <ActivityDetector />

                <PromiseState promise={ this.state.loadWalletPromise }>
                    { ({ status, value }) => {
                        switch (status) {
                        case 'fulfilled': return cloneElement(this.props.children, { className: styles.successScreen });
                        case 'rejected': return this.renderError(value);
                        default: return null;
                        }
                    } }
                </PromiseState>
            </IdmWalletProvider>
        );
    }

    handleBuildPromiseSettle = async ({ status, value: idmWallet }) => {
        if (status === 'fulfilled') {
            this.setState({ loadWalletPromise: idmWallet.identities.load() });
        }
    };

    handleRetry = () => {
        this.setState({
            createWalletPromise: pDelay(RETRY_DELAY).then(() => createIdmWallet()),
        });
    };
}

Boot.propTypes = {
    children: PropTypes.node,
};

export default Boot;
