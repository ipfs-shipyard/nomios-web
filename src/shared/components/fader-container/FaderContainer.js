import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FaderContainer.css';

class FaderContainer extends Component {
    static getDerivedStateFromProps(props, state) {
        // It means a change of active index has occurred
        if (props.activeIndex !== state.activeIndex) {
            return state.isFirstRender ?
                { activeIndex: props.activeIndex, isFirstRender: false } :
                { requestNextActiveIndex: props.activeIndex };
        }

        return null;
    }

    contentRef = createRef();

    state = {
        isFirstRender: true,
        activeIndex: undefined,
        requestNextActiveIndex: false,
    };

    render() {
        const { activeIndex, requestNextActiveIndex } = this.state;
        const { children } = this.props;

        const isVisible = typeof requestNextActiveIndex === 'boolean';

        return (
            <div className={ classNames(styles.content, isVisible && styles.visible) }
                ref={ this.contentRef }
                onTransitionEnd={ this.handleTransitionEnd }>
                { children[activeIndex] }
            </div>
        );
    }

    handleTransitionEnd = (event) => {
        const { requestNextActiveIndex } = this.state;
        const isAnimatingIn = typeof requestNextActiveIndex === 'boolean';

        if (event.target !== this.contentRef.current || isAnimatingIn) {
            return;
        }

        this.setState({
            activeIndex: requestNextActiveIndex,
            requestNextActiveIndex: false,
        });
    };
}

FaderContainer.propTypes = {
    activeIndex: PropTypes.number,
    children: PropTypes.node.isRequired,
};

FaderContainer.defaultProps = {
    activeIndex: 0,
};

export default FaderContainer;
