/* eslint-disable prefer-import/prefer-import-over-require */
const path = require('path');
const fs = require('fs');
const { getLoaders, loaderByName, addBeforeLoader } = require('@craco/craco');

module.exports = {
    style: {
        postcss: {
            mode: 'file',
        },
    },
    plugins: [
        // Setup aliases
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    // Make react hooks work when libraries are linked: https://github.com/webpack/webpack/issues/8607
                    webpackConfig.resolve.alias.react = require.resolve('react');

                    return webpackConfig;
                },
            },
        },
        // Setup babel-loader to use babel.config.js
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    // Search for all instances of babel-loader
                    const { matches } = getLoaders(
                        webpackConfig,
                        loaderByName('babel-loader'),
                    );

                    const rules = matches.map((match) => match.loader);
                    const appRule = rules.find((rule) => rule.include === path.resolve('src'));

                    // If we can't find the loader then throw an error
                    if (!appRule) {
                        throw new Error('Could not find babel-loader entry for src/');
                    }

                    // Enable babelrc and clear any presets
                    appRule.options.configFile = true;
                    delete appRule.options.presets;

                    return webpackConfig;
                },
            },
        },
        // Change css rule to apply CSS modules to all CSS files, even without the .module.css extension
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
                    // Find 'oneOf' rule of the CRA config, which contains all the rules of files
                    const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);

                    if (!oneOfRule) {
                        throw new Error(`'oneOf' rule not found under module.rules in the ${env} webpack config`);
                    }

                    // Find .module.css files rule and remove it
                    // We will later add it before the generic `css` one
                    const moduleCssRuleIndex = oneOfRule.oneOf.findIndex(
                        (rule) => rule.test && rule.test.toString().includes('\\.module\\.css')
                    );
                    const moduleCssRule = oneOfRule.oneOf[moduleCssRuleIndex];

                    if (!moduleCssRule) {
                        throw new Error('Could not find \'.module.css\'  rule in \'oneOf\' set of rules');
                    }

                    oneOfRule.oneOf.splice(moduleCssRuleIndex, 1);

                    // Find generic `css` rule add the newModuleCssRule before it
                    // Aso remove the `exclude` of the generic `css` rule because it's no longer necessary
                    const cssRuleIndex = oneOfRule.oneOf.findIndex(
                        (rule) => rule.test && rule.test.toString().startsWith('/\\.css')
                    );
                    const cssRule = oneOfRule.oneOf[cssRuleIndex];

                    if (!cssRule) {
                        throw new Error('Could not find \'.css\'  rule in \'oneOf\' set of rules');
                    }

                    delete cssRule.exclude;

                    const newModuleCssRule = {
                        test: /\.css$/,
                        include: [
                            path.resolve('src'),
                            fs.realpathSync('node_modules/@nomios/web-uikit'),
                        ],
                        exclude: [
                            fs.realpathSync('node_modules/@nomios/web-uikit/node_modules'),
                        ],
                        use: moduleCssRule.use,
                    };

                    oneOfRule.oneOf.splice(cssRuleIndex, 0, newModuleCssRule);

                    return webpackConfig;
                },
            },
        },

        // Setup loader for svg files
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    const svgLoader = {
                        test: /\.svg$/,
                        use: [
                            {
                                loader: require.resolve('raw-loader'),
                            },
                            {
                                loader: require.resolve('svgo-loader'),
                                options: {
                                    plugins: [
                                        { removeTitle: true },
                                        { removeDimensions: true },
                                        { removeViewBox: false },
                                        { cleanupIDs: false },
                                    ],
                                },
                            },
                            // Uniquify classnames and ids so that they are unique and
                            // don't conflict with each other
                            {
                                loader: require.resolve('svg-css-modules-loader'),
                                options: {
                                    transformId: true,
                                    localIdentName: '[name]__[local]',
                                },
                            },
                        ],
                    };

                    addBeforeLoader(webpackConfig, loaderByName('file-loader'), svgLoader);

                    return webpackConfig;
                },
            },
        },
    ],
};
