import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { Transition } from 'react-transition-group';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Shell from './shell';
import SetupLocker from './modals/setup-locker';
import LockScreen from './modals/lock-screen';
import Home from './pages/home';
import Identity from './pages/identity';
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
        const { locked } = this.props;
        const { setupLockerOpen } = this.state;

        return (
            <div className={ styles.app }>
                <Router>
                    <Transition in={ locked } timeout={ 2000 } mountOnEnter unmountOnExit>
                        <LockScreen in={ locked } />
                    </Transition>

                    <Transition in={ setupLockerOpen } timeout={ 2000 } mountOnEnter unmountOnExit>
                        <SetupLocker open={ setupLockerOpen } onComplete={ this.handleSetupLockerComplete } />
                    </Transition>

                    <Shell>
                        <Route path="/" exact component={ Home } />
                        <Route path="/identity/:id" component={ Identity } />
                    </Shell>
                </Router>
            </div>
        );
    }

    handleSetupLockerComplete = () => {
        this.setState({ setupLockerOpen: false });
    };
}

App.propTypes = {
    locked: PropTypes.bool,
    pristine: PropTypes.bool,
};

export default connectIdmWallet((idmWallet) => () => ({
    locked: idmWallet.locker.isLocked(),
    pristine: idmWallet.locker.isPristine(),
}))(App);
