import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import styles from './Identity.css';
import IdentityDetails from './IdentityDetails';
import IdentityActivity from './IdentityActivity';
import PageLayout from '../../shared/components/page-layout/PageLayout';
import backgroundPatternUrl from '../../shared/media/backgrounds/background-pattern-2160p.png';

class Identity extends Component {
    render() {
        const { id } = this.props.match.params;

        if (!this.props.isLoaded()) {
            return null;
        }

        return (
            <div className={ styles.splitWrapper }>
                <div className={ styles.split }>
                    <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                    <PageLayout>
                        <div className={ styles.top }>
                            <IdentityDetails matchId={ id } />
                        </div>
                        <div className={ styles.bottom }>
                            <IdentityActivity matchId={ id } />
                        </div>
                    </PageLayout>
                </div>
            </div>
        );
    }
}

Identity.propTypes = {
    match: PropTypes.object.isRequired,
    isLoaded: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const isLoaded = () => idmWallet.identities.isLoaded();

    return () => ({
        isLoaded,
    });
})(Identity);
