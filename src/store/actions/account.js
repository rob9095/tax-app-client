import { apiCall, setTokenHeader } from '../../services/api';
import { SET_CURRENT_USER } from '../actionTypes';
import {addError, removeError} from './errors';

export function setCurrentUser(user) {
	return{
		type: SET_CURRENT_USER,
		user
	};
};

export function setAuthorizationToken(token) {
	setTokenHeader(token);
}

export function updateUser(updateData) {
	return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('post', `/api/account/update`, updateData)
			.then(({token, ...user}) => {
				localStorage.setItem('jwtToken', token);
				setAuthorizationToken(token);
				dispatch(setCurrentUser(user));
				dispatch(addError('Changes Saved!'));
				resolve();
			})
			.catch(err => {
				dispatch(addError(err ? err.message : err));
				reject();
			})
		});
	}
};
