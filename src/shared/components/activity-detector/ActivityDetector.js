import { useEffect } from 'react';
import PropTypes from 'prop-types';

const eventListenerOptions = { capture: true, passive: true };

const ActivityDetector = ({ onDetect }) => {
    useEffect(() => {
        document.addEventListener('keydown', onDetect, eventListenerOptions);
        document.addEventListener('mousemove', onDetect, eventListenerOptions);
        document.addEventListener('touchstart', onDetect, eventListenerOptions);

        return () => {
            document.removeEventListener('keydown', onDetect, eventListenerOptions);
            document.removeEventListener('mousemove', onDetect, eventListenerOptions);
            document.removeEventListener('touchstart', onDetect, eventListenerOptions);
        };
    }, [onDetect]);

    return null;
};

ActivityDetector.propTypes = {
    onDetect: PropTypes.func.isRequired,
};

export default ActivityDetector;
