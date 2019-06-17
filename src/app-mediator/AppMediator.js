import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import pDefer from 'p-defer';
import { Route, Switch, withRouter } from 'react-router-dom';
import Authenticate from '../pages/authenticate';
import Sign from '../pages/sign';
import LockScreen from '../shared/components/lock-screen';

class AppMediator extends Component {
    prompt = undefined;

    state = {
        locked: false,
    };

    constructor(props) {
        super(props);

        this.props.mediatorSide.setPrompts({
            unlock: this.promptUnlock,
            authenticate: this.promptAuthenticate,
            sign: this.promptSign,
        });
    }

    render() {
        const { locked /* , pristine */ } = this.state;

        return (
            <Fragment>
                <LockScreen locked={ locked } unlock={ this.promptUnlockFn } />

                <Switch>
                    <Route path="/prompt/authenticate" exact>
                        { ({ match }) => match ? (
                            <Authenticate
                                app={ this.prompt.app }
                                identities={ this.prompt.identities }
                                onAccept={ this.handlePromptAccept }
                                onDeny={ this.handlePromptDeny } />
                        ) : null }
                    </Route>

                    <Route path="/prompt/sign" exact>
                        { ({ match }) => match ? (
                            <Sign
                                app={ this.prompt.app }
                                data={ this.prompt.data }
                                onAccept={ this.handlePromptAccept }
                                onDeny={ this.handlePromptDeny } />
                        ) : null }
                    </Route>
                </Switch>
            </Fragment>
        );
    }

    promptUnlock = async ({ pristine, unlockFn }) => {
        this.prompt = {
            pristine,
            unlockFn,
            response: pDefer(),
        };

        this.setState({ pristine, locked: !pristine });

        return this.prompt.response.promise;
    };

    promptUnlockFn = async (...args) => {
        await this.prompt.unlockFn(...args);

        this.setState({ locked: false }, () => {
            this.prompt.response.resolve({ ok: true });
        });
    };

    promptAuthenticate = ({ app, identities }) => {
        this.prompt = {
            app,
            identities,
            response: pDefer(),
        };

        this.props.history.replace('/prompt/authenticate');

        return this.prompt.response.promise;
    };

    promptSign = ({ app, identity, data }) => {
        this.prompt = {
            app,
            identity,
            data,
            response: pDefer(),
        };

        this.props.history.replace('/prompt/sign');

        return this.prompt.response.promise;
    };

    handlePromptAccept = (identityId) => {
        this.prompt.response.resolve({ ok: true, identityId });
    };

    handlePromptDeny = () => {
        this.prompt.response.resolve({ ok: false });
    };
}

AppMediator.propTypes = {
    mediatorSide: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(AppMediator);
