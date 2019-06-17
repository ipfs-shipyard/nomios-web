import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';

const THROTTLE_TIME = 10000;
const EVENT_LISTENERS_OPTIONS = { capture: true, passive: true };

const ActivityDetector = ({ onDetect }) => {
    onDetect = useMemo(() => throttle(() => onDetect, THROTTLE_TIME), [onDetect]);

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

export default ActivityDetector;
