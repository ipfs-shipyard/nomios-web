import React from 'react';
import { ModalTrigger } from '@nomios/web-uikit';
import EditProfile from '../../modals/edit-profile';

const Home = () => (
    <div>
        <h4>This is the home page!</h4>
        <ModalTrigger modal={ <EditProfile /> }>
            <button>Edit Profile</button>
        </ModalTrigger>
    </div>
);

export default Home;
