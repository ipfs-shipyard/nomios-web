/* eslint-disable prefer-import/prefer-import-over-require */

module.exports = (api) => {
    api.cache(false);

    return require('babel-preset-moxy/end-project')(api, {
        modules: false,
        react: true,
        targets: ['browsers'],
    });
};
