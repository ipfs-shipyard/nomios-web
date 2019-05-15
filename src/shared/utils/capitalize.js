const capitalize = (string) => {
    if (typeof string !== 'string') {
        console.error('A valid string must be provided');

        return;
    }

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default capitalize;
