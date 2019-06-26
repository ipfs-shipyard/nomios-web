import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const customTomorrow = {
    ...tomorrow,
    'pre[class*="language-"]': {
        ...tomorrow['pre[class*="language-"]'],
        margin: 0,
        width: '100%',
        height: '100%',
        background: 'none',
    },
};

export default customTomorrow;
