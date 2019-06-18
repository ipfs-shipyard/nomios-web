import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import memoizeOne from 'memoize-one';
import { Link } from 'react-router-dom';
import { Dropdown, Avatar, ChevronIcon, TypeOption, PlusIcon } from '@nomios/web-uikit';
import styles from './IdentitySelector.css';

const DEFAULT_SELECTED_INDEX = 0;
const getIdentities = memoizeOne((list) =>
    list.reduce((acc, identity) => Object.assign(acc, { [identity.id]: identity.profileDetails }), {})
);

class IdentitySelector extends Component {
    static getDerivedStateFromProps(props) {
        return {
            identities: getIdentities(props.identities),
        };
    }

    state = { identities: undefined };

    createOptions = null;
    selectedValue = null;

    constructor(props) {
        super(props);

        // this.selectedValue = Object.keys(props.identities)[DEFAULT_SELECTED_INDEX];
        this.selectedValue = props.identities[DEFAULT_SELECTED_INDEX].id;
        this.createOptions = memoizeOne(this.createOptionsArray);
    }

    componentDidMount() {
        // Call onChange to inform parent of intial selected value
        this.props.onChange && this.props.onChange(this.selectedValue);
    }

    render() {
        const options = this.createOptions(this.state.identities);

        return (
            <div className={ styles.dropdownContainer }>
                <Dropdown
                    options={ options }
                    arrowPlacement="right"
                    menuClassName={ styles.menu }
                    onChange={ this.handleChange }
                    controlClassName={ styles.control }
                    menuListClassName={ styles.menuList }
                    renderTrigger={ this.renderCustomTrigger }
                    defaultValue={ options[DEFAULT_SELECTED_INDEX + 1] } />
            </div>
        );
    }

    renderCustomTrigger = ({ menuIsOpen }) => {
        const { image, name } = this.state.identities[this.selectedValue];
        const chevronClasses = classNames(styles.chevron, menuIsOpen && styles.up);

        return (
            <div className={ styles.trigger }>
                <Avatar image={ image } name={ name } className={ styles.avatar } animateOnEnter={ false } />
                <ChevronIcon className={ chevronClasses } />
            </div>
        );
    };

    renderOption = ({ isFocused, data }) => {
        const identity = this.state.identities[data.value];
        const optionClassNames = classNames(styles.option, isFocused && styles.focused);

        return (
            <div className={ optionClassNames } >
                <Avatar
                    image={ identity.image }
                    name={ identity.name }
                    className={ styles.avatar }
                    animateOnEnter={ false } />
                <span className={ styles.name }>{ identity.name }</span>
            </div>
        );
    };

    renderCreateIdentityOption = ({ isFocused }) => {
        const optionClassNames = classNames(styles.option, isFocused && styles.focused);

        return (
            <Link to="/" target="_blank" className={ styles.link }>
                <div className={ optionClassNames }>
                    <TypeOption selectable={ false } className={ styles.typeOption }>
                        <PlusIcon />
                    </TypeOption>
                    <span className={ styles.name }>Create Identity</span>
                </div>
            </Link>
        );
    };

    createOptionsArray = (identities) => {
        const createIdentityOption = { value: 'createCta', render: this.renderCreateIdentityOption };
        const options = Object.keys(identities).map((key) => ({ value: key, render: this.renderOption }));

        options.unshift(createIdentityOption);

        return options;
    };

    handleChange = ({ value }) => {
        if (value !== 'createCta') {
            this.selectedValue = value;
            this.props.onChange && this.props.onChange(value);
        }
    };

    handleCreateIdentity = () => console.log('CREATE IDENTITY');
}

IdentitySelector.propTypes = {
    identities: PropTypes.array.isRequired,
    onChange: PropTypes.func,
};

export default IdentitySelector;
