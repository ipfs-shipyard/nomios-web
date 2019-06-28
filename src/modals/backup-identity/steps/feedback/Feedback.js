import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { Button } from '@nomios/web-uikit';
import { IpfsAvatar } from '../../../../shared/components/ipfs';
import styles from './Feedback.css';

class Feedback extends Component {
    getFirstName = memoizeOne((name) => name.split(' ')[0]);

    render() {
        const { isBackedUp, onRequestClose, profileDetails: { name, image } } = this.props;

        const feedbackTitle = isBackedUp ?
            `${this.getFirstName(name)}, your identity is already backed up!` :
            `${this.getFirstName(name)}, your identity is now totally secure!`;
        const feedbackMessage = isBackedUp ?
            'You have already backed up your identity before. This identity is totally secure.' :
            'Nomios identities are decentralized, meaning that anyone who has the secret recovery key effectively owns this identity. Please keep your secret recovery key always safe.';

        return (
            <div className={ styles.contentWrapper }>
                <IpfsAvatar name={ name } image={ image } className={ styles.avatar } />
                <h2 className={ styles.heading }>{ feedbackTitle }</h2>
                <p>{ feedbackMessage }</p>
                <div className={ styles.buttonsWrapper } onClick={ onRequestClose }>
                    <Button className={ styles.button }>{ isBackedUp ? 'Close' : 'Go to app' }</Button>
                </div>
            </div>
        );
    }
}

Feedback.propTypes = {
    profileDetails: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    isBackedUp: PropTypes.bool,
};

Feedback.defaultProps = {
    isBackedUp: false,
};

export default Feedback;
