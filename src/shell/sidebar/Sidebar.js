import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Link, NavLink } from 'react-router-dom';
import { Logo, Avatar, SettingsIcon, HelpIcon } from '@nomios/web-uikit';
import Scrollbar from './scrollbar';
import styles from './Sidebar.css';

const OPEN_TRANSITION_DURATION = 300;
const OPEN_TRANSITION_CLASSNAMES = { enter: styles.open, enterDone: styles.open, exit: styles.close };
const STAGGER_FIXED_TRANSITION_DELAY = 50;
const STAGGER_TRANSITION_DELAY = 30;

const BOTTOM_ITEMS = [
    { name: 'Settings', Icon: SettingsIcon },
    { name: 'Help', Icon: HelpIcon },
];

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
                    onMouseEnter={ this.handleMouseEnter }
                    onMouseLeave={ this.handleMouseLeave }>
                    <div className={ styles.bg } />

                    <div className={ styles.wrapper }>
                        <div className={ styles.top }>
                            <Link to="/" onClick={ this.handleLinkClick }>
                                <Logo variant="symbol" className={ styles.symbol } />
                                <Logo
                                    variant="logotype"
                                    className={ styles.logotype }
                                    style={ open ? { transitionDelay: `${STAGGER_FIXED_TRANSITION_DELAY}ms` } : undefined } />
                            </Link>
                        </div>

                        <div className={ styles.middle }>
                            <Scrollbar open={ open }>
                                <ul>
                                    { mockIdentities.map((identity, index) => (
                                        <li key={ identity.id }>
                                            <NavLink to={ `/identity/${identity.id}` } onClick={ this.handleLinkClick } activeClassName={ styles.active }>
                                                <Avatar image={ identity.image } name={ identity.name } className={ styles.avatar } />
                                                <div
                                                    className={ styles.name }
                                                    style={ open ? { transitionDelay: `${((index + 1) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY}ms` } : undefined }>
                                                    <span className={ styles.text }>{ identity.name }</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    )) }
                                </ul>
                            </Scrollbar>
                        </div>

                        <ul className={ styles.bottom }>
                            { BOTTOM_ITEMS.map((item, index) => (
                                <li key={ item.name }>
                                    { <item.Icon className={ styles.icon } /> }
                                    <div
                                        className={ styles.name }
                                        style={ open ? { transitionDelay: `${((mockIdentities.length + index + 1) * STAGGER_TRANSITION_DELAY) + STAGGER_FIXED_TRANSITION_DELAY}ms` } : undefined }>
                                        <span className={ styles.text }>{ item.name }</span>
                                    </div>
                                </li>
                            )) }
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
        this.enterTimeout = setTimeout(() => this.setState({ open: true }), 200);
    }

    handleMouseEnter = () => this.open();

    handleMouseLeave = () => this.close();

    handleLinkClick = () => this.close();
}

Sidebar.propTypes = {
    className: PropTypes.string,
};

export default Sidebar;
