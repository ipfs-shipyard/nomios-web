import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './sidebar';
import styles from './Shell.css';

class Shell extends Component {
    render() {
        const { children } = this.props;

        return (
            <div className={ styles.shell }>
                <Sidebar className={ styles.sidebar } />

                <main className={ styles.content }>
                    { children }
                </main>
            </div>
        );
    }
}

Shell.propTypes = {
    children: PropTypes.node,
};

export default Shell;
