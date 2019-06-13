import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffle, random, remove } from 'lodash';
import { Button, FeedbackMessage } from '@nomios/web-uikit';
import MnemonicGrid from './mnemonic-grid';
import styles from './VerifyMnemonicWords.css';

const NUMBER_OF_WORDS = 2;

class VerifyMnemonicWords extends Component {
    state = { error: undefined, selectedIndexes: [] };

    shuffledMnemonic = [];
    randomWordsIndex = [];

    constructor(props) {
        super(props);

        this.shuffledMnemonic = shuffle(props.mnemonic);
        this.randomWordsIndex = this.generateRandomIndexes(NUMBER_OF_WORDS);
    }

    render() {
        const { error, selectedIndexes } = this.state;

        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Secret Recovery Key</h2>
                <p>{ `Verify by selecting words #${this.randomWordsIndex[0] + 1} and #${this.randomWordsIndex[1] + 1}.` }</p>
                <MnemonicGrid
                    mnemonic={ this.shuffledMnemonic }
                    selectedIndexes={ selectedIndexes }
                    onToggle={ this.handleToggleSelect } />
                { error && (
                    <FeedbackMessage
                        className={ styles.errorMessage }
                        type="error"
                        variant="large">
                        { error }
                    </FeedbackMessage>
                ) }
                <div className={ styles.buttonsWrapper }>
                    <Button
                        variant="secondary"
                        className={ styles.button }
                        onClick={ this.handlePrevStep }>
                        See words again
                    </Button>
                    <Button
                        className={ styles.button }
                        onClick={ this.handleNextStep }>
                        Confirm
                    </Button>
                </div>
            </div>
        );
    }

    generateRandomIndexes(wordsNumber) {
        const indexesArray = [];

        while (indexesArray.length < wordsNumber) {
            const randomNumber = random(0, 11);

            if (!indexesArray.includes(randomNumber)) {
                indexesArray.push(randomNumber);
            }
        }

        return indexesArray;
    }

    wordsAreCorrect() {
        const { selectedIndexes } = this.state;
        const { mnemonic } = this.props;

        const firstWordIndex = this.randomWordsIndex[0];
        const secondWordIndex = this.randomWordsIndex[1];
        const firstWord = mnemonic[firstWordIndex];
        const secondWord = mnemonic[secondWordIndex];

        const selectedWords = selectedIndexes.map((index) => this.shuffledMnemonic[index]);

        return selectedWords.includes(firstWord) && selectedWords.includes(secondWord);
    }

    handleToggleSelect = (index) => {
        const { selectedIndexes } = this.state;

        if (!selectedIndexes.includes(index)) {
            selectedIndexes.length < NUMBER_OF_WORDS && selectedIndexes.push(index);
        } else {
            remove(selectedIndexes, (element) => element === index);
        }

        this.setState({ selectedIndexes, error: undefined });
    };

    handlePrevStep = () => this.props.onNextStep(this.props.prevStepId);

    handleNextStep = () => {
        if (this.state.selectedIndexes.length < NUMBER_OF_WORDS) {
            this.setState({ error: 'You must select 2 words. Please, try again.' });
        } else if (this.wordsAreCorrect()) {
            this.props.onNextStep(this.props.nextStepId);
        } else {
            this.shuffledMnemonic = shuffle(this.props.mnemonic);
            this.randomWordsIndex = this.generateRandomIndexes(NUMBER_OF_WORDS);
            this.setState({
                error: 'Selected words do not match your recovery key, please try again.',
                selectedIndexes: [],
            });
        }
    };
}

VerifyMnemonicWords.propTypes = {
    mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
    nextStepId: PropTypes.string.isRequired,
    prevStepId: PropTypes.string.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default VerifyMnemonicWords;
