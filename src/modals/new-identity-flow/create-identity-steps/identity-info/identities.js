import React from 'react';
import { UserIcon, EntityIcon, OtherIcon, CheckmarkIcon } from '@nomios/web-uikit';

export default [
    {
        id: 'Person',
        label: 'Person',
        badge: <CheckmarkIcon />,
        icon: <UserIcon />,
        avatarLabel: 'Add photo',
        inputLabel: 'Your name',
        inputPlaceholder: 'Enter your name',
    },
    {
        id: 'Organization',
        label: 'Organization',
        badge: <CheckmarkIcon />,
        icon: <EntityIcon />,
        avatarLabel: 'Add logo',
        inputLabel: 'Organization name',
        inputPlaceholder: 'Enter organization name',
    },
    {
        id: 'Thing',
        label: 'Other',
        badge: <CheckmarkIcon />,
        icon: <OtherIcon />,
        avatarLabel: 'Add image',
        inputLabel: 'Name',
        inputPlaceholder: 'Enter the name',
    },
];
