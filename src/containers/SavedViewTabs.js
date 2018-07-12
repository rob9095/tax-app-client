import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { addError, removeError } from '../store/actions/errors';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SavedViewListItem from '../components/SavedViewListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 700,
  },
  container: {
    margin: '0 auto',
  },
  noResults: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
});

class SavedViewTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.props.removeError();
    this.setState({ value });
  };

  render() {
    const { classes, savedViews, sharedViews, isLoading } = this.props;
    const { value } = this.state;
    {if (isLoading) {
      return (
        <span>loading..</span>
      )
    }}
    let views = value === 0 ?
      savedViews.map(v => (
        <SavedViewListItem
          key={v._id}
          view={v}
          sharedView={false}
          isShared={v.isShared}
        />
      ))
      :
      sharedViews.filter(v => v.username !== this.props.currentUser.user.username)
      .map(v => (
        <SavedViewListItem
          key={v._id}
          view={v}
          sharedView={true}
          isShared={v.isShared}
        />
      ))
    return (
      <div className={classes.container}>
        <div className={classes.root}>
          <Paper className={classes.root} elevation={0}>
            <AppBar color="inherit" position="static" elevation={0}>
              <Tabs fullWidth={true} value={value} onChange={this.handleChange}>
                <Tab label="My Views" />
                <Tab label="Shared Views" />
              </Tabs>
            </AppBar>
            {value === 0 &&
              <TabContainer>
                <List>
                  <ListItem
                    className="view-item"
                    key="header"
                    disableGutters={true}
                    dense
                    >
                    <ListItemText className="view-header" primary="Title" />
                    <span className="view-header">Default</span>
                    <span className="view-header">Share</span>
                    <span className="view-header">Trash</span>
                  </ListItem>
                  {views.length > 0 ? views : <span className={classes.noResults}>No views found</span>}
                </List>
              </TabContainer>
            }
            {value === 1 &&
              <TabContainer>
                <List>
                  <ListItem
                    className="view-item"
                    key="header"
                    disableGutters={true}
                    dense
                    >
                    <ListItemText className="view-header" primary="Saved By" />
                    <span className="view-header">Default</span>
                  </ListItem>
                  {views.length > 0 ? views : <span className={classes.noResults}>No views found</span>}
                </List>
              </TabContainer>
            }
          </Paper>
        </div>
      </div>
    );
  }
}

SavedViewTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
		errors: state.errors,
    savedViews: state.savedViews,
  };
}

export default compose(withStyles(styles), connect(mapStateToProps, {removeError, addError}), )(SavedViewTabs);
