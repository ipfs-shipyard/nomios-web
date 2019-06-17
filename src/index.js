import './index.css';
import React from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';
import { setAppElement } from '@nomios/web-uikit';
import { IdmWalletProvider } from 'react-idm-wallet';
import { hasParent, createMediatorSide, createWalletSide } from 'idm-bridge-postmsg';
import App from './app';
import AppMediator from './app-mediator';
import Boot from './boot';

const renderApp = (rootEl) => {
    const createIdmWallet = async () => {
        const createIdmWallet = await import(/* webpackChunkName: "idm-wallet" */ 'idm-wallet');
        const idmWallet = await createIdmWallet.default();

        createWalletSide(idmWallet);

        return idmWallet;
    };

    return render(
        <Boot promise={ createIdmWallet() }>
            { (idmWallet) => (
                <IdmWalletProvider idmWallet={ idmWallet }>
                    <App />
                </IdmWalletProvider>
            ) }
        </Boot>,
        rootEl,
    );
};

const renderAppMediator = (rootEl) => render(
    <Boot promise={ createMediatorSide() }>
        { (mediatorSide) => (
            <AppMediator mediatorSide={ mediatorSide } />
        ) }
    </Boot>,
    rootEl,
);

const rootEl = document.getElementById('root');

ReactModal.setAppElement(rootEl);
setAppElement(rootEl);

if (hasParent()) {
    renderAppMediator(rootEl);
} else {
    renderApp(rootEl);
}
