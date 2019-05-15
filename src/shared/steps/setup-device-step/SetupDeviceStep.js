/* eslint-disable react/jsx-handler-names */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSpy } from 'react-final-form';

import { Button, TypeGroup, TypeOption, TextInput, EditIcon } from '@nomios/web-uikit';
import FaderContainer from '../../components/fader-container';
import { notEmpty } from '../../form-validators';
import { deviceInfo } from './deviceInfo';
import devices from './devices';
import { capitalize } from '../../utils';

import styles from './SetupDeviceStep.css';

const SUBSTEP_TRANSITION_DELAY = 300;
const DEVICE_INFO_FALLBACK = {
    type: 'desktop',
    nameSufix: 'Device',
};

class SetupDeviceStep extends Component {
    state = {
        selectedOption: null,
        activeSubStepIndex: 1,
    };

    formRef = createRef();

    constructor(props) {
        super(props);

        this.detectedDeviceInfo = deviceInfo ? deviceInfo : DEVICE_INFO_FALLBACK;
        this.selectedDeviceInfo = this.getSelectedDeviceInfo(this.detectedDeviceInfo.type);
        this.formInitialValues = {
            'identity-device': this.selectedDeviceInfo.id,
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.identityFirstName && this.props.identityFirstName) {
            this.setTextInputValue(this.props.identityFirstName, this.detectedDeviceInfo.nameSufix);
        }

        if (prevProps.identityFirstName !== this.props.identityFirstName) {
            const sufix = !this.state.selectedOption ? this.detectedDeviceInfo.nameSufix : this.selectedDeviceInfo.label;
            const prevDeviceName = this.getDefaultDeviceName(prevProps.identityFirstName, sufix);
            const currentDeviceName = this.formRef.current.form.getFieldState('device-name').value;

            if (prevDeviceName === currentDeviceName) {
                this.setTextInputValue(this.props.identityFirstName, this.selectedDeviceInfo.label);
            }
        }
    }

    componentWillUnmount() {
        this.substepTransitionTimeout && clearTimeout(this.substepTransitionTimeout);
    }

    render() {
        const { stepData: { title, description, buttonText } } = this.props;
        const { activeSubStepIndex } = this.state;
        const { label, icon } = this.selectedDeviceInfo;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>{ title }</h2>
                <p>{ description }</p>

                <Form
                    ref={ this.formRef }
                    initialValues={ this.formInitialValues }
                    onSubmit={ this.handleOnSubmit }>
                    { ({ handleSubmit, invalid }) => (
                        <form autoComplete="off" onSubmit={ handleSubmit }>
                            <FormSpy onChange={ this.handleFormChange } />
                            <FaderContainer activeIndex={ activeSubStepIndex }>
                                { this.renderTypeGroupField() }
                                <div className={ styles.deviceInfoWrapper }>
                                    <TypeOption
                                        label={ label }
                                        selected
                                        badge={ <EditIcon /> }
                                        onClick={ this.handleTypeOptionClick }>
                                        { icon }
                                    </TypeOption>
                                    <Field
                                        name="device-name"
                                        validate={ notEmpty }>
                                        { ({ input }) => (
                                            <TextInput
                                                { ...input }
                                                className={ styles.textInput }
                                                label="Device name"
                                                placeholder="Enter device name" />
                                        ) }
                                    </Field>
                                </div>
                            </FaderContainer>
                            <div className={ styles.buttonWrapper }>
                                <Button disabled={ activeSubStepIndex === 0 || invalid }>
                                    { buttonText }
                                </Button>
                            </div>
                        </form>
                    ) }
                </Form>
            </div>
        );
    }

    renderDevices() {
        return (
            devices.map((device, index) => (
                <TypeOption key={ index } id={ device.id } label={ device.label } badge={ device.badge }>
                    { device.icon }
                </TypeOption>
            ))
        );
    }

    renderTypeGroupField() {
        const { selectedOption } = this.state;

        return (
            <Field name="identity-device">
                { ({ input, meta }) => {
                    if (!meta.data.handleOnChange) {
                        meta.data.handleOnChange = (selectedId) => {
                            input.onChange(selectedId);
                            this.handleSelectIndentityDevice(selectedId);
                        };
                    }

                    return (
                        <TypeGroup
                            selectedId={ selectedOption }
                            className={ styles.typeGroup }
                            name={ input.name }
                            onSelect={ meta.data.handleOnChange } >
                            { this.renderDevices() }
                        </TypeGroup>
                    );
                } }
            </Field>
        );
    }

    getSelectedDeviceInfo(id) {
        return devices.filter((device) => device.id === id)[0];
    }

    getDefaultDeviceName(name, sufix) {
        return `${name}'s ${capitalize(sufix)}`;
    }

    setTextInputValue(name, sufix) {
        const deviceName = this.getDefaultDeviceName(name, sufix);

        this.formRef.current.form.change('device-name', deviceName);
    }

    handleTypeOptionClick = () => {
        this.setState({ activeSubStepIndex: 0, selectedOption: null });
    };

    handleSelectIndentityDevice = (selectedId) => {
        this.setState({
            selectedOption: selectedId,
        }, () => {
            this.substepTransitionTimeout = setTimeout(() => {
                this.setState({ activeSubStepIndex: 1 });
            }, SUBSTEP_TRANSITION_DELAY);
        });
    };

    handleFormChange = ({ modified, values }) => {
        if (modified['identity-device']) {
            const prevDeviceName = this.getDefaultDeviceName(this.props.identityFirstName, this.selectedDeviceInfo.label);
            const currentDeviceName = values['device-name'];

            if (prevDeviceName === currentDeviceName) {
                this.selectedDeviceInfo = this.getSelectedDeviceInfo(values['identity-device']);

                this.setTextInputValue(this.props.identityFirstName, this.selectedDeviceInfo.label);
            }
        }
    };

    handleOnSubmit = (formData) => {
        this.props.onNextStep && this.props.onNextStep(this.props.nextStepId, formData);
    };
}

SetupDeviceStep.propTypes = {
    identityFirstName: PropTypes.string,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
    stepData: PropTypes.shape({
        description: PropTypes.string,
        buttonText: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};

export default SetupDeviceStep;
