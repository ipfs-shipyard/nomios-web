import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { DesktopIcon, LaptopIcon, TabletIcon, MobileIcon } from '@nomios/Web-uikit';
import StatusIndicator from './shared/StatusIndicator';
import GenericItem from './shared/GenericItem';
import GenericList from './shared/GenericList';

function iconFromDevicetype(type) {
    switch (type) {
    case 'desktop':
        return <DesktopIcon />;
    case 'laptop':
        return <LaptopIcon />;
    case 'tablet':
        return <TabletIcon />;
    case 'mobile':
        return <MobileIcon />;
    default:
        return null;
    }
}

function statusFromDeviceStatus(device) {
    if (device.privateKey) {
        return {
            text: 'Current',
            class: 'current',
        };
    }

    if (device.revokedAt) {
        return {
            text: 'Revoked',
            class: 'revoked',
        };
    }

    return {
        text: 'Other',
        class: 'offline',
    };
}

const DeviceItem = (props) => {
    const { device, ...rest } = props;

    const deviceIcon = iconFromDevicetype(device.type);
    const deviceStatus = statusFromDeviceStatus(device);

    const status = <StatusIndicator text={ deviceStatus.text } status={ deviceStatus.class } dotSide="right" />;

    return (
        <GenericItem
            icon={ deviceIcon }
            content={ device.name }
            status={ status }
            { ...rest } />
    );
};

DeviceItem.propTypes = {
    device: PropTypes.object.isRequired,
};

const DevicesBox = (props) => {
    const { getDevices, matchId } = props;

    const devices = getDevices(matchId);

    return (
        <GenericList>
            { devices.map((device, index) =>
                <DeviceItem device={ device } key={ index } />
            )}
        </GenericList>
    );
};

DevicesBox.propTypes = {
    matchId: PropTypes.string.isRequired,
    getDevices: PropTypes.func.isRequired,
};

export default connectIdmWallet((idmWallet) => {
    const getDevices = (params) => idmWallet.identities.get(params).devices.list();

    return () => ({
        getDevices,
    });
})(DevicesBox);
