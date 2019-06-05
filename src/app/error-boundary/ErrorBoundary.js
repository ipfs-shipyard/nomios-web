import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Page404, Page500 } from '../../pages/errors';
import styles from './ErrorBoundary.css';

class ErrorBoundary extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname !== state.pathname) {
            document.body.classList.remove(styles.hideErrorOverlay);

            return {
                hasError: false,
                error: undefined,
                pathname: props.location.pathname,
            };
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: undefined,
            pathname: props.location.pathname,
        };
    }

    componentDidCatch(error) {
        this.setState({ hasError: true, error });
    }

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            switch (error.code) {
            case 'UNKNOWN_IDENTITY':
                document.body.classList.add(styles.hideErrorOverlay);

                return <Page404 />;
            default:
                return <Page500 onRetry={ this.handleRetry } error={ error } />;
            }
        }

        return this.props.children;
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
