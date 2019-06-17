import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FacebookIcon, TwitterIcon, LinkedinIcon, GithubIcon, TextButton } from '@nomios/web-uikit';
import StatusIndicator from './shared/StatusIndicator';
import GenericList from './shared/GenericList';
import styles from './SocialProofs.css';

class SocialProofItem extends Component {
    render() {
        const { network, account } = this.props;

        const socialIcon = this.inferSocialIcon(network);

        if (!account) {
            return (
                <TextButton
                    icon={ socialIcon }
                    className={ classNames(styles.proofLine, styles.noProof) }
                    iconPosition="left"
                    onClick={ this.handleButtonClick }>
                    <span className={ styles.text }>Prove my { network }<span className={ styles.optional }> account</span></span>
                </TextButton>
            );
        }

        return (
            <div className={ classNames(styles.proofLine, styles.hasProof) }>
                <div className={ styles.left }>
                    { socialIcon }
                    <div className={ styles.text }>{ account.username }</div>
                </div>
                <StatusIndicator text={ this.textFromAccountStatus(account.status) } status={ account.status } />
            </div>
        );
    }

    textFromAccountStatus(status) {
        switch (status) {
        case 'invalid':
            return 'Invalid';
        case 'pending':
            return 'Pending';
        case 'approved':
            return 'Approved';
        default:
            return 'Invalid';
        }
    }

    inferSocialIcon(network) {
        switch (network) {
        case 'Facebook':
            return <FacebookIcon className={ styles.icon } />;
        case 'Github':
            return <GithubIcon className={ styles.icon } />;
        case 'Linkedin':
            return <LinkedinIcon className={ styles.icon } />;
        case 'Twitter':
            return <TwitterIcon className={ styles.icon } />;
        default:
            return null;
        }
    }

    handleButtonClick = () => {
        const { onClick } = this.props;

        alert('Social network proof');
        onClick && onClick();
    };
}

SocialProofItem.propTypes = {
    network: PropTypes.string.isRequired,
    account: PropTypes.shape({
        username: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['pending', 'invalid', 'approved']).isRequired,
    }),
    onClick: PropTypes.func,
};

const SocialProofsBox = (props) => {
    const { proofs } = props;

    const listItems = [
        <SocialProofItem network="Facebook" account={ proofs.facebook } key={ 0 } />,
        <SocialProofItem network="Twitter" account={ proofs.twitter } key={ 1 } />,
        <SocialProofItem network="Linkedin" account={ proofs.linkedin } key={ 2 } />,
        <SocialProofItem network="Github" account={ proofs.github } key={ 3 } />,
    ];

    return (
        <GenericList>
            { listItems.map((device) => device) }
        </GenericList>
    );
};

SocialProofsBox.propTypes = {
    proofs: PropTypes.shape({
        twitter: PropTypes.shape({
            username: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        }),
        github: PropTypes.shape({
            username: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        }),
        facebook: PropTypes.shape({
            username: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        }),
        linkedin: PropTypes.shape({
            username: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        }),
    }),
};

// For testing purposes only. In final version, have an empty object as a default
SocialProofsBox.defaultProps = {
    proofs: {},
};

export default SocialProofsBox;
