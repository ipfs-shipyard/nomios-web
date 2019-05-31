import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { Avatar, Button, EditIcon } from '@nomios/web-uikit';
import styles from './IdentityDetails.css';

const IdentityAttribute = (props) => {
    const { title, value } = props;

    return (
        <div className={ styles.attribute }>
            <div className={ styles.title }>{title.toUpperCase()}</div>
            <div className={ styles.value }>{value}</div>
        </div>
    );
};

IdentityAttribute.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
};

class IdentityDetails extends PureComponent {
    render() {
        const { name,
            image,
            didMethod,
            documentId,
            dateOfBirth,
            nationality,
            location,
            gender } = this.buildDetailsObject();

        return (
            <div className={ styles.detailsWrapper }>
                <Avatar name={ name } image={ image } className={ styles.avatar } />
                <h1 className={ styles.name }>{ name }</h1>
                <div className={ styles.did }>{ didMethod } | did:{didMethod}:{documentId}</div>
                <div className={ styles.lowerBar }>
                    <div className={ styles.attributes }>
                        { dateOfBirth &&
                            <IdentityAttribute title="Date of birth" value={ dateOfBirth } /> }
                        { gender &&
                            <IdentityAttribute title="Gender" value={ gender } /> }
                        { nationality &&
                            <IdentityAttribute title="Nationality" value={ nationality } /> }
                        { location &&
                            <IdentityAttribute title="Location" value={ location } /> }
                    </div>
                    <Button variant="negative" className={ styles.editButton } onClick={ this.handleEdit }>
                        Edit<span className={ styles.profileSpan }> Profile</span> <EditIcon className={ styles.buttonIcon } />
                    </Button>
                </div>
            </div>
        );
    }

    buildDetailsObject() {
        const { profileDetails, id } = this.props;

        const details = {
            didMethod: 'ipid',
            documentId: id,
        };

        Object.assign(details, profileDetails);

        return details;
    }

    handleEdit = () => {
        alert('Edit profile');
    };
}

IdentityDetails.propTypes = {
    id: PropTypes.string.isRequired,
    profileDetails: PropTypes.object.isRequired,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    profileDetails: idmWallet.identities.get(ownProps.id).profile.getDetails(),
}))(IdentityDetails);
