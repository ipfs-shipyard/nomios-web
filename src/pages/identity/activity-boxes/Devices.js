import React from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import devices from '../../../shared/data/devices';
import StatusIndicator from './shared/StatusIndicator';
import GenericItem from './shared/GenericItem';
import GenericList from './shared/GenericList';

function deviceDataFromId(id) {
    return devices.filter((device) => device.id === id)[0];
}

function statusFromDeviceStatus(device) {
    if (device.keyMaterial.privateKeyPem) {
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

    const deviceIcon = deviceDataFromId(device.type).icon;
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
    const { devices } = props;

    return (
        <GenericList>
            { devices.map((device, index) =>
                <DeviceItem device={ device } key={ index } />
            )}
        </GenericList>
    );
};

DevicesBox.propTypes = {
    id: PropTypes.string.isRequired,
    devices: PropTypes.array.isRequired,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    devices: idmWallet.identities.get(ownProps.id).devices.list(),
}))(DevicesBox);
