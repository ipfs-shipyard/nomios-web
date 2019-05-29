import React from 'react';
import { SetupDeviceStep } from '../../common-steps';

const stepData = {
    title: '2. Your Device Details',
    description: 'You will be importing this identity to this device.',
    buttonText: 'Continue',
};

const IdentityDevice = (props) => <SetupDeviceStep { ...props } stepData={ stepData } />;

export default IdentityDevice;
