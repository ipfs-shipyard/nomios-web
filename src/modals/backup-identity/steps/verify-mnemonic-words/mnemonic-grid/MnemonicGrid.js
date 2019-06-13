import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { Badge } from '@nomios/web-uikit';
import styles from './MnemonicGrid.css';

class MnemonicGrid extends Component {
    render() {
        return (
            <div className={ styles.mnemonicGrid }>
                { this.renderMnemonicGrid() }
            </div>
        );
    }

    renderMnemonicGrid() {
        const { mnemonic, selectedIndexes } = this.props;

        return mnemonic.map((word, index) => (
            <Badge
                key={ index }
                className={ styles.badge }
                selected={ selectedIndexes.includes(index) }
                onClick={ this.handleBadgeClick(index) }>
                { word }
            </Badge>
        ));
    }

    handleBadgeClick = memoizeOne((index) => () => {
        this.props.onToggle(index);
    });
}

MnemonicGrid.propTypes = {
    selectedIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
    mnemonic: PropTypes.arrayOf(PropTypes.string).isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default MnemonicGrid;
