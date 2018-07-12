import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Dashboard from './Dashboard'
import Setup from '../components/Setup';
import SetupSteps from './SetupSteps';
import AuthForm from '../components/AuthForm';
import { authUser } from '../store/actions/auth';
import { removeError } from '../store/actions/errors';
import Grid from '@material-ui/core/Grid';
import AccountPage from './AccountPage';

const Main = props => {
	const {authUser, errors, removeError, currentUser } = props;
	return(
		<Grid container spacing={24} className="container">
			<Grid item xs={12}>
				<div>
					<Switch>
						<Route exact path="/account" render={props => <AccountPage currentUser={currentUser} {...props} />} />
						<Route exact path="/setup" render={props => <SetupSteps currentUser={currentUser} {...props} />} />
						<Route exact path="/" render={props => <Dashboard currentUser={currentUser} {...props} />} />
						<Route exact path="/dashboard" render={props => <Dashboard currentUser={currentUser} {...props} />} />
						<Route
							exact
							path="/signin"
							render={props => {
								return (
									<AuthForm
										removeError={removeError}
										errors={errors}
										onAuth={authUser}
										buttonText="Log In"
										heading="Welcome Back"
										{...props}
									/>
								);
							}}
						/>
						<Route
							exact
							path="/signup"
							render={props => {
								return (
									<AuthForm
										removeError={removeError}
										errors={errors}
										onAuth={authUser}
										signUp
										buttonText="Sign Up"
										heading="Create Account"
										{...props}
									/>
								);
							}}
						/>
					</Switch>
				</div>
			</Grid>
		</Grid>
	);
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
		errors: state.errors
	};
}

export default withRouter(connect(mapStateToProps, { authUser, removeError })(Main));
