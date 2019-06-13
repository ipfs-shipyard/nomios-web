import React from 'react';
import { Logo, ModalTrigger, Button } from '@nomios/web-uikit';
import BackupIdentity from '../../modals/backup-identity';
import styles from './Home.css';

const Home = () => (
    <div className={ styles.homepage }>
        <div className={ styles.background } />
        <Logo variant="vertical" className={ styles.logo } />
        <ModalTrigger modal={ <BackupIdentity /> }>
            <Button variant="primary">Backup</Button>
        </ModalTrigger>
    </div>
);

export default Home;
