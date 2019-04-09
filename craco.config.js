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
        // Setup babel-loader to use babel.config.js
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    // Search for all instances of babel-loader
                    const { hasFoundAny, matches } = getLoaders(
                        webpackConfig,
                        loaderByName('babel-loader'),
                    );

                    // If we can't find the loader then throw an error.
                    if (!hasFoundAny) {
                        throw new Error('Could not find babel-loader');
                    }

                    // Loop through each match, enabling babelrc and clearing any presets
                    matches.forEach(({ loader }) => {
                        loader.options = loader.options || {};
                        loader.options.configFile = true;
                        delete loader.options.presets;
                    });

                    return webpackConfig;
                },
            },
        },
        // Change css rule to apply CSS modules to all CSS files, even without the .module.css extension
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
                    const newModuleCssRule = {
                        test: /\.css$/,
                        include: [
                            path.resolve('src'),
                            fs.realpathSync('node_modules/@nomios/web-uikit'),
                        ],
                    };

                    // Find 'oneOf' rule
                    const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);

                    // Throw an error if 'oneOf' rule is not found
                    if (!oneOfRule) {
                        throw new Error(`'oneOf' rule not found under module.rules in the ${env} webpack config`);
                    }

                    // Find .module.css files rule
                    const moduleCssRule = oneOfRule.oneOf.find(
                        (rule) => rule.test && rule.test.toString().includes('.module')
                    );
                    // Find .css files rule
                    const cssRule = oneOfRule.oneOf.find(
                        (rule) => rule.test && rule.test.toString().includes('.css') && !rule.test.toString().includes('.module')
                    );

                    // Update .module.css files rule
                    moduleCssRule.test = newModuleCssRule.test;
                    moduleCssRule.include = newModuleCssRule.include;

                    // Update .css files rule
                    cssRule.exclude = newModuleCssRule.include;

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
                                loader: 'raw-loader',
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
                                loader: 'svg-css-modules-loader',
                                options: {
                                    transformId: true,
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
