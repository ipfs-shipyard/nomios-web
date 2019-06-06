import React from 'react';
import { MobileIcon, TabletIcon, LaptopIcon, DesktopIcon } from '@nomios/web-uikit';

export default [
    {
        id: 'phone',
        label: 'Mobile',
        icon: <MobileIcon />,
    },
    {
        id: 'tablet',
        label: 'Tablet',
        icon: <TabletIcon />,
    },
    {
        id: 'laptop',
        label: 'Laptop',
        icon: <LaptopIcon />,
    },
    {
        id: 'desktop',
        label: 'Desktop',
        icon: <DesktopIcon />,
    },
];
