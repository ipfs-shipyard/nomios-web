import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FadeContainer from '../../components/fade-container';
import styles from './FeedbackStep.css';

class FeedbackStep extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.status === state.status) {
            return null;
        }

        const activeSubStepIndex = props.status === 'pending' ? 0 : 1;
        const messages = props.status === 'fulfilled' ? props.stepData.success : props.stepData.error;
        const actions = props.status === 'fulfilled' ? props.successActions : props.errorActions;

        return {
            activeSubStepIndex,
            messages,
            actions,
        };
    }

    state = {
        activeSubStepIndex: 0,
        messages: undefined,
        actions: undefined,
    };

    render() {
        const { messages, actions, activeSubStepIndex } = this.state;
        const { stepData: { loadingText } } = this.props;

        return (
            <FadeContainer activeIndex={ activeSubStepIndex }>
                <div className={ styles.loadingContainer }>
                    <h2>{ loadingText }</h2>
                </div>
                <div className={ styles.feedbackContainer }>
                    <div className={ styles.textContainer }>
                        <h2>{ messages.title }</h2>
                        <p>{ messages.message }</p>
                    </div>
                    <div className={ styles.actionsContainer }>
                        { actions }
                    </div>
                </div>
            </FadeContainer>
        );
    }
}

FeedbackStep.propTypes = {
    status: PropTypes.string.isRequired,
    successActions: PropTypes.node,
    errorActions: PropTypes.node,
    stepData: PropTypes.shape({
        loadingText: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        success: PropTypes.shape({
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            message: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
        error: PropTypes.shape({
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            message: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
    }).isRequired,
};

export default FeedbackStep;
