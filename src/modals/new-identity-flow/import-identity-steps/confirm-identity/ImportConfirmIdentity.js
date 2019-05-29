import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Avatar } from '@nomios/web-uikit';
import styles from './ImportConfirmIdentity.css';

class ImportConfirmIdentity extends Component {
    render() {
        const { identityData } = this.props;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>1. Your Identity Details</h2>
                <p>
                    Confirm the ID that you&apos;re importing for this device.
                </p>
                <div className={ styles.identityWrapper }>
                    <Avatar name={ identityData.name } image={ identityData.image } />
                    <div className={ styles.identityName }>
                        <div className={ styles.title }>Identity Name</div>
                        <div className={ styles.text }>{ identityData.name }</div>
                    </div>
                </div>
                <div className={ styles.advance }>
                    <Button onClick={ this.handleSecondaryStep } variant="secondary">Oops, import other</Button>
                    <Button onClick={ this.handleNextStep } className={ styles.primaryButton }>Continue</Button>
                </div>
            </div>
        );
    }

    handleNextStep = () => {
        const { nextStepId } = this.props;

        this.props.onNextStep(nextStepId);
    };

    handleSecondaryStep = () => {
        const { previousStepId } = this.props;

        this.props.onNextStep(previousStepId);
    };
}

ImportConfirmIdentity.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    previousStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
    identityData: PropTypes.shape({ name: PropTypes.string, image: PropTypes.string }),
};

ImportConfirmIdentity.defaultProps = {
    identityData: { name: 'Unknown Identity' },
};

export default ImportConfirmIdentity;
