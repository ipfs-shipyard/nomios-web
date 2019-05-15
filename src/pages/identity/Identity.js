import React from 'react';
import PropTypes from 'prop-types';

const Identity = ({ match }) => <div>This is the identity page of { match.params.id }!</div>;

Identity.propTypes = {
    match: PropTypes.object.isRequired,
};

export default Identity;
