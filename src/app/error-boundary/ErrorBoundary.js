import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Page404, Page500 } from '../../pages/errors';
import styles from './ErrorBoundary.css';

class ErrorBoundary extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname !== state.pathname) {
            return {
                error: undefined,
                pathname: props.location.pathname,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            error: undefined,
            pathname: props.location.pathname,
        };
    }

    componentDidCatch(error) {
        this.setState({ error });
    }

    render() {
        const { error } = this.state;

        if (error) {
            switch (error.code) {
            case 'UNKNOWN_IDENTITY':
                this.hideErrorOverlay();

                return <Page404 />;
            default:
                this.showErrorOverlay();

                return <Page500 onRetry={ this.handleRetry } error={ error } />;
            }
        } else {
            this.destroyErrorOverlay();
            this.showErrorOverlay();
        }

        return this.props.children;
    }

    showErrorOverlay() {
        document.body.classList.remove(styles.hideErrorOverlay);
    }

    hideErrorOverlay() {
        document.body.classList.add(styles.hideErrorOverlay);
    }

    destroyErrorOverlay() {
        // Destroy
        const errorOverlay = document.querySelector('body>iframe[style]');

        errorOverlay &&
            errorOverlay.remove();
    }

    handleRetry = () => {
        window.location.reload();
    };
}

ErrorBoundary.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,

    children: PropTypes.node.isRequired,
};

export default withRouter(ErrorBoundary);
