import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@nomios/web-uikit';
import IpfsUrl from '../ipfs-url';

const IpfsAvatar = ({ image, ...rest }) => {
    if (!image) {
        return <Avatar { ...rest } />;
    }

    return (
        <IpfsUrl input={ image }>
            { ({ status, value }) => (
                <Avatar
                    image={ status === 'fulfilled' ? value : undefined }
                    { ...rest } />
            ) }
        </IpfsUrl>
    );
};

IpfsAvatar.propTypes = {
    image: PropTypes.string,
};

export default IpfsAvatar;
