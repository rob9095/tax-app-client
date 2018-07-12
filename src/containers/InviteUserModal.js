import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewInvitation, getInvitations } from '../store/actions/invitations';
import { addError, removeError } from '../store/actions/errors';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import InviteListItem from '../components/InviteListItem';
import { getUserProfileImage } from '../store/actions/teamworkApi';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: 20,
  }
});

class InviteUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: '',
      inputErrors: false,
      errMessage: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.getInvitations()
    .then((invites)=>{
      this.setState({
        isLoading: false,
      })
    })
    .catch(()=>{
      this.setState({
        errMessage: 'Trouble contacting server, please try again.',
        isLoading: false,
      })
    })
  }

  componentWillReceiveProps(newProps){
    if (newProps.errors.message !== ''){
      this.setState({
        errMessage: newProps.errors.message
      })
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.props.toggleModal();
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.toggleModal();
    this.props.removeError();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async() => {
    if (this.state.email.length <= 0) {
      this.setState({
        inputErrors: true,
        errMessage: 'Please enter a valid email',
        isLoading: false,
      });
      return
    }
    const profileImg = await this.props.getUserProfileImage(this.props.currentUser.user, this.state.email, false)
    if (!profileImg) {
      this.setState({
        inputErrors: true,
        errMessage: `No Teamwork users found with email ${this.state.email}`,
        isLoading: false,
      })
      return
    } else {
      console.log(profileImg)
      const inviteData = {
        invitedByEmail: this.props.currentUser.user.email,
        email: this.state.email,
        profileImageUrl: profileImg,
      }
      await this.props.addNewInvitation(inviteData)
      this.setState({
        email: '',
        inputErrors: false,
      })
    }
    this.setState({
      isLoading: false,
    })
  }

  closeErrors = () => {
    this.setState({
      inputErrors: false,
      errMessage: '',
    });
    this.props.removeError();
  }

  render() {
    const { classes, currentUser, errors, invitations} = this.props;
    let invites = invitations.map(i => (
      <InviteListItem
        key={i._id}
        invite={i}
      />
    ))
    return (
      <div>
        <Button
          onClick={this.handleOpen}
          className={classes.button}
          variant="raised"
          type="submit"
          color="primary">
          Invite New User
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <div className={classes.formContainer}>
              <h2 className={classes.title}>Invite New User</h2>
              {this.state.errMessage && (
                <Paper elevation={4} className="alert alert-error">
                  {this.state.errMessage}
                  <CloseIcon onClick={this.closeErrors} color="primary" className="alert-close" />
                </Paper>
              )}
              <FormControl>
                <Input
                  autoFocus
                  error={this.state.inputErrors}
                  autoComplete="off"
                  id="email"
                  type="text"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  className='centered'
                  placeholder="Email (must be same as Teamwork email)"
                />
              </FormControl>
              <Button
                onClick={this.handleSubmit}
                className={classes.button}
                variant="raised"
                type="submit"
                color="primary">
                Send Invite
              </Button>
            </div>
            <h3 className={classes.title}>
              {invites.length > 0 ?
                'Current Invites'
                :
                'No Invites Found'
              }
            </h3>
            {this.state.isLoading && (
              <CircularProgress size={24} />
            )}
            <List>
              {invites}
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}

InviteUserModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    invitations: state.invitations,
	};
}

export default withStyles(styles)(connect(mapStateToProps, { addError, removeError, addNewInvitation, getInvitations, getUserProfileImage })(InviteUserModal));
