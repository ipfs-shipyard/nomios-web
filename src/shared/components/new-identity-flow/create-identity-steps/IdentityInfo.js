import React from 'react';
import PropTypes from 'prop-types';

import { ModalStep } from '@nomios/web-uikit';

const IdentityInfo = (props) => (
    <ModalStep id={ props.id }><p>IdentityInfo</p></ModalStep>
);

IdentityInfo.propTypes = {
    id: PropTypes.string.isRequired,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityInfo;
