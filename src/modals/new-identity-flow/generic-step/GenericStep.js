import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Svg } from '@nomios/web-uikit';
import styles from './GenericStep.css';

const helmet = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../../shared/media/illustrations/helmet.svg');

class GenericStep extends Component {
    render() {
        return (
            <div className={ styles.contentWrapper }>
                <h2 className={ styles.heading }>Start using Nomios</h2>
                <p>
                    Nomios will give you control over your fundamental digital rights:
                    Identity, data ownership, privacy and security.
                </p>
                <div className={ styles.bottomContent }>
                    <Svg svg={ helmet } className={ styles.illustration } />
                    <div className={ styles.buttonsWrapper }>
                        <Button variant="negative" fullWidth onClick={ this.handleCreateIdentity }>Create ID</Button>
                        <Button variant="tertiary" fullWidth onClick={ this.handleImportIdentity }>Import ID</Button>
                    </div>
                </div>
            </div>
        );
    }

    handleCreateIdentity = () => this.props.onNextStep('create');

    handleImportIdentity = () => this.props.onNextStep('import');
}

GenericStep.propTypes = {
    onNextStep: PropTypes.func,
};

export default GenericStep;
