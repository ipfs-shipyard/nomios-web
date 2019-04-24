import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ModalStep, Button, TypeGroup, TypeOption, UserIcon, CheckmarkIcon, EntityIcon, OtherIcon } from '@nomios/web-uikit';
import FaderContainer from '../../fader-container';
import BulletsIndicator from '../../bullets-indicator';

import styles from './IdentityType.css';

class IdentityType extends Component {
    state = {
        activeSubStepIndex: 0,
    };

    constructor() {
        super();

        this.bulletCallbacks = [
            this.handleBulletTypeClick,
            this.handleBulletNameClick,
        ];
    }

    render() {
        const { activeSubStepIndex } = this.state;

        console.log('activeSubStepIndex', activeSubStepIndex);

        return (
            <ModalStep id={ this.props.id }>
                <div className={ styles.contentWrapper }>
                    <h2 className={ styles.heading }>1. Tell us who you are</h2>
                    <p>
                        Nomios will give you control over your fundamental digital rights:
                        Identity, data ownership, privacy and security.
                    </p>
                    <FaderContainer activeIndex={ activeSubStepIndex }>
                        <TypeGroup className={ styles.typeGroup } name="identity-type" onSelect={ this.handleOnSelectIndentityType }>
                            <TypeOption id={ 1 } label="Person" badge={ CheckmarkIcon }>
                                <UserIcon />
                            </TypeOption>
                            <TypeOption id={ 2 } label="Organization" badge={ CheckmarkIcon }>
                                <EntityIcon />
                            </TypeOption>
                            <TypeOption id={ 3 } label="Other" badge={ CheckmarkIcon }>
                                <OtherIcon />
                            </TypeOption>
                        </TypeGroup>
                        <p>diogo</p>
                    </FaderContainer>
                    <div className={ styles.buttonWrapper }>
                        <Button onClick={ this.handleNextStep }>Continue</Button>
                    </div>
                    <BulletsIndicator
                        className={ styles.bulletsIndicator }
                        activeIndex={ activeSubStepIndex }
                        bulletCallbacks={ this.bulletCallbacks } />
                </div>
            </ModalStep>
        );
    }

    updateActiveSubStepIndex = (index) => this.setState({ activeSubStepIndex: index });

    handleBulletTypeClick = () => this.updateActiveSubStepIndex(0);
    handleBulletNameClick = () => this.updateActiveSubStepIndex(1);

    handleNextStep = () => {
        // Means that the first sub-step is active and the button must trigger the next sub-step
        if (this.state.activeSubStepIndex === 0) {
            this.handleBulletNameClick();
        } else {
            console.log('clicked next step');
        }
    };

    handleOnSelectIndentityType = (id) => console.log('lol', id);
}

IdentityType.propTypes = {
    id: PropTypes.string.isRequired,
    nextStepId: PropTypes.string,
    onNextStep: PropTypes.func,
};

export default IdentityType;
