import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import PageLayout from '../../shared/components/page-layout/PageLayout';
import IdentityDetails from './IdentityDetails';
import IdentityActivity from './IdentityActivity';
import styles from './Identity.css';

class Identity extends Component {
    render() {
        const { id } = this.props.match.params;

        if (!this.props.hasIdentity) {
            return null;
        }

        return (
            <div className={ styles.splitWrapper }>
                <div className={ styles.split }>
                    <div className={ styles.background } />
                    <PageLayout>
                        <div className={ styles.top }>
                            <IdentityDetails id={ id } />
                        </div>
                        <div className={ styles.bottom }>
                            <IdentityActivity id={ id } />
                        </div>
                    </PageLayout>
                </div>
            </div>
        );
    }
}

Identity.propTypes = {
    match: PropTypes.object.isRequired,
    hasIdentity: PropTypes.bool.isRequired,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    hasIdentity: idmWallet.identities.has(ownProps.match.params.id),
}))(Identity);
