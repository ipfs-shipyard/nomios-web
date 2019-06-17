import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SlideDown from 'react-slidedown';
import { Svg, Button, TextButton, WarningIcon } from '@nomios/web-uikit';
import styles from './ErrorScreen.css';

const fadingLogoSvg = import(/* webpackChunkName: "svg-illustrations-sprite" */ '../../media/illustrations/brand-fading-symbol.svg');

class ErrorScreen extends Component {
    state = {
        showingDetails: false,
    };

    render() {
        const { className, text, error, onRetry } = this.props;
        const { showingDetails } = this.state;

        return (
            <div className={ classNames(styles.errorScreen, className) }>
                <div className={ styles.wrapper }>
                    <Svg svg={ fadingLogoSvg } className={ styles.illustration } />

                    <p className={ styles.body }>{text}</p>

                    <div className={ styles.buttons }>
                        <Button
                            variant="secondary"
                            onClick={ this.handleToggleDetailsClick }
                            className={ styles.toggleDetails }>
                            { showingDetails ? 'Hide details' : 'Show details' }
                        </Button>
                        <Button variant="primary"
                            onClick={ onRetry }
                            className={ styles.tryAgain }>
                            Try again
                        </Button>
                    </div>

                    <SlideDown closed={ !showingDetails } className={ styles.errorSlideDown }>
                        <div className={ styles.errorBlock }>
                            <p className={ styles.message }>
                                { error.code && <Fragment>{ error.code }&nbsp;-&nbsp;</Fragment> }
                                { error.message }
                            </p>

                            { error.stack &&
                            <pre className={ styles.stack }>{ this.getNormalizedStack(error.stack) }</pre> }

                            <TextButton
                                variant="small"
                                icon={ <WarningIcon /> }
                                iconPosition="left"
                                className={ styles.reportButton }
                                onClick={ this.handleReportClick }>
                            Report this error
                            </TextButton>
                        </div>
                    </SlideDown>
                </div>
            </div>
        );
    }

    getNormalizedStack(stack) {
        return stack
        .split('\n')
        .slice(1)
        .map((line) => line.replace(/^(\t| {4})/, ''))
        .join('\n');
    }

    handleToggleDetailsClick = () => {
        this.setState((state) => ({
            showingDetails: !state.showingDetails,
        }));
    };

    handleReportClick = () => {
        window.open('https://github.com/ipfs-shipyard/pm-idm/issues/new?assignees=&labels=bug&template=bug_report.md');
    };
}

ErrorScreen.propTypes = {
    text: PropTypes.string.isRequired,
    error: PropTypes.shape({ message: PropTypes.string.isRequired, code: PropTypes.string }).isRequired,
    onRetry: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ErrorScreen;
