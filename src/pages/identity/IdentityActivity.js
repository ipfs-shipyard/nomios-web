import { ArrowRightIcon, TextButton } from '@nomios/web-uikit';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AppsBox from './activity-boxes/Apps';
import DevicesBox from './activity-boxes/Devices';
import SocialProofsBox from './activity-boxes/SocialProofs';
import styles from './IdentityActivity.css';

class ActivityBox extends Component {
    render() {
        const { title, onClick, children } = this.props;

        return (
            <div className={ styles.activity }>
                <div className={ styles.headerWrapper }>
                    <TextButton
                        className={ styles.header }
                        icon={ <ArrowRightIcon className={ styles.arrow } /> }
                        iconPosition="left"
                        onClick={ onClick }>
                        { title }
                    </TextButton>
                </div>
                <div className={ styles.activityBlock }>
                    { children }
                </div>
            </div>
        );
    }
}

ActivityBox.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

class IdentityActivity extends Component {
    render() {
        const { id } = this.props;

        return (
            <div className={ styles.activitiesWrapper }>
                <ActivityBox title="My Devices" onClick={ this.handleMyDevices }>
                    <DevicesBox id={ id } />
                </ActivityBox>
                <ActivityBox title="My Social Proofs" onClick={ this.handleMySocialProofs }>
                    <SocialProofsBox />
                </ActivityBox>
                <ActivityBox title="My Apps" onClick={ this.handleMyApps }>
                    <AppsBox />
                </ActivityBox>
            </div>
        );
    }

    handleMyDevices = () => {
        alert('See my devices');
    };

    handleMySocialProofs = () => {
        alert('See my social proofs');
    };

    handleMyApps = () => {
        alert('See my apps');
    };
}

IdentityActivity.propTypes = {
    id: PropTypes.string.isRequired,
};

export default IdentityActivity;
