import React from 'react';
import { UserIcon, EntityIcon, OtherIcon, CheckmarkIcon } from '@nomios/web-uikit';

export default [
    {
        id: 'person',
        label: 'Person',
        badge: <CheckmarkIcon />,
        icon: <UserIcon />,
        avatarLabel: 'Add photo',
        inputLabel: 'Your name',
        inputPlaceholder: 'Enter your name',
    },
    {
        id: 'organization',
        label: 'Organization',
        badge: <CheckmarkIcon />,
        icon: <EntityIcon />,
        avatarLabel: 'Add logo',
        inputLabel: 'Organization name',
        inputPlaceholder: 'Enter organization name',
    },
    {
        id: 'other',
        label: 'Other',
        badge: <CheckmarkIcon />,
        icon: <OtherIcon />,
        avatarLabel: 'Add image',
        inputLabel: 'Name',
        inputPlaceholder: 'Enter the name',
    },
];
