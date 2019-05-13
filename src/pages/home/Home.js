import React from 'react';
import { ModalTrigger } from '@nomios/web-uikit';

import NewIdentityFlow from '../../shared/components/new-identity-flow';

const Home = () => (
    <div>
        <h4>This is the home page!</h4>
        <ModalTrigger modal={ <NewIdentityFlow /> }>
            <button>Add new identity</button>
        </ModalTrigger>
    </div>
);

export default Home;
