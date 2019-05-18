import React from 'react';
import SetupDeviceStep from '../../../../shared/steps/setup-device-step';

const stepData = {
    title: '2. Setup your device',
    description: 'To complete your identity creation you must enter your device name and select which type of device are you on.',
    buttonText: 'Continue',
};

const IdentityDevice = (props) => <SetupDeviceStep { ...props } stepData={ stepData } />;

export default IdentityDevice;
