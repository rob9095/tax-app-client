import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { deleteProject } from '../store/actions/projects';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import SaveViewModal from '../containers/SaveViewModal';
import CircularProgress from '@material-ui/core/CircularProgress';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class ProjectTableToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchLoading: false,
      saveLoading: false,
      showSaveModal: false,
      searchOpen: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.openSaveModal === true && this.props.openSaveModal === false) {
      this.setState({
        showSaveModal: true,
        saveLoading: false,
      })
      this.props.toggleSaveModel();
    }
    if (newProps.searchViewOpen === true && this.props.searchViewOpen === false){
      this.setState({
        searchLoading: false,
      })
    }
    if (newProps.searchViewOpen === false && this.state.searchOpen === false){
      this.setState({
        searchLoading: false,
      })
    }
  }

  toggleSearch = () => {
    this.setState({
      searchOpen: !this.state.searchOpen,
      searchLoading: true,
    })
    setTimeout(()=>{
      this.props.toggleSearchView();
    },100)
  }

  toggleSaveViewModal = () => {
    this.setState({
      showSaveModal: !this.state.showSaveModal,
    })
  }

  handleSaveView = () => {
    this.setState({
      saveLoading: true,
    })
    setTimeout(()=>{
      this.props.toggleGetHeadState();
    },100)
  }

  handleDelete = async() => {
    this.props.toggleLoad();
    console.log(this.props.selectedProjects)
    let counter = 0;
    for (let id of this.props.selectedProjects) {
      await this.props.deleteProject(id);
      await this.props.onProjectDelete(id);
      counter++
    }
    if (counter === this.props.selectedProjects.length || this.props.selectedProjects.length === 0) {
      this.props.toggleLoad();
    }
  }

  render() {
    const { numSelected, classes, currentTasks, bodyState } = this.props;
    console.log(this.props.bodyState)
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {this.state.showSaveModal && (
          <SaveViewModal tasks={currentTasks} tableData={bodyState} toggleModal={this.toggleSaveViewModal} />
        )}
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title">Projects</Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={this.handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <div className="toolbar-container">
              <Tooltip title="Save View">
                <IconButton
                  disableRipple={true}
                  aria-label="Save View"
                  onClick={this.handleSaveView}
                  >
                    {this.state.saveLoading && this.props.rowsPerPage > 180 ?
                      <CircularProgress size={24} />
                      :
                      <SaveIcon />
                    }
                </IconButton>
              </Tooltip>
              <Tooltip title="Search">
                <IconButton
                  disableRipple={true}
                  aria-label="Search"
                  onClick={this.toggleSearch}
                >
                  {this.state.searchLoading && this.props.rowsPerPage > 180 ?
                    <CircularProgress size={24} />
                    :
                    <SearchIcon />
                   }
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Toolbar>
    );
  }
}

ProjectTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    projects: state.projects,
    tableState: state.tableState,
    savedView: state.savedView,
    defaultView: state.defaultView,
	};
}

export default compose(withStyles(toolbarStyles), connect(mapStateToProps, { deleteProject }), )(ProjectTableToolbar);
