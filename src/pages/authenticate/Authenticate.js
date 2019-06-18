import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Logo, TextButton, EditIcon, Button } from '@nomios/web-uikit';
import RequestInfoIllustration from './request-info-illustration';
import IdentitySelector from './identity-selector';
import Feedback from './feedback';
import FadeContainer from '../../shared/components/fade-container';
import credentialScopes from './credentialScopes';
import backgroundPatternUrl from '../../shared/media/backgrounds/background-pattern-1440p.png';
import styles from './Authenticate.css';

const MOCKED_CREDENTIAL_SCOPES = ['personalDetails', 'socialProofs'];

class Authenticate extends Component {
    state = {
        activeStepId: 0,
    };

    selectedIdentityId = undefined;

    render() {
        const { activeStepId } = this.state;
        const { identities, app } = this.props;
        const noIdentities = !identities || identities.length === 0;

        return (
            <div className={ styles.container }>
                <div className={ styles.background } style={ { backgroundImage: `url(${backgroundPatternUrl})` } } />
                <div className={ styles.infoContainer }>
                    <FadeContainer activeIndex={ activeStepId }>
                        <Fragment>
                            <div className={ styles.header }>
                                <Logo className={ styles.logo } variant="symbol" />
                                { !noIdentities && (
                                    <IdentitySelector
                                        onChange={ this.handleIdentityChange }
                                        identities={ this.props.identities } />
                                ) }
                            </div>
                            <div className={ styles.illustration }>
                                <RequestInfoIllustration name={ app.name } iconUrl={ app.iconUrl } />
                            </div>
                            <h2 className={ styles.title }>{ app.name } wants to authenticate you.</h2>
                            { noIdentities ? this.renderNoIdentitiesHelperText() : this.renderInfoDetailsContainer() }
                            { noIdentities ? this.renderCreateIdentityButton() : this.renderAuthenticationButtons() }
                        </Fragment>
                        <Feedback
                            status="pending"
                            credentialScopes={ MOCKED_CREDENTIAL_SCOPES }
                            onRetry={ this.handleRetryAuthentication } />
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
            <div className={ styles.singleButtonContainer }>
                <Button variant="negative" onClick={ this.handleCreateIdentity }>Create identity</Button>
            </div>
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
        this.props.onAccept(this.selectedIdentityId);
    };

    handleCreateIdentity = () => console.log('Create identity');

    handleRetryAuthentication = () => this.handleAllowAuthentication();

    handleIdentityChange = (id) => {
        this.selectedIdentityId = id;
    };
}

Authenticate.propTypes = {
    identities: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
};

export default Authenticate;
