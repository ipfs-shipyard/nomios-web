/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSpy } from 'react-final-form';
import { Button, TypeGroup, TypeOption, AvatarPicker, TextInput } from '@nomios/web-uikit';
import FadeContainer from '../../../../shared/components/fade-container';
import { notEmpty } from '../../../../shared/form-validators';
import BulletsIndicator from '../../../../shared/components/bullets-indicator';
import identities from './identities';
import styles from './IdentityInfo.css';

const FORM_INITIAL_VALUES = {
    type: 'Person',
};

class IdentityInfo extends Component {
    state = {
        activeSubStepIndex: 0,
        identityImage: null,
    };

    selectedIdentityInfo = this.getIdentityInfo(FORM_INITIAL_VALUES.type);

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
                            <FormSpy onChange={ this.handleFormChange } />
                            <FadeContainer activeIndex={ activeSubStepIndex }>
                                <Field name="type">
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
                            </FadeContainer>
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

    goToIdentityName(formData) {
        this.selectedIdentityInfo = formData && formData.type ?
            this.getIdentityInfo(formData.type) :
            this.selectedIdentityInfo;

        this.handleBulletClick(1);
    }

    handleBulletClick(bulletIndex) {
        if (bulletIndex !== this.state.activeSubStepIndex) {
            this.setState({ activeSubStepIndex: bulletIndex });
        }
    }

    handleGoToIdentityType = () => this.handleBulletClick(0);
    handleGoToIdentityName = () => this.goToIdentityName();

    // We are controlling this input manually to avoid installing third-party libs.
    // Check this issue here: https://github.com/final-form/react-final-form/issues/92
    handleAvatarInputChange = (imageFile) => {
        this.setState({ identityImage: imageFile });
    };

    handleFormChange = ({ modified, values }) => {
        if (modified.type) {
            this.selectedIdentityInfo = this.getIdentityInfo(values.type);
        }
    };

    handleOnSubmit = (formData) => {
        switch (this.state.activeSubStepIndex) {
        case 0:
            this.goToIdentityName(formData);
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

        this.props.onNextStep(this.props.nextStepId, finalData);
    };
}

IdentityInfo.propTypes = {
    nextStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default IdentityInfo;
