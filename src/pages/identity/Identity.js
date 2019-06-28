import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import PageLayout from '../../shared/components/page-layout/PageLayout';
import Revoked from './revoked';
import IdentityDetails from './IdentityDetails';
import IdentityActivity from './IdentityActivity';
import styles from './Identity.css';

class Identity extends Component {
    render() {
        const { id } = this.props.match.params;
        const { isRevoked } = this.props;

        if (isRevoked) {
            return <Revoked id={ id } />;
        }

        return (
            <div className={ styles.split }>
                <div className={ styles.background } />
                <PageLayout className={ styles.layout }>
                    <div className={ styles.top }>
                        <IdentityDetails id={ id } />
                    </div>
                    <div className={ styles.bottom }>
                        <IdentityActivity id={ id } />
                    </div>
                </PageLayout>
            </div>
        );
    }
}

Identity.propTypes = {
    isRevoked: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    isRevoked: idmWallet.identities.get(ownProps.match.params.id).isRevoked(),
}))(Identity);
