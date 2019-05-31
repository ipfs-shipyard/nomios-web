import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { connectIdmWallet } from 'react-idm-wallet';

const THROTTLE_TIME = 10000;
const EVENT_LISTENERS_OPTIONS = { capture: true, passive: true };

const ActivityDetector = ({ onDetect }) => {
    useEffect(() => {
        document.addEventListener('keydown', onDetect, EVENT_LISTENERS_OPTIONS);
        document.addEventListener('mousemove', onDetect, EVENT_LISTENERS_OPTIONS);
        document.addEventListener('touchstart', onDetect, EVENT_LISTENERS_OPTIONS);

        return () => {
            document.removeEventListener('keydown', onDetect, EVENT_LISTENERS_OPTIONS);
            document.removeEventListener('mousemove', onDetect, EVENT_LISTENERS_OPTIONS);
            document.removeEventListener('touchstart', onDetect, EVENT_LISTENERS_OPTIONS);
        };
    }, [onDetect]);

    return null;
};

ActivityDetector.propTypes = {
    onDetect: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    // Avoid calling `locker.idleTimer.restart` on every detection because it will cause
    // every `connectIdmWallet` function to re-run
    const restartIdleTimer = throttle(() => idmWallet.locker.idleTimer.restart(), THROTTLE_TIME);

    return () => ({ onDetect: restartIdleTimer });
})(ActivityDetector);
