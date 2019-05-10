import './index.css';
import React from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';
import { setAppElement } from '@nomios/web-uikit';
import App from './App';
import Boot from './Boot';
import * as serviceWorker from './serviceWorker';

ReactModal.setAppElement('#root');
setAppElement('#root');

render(
    <Boot>
        <App />
    </Boot>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
