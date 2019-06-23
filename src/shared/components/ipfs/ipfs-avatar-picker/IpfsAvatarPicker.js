import React from 'react';
import PropTypes from 'prop-types';
import { AvatarPicker } from '@nomios/web-uikit';
import IpfsUrl from '../ipfs-url';

const IpfsAvatarPicker = ({ image, ...rest }) => {
    if (!image) {
        return <AvatarPicker { ...rest } />;
    }

    return (
        <IpfsUrl input={ image }>
            { ({ status, value }) => (
                <AvatarPicker
                    image={ status === 'fulfilled' ? value : undefined }
                    { ...rest } />
            ) }
        </IpfsUrl>
    );
};

IpfsAvatarPicker.propTypes = {
    image: PropTypes.string,
};

export default IpfsAvatarPicker;
