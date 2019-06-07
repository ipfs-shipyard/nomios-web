import React from 'react';
import { NavLink } from 'react-router-dom';
import { Svg, Button } from '@nomios/web-uikit';
import styles from './Page404.css';

// eslint-disable-next-line max-len
const fadingLogoSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/brand-fading-symbol.svg');

const Page404 = () => (
    <div className={ styles.errorPage }>
        <div className={ styles.background } />
        <Svg svg={ fadingLogoSvg } className={ styles.illustration } />
        <h1 className={ styles.title }>This page... has no identity.</h1>
        <p className={ styles.body }>Sorry, we can&apos;t find what you are looking for.</p>
        <NavLink to="/"><Button variant="primary">Go to Homepage</Button></NavLink>
    </div>
);

export default Page404;
