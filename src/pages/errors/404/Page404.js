import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Svg, Button } from '@nomios/web-uikit';
import styles from './Page404.css';

// eslint-disable-next-line max-len
const fadingLogoSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/brand-fading-symbol.svg');

const Page404 = ({ history }) => {
    const onHomepageClick = useCallback(() => history.push('/'), [history]);

    return (
        <div className={ styles.errorPage }>
            <div className={ styles.background } />
            <Svg svg={ fadingLogoSvg } className={ styles.illustration } />
            <h1 className={ styles.title }>This page... has no identity.</h1>
            <p className={ styles.body }>Sorry, we can&apos;t find what you are looking for.</p>
            <Button variant="primary" onClick={ onHomepageClick }>Go to Homepage</Button>
        </div>
    );
};

Page404.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(Page404);
