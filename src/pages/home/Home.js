import React from 'react';
import { Logo, ModalTrigger, Button } from '@nomios/web-uikit';
import BackupIdentity from '../../modals/backup-identity';
import styles from './Home.css';

const Home = () => (
    <div className={ styles.homepage }>
        <div className={ styles.background } />
        <Logo variant="vertical" className={ styles.logo } />
        <ModalTrigger modal={ <BackupIdentity id="cc939892e0aed9c14299a914e04bfac4632ff986cd20bb22fbcde72b8c90c95d" /> }>
            <Button variant="primary">Backup</Button>
        </ModalTrigger>
    </div>
);

export default Home;
