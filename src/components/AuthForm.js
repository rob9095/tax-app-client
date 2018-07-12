import React, { Component } from 'react';
import { Switch, Route, withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { authUser } from '../store/actions/auth';
import { addError, removeError } from '../store/actions/errors';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
		width: '100%',
		fontSize: '.95rem',
  },
	button: {
		margin: theme.spacing.unit,
		marginTop: 20,
		width: '100%',
	}
});

class AuthForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			username: '',
			password: '',
			passwordCheck: '',
			profileImageUrl: '',
		};
	}

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	closeErrors = () => {
		this.props.removeError();
	}

	handleSubmit = e => {
		e.preventDefault();
		if (this.state.password !== this.state.passwordCheck && this.props.signUp) {
			this.props.addError('Passwords must match')
			return
		}
		if (this.state.username.length <= 4 && this.props.signUp) {
			this.props.addError('Choose a username longer than 4 characters')
			return
		}
		const authType = this.props.signUp ? 'signup' : 'signin';
		this.props.onAuth(authType, this.state).then(() => {
			this.props.history.push('/dashboard');
		})
		.catch(() => {
			return;
		});
	};

	render() {
		const { email, username, password, passwordCheck, profileImageUrl } = this.state;
		const { classes, signUp, heading, buttonText, errors, history, removeError } = this.props;
		// history.listen(() => {
		// 	removeError();
		// });
		return(
		<div>
			<div className="form-container">
				<div>
					<form className="auth-form" onSubmit={this.handleSubmit}>
						<h2>{heading}</h2>
						{errors.message && (
							<Paper elevation={4} className="alert alert-error">
								{errors.message}
								<CloseIcon onClick={this.closeErrors} color="primary" className="alert-close" />
							</Paper>
						)}
            {signUp && (
								<Input
									autoComplete="off"
									id="username"
									name="username"
									onChange={this.handleChange}
									value={username}
									type="text"
									placeholder="Username"
									className={classes.input}
									inputProps={{'aria-label': 'Description',}}
								/>
						)}
							<Input
								autoComplete="off"
								id="email"
								name="email"
								onChange={this.handleChange}
								value={email}
								type="text"
								placeholder="Email (same as Teamwork email)"
	        			className={classes.input}
	        			inputProps={{'aria-label': 'Description',}}
							/>
							<Input
								autoComplete="off"
								className="form-control"
								id="password"
								name="password"
								onChange={this.handleChange}
								type="password"
								placeholder="Password"
								className={classes.input}
								inputProps={{'aria-label': 'Description',}}
								error={this.state.password !== this.state.passwordCheck && signUp ? true : false}
							/>
						{/* <label htmlFor="email">Email:</label>
						<input
							autoComplete="off"
							className="form-control"
							id="email"
							name="email"
							onChange={this.handleChange}
							value={email}
							type="text"
						/> */}
						{/* <label htmlFor="password">Password:</label>
						<input
							autoComplete="off"
							className="form-control"
							id="password"
							name="password"
							onChange={this.handleChange}
							type="password"
						/> */}
						{signUp && (
								<Input
									autoComplete="off"
									id="passwordCheck"
									name="passwordCheck"
									onChange={this.handleChange}
									value={passwordCheck}
									type="password"
									placeholder="Confirm Password"
									className={classes.input}
									inputProps={{'aria-label': 'Description',}}
									error={this.state.password !== this.state.passwordCheck ? true : false}
								/>
						)}
						<Button className={classes.button} variant="raised" type="submit" color="primary">{buttonText}</Button>
            {signUp ?
              <Link className="plain-a text" to="/signin">Already have an account? Sign In</Link>
              :
              <Link className="plain-a text" to="/signup">Create an Account</Link>
            }
						{/* <button type="submit" className="btn btn-primary btn-block btn-lg">
							{buttonText}
						</button> */}
					</form>
				</div>
			</div>
		</div>
		)
	}
}

AuthForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
		errors: state.errors
	};
}

export default  withRouter(compose(withStyles(styles), connect(mapStateToProps, { authUser, removeError, addError }),)(AuthForm));
