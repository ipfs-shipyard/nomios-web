import React from 'react';
import { FeedbackStep } from '../../common-steps';

const stepData = {
    loadingText: 'Please wait while we create your identity...',
    success: {
        title: 'Welcome! Your identity was created sucessfully, against all odds.',
        message: 'Your ID is ready and secure, but you must record your Secret Recovery Key to add new devices and backup this identity.',
    },
    error: {
        title: 'Oops...',
        message: 'Looks like something went wrong.',
    },
};

const Feedback = (props) => <FeedbackStep { ...props } stepData={ stepData } />;

export default Feedback;
