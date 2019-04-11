import React from 'react';
import PropTypes from 'prop-types';

import { ModalStep } from '@nomios/web-uikit';

const IdentityType = (props) => (
    <ModalStep id={ props.id }><p>IdentityType</p></ModalStep>
);

IdentityType.propTypes = {
    id: PropTypes.string.isRequired,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityType;
