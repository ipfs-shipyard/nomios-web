import SetPassphrase from './set-passphrase/SetPassphrase';
import SetTimeout from './set-timeout/SetTimeout';

const setupLockerSteps = [
    {
        component: SetPassphrase,
        props: {
            id: 'passphrase',
            nextStepId: 'timeout',
        },
    },
    {
        component: SetTimeout,
        props: {
            id: 'timeout',
        },
    },
];

export default setupLockerSteps;
