import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Sidebar.css';

class Sidebar extends Component {
    render() {
        const { className } = this.props;

        return (
            <div className={ classNames(styles.sidebar, className) }>
                Sidebar

                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/identity/x">Identity x</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

Sidebar.propTypes = {
    className: PropTypes.string,
};

export default Sidebar;
