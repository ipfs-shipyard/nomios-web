import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextButton, EyeIcon } from '@nomios/web-uikit';
import styles from './CodeBlock.css';

class CodeBlock extends Component {
    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.container, className) }>
                <TextButton
                    variant="small"
                    icon={ <EyeIcon className={ styles.icon } /> }
                    className={ styles.textButton }
                    onClick={ this.handlePreviewClick }>
                    Preview
                </TextButton>
                <pre className={ styles.pre }><code>{ this.stringifyData() }</code></pre>
            </div>
        );
    }

    stringifyData() {
        const { data } = this.props;

        return ArrayBuffer.isView(data) ? '<Binary>' : JSON.stringify(data, null, 4);
    }

    handlePreviewClick = () => alert('Not implemented yet');
}

CodeBlock.propTypes = {
    data: PropTypes.any.isRequired,
    className: PropTypes.string,
};

export default CodeBlock;
