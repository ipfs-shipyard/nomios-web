import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import { Link } from 'react-router-dom';
import { Dropdown, Avatar, ChevronIcon, TypeOption, PlusIcon } from '@nomios/web-uikit';
import styles from './IdentitySelector.css';

const DEFAULT_SELECTED_INDEX = 0;

class IdentitySelector extends Component {
    selectedValue = null;
    createOptions = null;
    findIdentity = null;

    constructor(props) {
        super(props);

        this.selectedValue = props.initialIdentityId ? props.initialIdentityId : props.identities[DEFAULT_SELECTED_INDEX].id;
        this.createOptions = memoizeOne(this.createOptionsArray);
        this.findIdentity = memoizeOne(this.findIdentityObject);
    }

    render() {
        const { identities } = this.props;
        const { options, defaultOption } = this.createOptions(identities);

        return (
            <div className={ styles.dropdownContainer }>
                <Dropdown
                    options={ options }
                    arrowPlacement="right"
                    menuClassName={ styles.menu }
                    onChange={ this.handleChange }
                    defaultValue={ defaultOption }
                    controlClassName={ styles.control }
                    menuListClassName={ styles.menuList }
                    renderTrigger={ this.renderCustomTrigger } />
            </div>
        );
    }

    renderCustomTrigger = ({ menuIsOpen }) => {
        const { image, name } = this.findIdentity(this.selectedValue).profileDetails;
        const chevronClasses = classNames(styles.chevron, menuIsOpen && styles.up);

        return (
            <div className={ styles.trigger }>
                <Avatar image={ image } name={ name } className={ styles.avatar } animateOnEnter={ false } />
                <ChevronIcon className={ chevronClasses } />
            </div>
        );
    };

    renderOption = ({ isFocused, data }) => {
        const { name, image } = this.findIdentity(data.value).profileDetails;
        const optionClassNames = classNames(styles.option, isFocused && styles.focused);

        return (
            <div className={ optionClassNames } >
                <Avatar image={ image } name={ name } className={ styles.avatar } animateOnEnter={ false } />
                <span className={ styles.name }>{ name }</span>
            </div>
        );
    };

    renderCreateIdentityOption = ({ isFocused }) => {
        const optionClassNames = classNames(styles.option, isFocused && styles.focused);

        return (
            <Link
                to="/?action=create-identity"
                rel="noopener"
                target="_blank"
                className={ styles.link }
                onClick={ this.handleCreateIdentityClick }>
                <div className={ optionClassNames }>
                    <TypeOption selectable={ false } className={ styles.typeOption }>
                        <PlusIcon />
                    </TypeOption>
                    <span className={ styles.name }>Create Identity</span>
                </div>
            </Link>
        );
    };

    findIdentityObject = (id) => this.props.identities.find((identity) => identity.id === id);

    createOptionsArray = (identities) => {
        let defaultOption;
        const createIdentityOption = { value: 'createCta', render: this.renderCreateIdentityOption };

        const options = identities.map((identity) => {
            const option = { value: identity.id, render: this.renderOption };
            const initialIdentityId = this.props.initialIdentityId ? this.props.initialIdentityId : identities[DEFAULT_SELECTED_INDEX].id;

            if (identity.id === initialIdentityId) {
                defaultOption = option;
            }

            return option;
        });

        options.unshift(createIdentityOption);

        return {
            defaultOption: !defaultOption ? options[DEFAULT_SELECTED_INDEX + 1] : defaultOption,
            options,
        };
    };

    handleChange = ({ value }) => {
        if (value !== 'createCta') {
            this.selectedValue = value;
            this.props.onChange && this.props.onChange(value);
        }
    };

    handleCreateIdentityClick = () => window.close();
}

IdentitySelector.propTypes = {
    identities: PropTypes.array.isRequired,
    initialIdentityId: PropTypes.string,
    onChange: PropTypes.func,
};

export default IdentitySelector;
