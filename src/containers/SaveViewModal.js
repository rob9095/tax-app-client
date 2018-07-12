import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNewInvitation, getInvitations } from '../store/actions/invitations';
import { addError, removeError } from '../store/actions/errors';
import { addSavedTableView, getSavedTableViews } from '../store/actions/savedTableViews';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import SavedViewTabs from './SavedViewTabs';

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
    width: theme.spacing.unit * 50,
    minWidth: 500,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 4,
    maxHeight: 800,
    overflowY: 'auto',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    margin: '0 auto',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class SaveViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: '',
      inputErrors: false,
      errMessage: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({
      open: true,
    })
    this.props.getSavedTableViews('shared')
    this.props.getSavedTableViews(this.props.currentUser.user.id)
    .then(()=>{
      this.setState({
        isLoading: false,
      })
    })
    .catch(err => {
      this.props.addError(err)
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

  handleSubmit = () => {
    if (this.state.title.length <= 0) {
      this.setState({
        inputErrors: true,
        errMessage: 'Please enter a name',
      });
      return
    }

    const tableBodyState = {
      ...this.props.tableData,
    };
    const tableHeadState = {
      ...this.props.tableData.headState,
      tasks: this.props.tasks,
    }
    delete tableHeadState.currentEvent;
    delete tableHeadState.columnData;
    delete tableBodyState.data;
    delete tableBodyState.dataCopy;
    delete tableBodyState.getHeaderState;
    delete tableBodyState.showSaveModal;
    delete tableBodyState.headState;
    const viewData = {
      table: 'projects',
      title: this.state.title,
      user: this.props.currentUser.user.id,
      username: this.props.currentUser.user.username,
      profileImageUrl: this.props.currentUser.user.profileImageUrl,
      headerState: tableHeadState,
      bodyState: tableBodyState,
    }
    this.props.addSavedTableView(viewData)
    .then(()=>{
      this.setState({
        inputErrors: false,
        errMessage: '',
        title: '',
      })
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
    const { classes, currentUser, errors, savedViews, sharedViews } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            {this.state.errMessage && (
              <Paper elevation={4} className="alert alert-error">
                {this.state.errMessage}
                <CloseIcon onClick={this.closeErrors} color="primary" className="alert-close" />
              </Paper>
            )}
            <div className={classes.formContainer}>
              <FormControl>
                <Input
                  autoFocus
                  error={this.state.inputErrors}
                  autoComplete="off"
                  id="title"
                  type="text"
                  name="title"
                  onChange={this.handleChange}
                  value={this.state.title}
                  className="centered"
                  placeholder="View Name"
                />
              </FormControl>
              <Button
                onClick={this.handleSubmit}
                className={classes.button}
                variant="raised"
                type="submit"
                color="primary">
                Save Current View
              </Button>
            </div>
            <SavedViewTabs
              isLoading={this.state.isLoading}
              savedViews={savedViews}
              sharedViews={sharedViews}
            />
            {/* <h4>Saved Views</h4> */}
            {/* <ul className="view-list">
              {views}
            </ul> */}
          </div>
        </Modal>
      </div>
    );
  }
}

SaveViewModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    tableState: state.tableState,
    savedViews: state.savedViews,
    sharedViews: state.sharedViews,
	};
}

export default withStyles(styles)(connect(mapStateToProps, { addError, removeError, addSavedTableView, getSavedTableViews })(SaveViewModal));
