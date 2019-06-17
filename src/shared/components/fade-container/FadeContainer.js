import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FadeContainer.css';

class FadeContainer extends Component {
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
        const { children, className } = this.props;

        const isVisible = typeof requestNextActiveIndex === 'boolean';

        return (
            <div className={ classNames(styles.content, isVisible && styles.visible, className) }
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

FadeContainer.propTypes = {
    children: PropTypes.node.isRequired,
    activeIndex: PropTypes.number,
    className: PropTypes.string,
};

FadeContainer.defaultProps = {
    activeIndex: 0,
};

export default FadeContainer;
