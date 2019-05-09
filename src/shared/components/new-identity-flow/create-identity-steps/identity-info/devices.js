import React from 'react';
import { MobileIcon, TabletIcon, LaptopIcon, DesktopIcon, CheckmarkIcon } from '@nomios/web-uikit';

export default [
    {
        id: 'mobile',
        label: 'Mobile',
        badge: <CheckmarkIcon />,
        icon: <MobileIcon />,
    },
    {
        id: 'tablet',
        label: 'Tablet',
        badge: <CheckmarkIcon />,
        icon: <TabletIcon />,
    },
    {
        id: 'laptop',
        label: 'Laptop',
        badge: <CheckmarkIcon />,
        icon: <LaptopIcon />,
    },
    {
        id: 'desktop',
        label: 'Desktop',
        badge: <CheckmarkIcon />,
        icon: <DesktopIcon />,
    },
];
