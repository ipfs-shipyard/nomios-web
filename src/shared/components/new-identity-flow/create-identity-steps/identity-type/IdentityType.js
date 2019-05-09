import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, TypeGroup, TypeOption, AvatarPicker, TextInput } from '@nomios/web-uikit';
import FaderContainer from '../../../fader-container';
import BulletsIndicator from '../../../bullets-indicator';
import identities from './identities';

import styles from './IdentityType.css';

const DEFAULT_SELECTED_IDENTITY = 'person';

class IdentityType extends Component {
    state = {
        activeSubStepIndex: 0,
        nextStepButtonDisabled: false,
        identityData: {
            type: DEFAULT_SELECTED_IDENTITY,
            name: null,
            image: null,
        },
    };

    selectedIdentityInfo = this.getIdentityInfo(DEFAULT_SELECTED_IDENTITY);

    constructor() {
        super();

        this.bulletCallbacks = [
            this.handleBulletTypeClick,
            this.handleBulletNameClick,
        ];
    }

    render() {
        const { activeSubStepIndex, nextStepButtonDisabled, identityData: { type, name } } = this.state;
        const { icon, avatarLabel, inputLabel, inputPlaceholder } = this.selectedIdentityInfo;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>1. Tell us who you are</h2>
                <p>
                    Nomios will give you control over your fundamental digital rights:
                    Identity, data ownership, privacy and security.
                </p>
                <FaderContainer activeIndex={ activeSubStepIndex }>
                    <TypeGroup
                        selectedId={ type }
                        className={ styles.typeGroup }
                        name="identity-type"
                        onSelect={ this.handleSelectIndentityType }>
                        { this.renderIdentities() }
                    </TypeGroup>
                    <div className={ styles.identityInfoWrapper }>
                        <AvatarPicker
                            name={ name }
                            icon={ icon }
                            label={ avatarLabel }
                            onChange={ this.handleAvatarInputChange } />
                        <TextInput
                            onChange={ this.handleTextInputChange }
                            className={ styles.textInput }
                            label={ inputLabel }
                            placeholder={ inputPlaceholder } />
                    </div>
                </FaderContainer>
                <div className={ styles.buttonWrapper }>
                    <Button disabled={ nextStepButtonDisabled } onClick={ this.handleNextStep }>Continue</Button>
                </div>
                <BulletsIndicator
                    className={ styles.bulletsIndicator }
                    activeIndex={ activeSubStepIndex }
                    bulletCallbacks={ this.bulletCallbacks } />
            </div>
        );
    }

    renderIdentities() {
        return (
            identities.map((identity, index) => (
                <TypeOption key={ index } id={ identity.id } label={ identity.label } badge={ identity.badge }>
                    { identity.icon }
                </TypeOption>
            ))
        );
    }

    getIdentityInfo(id) {
        return identities.filter((identity) => identity.id === id)[0];
    }

    shouldDisableButton(substepId) {
        const { type, name } = this.state.identityData;

        switch (substepId) {
        case 0:
            return !type;
        case 1:
            return !name || name === '';
        default:
            return false;
        }
    }

    handleBulletClick(bulletIndex) {
        const shouldDisable = this.shouldDisableButton(bulletIndex);

        if (bulletIndex !== this.state.activeSubStepIndex || shouldDisable !== this.state.nextStepButtonDisabled) {
            this.setState({ activeSubStepIndex: bulletIndex, nextStepButtonDisabled: shouldDisable });
        }
    }

    handleBulletTypeClick = () => this.handleBulletClick(0);
    handleBulletNameClick = () => this.handleBulletClick(1);

    handleSelectIndentityType = (identityTypeId) => {
        this.selectedIdentityInfo = this.getIdentityInfo(identityTypeId);
        this.setState((prevState) => ({
            identityData: { ...prevState.identityData, type: identityTypeId },
        }));
    };

    handleAvatarInputChange = (imageFile) => {
        this.setState((prevState) => ({
            identityData: { ...prevState.identityData, image: imageFile },
        }));
    };

    handleTextInputChange = (event) => {
        const shouldDisable = event.target.value === '';
        const inputTextValue = event.target.value;

        this.setState((prevState) => ({
            nextStepButtonDisabled: shouldDisable,
            identityData: { ...prevState.identityData, name: inputTextValue },
        }));
    };

    handleNextStep = () => {
        if (this.state.activeSubStepIndex === 0) {
            this.handleBulletNameClick();
        } else {
            this.props.onNextStep && this.props.onNextStep(this.props.nextStepId, this.state.identityData);
        }
    };
}

IdentityType.propTypes = {
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityType;
