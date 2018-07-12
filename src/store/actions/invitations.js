import { apiCall } from '../../services/api';
import { addError, removeError } from './errors';
import { LOAD_INVITES, ADD_INVITE, REMOVE_INVITE } from '../actionTypes';

export const addInvite = (invite) => ({
	type: ADD_INVITE,
  invite
})

export const removeInvite = (id) => ({
	type: REMOVE_INVITE,
  id
})

export const loadInvites = (invites) => ({
	type: LOAD_INVITES,
  invites
})


export function deleteInvitation(data) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      return apiCall('delete', `/api/invitations/${data._id}`)
      .then((invite)=> {
        resolve(invite);
        dispatch(removeInvite(invite._id));
      })
      .catch((err)=> {
        dispatch(addError(err ? err.message : err));
        reject(err.message);
      })
    })
  }
}

export function addNewInvitation(data) {
  return dispatch => {
    return new Promise((resolve,reject) => {
        return apiCall('post', `/api/invitations`, data)
        .then((res) => {
          resolve(res);
          dispatch(addInvite(res))
        })
        .catch(err => {
          dispatch(addError(err ? err.message : err));
          reject(err.message);
        })
    });
  }
}

export function getInvitations() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall('get', '/api/invitations')
      .then((res)=> {
        resolve(res);
        dispatch(loadInvites(res))
      })
      .catch((err)=> {
        dispatch(addError(err ? err.message : err));
        reject(err);
      });
    });
  };
};
