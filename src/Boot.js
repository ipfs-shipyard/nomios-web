import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import createIdmWallet from 'idm-wallet';
import { IdmWalletProvider } from 'react-idm-wallet';
import { PromiseState } from 'react-promiseful';
import { Button } from '@nomios/web-uikit';
import styles from './Boot.css';

const buildIdmWallet = () => createIdmWallet({});

class Boot extends Component {
    state = {
        walletPromise: buildIdmWallet(),
    };

    render() {
        return (
            <div className={ styles.boot }>
                <PromiseState promise={ this.state.walletPromise }>
                    { ({ status, value }) => {
                        switch (status) {
                        case 'pending': return this.renderLoading();
                        case 'rejected': return this.renderError(value);
                        case 'fulfilled': return this.renderSuccess(value);
                        default: return null;
                        }
                    } }
                </PromiseState>
            </div>
        );
    }

    renderLoading() {
        return <p>Loading...</p>;
    }

    renderError(error) {
        console.error(error);

        return (
            <Fragment>
                <p>Oops, an error occurred while initializing the wallet.</p>

                <Button onClick={ this.handleRetry }>Retry</Button>
            </Fragment>
        );
    }

    renderSuccess(idmWallet) {
        return (
            <IdmWalletProvider idmWallet={ idmWallet }>
                { this.props.children }
            </IdmWalletProvider>
        );
    }

    handleRetry = () => {
        this.setState({ walletPromise: buildIdmWallet() });
    };
}

Boot.propTypes = {
    children: PropTypes.node,
};

export default Boot;
