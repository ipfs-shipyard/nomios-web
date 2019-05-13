import React from 'react';
import PropTypes from 'prop-types';

import SetupDeviceStep from '../../../../shared/steps/setup-device-step';

const stepData = {
    title: '2. Setup your device',
    description: 'To complete your identity creation you must enter your device name and select which type of device are you on.',
    buttonText: 'Continue',
};

const IdentityInfo = (props) => <SetupDeviceStep { ...props } stepData={ stepData } />;

IdentityInfo.propTypes = {
    identityFirstName: PropTypes.string,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityInfo;
