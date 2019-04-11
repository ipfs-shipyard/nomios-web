import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ModalStep, Button } from '@nomios/web-uikit';

import styles from './GenericStep.css';

class GenericStep extends Component {
    render() {
        const { id } = this.props;

        return (
            <ModalStep id={ id }>
                <div className={ styles.contentWrapper }>
                    <h2 className={ styles.heading }>Start using Nomios</h2>
                    <p>
                        Nomios will give you control over your fundamental digital rights:
                        Identity, data ownership, privacy and security.
                    </p>
                    <div className={ styles.bottomContent }>
                        <div>ILLUSTRATION</div>
                        <div className={ styles.buttonsWrapper }>
                            <Button variant="negative" fullWidth onClick={ this.handleCreateIdentity }>Create new ID</Button>
                            <Button variant="tertiary" fullWidth onClick={ this.handleImportIdentity }>Use existing ID</Button>
                        </div>
                    </div>
                </div>
            </ModalStep>
        );
    }

    handleCreateIdentity = () => this.props.onNextStep('create');

    handleImportIdentity = () => this.props.onNextStep('import');
}

GenericStep.propTypes = {
    id: PropTypes.string.isRequired,
    onNextStep: PropTypes.func,
};

export default GenericStep;
