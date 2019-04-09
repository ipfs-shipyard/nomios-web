/* eslint-disable prefer-import/prefer-import-over-require */
const path = require('path');
const BabelRcPlugin = require('@jackwilsdon/craco-use-babelrc');

module.exports = {
    style: {
        postcss: {
            mode: 'file',
        },
    },
    plugins: [
        { plugin: BabelRcPlugin },
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
                    const newModuleCssRule = {
                        test: /\.css$/,
                        include: [
                            path.resolve('src'),
                            path.resolve('node_modules/@nomios/web-uikit'),
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
    ],
};
