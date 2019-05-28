/* eslint-disable prefer-import/prefer-import-over-require */

module.exports = (api) => {
    api.cache(false);

    return require('babel-preset-moxy/end-project')(api, {
        modules: false,
        react: true,
        loose: false, // Need this to be false, otherwise bip39 library fails
        targets: ['browsers'],
    });
};
