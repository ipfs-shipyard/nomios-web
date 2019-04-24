import React from 'react';
import PropTypes from 'prop-types';

import { FlowModalStep } from '@nomios/web-uikit';

const IdentityInfo = (props) => (
    <FlowModalStep id={ props.id }><p>IdentityInfo</p></FlowModalStep>
);

IdentityInfo.propTypes = {
    id: PropTypes.string.isRequired,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityInfo;
