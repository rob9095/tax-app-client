import { addError, removeError } from './errors';
import { apiCall } from '../../services/api';
import { LOAD_SAVED_VIEW, CLEAR_SAVED_VIEW, LOAD_DEFAULT_VIEW, LOAD_FULL_DEFAULT_VIEW, CLEAR_FULL_DEFAULT_VIEW } from '../actionTypes';

export const clearDisplayView = (id) => ({
  type: CLEAR_SAVED_VIEW,
  id
})

export const displayView = (view) => ({
  type: LOAD_SAVED_VIEW,
  view
})

export const loadDefaultView = (id) => ({
  type: LOAD_DEFAULT_VIEW,
  id
})

export const loadFullDefaultView = (view) => ({
  type: LOAD_FULL_DEFAULT_VIEW,
  view
})

export const clearFullDefaultView = (id) => ({
  type: CLEAR_FULL_DEFAULT_VIEW,
  id
})

export function clearSavedViewDisplay(view) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      if (view) {
        dispatch(clearDisplayView(view._id));
        resolve(view)
      } else {
        dispatch(addError('Please try again'))
        reject();
      }
    })
  }
}

export function handleSavedViewDisplay(view) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      if (view) {
        console.log(view)
        dispatch(displayView(view));
        resolve(view)
      } else {
        dispatch(addError('Please try again'))
        reject();
      }
    })
  }
}

export function setDefaultView(data) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      return apiCall('post', `/api/saved-views/default`, data)
      .then((view)=>{
        //dispatch(loadDefaultView(view._id))
        data.remove === true ? dispatch(clearFullDefaultView(view._id)) : dispatch(loadFullDefaultView(view))
        resolve(view)
      })
      .catch((err)=>{
        dispatch(addError(err ? err.message : err))
        reject(err);
      })
    })
  }
}

export function fetchDefaultView(user_id) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      return apiCall('get', `/api/saved-views/default/${user_id}`)
      .then((view)=>{
        dispatch(loadFullDefaultView(view))
        resolve(view)
      })
      .catch((err)=>{
        dispatch(addError(err ? err.message : err))
        reject(err);
      })
    })
  }
}
