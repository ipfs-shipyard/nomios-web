/* eslint-disable react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { omit } from 'lodash';
import { Form, Field } from 'react-final-form';
import nationalities from 'ms-nationalities';
import { readAsArrayBuffer } from 'promise-file-reader';
import { TextInput, Button, AutocompleteSelect, Radio, AvatarPicker, UserIcon } from '@nomios/web-uikit';
import { ButtonPromiseState } from '../../../shared/components/button-promise-state';
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
        profileDetails: undefined,
    };

    constructor(props) {
        super(props);

        this.state.profileDetails = props.profileDetails;
    }

    render() {
        const { promise, image, profileDetails } = this.state;

        const initialValues = omit(profileDetails, '@context', '@type', 'image');

        return (
            <Form
                initialValues={ initialValues }
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
                                        <Field name="gender" type="radio" value="Male">
                                            { ({ input }) => <Radio { ...input } label="Male" /> }
                                        </Field>
                                        <Field name="gender" type="radio" value="Female">
                                            { ({ input }) => <Radio { ...input } label="Female" /> }
                                        </Field>
                                        <Field name="gender" type="radio" value="Other">
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
                                            image={ profileDetails.image }
                                            name={ profileDetails.name }
                                            icon={ <UserIcon /> }
                                            label="Change photo"
                                            labelAlignment="right"
                                            onChange={ this.handleAvatarInputChange } />
                                    </div>
                                </div>
                                <div className={ classNames(styles.field, styles.location) }>
                                    <label className={ styles.label }>Location</label>
                                    <Field name="address">
                                        { ({ input }) => (
                                            <LocationInput
                                                { ...input }
                                                onLocationInferred={ form.change }
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

    async updateIdentity(data) {
        const { saveProfile } = this.props;

        const properties = {
            name: undefined,
            nationality: undefined,
            gender: undefined,
            address: undefined,
            ...data,
        };

        if (this.state.image) {
            properties.image = {
                type: this.state.image.type,
                data: await readAsArrayBuffer(this.state.image),
            };
        }

        return saveProfile(properties);
    }

    // We are controlling this input manually to avoid installing third-party libs.
    // Check this issue here: https://github.com/final-form/react-final-form/issues/92
    handleAvatarInputChange = (imageFile) => {
        this.setState({ image: imageFile });
    };

    handleSubmit = (data) => {
        this.setState({ promise: this.updateIdentity(data) });
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
    profileDetails: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired,
};

export default ProfileForm;
