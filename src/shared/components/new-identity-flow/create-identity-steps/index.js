import IdentityType from './IdentityType';
import IdentityInfo from './IdentityInfo';

const createIdentitySteps = [
    {
        component: IdentityType,
        props: {
            id: 'create-identity-type',
            nextStepId: 'create-identity-info',
        },
    },
    {
        component: IdentityInfo,
        props: {
            id: 'create-identity-info',
            nextStepId: 'create-identity-info',
        },
    },
];

export default createIdentitySteps;
