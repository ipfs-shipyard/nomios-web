import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { TextButton, EyeIcon } from '@nomios/web-uikit';
import customTheme from './customTheme';
import styles from './CodeBlock.css';

class CodeBlock extends Component {
    render() {
        const { className, language } = this.props;

        return (
            <div className={ classNames(styles.container, className) }>
                <TextButton
                    icon={ <EyeIcon className={ styles.icon } /> }
                    className={ styles.textButton }
                    onClick={ this.handlePreviewClick }>
                    Preview
                </TextButton>
                <SyntaxHighlighter language={ language } style={ customTheme }>
                    { this.stringifyData() }
                </SyntaxHighlighter>
            </div>
        );
    }

    stringifyData() {
        const { data } = this.props;

        return ArrayBuffer.isView(data) ? '"<Binary>"' : JSON.stringify(data, null, 2);
    }

    handlePreviewClick = () => alert('Not implemented yet');
}

CodeBlock.propTypes = {
    data: PropTypes.any.isRequired,
    className: PropTypes.string,
    language: PropTypes.string,
};

CodeBlock.defaultProps = {
    language: 'json',
};

export default CodeBlock;
