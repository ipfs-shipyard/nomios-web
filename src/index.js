import './index.css';
import React from 'react';
import { render } from 'react-dom';
import pTimeout from 'p-timeout';
import ReactModal from 'react-modal';
import { setAppElement } from '@nomios/web-uikit';
import Boot from './boot';
import * as serviceWorker from './serviceWorker';

ReactModal.setAppElement('#root');
setAppElement('#root');

const renderApp = async () => {
    const App = await pTimeout(
        import(/* webpackChunkName: "app" */ './app').then((res) => res.default),
        60000,
    );

    return <App />;
};

render(
    <Boot>{ renderApp() }</Boot>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
