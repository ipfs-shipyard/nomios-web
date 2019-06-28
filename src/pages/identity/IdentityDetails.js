/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { connectIdmWallet } from 'react-idm-wallet';
import { TrashIcon, CopyIcon, EditIcon, SplitButton, withModalGlobal } from '@nomios/web-uikit';
import { IpfsAvatar } from '../../shared/components/ipfs';
import EditProfile from '../../modals/edit-profile';
import BackupIdentity from '../../modals/backup-identity';
import styles from './IdentityDetails.css';

const IdentityAttribute = (props) => {
    const { title, value } = props;

    return (
        <div className={ styles.attribute }>
            <div className={ styles.title }>{ title.toUpperCase() }</div>
            <div className={ styles.value }>{ value }</div>
        </div>
    );
};

IdentityAttribute.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
};

class IdentityDetails extends Component {
    actions = undefined;

    render() {
        const { did, profileDetails, isBackupComplete } = this.props;
        const { name, image, dateOfBirth, nationality, address, gender } = profileDetails;
        const { mainActionId, actions } = this.getActions(isBackupComplete);

        return (
            <div className={ styles.detailsWrapper }>
                <IpfsAvatar name={ name } image={ image } className={ styles.avatar } />
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
                    <SplitButton
                        variant="negative"
                        actions={ actions }
                        mainActionId={ mainActionId }
                        onActionClick={ this.handleActionClick } />
                </div>
            </div>
        );
    }

    getActions = memoizeOne((isBackupComplete) => {
        const mainActionId = isBackupComplete ? 'edit' : 'backup';
        const defaultActions = [
            { id: 'edit', icon: <EditIcon />, text: 'Edit' },
            { id: 'delete', icon: <TrashIcon />, text: 'Delete' },
        ];
        const actions = isBackupComplete ?
            defaultActions :
            [...defaultActions, { id: 'backup', icon: <CopyIcon />, text: 'Backup' }];

        return {
            mainActionId,
            actions,
        };
    });

    handleActionClick = (actionId) => {
        const { id, globalModal } = this.props;

        switch (actionId) {
        case 'backup':
            globalModal.openModal(<BackupIdentity id={ id } />);
            break;
        case 'edit':
            globalModal.openModal(<EditProfile id={ id } />);
            break;
        case 'delete':
            alert('Delete not implemented yet');
            break;
        default:
            break;
        }
    };
}

IdentityDetails.propTypes = {
    id: PropTypes.string.isRequired,
    did: PropTypes.string.isRequired,
    globalModal: PropTypes.object.isRequired,
    profileDetails: PropTypes.object.isRequired,
    isBackupComplete: PropTypes.bool.isRequired,
};

const WrappedIdentityDetails = withModalGlobal(IdentityDetails);

export default connectIdmWallet((idmWallet) => (ownProps) => ({
    did: idmWallet.identities.get(ownProps.id).getDid(),
    profileDetails: idmWallet.identities.get(ownProps.id).profile.getDetails(),
    isBackupComplete: idmWallet.identities.get(ownProps.id).backup.isComplete(),
}))(WrappedIdentityDetails);
