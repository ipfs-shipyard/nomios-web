import { isMobile, isMobileOnly, mobileVendor } from 'react-device-detect';

let deviceInfo;

const getDeviceType = async () => {
    if (!navigator.getBattery) {
        return 'desktop';
    }

    let battery;

    try {
        battery = await navigator.getBattery();
    } catch (err) {
        return 'desktop';
    }

    if (battery.charging && battery.chargingTime === 0) {
        return 'desktop';
    }

    return 'laptop';
};

const getDeviceInfo = async () => {
    // isMobile returns true if device type is mobile or tablet
    if (isMobile) {
        const type = isMobileOnly ? 'mobile' : 'tablet';
        const mobileName = mobileVendor !== 'none' ? mobileVendor : type;

        return {
            type,
            nameSufix: mobileName,
        };
    }

    const type = await getDeviceType();

    deviceInfo = {
        type,
        nameSufix: type,
    };

    return deviceInfo;
};

getDeviceInfo();

export default getDeviceInfo;
export { deviceInfo };
