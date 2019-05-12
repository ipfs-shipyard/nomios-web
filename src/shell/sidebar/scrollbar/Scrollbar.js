import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styles from './Scrollbar.css';

class Sidebar extends Component {
    state = {
        topEdgeVisible: true,
        bottomEdgeVisible: true,
    };

    render() {
        const { children, open } = this.props;
        const { topEdgeVisible, bottomEdgeVisible } = this.state;

        const finalClassName = classNames(
            styles.scrollbar,
            open && styles.open,
            !topEdgeVisible && styles.showTopEdge,
            !bottomEdgeVisible && styles.showBottomEdge,
        );

        return (
            <SimpleBar className={ finalClassName }>
                <InView as="div" onChange={ this.handleTopEdgeChange } className={ styles.topEdgeDetector } />
                { children }
                <InView as="div" onChange={ this.handleBottomEdgeChange } className={ styles.bottomEdgeDetector } />
            </SimpleBar>
        );
    }

    handleTopEdgeChange = (inView) => this.setState({ topEdgeVisible: inView });

    handleBottomEdgeChange = (inView) => this.setState({ bottomEdgeVisible: inView });
}

Sidebar.propTypes = {
    open: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Sidebar;
