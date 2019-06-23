import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { Button } from '@nomios/web-uikit';
import { IpfsAvatar } from '../../../../shared/components/ipfs';
import styles from './Feedback.css';

class Feedback extends Component {
    getFirstName = memoizeOne((name) => name.split(' ')[0]);

    render() {
        const { isBackedup, onRequestClose, profileDetails: { name, image } } = this.props;
        const feedbackText = isBackedup ?
            `${this.getFirstName(name)}, your identity is already backed up!` :
            `${this.getFirstName(name)}, your identity is now totally secure!`;

        return (
            <div className={ styles.contentWrapper }>
                <IpfsAvatar name={ name } image={ image } className={ styles.avatar } />
                <h2 className={ styles.heading }>{ feedbackText }</h2>
                <p>
                    You have already backed up your identity before. This identity is totally secure.
                </p>
                <div className={ styles.buttonsWrapper } onClick={ onRequestClose }>
                    <Button className={ styles.button }>{ isBackedup ? 'Close' : 'Go to app' }</Button>
                </div>
            </div>
        );
    }
}

Feedback.propTypes = {
    profileDetails: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    isBackedup: PropTypes.bool,
};

Feedback.defaultProps = {
    isBackedup: false,
};

export default Feedback;
