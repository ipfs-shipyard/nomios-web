/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Field } from 'react-final-form';
import { ButtonPromiseState } from '../../../shared/components/button-promise-state';
import nationalities from 'ms-nationalities';
import { TextInput, Button, AutocompleteSelect, Radio, AvatarPicker, UserIcon } from '@nomios/web-uikit';
import { notEmpty } from '../../../shared/form-validators';
import LocationInput from './location-input';
import styles from './ProfileForm.css';

const PLACEHOLDER = {
    name: 'Enter your name',
    nationality: 'Enter your nationality',
    location: 'Enter your location',
};

class ProfileForm extends Component {
    state = {
        image: null,
        promise: undefined,
    };

    render() {
        const { profileInfo } = this.props;
        const { promise, image } = this.state;

        return (
            <Form
                initialValues={ profileInfo }
                onSubmit={ this.handleSubmit }>
                { ({ handleSubmit, invalid, dirty, form }) => (
                    <form className={ styles.form } autoComplete="off" onSubmit={ handleSubmit }>
                        <div className={ styles.inputsContainer }>
                            <div className={ styles.leftContent }>
                                <div className={ classNames(styles.field, styles.name) }>
                                    <label className={ styles.label }>Name</label>
                                    <Field name="name" validate={ notEmpty }>
                                        { ({ input }) => <TextInput { ...input } placeholder={ PLACEHOLDER.name } /> }
                                    </Field>
                                </div>
                                <div className={ classNames(styles.field, styles.nationality) }>
                                    <label className={ styles.label }>Nationality</label>
                                    <Field name="nationality">
                                        { ({ input }) => (
                                            <AutocompleteSelect
                                                value={ input.value }
                                                options={ nationalities }
                                                onChange={ input.onChange }
                                                placeholder={ PLACEHOLDER.nationality } />
                                        ) }
                                    </Field>
                                </div>
                                <div className={ styles.field }>
                                    <label className={ styles.label }>Gender</label>
                                    <div className={ styles.genderWrapper }>
                                        <Field name="gender" type="radio" value="male">
                                            { ({ input }) => <Radio { ...input } label="Male" /> }
                                        </Field>
                                        <Field name="gender" type="radio" value="female">
                                            { ({ input }) => <Radio { ...input } label="Female" /> }
                                        </Field>
                                        <Field name="gender" type="radio" value="other">
                                            { ({ input }) => <Radio { ...input } label="Other" /> }
                                        </Field>
                                    </div>
                                </div>
                            </div>

                            <div className={ styles.rightContent }>
                                <div className={ styles.field }>
                                    <label className={ styles.label }>Photo</label>
                                    <div className={ styles.avatarPickerWrapper }>
                                        <AvatarPicker
                                            image={ profileInfo.image }
                                            name="Pedro Santos"
                                            icon={ <UserIcon /> }
                                            label="Change photo"
                                            labelAlignment="right"
                                            onChange={ this.handleAvatarInputChange } />
                                    </div>
                                </div>
                                <div className={ classNames(styles.field, styles.location) }>
                                    <label className={ styles.label }>Location</label>
                                    <Field name="location">
                                        { ({ input }) => (
                                            <LocationInput
                                                { ...input }
                                                onLocationInfered={ form.change }
                                                placeholder={ PLACEHOLDER.location } />
                                        ) }
                                    </Field>
                                </div>
                            </div>

                        </div>
                        <div className={ styles.buttonContainer }>
                            <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                                { ({ status }) => (
                                    <Button disabled={ invalid || !(dirty || !!image) } feedback={ status }>Save changes</Button>
                                ) }
                            </ButtonPromiseState>
                        </div>
                    </form>
                ) }
            </Form>
        );
    }

    // We are controlling this input manually to avoid installing third-party libs.
    // Check this issue here: https://github.com/final-form/react-final-form/issues/92
    handleAvatarInputChange = (imageFile) => {
        this.setState({ image: imageFile });
    };

    handleSubmit = (data) => {
        console.log('Submitted data', data);
        console.log('Uploaded image', this.state.image);
        const promise = new Promise((resolve) => setTimeout(resolve, 500));

        this.setState({ promise });
    };

    handleSettle = ({ status }) => {
        switch (status) {
        case 'fulfilled':
            this.props.onRequestClose();
            break;
        case 'rejected':
            this.setState({ promise: undefined });
            break;
        default:
            break;
        }
    };
}

ProfileForm.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    profileInfo: PropTypes.object.isRequired,
};

export default ProfileForm;
