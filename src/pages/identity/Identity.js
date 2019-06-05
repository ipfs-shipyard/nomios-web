import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageLayout from '../../shared/components/page-layout/PageLayout';
import IdentityDetails from './IdentityDetails';
import IdentityActivity from './IdentityActivity';
import styles from './Identity.css';

class Identity extends Component {
    render() {
        const { id } = this.props.match.params;

        return (
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
        );
    }
}

Identity.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Identity;
