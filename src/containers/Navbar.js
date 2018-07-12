import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NavbarDrawer from '../components/NavbarDrawer';
import { logout } from '../store/actions/auth';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    }
  }

  logout = e => {
    this.setState({
      redirect: true,
    })
    this.props.logout();
    setTimeout(()=>{
      this.setState({
        redirect: false,
      })
    },100)
  }

  render() {
    const { classes, errors, currentUser } = this.props;
    if (this.state.redirect) {
      return (
        <Redirect to="/signin" />
      )
    }
    return(
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <NavbarDrawer currentUser={currentUser} />
              <Typography variant="title" color="inherit" className={classes.flex}>
                <Link className="plain-a" to="/">Tax Samaritan</Link>
              </Typography>
              {currentUser.isAuthenticated ?
                <Button onClick={this.logout} color="inherit">Logout</Button>
              :
                <div>
                  <Link className="plain-a" to="/signin"><Button color="inherit">Login</Button></Link>
                  <Link className="plain-a" to="/signup"><Button color="inherit">Sign Up</Button></Link>
                </div>
              }
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    projects: state.projects
	};
}

export default compose(withStyles(styles), connect(mapStateToProps, { logout }), )(Navbar);
