import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Logo, Button } from '@nomios/web-uikit';
import FadeContainer from '../../shared/components/fade-container';
import AppInfoIllustration from './app-info-illustration';
import CodeBlock from './code-block';
import backgroundPatternUrl from '../../shared/media/backgrounds/background-pattern-1440p.png';
import styles from './Sign.css';

class Sign extends Component {
    state = { activeFeedbackStepId: 0 };

    render() {
        const { activeFeedbackStepId } = this.state;
        const { app /* , identity */, data, onDeny } = this.props;

        return (
            <div className={ styles.container }>
                <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                <div className={ styles.infoContainer }>
                    <FadeContainer className={ styles.fadeContainer } activeIndex={ activeFeedbackStepId }>
                        <>
                            <div className={ styles.header }>
                                <Logo className={ styles.logo } variant="symbol" />
                            </div>
                            <AppInfoIllustration
                                name={ app.name }
                                iconUrl={ app.iconUrl }
                                className={ styles.illustration } />
                            <h2 className={ styles.title }>This app needs your signature.</h2>
                            <CodeBlock className={ styles.codeBlock } data={ data } />
                            <div className={ styles.buttonsContainer }>
                                <Button variant="tertiary" onClick={ onDeny }>No, cancel</Button>
                                <Button variant="negative" onClick={ this.handleAccept }>Yes, sign data</Button>
                            </div>
                        </>
                        <div className={ styles.feedbackContainer }>
                            <h2 className={ styles.title }>Please wait for the signature validation…</h2>
                        </div>
                    </FadeContainer>
                </div>
            </div>
        );
    }

    handleAccept = () => {
        this.setState({ activeFeedbackStepId: 1 });
        this.props.onAccept();
    };
}

Sign.propTypes = {
    app: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    data: PropTypes.any.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
};

export default Sign;
