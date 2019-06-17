import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { TextButton, CopyIcon } from '@nomios/web-uikit';
import styles from './MnemonicBox.css';

class MnemonicBox extends Component {
    state = { copied: false };
    stringifyMnemonic = memoizeOne((mnemonic) => mnemonic.join(' '));

    render() {
        const { mnemonic } = this.props;
        const { copied } = this.state;

        return (
            <div className={ styles.box }>
                <div className={ styles.top }>
                    { this.renderWords(mnemonic) }
                </div>
                <div className={ styles.bottom }>
                    <CopyToClipboard text={ this.stringifyMnemonic(mnemonic) } onCopy={ this.handleOnCopy }>
                        <TextButton
                            variant="small"
                            iconPosition="left"
                            icon={ <CopyIcon /> }>
                            { copied ? 'Copied!' : 'Copy to clipboard' }
                        </TextButton>
                    </CopyToClipboard>
                </div>
            </div>
        );
    }

    renderWords = memoizeOne((mnemonic) => mnemonic.map((word, index) => {
        const wordNumber = `0${index + 1}`.slice(-2);

        return (
            <div key={ index } className={ styles.wordContainer }>
                <span className={ styles.number }>{ `#${wordNumber}` }</span>
                <span>{ word }</span>
            </div>
        );
    }));

    handleOnCopy = () => {
        this.setState({ copied: true });
    };
}

MnemonicBox.propTypes = {
    mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MnemonicBox;
