import React, { PureComponent, createRef } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { connectIdmWallet } from 'react-idm-wallet';
import { SettingsIcon, BellIcon, ModalTrigger } from '@nomios/web-uikit';
import NewIdentityFlow from '../../modals/new-identity-flow';
import Scrollbar from './scrollbar';
import AddIdentityItem from './add-identity-item';
import IdentityItem from './identity-item';
import ActionItem from './action-item';
import LogoItem from './logo-item';
import styles from './Sidebar.css';

const OPEN_DELAY_DURATION = 200;
const OPEN_TRANSITION_DURATION = 300;
const OPEN_TRANSITION_CLASSNAMES = { enter: styles.open, enterDone: styles.open, exit: styles.close };
const STAGGER_FIXED_TRANSITION_DELAY = 50;
const STAGGER_TRANSITION_DELAY = 30;

class Sidebar extends PureComponent {
    enterTimeout = undefined;
    addIdentityModalRef = createRef();

    state = {
        open: false,
    };

    componentWillUnmount() {
        clearTimeout(this.enterTimeout);
    }

    render() {
        const { open } = this.state;
        const { identities, className } = this.props;
        const identitiesCount = !identities ? 0 : identities.length;

        return (
            <CSSTransition in={ open } classNames={ OPEN_TRANSITION_CLASSNAMES } timeout={ OPEN_TRANSITION_DURATION }>
                <div
                    className={ classNames(styles.sidebar, className) }
                    onMouseOver={ this.handleMouseOver }
                    onMouseLeave={ this.handleMouseLeave }>
                    <div className={ styles.bg } />

                    <div className={ styles.wrapper }>
                        <div className={ styles.top }>
                            <LogoItem
                                in={ open }
                                staggerDelay={ STAGGER_FIXED_TRANSITION_DELAY }
                                onClick={ this.handleLogoItemClick } />
                        </div>

                        <div className={ styles.middle }>
                            { identities && (
                                <Scrollbar in={ open }>
                                    <ul>
                                        <ModalTrigger
                                            modal={ <NewIdentityFlow ref={ this.addIdentityModalRef } /> }
                                            onChange={ this.handleModalTriggerChange }>
                                            <AddIdentityItem
                                                in={ open }
                                                staggerDelay={ STAGGER_TRANSITION_DELAY + STAGGER_FIXED_TRANSITION_DELAY } />
                                        </ModalTrigger>

                                        { identities.map((identity, index) => (
                                            <IdentityItem
                                                key={ identity.getId() }
                                                id={ identity.getId() }
                                                details={ identity.profile.getDetails() }
                                                in={ open }
                                                staggerDelay={ ((index + 2) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY }
                                                onClick={ this.handleIdentityItemClick } />
                                        )) }
                                    </ul>
                                </Scrollbar>
                            ) }
                        </div>

                        <ul className={ styles.bottom }>
                            <ActionItem
                                name="Notifications"
                                icon={ BellIcon }
                                in={ open }
                                staggerDelay={ ((identitiesCount + 2) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY }
                                onClick={ this.handleNotificationsItemClick } />
                            <ActionItem
                                name="Settings"
                                icon={ SettingsIcon }
                                in={ open }
                                staggerDelay={ ((identitiesCount + 3) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY }
                                onClick={ this.handleSettingsItemClick } />
                        </ul>
                    </div>
                </div>
            </CSSTransition>
        );
    }

    close() {
        clearTimeout(this.enterTimeout);
        this.setState({ open: false });
    }

    open() {
        clearTimeout(this.enterTimeout);
        this.enterTimeout = setTimeout(() => this.setState({ open: true }), OPEN_DELAY_DURATION);
    }

    // We use onMouseOver instead of onMouseEnter because the user might click the avatar/links
    // while still in the sidebar. This way, the sidebar will open again as soon as another element
    // is hovered
    handleMouseOver = () => {
        // This is needed because of event bubbling. Events inside a portal will be propagated
        // to its ancestors in the React tree (event though those elements are not ancestors in the DOM tree).
        // You can read more about it here: https://reactjs.org/docs/portals.html#event-bubbling-through-portals
        const isAddIdentityModalMounted = findDOMNode(this.addIdentityModalRef.current);

        !isAddIdentityModalMounted && this.open();
    };

    handleMouseLeave = () => this.close();

    handleModalTriggerChange = (open) => !open && this.close();

    handleLogoItemClick = () => this.close();

    handleIdentityItemClick = () => this.close();

    handleNotificationsItemClick = () => {
        alert('Not implemented');
    };

    handleSettingsItemClick = () => {
        alert('Not implemented');
    };
}

Sidebar.propTypes = {
    identities: PropTypes.array,
    className: PropTypes.string,
};

export default connectIdmWallet((idmWallet) => () => ({
    identities: idmWallet.identities.isLoaded() ? idmWallet.identities.list() : undefined,
}))(Sidebar);
