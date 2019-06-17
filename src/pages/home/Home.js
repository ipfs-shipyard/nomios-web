import React from 'react';
import { Logo } from '@nomios/web-uikit';
import styles from './Home.css';

const Home = () => (
    <div className={ styles.homepage }>
        <div className={ styles.background } />
        <Logo variant="vertical" className={ styles.logo } />
    </div>
);

export default Home;
