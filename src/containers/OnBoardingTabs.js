import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AuthForm from '../components/AuthForm';
import { authUser } from '../store/actions/auth';
import { removeError } from '../store/actions/errors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

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
  },
});

class OnBoardingTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.props.removeError();
    this.setState({ value });
  };

  render() {
    const { classes, errors, authUser, history } = this.props;
    const { value } = this.state;

    return (
      <div className="onboarding-container">
        <div className={classes.root}>
          <Paper className={classes.root} elevation={4}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 &&
              <TabContainer>
                <AuthForm
                  removeError={removeError}
                  onAuth={authUser}
                  buttonText="Log In"
                  heading="Welcome Back"
                  errors={errors}
                  history={history}
                />
              </TabContainer>
            }
            {value === 1 &&
              <TabContainer>
                <AuthForm
                  removeError={removeError}
                  onAuth={authUser}
                  buttonText="Sign Up"
                  heading="Create Account"
                  errors={errors}
                  history={history}
                  signUp
                />
              </TabContainer>
            }
          </Paper>
        </div>
      </div>
    );
  }
}

OnBoardingTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
		errors: state.errors
  };
}

export default compose(withStyles(styles), connect(mapStateToProps, { authUser, removeError }), )(OnBoardingTabs);
