import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteInvitation } from '../store/actions/invitations';
import { addError, removeError } from '../store/actions/errors';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class InvitationListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete = () => {
    this.props.deleteInvitation({...this.props.invite});
  }

  render() {
    const { invite } = this.props;
    return(
      <ListItem
        button={true}
        key={invite._id}
        >
        <ListItemText
          primary={invite.email}
          secondary={`Invited By: ${invite.invitedByEmail}`}
        />
        <Tooltip title="Delete">
          <IconButton
            onClick={this.handleDelete}
            aria-label="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItem>
    )
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    invitations: state.invitations,
	};
}

export default connect(mapStateToProps, { addError, removeError, deleteInvitation })(InvitationListItem);
