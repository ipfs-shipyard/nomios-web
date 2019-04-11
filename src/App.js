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
import ActivityDetector from './shared/components/activity-detector';

Modal.setAppElement('#root');

class App extends Component {
    state = {
        lockScreenOpen: false,
        setupLockerOpen: false,
    };

    constructor(props) {
        super(props);
        this.state.lockScreenOpen = props.locked;
        this.state.setupLockerOpen = props.pristine;
    }

    componentDidUpdate(prevProps) {
        if (this.props.locked && !prevProps.locked) {
            this.setState({ lockScreenOpen: true });
        }
    }

    render() {
        const { lockScreenOpen, setupLockerOpen } = this.state;

        return (
            <div className={ styles.app }>
                <ActivityDetector onDetect={ this.handleActivityDetect } />

                <Router>
                    <Transition in={ lockScreenOpen } timeout={ 2000 } mountOnEnter unmountOnExit>
                        <LockScreen in={ lockScreenOpen } onUnlock={ this.handleLockScreenUnlock } />
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

    handleActivityDetect = () => this.props.restartIdleTimer();

    handleLockScreenUnlock = () => {
        this.setState({ lockScreenOpen: this.props.locked });
    };

    handleSetupLockerComplete = () => {
        this.setState({ setupLockerOpen: false });
    };
}

App.propTypes = {
    locked: PropTypes.bool,
    pristine: PropTypes.bool,
    restartIdleTimer: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const restartIdleTimer = () => idmWallet.locker.idleTimer.restart();

    return () => ({
        locked: idmWallet.locker.isLocked(),
        pristine: idmWallet.locker.isPristine(),
        restartIdleTimer,
    });
})(App);
