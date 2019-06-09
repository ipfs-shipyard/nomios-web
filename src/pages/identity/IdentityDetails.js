import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connectIdmWallet } from 'react-idm-wallet';
import { ModalTrigger, Avatar, Button, EditIcon } from '@nomios/web-uikit';
import EditProfile from '../../modals/edit-profile';
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

class IdentityDetails extends Component {
    render() {
        const { id, did, profileDetails } = this.props;
        const { name, image, dateOfBirth, nationality, address, gender } = profileDetails;

        return (
            <div className={ styles.detailsWrapper }>
                <Avatar name={ name } image={ image } className={ styles.avatar } />
                <h1 className={ styles.name }>{ name }</h1>
                <div className={ styles.did }>{ did }</div>
                <div className={ styles.lowerBar }>
                    <div className={ styles.attributes }>
                        { dateOfBirth &&
                            <IdentityAttribute title="Date of birth" value={ dateOfBirth } /> }
                        { gender &&
                            <IdentityAttribute title="Gender" value={ gender } /> }
                        { nationality &&
                            <IdentityAttribute title="Nationality" value={ nationality } /> }
                        { address &&
                            <IdentityAttribute title="Location" value={ address } /> }
                    </div>
                    <ModalTrigger modal={ <EditProfile id={ id } /> }>
                        <Button variant="negative" className={ styles.editButton } onClick={ this.handleEdit }>
                            Edit<span className={ styles.profileSpan }> Profile</span> <EditIcon className={ styles.buttonIcon } />
                        </Button>
                    </ModalTrigger>
                </div>
            </div>
        );
    }

    handleEdit = () => {
        alert('Edit profile');
    };
}

IdentityDetails.propTypes = {
    id: PropTypes.string.isRequired,
    did: PropTypes.string.isRequired,
    profileDetails: PropTypes.object.isRequired,
};

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    did: idmWallet.identities.get(ownProps.id).getDid(),
    profileDetails: idmWallet.identities.get(ownProps.id).profile.getDetails(),
}))(IdentityDetails);
