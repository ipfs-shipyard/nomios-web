import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextareaAutosize from 'react-textarea-autosize';
import { FeedbackMessage } from '@nomios/web-uikit';
import { Field } from 'react-final-form';
import styles from './RecoveryTextArea.css';

const RECOVERY_WORD_NUMBER = 12;

class RecoveryTextArea extends Component {
    render() {
        const { className } = this.props;
        const inputWrapperClassName = classNames(styles.inputWrapper, className);

        return (
            <div className={ inputWrapperClassName }>
                <Field name="mnemonic" validate={ this.validateInput }>
                    { ({ input, meta }) => {
                        const { onChange, ...restInput } = input;

                        const wordCount = meta.data ? meta.data.validationResult : 0;
                        const fillPercentage = wordCount * 100 / RECOVERY_WORD_NUMBER;

                        return (
                            <Fragment>
                                <TextareaAutosize
                                    { ...restInput }
                                    onInput={ onChange }
                                    type="text"
                                    onPaste={ this.handleInputPaste }
                                    onKeyDown={ this.handleInputKeyDown }
                                    placeholder="Enter words separted by a space or a comma" />
                                <div className={ styles.animatedBorder } style={ { width: `${fillPercentage}%` } } />
                                <FeedbackMessage className={ styles.progressDisplay } iconPosition="right">{ wordCount }/{ RECOVERY_WORD_NUMBER }</FeedbackMessage>
                            </Fragment>
                        );
                    }}
                </Field>
            </div>
        );
    }

    fireInputEvent(element) {
        const evt = new CustomEvent('input', { bubbles: true });

        element.dispatchEvent(evt);
    }

    splitRecoveryIntoArray(content) {
        content = content ? content : '';

        return content.toLowerCase()
        .split(/[ ,;]+/g)
        .filter((elem) => elem !== '');
    }

    calculateWordCount(content) {
        const wordList = this.splitRecoveryIntoArray(content);

        return wordList.length;
    }

    validateInput = (recovery, _, meta) => {
        const wordCount = this.calculateWordCount(recovery);

        meta.data.validationResult = wordCount;

        return wordCount === RECOVERY_WORD_NUMBER ? undefined : 'Not enough words';
    };

    handleInputKeyDown = (event) => {
        const key = event.key;
        const input = event.target;

        const selectionStart = input.selectionStart;
        const isSeparatorKey = key === ' ' || key === ',' || key === ';';
        const canAddSpace = (input.value[selectionStart - 1] !== ' ');

        // Simplify these two ifs

        if (((!event.target.value || this.calculateWordCount(event.target.value) === 12 || !canAddSpace) && isSeparatorKey) ||
            key === 'Enter') {
            event.preventDefault();

            return;
        }

        if (isSeparatorKey) {
            event.preventDefault();

            input.setRangeText(' ');
            input.selectionStart = input.selectionEnd = selectionStart + 1;

            this.fireInputEvent(input);
        }
    };

    handleInputPaste = (event) => {
        const input = event.target;

        const clipboardContent = event.clipboardData || window.clipboarddata;
        const pastedData = clipboardContent.getData('Text');

        const simulatePasteResult = `${input.value.slice(0, input.selectionStart)}${pastedData}${input.value.slice(input.selectionEnd)}`;

        event.preventDefault();

        const value = simulatePasteResult.toLowerCase()
        .replace(/\n/g, '')
        .replace(/[ ,;]+/g, ' ')
        .trim();

        if (this.calculateWordCount(value) > RECOVERY_WORD_NUMBER) {
            return;
        }

        input.value = value;
        this.fireInputEvent(input);
    };
}

RecoveryTextArea.propTypes = {
    className: PropTypes.string,
};

export default RecoveryTextArea;
