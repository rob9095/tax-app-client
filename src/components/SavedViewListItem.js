import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { handleSavedViewDisplay, clearSavedViewDisplay, setDefaultView } from '../store/actions/savedTableView';
import { deleteSavedTableView, toggleSharedView, checkDefaultViewBeforeDelete } from '../store/actions/savedTableViews';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveViewConfirmation from '../containers/RemoveViewConfirmation';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
});

class SavedViewListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDefault: false,
      defaultTitle: null,
      showDeleteConfirmation: false,
      userData: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleShareClick = (e) => {
    const viewData = {
      viewId: this.props.view._id,
      username: this.props.currentUser.user.username,
    }
    this.props.toggleSharedView(viewData)
    e.stopPropagation();
  }

  handleDelete = () => {
    this.props.deleteSavedTableView(this.props.view);
    this.props.clearSavedViewDisplay(this.props.view);
  }

  handleDeleteClick = (e) => {
    this.props.checkDefaultViewBeforeDelete({
      viewId: this.props.view._id,
      username: this.props.currentUser.user.username,
    })
    .then((res)=>{
      if (res.message === 'users found') {
        this.setState({
          showDeleteConfirmation: true,
          userData: res.userData,
        })
      } else {
        this.handleDelete();
      }
    })
    e.stopPropagation();
  }

  handleClick = () => {
    this.props.handleSavedViewDisplay(this.props.view);
  }

  handleSetDefaultView = (e) => {
    const userId = this.props.currentUser.user.id
    const viewId = this.props.view._id
    this.props.setDefaultView({
      userId,
      viewId,
    })
    e.stopPropagation();
  }

  handleConfirmClose = () => {
    this.setState({
      showDeleteConfirmation: false,
    })
  }

  render() {
    const { view, sharedView, isShared } = this.props;
    const { showDeleteConfirmation } = this.state;
    const isDefault = this.props.defaultView[0] !== null ? this.props.defaultView[0].title === this.props.view.title : false
    return (
      <span>
        {showDeleteConfirmation ?
          <Paper className="delete-confirm" elevation={4}>
            <h4>Are you sure?</h4>
            <h5>We found {this.state.userData.length} {this.state.userData.length > 1 ? 'users' : 'user'} with this view set as their default</h5>
            <span className="confirm-options">
              <span onClick={this.handleDelete} className="confirm-option">Yes</span>
              <span onClick={this.handleConfirmClose} className="confirm-option">No</span>
            </span>
          </Paper>
         :
          null
        }
        <ListItem
          className="view-item"
          onClick={this.handleClick}
          key={view._id}
          disableGutters={true}
          dense
          button
          >
            {sharedView && (<Avatar alt={view.username} src={view.profileImageUrl} />)}
            <ListItemText
              primary={view.title}
              secondary={sharedView && (view.username)}
            />
            <Tooltip title={isDefault ? '' : 'Set Default View'}>
              <IconButton
                onClick={this.handleSetDefaultView}
                aria-label={isDefault ? '' : 'Set Default View'}
                >
                {isDefault ? <StarIcon className="star filled" /> : <StarIcon /> }
              </IconButton>
            </Tooltip>
            {!sharedView && (
                <Tooltip title={isShared ? 'Un Share' : 'Share'}>
                  <IconButton
                    onClick={this.handleShareClick}
                    aria-label={isShared ? 'Un Share' : 'Share'}
                    >
                    <FavoriteIcon
                      className={isShared ? 'share filled' : null}
                    />
                  </IconButton>
                </Tooltip>
              )}
              {!sharedView && (
                <Tooltip title="Delete">
                  <IconButton
                    onClick={this.handleDeleteClick}
                    aria-label="Delete"
                    >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
        </ListItem>
      </span>
    );
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    tableState: state.tableState,
    savedViews: state.savedViews,
    savedView: state.savedView,
    defaultView: state.defaultView,
	};
}

export default connect(mapStateToProps, { handleSavedViewDisplay, clearSavedViewDisplay, deleteSavedTableView, toggleSharedView, setDefaultView, checkDefaultViewBeforeDelete })(SavedViewListItem);
