import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { Transition } from 'react-transition-group';
import { Route, Switch } from 'react-router-dom';
import Sidebar from './sidebar';
import ErrorBoundary from './error-boundary';
import WalletEnclave from '../shared/components/wallet-enclave';
import SetupLocker from '../modals/setup-locker';
import Home from '../pages/home';
import Identity from '../pages/identity';
import { Page404 } from '../pages/errors';
import styles from './App.css';

class App extends Component {
    state = {
        setupLockerOpen: false,
    };

    constructor(props) {
        super(props);
        this.state.setupLockerOpen = props.pristine;
    }

    render() {
        const { pristine } = this.props;
        const { setupLockerOpen } = this.state;

        return (
            <Fragment>
                <Transition in={ setupLockerOpen } timeout={ 2000 } mountOnEnter unmountOnExit>
                    <SetupLocker open={ setupLockerOpen } onComplete={ this.handleSetupLockerComplete } />
                </Transition>

                <WalletEnclave>
                    <div className={ styles.app }>
                        <Sidebar className={ styles.sidebar } />

                        <main className={ styles.page }>
                            { !pristine && (
                                <ErrorBoundary>
                                    <Switch>
                                        <Route path="/" exact component={ Home } />
                                        <Route path="/identity/:id" component={ Identity } />
                                        <Route path="/*" component={ Page404 } />
                                    </Switch>
                                </ErrorBoundary>
                            ) }
                        </main>
                    </div>
                </WalletEnclave>
            </Fragment>
        );
    }

    handleSetupLockerComplete = () => {
        this.setState({ setupLockerOpen: false });
    };
}

App.propTypes = {
    pristine: PropTypes.bool,
};

export default connectIdmWallet((idmWallet) => () => ({
    pristine: idmWallet.locker.isPristine(),
}))(App);
