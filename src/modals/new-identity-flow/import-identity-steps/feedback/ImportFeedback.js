import React from 'react';

import FeedbackStep from '../../common-steps/feedback-step';

const stepData = {
    loadingText: 'Please wait while we import your identity...',
    success: {
        title: 'Welcome! Your identity was imported sucessfully, against all odds.',
        message: 'Your ID is ready and secure, you\'ll be redirected to <Nomios> homepage, please wait, thank you for your patience.',
    },
    error: {
        title: 'Oops...',
        message: 'Looks like something went wrong while importing your identity.',
    },
};

const ImportFeedback = (props) => <FeedbackStep { ...props } stepData={ stepData } />;

export default ImportFeedback;
