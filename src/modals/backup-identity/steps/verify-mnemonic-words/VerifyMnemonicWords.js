import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shuffle, random, remove } from 'lodash';
import { Button, FeedbackMessage } from '@nomios/web-uikit';
import MnemonicGrid from './mnemonic-grid';
import { ButtonPromiseState } from '../../../../shared/components/button-promise-state';
import styles from './VerifyMnemonicWords.css';

const NUMBER_OF_WORDS = 2;

class VerifyMnemonicWords extends Component {
    state = {
        error: undefined,
        promise: undefined,
        selectedIndexes: [],
    };

    shuffledMnemonic = [];
    randomWordsIndex = [];

    constructor(props) {
        super(props);

        this.shuffledMnemonic = shuffle(props.mnemonic);
        this.randomWordsIndex = this.generateRandomIndexes(NUMBER_OF_WORDS);
    }

    render() {
        const { error, selectedIndexes, promise } = this.state;

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
                    <ButtonPromiseState promise={ promise } onSettle={ this.handleSettle }>
                        { ({ status }) => (
                            <Button
                                feedback={ status }
                                className={ styles.button }
                                onClick={ this.handleNextStep }>
                                Confirm
                            </Button>
                        ) }
                    </ButtonPromiseState>
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
        const { selectedIndexes } = this.state;
        const { setComplete } = this.props;

        if (selectedIndexes.length < NUMBER_OF_WORDS) {
            this.setState({ error: 'You must select 2 words. Please, try again.' });
        } else if (this.wordsAreCorrect()) {
            const promise = setComplete();

            this.setState({ promise });
        } else {
            this.shuffledMnemonic = shuffle(this.props.mnemonic);
            this.randomWordsIndex = this.generateRandomIndexes(NUMBER_OF_WORDS);
            this.setState({
                error: 'Selected words do not match your recovery key, please try again.',
                selectedIndexes: [],
            });
        }
    };

    handleSettle = (state) => {
        if (state.status === 'fulfilled') {
            this.props.onNextStep(this.props.nextStepId);
        } else {
            this.setState({ error: state.value });
        }
    };
}

VerifyMnemonicWords.propTypes = {
    mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
    nextStepId: PropTypes.string.isRequired,
    prevStepId: PropTypes.string.isRequired,
    setComplete: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
};

export default VerifyMnemonicWords;
