import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Page404, Page500 } from '../../pages/errors';

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
                process.env.NODE_ENV === 'development' &&
                    console.info('This error is caused by an unknown identity. ' +
                    'It is handled correctly by the Error Boundary component.' +
                    '\n\nPlease close this overlay (this will not appear in production).');

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
