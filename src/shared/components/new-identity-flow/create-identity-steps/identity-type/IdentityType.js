import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

import { Button, TypeOption, AvatarPicker, TextInput } from '@nomios/web-uikit';
import FaderContainer from '../../../fader-container';
import { notEmpty } from '../../../../form-validators';
import BulletsIndicator from '../../../bullets-indicator';
import identities from './identities';

import styles from './IdentityType.css';

const DEFAULT_SELECTED_IDENTITY = 'person';

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

                <Form onSubmit={ this.handleOnSubmit }>
                    { ({ handleSubmit, invalid, values }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit }>
                            <FaderContainer activeIndex={ activeSubStepIndex }>
                                <div className={ styles.typeGroup }>
                                    { this.renderIdentities() }
                                </div>
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

    renderIdentities() {
        const { id } = this.selectedIdentityInfo;

        return (
            identities.map((identity, index) => (
                <Field
                    key={ index }
                    type="radio"
                    name="identity-type"
                    value={ identity.id }
                    initialValue={ id }
                    validate={ notEmpty }>
                    { ({ input, meta }) => {
                        if (!meta.data.handleOnChange) {
                            meta.data.handleOnChange = (event) => {
                                input.onChange(event);
                                this.handleTypeOptionChange(event);
                            };
                        }

                        return (
                            <TypeOption
                                { ...input }
                                id={ identity.id }
                                label={ identity.label }
                                badge={ identity.badge }
                                selected={ id === identity.id }
                                onChange={ meta.data.handleOnChange }>
                                { identity.icon }
                            </TypeOption>
                        );
                    } }
                </Field>
            ))
        );
    }

    getIdentityInfo(id) {
        return identities.filter((identity) => identity.id === id)[0];
    }

    handleTypeOptionChange = (event) => {
        this.selectedIdentityInfo = this.getIdentityInfo(event.target.value);
    };

    handleBulletClick(bulletIndex) {
        if (bulletIndex !== this.state.activeSubStepIndex) {
            this.setState({ activeSubStepIndex: bulletIndex });
        }
    }

    handleGoToIdentityType = () => this.handleBulletClick(0);
    handleGoToIdentityName = () => this.handleBulletClick(1);

    // We are controlling this input manually to avoid installing third-party libs.
    // Check this issue here: https://github.com/final-form/react-final-form/issues/92
    handleAvatarInputChange = (imageFile) => {
        this.setState({ identityImage: imageFile });
    };

    handleOnSubmit = (formData) => {
        switch (this.state.activeSubStepIndex) {
        case 0:
            this.handleGoToIdentityName();
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
