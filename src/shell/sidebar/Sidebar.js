import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { SettingsIcon, BellIcon } from '@nomios/web-uikit';
import Scrollbar from './scrollbar';
import AddIdentityItem from './add-identity-item';
import IdentityItem from './identity-item';
import ActionItem from './action-item';
import LogoItem from './logo-item';
import styles from './Sidebar.css';

const OPEN_DELAY_DURATION = 250;
const OPEN_TRANSITION_DURATION = 300;
const OPEN_TRANSITION_CLASSNAMES = { enter: styles.open, enterDone: styles.open, exit: styles.close };
const STAGGER_FIXED_TRANSITION_DELAY = 50;
const STAGGER_TRANSITION_DELAY = 30;

const mockIdentities = [
    { id: 'a', name: 'Daenerys Targaryen Daenerys Targaryen', image: 'https://www.buro247.sg/thumb/300x300_5/images/beauty/Audio-review-Game-of-Thrones-best-hair-buro247.sg-CR-square.jpg' },
    { id: 'b', name: 'John Snow', image: 'https://img2.zergnet.com/4035209_300.jpg' },
    { id: 'm', name: 'Tyron Lannister', image: 'https://static.tvtropes.org/pmwiki/pub/images/tyrion_lannister.png' },
    { id: 'd', name: 'Aryia Stark', image: 'http://allaboutgot.haarstyle.club/wp-content/uploads/2019/04/Game-of-Thrones-S6-Maisie-Williams-as-Arya-Stark.jpg' },
    { id: 'e', name: 'Mellisandre', image: 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/p-game-of-thrones-carice-van-houten.jpg' },
    { id: 'f', name: 'Joffrey Baratheon', image: 'https://www.questrecruitment.ie/wp-content/uploads/2017/08/joffrey-300x300.png' },
    { id: 'g', name: 'The Mountain', image: 'http://cdn04.cdn.justjared.com/wp-content/uploads/headlines/2016/04/game-of-thrones-the-mountain-reveals-his-insane-diet-plan.jpg' },
    { id: 'h', name: 'The Hound', image: 'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/p-game-of-thrones-rory-mccann.jpg' },
    { id: 'i', name: 'Tormund Giantsbane', image: 'https://www.buro247.sg/thumb/300x300_5/images/culture/tormund-game-of-thrones-burosingapore-crsq.jpg' },
    { id: 'j', name: 'Brynden Tully', image: 'https://static.tvtropes.org/pmwiki/pub/images/brynden_tully_8.png' },
    { id: 'k', name: 'Daario Naharis', image: 'https://static.tvtropes.org/pmwiki/pub/images/daario_naharis.png' },
    { id: 'c', name: 'Olenna Tyrell', image: 'https://scontent.fopo2-1.fna.fbcdn.net/v/t1.0-9/10418141_981449785233791_9168055777222432320_n.jpg?_nc_cat=106&_nc_ht=scontent.fopo2-1.fna&oh=3cd941c4ffa79f7b515d7c6c7d02e284&oe=5D6251AB' },
];

class Sidebar extends Component {
    enterTimeout = undefined;

    state = {
        open: false,
    };

    componentWillUnmount() {
        clearTimeout(this.enterTimeout);
    }

    render() {
        const { open } = this.state;
        const { className } = this.props;

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
                            <Scrollbar in={ open }>
                                <ul>
                                    <AddIdentityItem
                                        in={ open }
                                        staggerDelay={ STAGGER_TRANSITION_DELAY + STAGGER_FIXED_TRANSITION_DELAY } />

                                    { mockIdentities.map((identity, index) => (
                                        <IdentityItem
                                            key={ identity.id }
                                            identity={ identity }
                                            in={ open }
                                            staggerDelay={ ((index + 2) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY }
                                            onClick={ this.handleIdentityItemClick } />
                                    )) }
                                </ul>
                            </Scrollbar>
                        </div>

                        <ul className={ styles.bottom }>
                            <ActionItem
                                name="Notifications"
                                icon={ BellIcon }
                                in={ open }
                                staggerDelay={ ((mockIdentities.length + 2) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY } />
                            <ActionItem
                                name="Settings"
                                icon={ SettingsIcon }
                                in={ open }
                                staggerDelay={ ((mockIdentities.length + 3) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY } />
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
    handleMouseOver = () => !this.state.open && this.open();

    handleMouseLeave = () => this.close();

    handleLogoItemClick = () => this.close();

    handleIdentityItemClick = () => this.close();
}

Sidebar.propTypes = {
    className: PropTypes.string,
};

export default Sidebar;
