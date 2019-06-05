import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Page404, Page500 } from '../../pages/errors';

class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: undefined,
    };

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error });

        console.log('error', error);
        console.log('info', info);
    }

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            switch (error.code) {
            case 'UNKNOWN_IDENTITY':
                return <Page404 />;
            default:
                console.log('error.code', error.code);

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
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
