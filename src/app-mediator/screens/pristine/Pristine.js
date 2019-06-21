import React from 'react';
import PropTypes from 'prop-types';
import { Logo, Button } from '@nomios/web-uikit';
import { Link } from 'react-router-dom';
import AppInfo from '../../../shared/components/app-info';
import backgroundPatternUrl from '../../../shared/media/backgrounds/background-pattern-1440p.png';
import styles from './Pristine.css';

const Pristine = ({ app }) => (
    <div className={ styles.container }>
        <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
        <div className={ styles.infoContainer }>
            <div className={ styles.header }>
                <Logo className={ styles.logo } variant="symbol" />
            </div>
            <div className={ styles.appInfoContainer }>
                <AppInfo label={ app.name } iconUrl={ app.iconUrl } />
            </div>
            <h2 className={ styles.title }>Start using Nomios to authenticate.</h2>
            <p className={ styles.text }>
                It looks like that you&apos;ve never used Nomios before, you must setup Nomios and create your first identity.
            </p>
            <Link
                to="/?action=create-identity"
                target="_blank"
                className={ styles.buttonContainer }
                rel="noopener">
                <Button variant="negative">Start using Nomios</Button>
            </Link>
        </div>
    </div>
);

Pristine.propTypes = {
    app: PropTypes.object.isRequired,
};

export default Pristine;
