import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Logo, TextButton, EditIcon, Button } from '@nomios/web-uikit';
import { Link } from 'react-router-dom';
import RequestInfoIllustration from './request-info-illustration';
import IdentitySelector from './identity-selector';
import FadeContainer from '../../shared/components/fade-container';
import credentialScopes from '../../shared/data/credential-scopes';
import backgroundPatternUrl from '../../shared/media/backgrounds/background-pattern-1440p.png';
import styles from './Authenticate.css';

const MOCKED_CREDENTIAL_SCOPES = ['personalDetails', 'socialProofs'];
const INITIAL_VALUE_INDEX = 0;

class Authenticate extends Component {
    state = { activeFeedbackStepId: 0 };

    selectedIdentityId = undefined;

    constructor(props) {
        super(props);

        this.selectedIdentityId = props.identities.length > 0 && props.identities[INITIAL_VALUE_INDEX].id;
    }

    render() {
        const { activeFeedbackStepId } = this.state;
        const { identities, app } = this.props;
        const noIdentities = !identities || identities.length === 0;

        return (
            <div className={ styles.container }>
                <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                <div className={ styles.infoContainer }>
                    <FadeContainer className={ styles.fadeContainer } activeIndex={ activeFeedbackStepId }>
                        <>
                            <div className={ styles.header }>
                                <Logo className={ styles.logo } variant="symbol" />
                                { !noIdentities && (
                                    <IdentitySelector
                                        identities={ this.props.identities }
                                        onChange={ this.handleIdentityChange }
                                        initialIdentityId={ this.props.identities[INITIAL_VALUE_INDEX].id } />
                                ) }
                            </div>
                            <div className={ styles.illustration }>
                                <RequestInfoIllustration name={ app.name } iconUrl={ app.iconUrl } />
                            </div>
                            <h2 className={ styles.title }>This app wants to authenticate you.</h2>
                            { noIdentities ? this.renderNoIdentitiesHelperText() : this.renderInfoDetailsContainer() }
                            { noIdentities ? this.renderCreateIdentityButton() : this.renderAuthenticationButtons() }
                        </>
                        <div className={ styles.feedbackContainer }>
                            <h2 className={ styles.title }>Please wait for the authentication…</h2>
                        </div>
                    </FadeContainer>
                </div>
            </div>
        );
    }

    renderInfoDetailsContainer() {
        return (
            <div className={ styles.infoDetailsContainer }>
                <div className={ styles.infoText }>
                        Info you will provide:
                    <ul className={ styles.list }>
                        { MOCKED_CREDENTIAL_SCOPES.map((credentialScope, index) => (
                            <li key={ `credentialScope${index}` }>
                                { credentialScopes[credentialScope].name }
                            </li>
                        )) }
                    </ul>
                </div>
                <TextButton
                    className={ styles.textButton }
                    iconPosition="left"
                    icon={ <EditIcon /> }
                    onClick={ this.handleEditClick }>
                        Edit
                </TextButton>
            </div>
        );
    }

    renderNoIdentitiesHelperText() {
        return (
            <div className={ styles.helperTextContainer }>
                <p>You need to create an identity within Nomios to complete the authentication.</p>
            </div>
        );
    }

    renderCreateIdentityButton() {
        return (
            <Link
                to="/?action=create-identity"
                target="_blank"
                onClick={ this.handleCreateIdentityClick }
                className={ classNames(styles.link, styles.singleButtonContainer) }
                rel="noopener">
                <Button variant="negative">Create identity</Button>
            </Link>
        );
    }

    renderAuthenticationButtons() {
        return (
            <div className={ styles.buttonsContainer }>
                <Button variant="tertiary" onClick={ this.handleDenyAuthentication }>No, deny</Button>
                <Button variant="negative" onClick={ this.handleAllowAuthentication }>Yes, allow</Button>
            </div>
        );
    }

    handleEditClick = () => alert('Edit info details not implemented yet');

    handleDenyAuthentication = () => {
        this.props.onDeny(this.selectedIdentityId);
    };

    handleAllowAuthentication = () => {
        this.setState({ activeFeedbackStepId: 1 });
        this.props.onAccept(this.selectedIdentityId);
    };

    handleRetryAuthentication = () => this.handleAllowAuthentication();

    handleIdentityChange = (id) => {
        this.selectedIdentityId = id;
    };

    handleCreateIdentityClick = () => window.close();
}

Authenticate.propTypes = {
    identities: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
};

export default Authenticate;
