/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

import { Button, TypeGroup, TypeOption, AvatarPicker, TextInput } from '@nomios/web-uikit';
import FaderContainer from '../../../../shared/components/fader-container';
import { notEmpty } from '../../../../shared/form-validators';
import BulletsIndicator from '../../../../shared/components/bullets-indicator';
import identities from './identities';

import styles from './IdentityType.css';

const DEFAULT_SELECTED_IDENTITY = 'person';
const FORM_INITIAL_VALUES = {
    'identity-type': DEFAULT_SELECTED_IDENTITY,
};

class IdentityType extends Component {
    state = {
        activeSubStepIndex: 0,
        identityImage: null,
    };

    selectedIdentityInfo = this.getIdentityInfo(DEFAULT_SELECTED_IDENTITY);

    constructor() {
        super();

        this.bulletCallbacks = [
            this.handleGoToIdentityType,
            this.handleGoToIdentityName,
        ];
    }

    render() {
        const { activeSubStepIndex } = this.state;
        const { icon, avatarLabel, inputLabel, inputPlaceholder } = this.selectedIdentityInfo;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>1. Tell us who you are</h2>
                <p>
                    Nomios will give you control over your fundamental digital rights:
                    Identity, data ownership, privacy and security.
                </p>

                <Form
                    initialValues={ FORM_INITIAL_VALUES }
                    onSubmit={ this.handleOnSubmit }>
                    { ({ handleSubmit, invalid, values }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit }>
                            <FaderContainer activeIndex={ activeSubStepIndex }>
                                <Field name="identity-type">
                                    { ({ input }) => (
                                        <TypeGroup
                                            selectedId={ input.value }
                                            className={ styles.typeGroup }
                                            name={ input.name }
                                            onSelect={ input.onChange }>
                                            { this.renderIdentities() }
                                        </TypeGroup>
                                    ) }
                                </Field>
                                <div className={ styles.identityInfoWrapper }>
                                    <AvatarPicker
                                        name={ values.name }
                                        icon={ icon }
                                        label={ avatarLabel }
                                        onChange={ this.handleAvatarInputChange } />
                                    <Field
                                        name="name"
                                        validate={ notEmpty }>
                                        { ({ input }) => (
                                            <TextInput
                                                { ...input }
                                                className={ styles.textInput }
                                                label={ inputLabel }
                                                placeholder={ inputPlaceholder } />
                                        ) }
                                    </Field>
                                </div>
                            </FaderContainer>

                            <div className={ styles.buttonWrapper }>
                                <Button disabled={ invalid }>Continue</Button>
                            </div>
                        </form>
                    ) }
                </Form>

                <BulletsIndicator
                    className={ styles.bulletsIndicator }
                    activeIndex={ activeSubStepIndex }
                    bulletCallbacks={ this.bulletCallbacks } />
            </div>
        );
    }

    renderIdentities = () => (
        identities.map((identity, index) => (
            <TypeOption key={ index } id={ identity.id } label={ identity.label } badge={ identity.badge }>
                { identity.icon }
            </TypeOption>
        ))
    );

    getIdentityInfo(id) {
        return identities.filter((identity) => identity.id === id)[0];
    }

    handleBulletClick(bulletIndex) {
        if (bulletIndex !== this.state.activeSubStepIndex) {
            this.setState({ activeSubStepIndex: bulletIndex });
        }
    }

    handleGoToIdentityType = () => this.handleBulletClick(0);
    handleGoToIdentityName = (formData) => {
        this.selectedIdentityInfo = this.getIdentityInfo(formData['identity-type']);
        this.handleBulletClick(1);
    };

    // We are controlling this input manually to avoid installing third-party libs.
    // Check this issue here: https://github.com/final-form/react-final-form/issues/92
    handleAvatarInputChange = (imageFile) => {
        this.setState({ identityImage: imageFile });
    };

    handleOnSubmit = (formData) => {
        switch (this.state.activeSubStepIndex) {
        case 0:
            this.handleGoToIdentityName(formData);
            break;
        case 1:
            this.handleNextStep(formData);
            break;
        default:
            break;
        }
    };

    handleNextStep = (formData) => {
        const finalData = { image: this.state.identityImage, ...formData };

        this.props.onNextStep && this.props.onNextStep(this.props.nextStepId, finalData);
    };
}

IdentityType.propTypes = {
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityType;
