import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';

import { Button, TypeGroup, TypeOption, TextInput, EditIcon } from '@nomios/web-uikit';
import FaderContainer from '../../components/fader-container';
import { notEmpty } from '../../form-validators';
import { deviceInfo } from './deviceInfo';
import devices from './devices';

import styles from './SetupDeviceStep.css';

const SUBSTEP_TRANSITION_DELAY = 300;
const DEVICE_INFO_FALLBACK = {
    type: 'Desktop',
    nameSufix: 'Device',
};

class SetupDeviceStep extends Component {
    state = {
        activeSubStepIndex: 1,
        selectedOption: null,
        shouldRenderForm: false,
        selectedDeviceInfo: null,
        deviceData: {
            type: null,
            name: null,
        },
    };

    constructor(props) {
        super(props);

        this.detectedDeviceInfo = deviceInfo ? deviceInfo : DEVICE_INFO_FALLBACK;
        this.state.deviceData = {
            type: this.detectedDeviceInfo.type.toLowerCase(),
            name: this.getDefaultDeviceName(props.identityFirstName, this.detectedDeviceInfo.nameSufix),
        };
        this.state.selectedDeviceInfo = this.getSelectedDeviceInfo(this.detectedDeviceInfo.type.toLowerCase());
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.identityFirstName !== this.props.identityFirstName) {
            const newState = { ...this.state };
            const sufix = !this.state.selectedOption ? this.detectedDeviceInfo.nameSufix : this.state.selectedDeviceInfo.label;
            const defaultDeviceName = this.getDefaultDeviceName(prevProps.identityFirstName, sufix);

            if (defaultDeviceName === this.state.deviceData.name) {
                const deviceData = {
                    ...this.state.deviceData,
                    name: this.getDefaultDeviceName(this.props.identityFirstName, prevState.selectedDeviceInfo.label),
                };

                newState.deviceData = deviceData;
            }

            if (!prevProps.identityFirstName && this.props.identityFirstName && !this.state.shouldRenderForm) {
                newState.shouldRenderForm = true;
            }

            this.setState(newState);
        } else if (prevState.deviceData.type !== this.state.deviceData.type) {
            const defaultDeviceName = this.getDefaultDeviceName(this.props.identityFirstName, prevState.selectedDeviceInfo.label);

            if (defaultDeviceName === this.state.deviceData.name) {
                this.setState((prevState) => ({
                    deviceData: {
                        ...prevState.deviceData,
                        name: this.getDefaultDeviceName(this.props.identityFirstName, this.state.selectedDeviceInfo.label),
                    },
                }));
            }
        }
    }

    render() {
        const { stepData: { title, description, buttonText } } = this.props;
        const {
            selectedDeviceInfo: { icon, label },
            deviceData: { name },
            activeSubStepIndex,
            shouldRenderForm,
            selectedOption,
        } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>{ title }</h2>
                <p>{ description }</p>
                { shouldRenderForm &&
                    <Form onSubmit={ this.handleOnSubmit }>
                        { ({ handleSubmit, invalid }) => (
                            <form autoComplete="off" onSubmit={ handleSubmit }>
                                <FaderContainer activeIndex={ activeSubStepIndex }>
                                    <TypeGroup
                                        selectedId={ selectedOption }
                                        className={ styles.typeGroup }
                                        name="identity-device"
                                        onSelect={ this.handleSelectIndentityDevice }>
                                        { this.renderDevices() }
                                    </TypeGroup>
                                    <div className={ styles.deviceInfoWrapper }>
                                        <TypeOption
                                            label={ label }
                                            selected
                                            badge={ <EditIcon /> }
                                            onClick={ this.handleTypeOptionClick }>
                                            { icon }
                                        </TypeOption>
                                        <Field
                                            name="deviceName"
                                            validate={ notEmpty }
                                            initialValue={ name }>
                                            { (data) => this.renderTextInput(data) }
                                        </Field>
                                    </div>
                                </FaderContainer>
                                <div className={ styles.buttonWrapper }>
                                    <Button
                                        disabled={ activeSubStepIndex === 0 || invalid }>
                                        { buttonText }
                                    </Button>
                                </div>
                            </form>
                        ) }
                    </Form>
                }
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

    renderTextInput({ input, meta }) {
        if (!meta.data.handleOnChange) {
            meta.data.handleOnChange = (event) => {
                input.onChange(event);
                this.handleTextInputChange(event);
            };
        }

        return (
            <TextInput
                { ...input }
                value={ this.state.deviceData.name }
                onChange={ meta.data.handleOnChange }
                className={ styles.textInput }
                label="Device name"
                placeholder="Enter device name" />
        );
    }

    getSelectedDeviceInfo(id) {
        return devices.filter((device) => device.id === id)[0];
    }

    getDefaultDeviceName(name, sufix) {
        return `${name}'s ${sufix}`;
    }

    deviceNameValidator = (value) => !value ? 'This field is mandatory' : undefined;

    handleSelectIndentityDevice = (deviceTypeId) => {
        this.setState((prevState) => ({
            selectedDeviceInfo: this.getSelectedDeviceInfo(deviceTypeId),
            deviceData: { ...prevState.deviceData, type: deviceTypeId },
            selectedOption: deviceTypeId,
        }), () => {
            this.substepTransitionTimeout = setTimeout(() => {
                this.setState({ activeSubStepIndex: 1 });
            }, SUBSTEP_TRANSITION_DELAY);
        });
    };

    handleTextInputChange = (event) => {
        const name = event.target.value;

        this.setState((prevState) => ({
            deviceData: {
                ...prevState.deviceData,
                name,
            },
        }));
    };

    handleTypeOptionClick = () => {
        this.setState({ activeSubStepIndex: 0, selectedOption: null });
    };

    handleOnSubmit = () => {
        this.props.onNextStep && this.props.onNextStep(this.props.nextStepId, this.state.deviceData);
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
