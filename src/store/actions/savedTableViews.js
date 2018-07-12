import { apiCall } from '../../services/api';
import { addError, removeError } from './errors';
import { REMOVE_VIEW, ADD_VIEW, LOAD_VIEWS, LOAD_SHARED_VIEWS, TOGGLE_VIEW_SHARE } from '../actionTypes';

export const toggleIsShared = (view) => ({
	type: TOGGLE_VIEW_SHARE,
	view
})

export const addView = (view) => ({
	type: ADD_VIEW,
  view
})

export const removeView = (id) => ({
	type: REMOVE_VIEW,
  id
})

export const loadViews = (views) => ({
	type: LOAD_VIEWS,
  views
})

export const loadSharedViews = (views) => ({
	type: LOAD_SHARED_VIEWS,
	views
})

export const saveState = (state, stateType) => ({
  type: stateType,
  state
})

export function saveTableState(state, stateType) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      if (state) {
        dispatch(saveState(state, stateType));
        resolve(state)
      } else {
        dispatch(addError('Please try again'))
        reject();
      }
    })
  }
}

export function deleteSavedTableView(view) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      return apiCall('delete', `/api/saved-views/${view._id}`)
      .then((view)=> {
        resolve(view);
        dispatch(removeView(view._id));
      })
      .catch((err)=> {
        dispatch(addError(err ? err.message : err));
        reject(err.message);
      })
    })
  }
}

export function addSavedTableView(view) {
  return dispatch => {
    return new Promise((resolve,reject) => {
        return apiCall('post', `/api/saved-views`, view)
        .then((res) => {
          resolve(res);
          dispatch(addView(res))
        })
        .catch(err => {
          dispatch(addError(err ? err.message : err));
          reject(err.message);
        })
    });
  }
}

export function getSavedTableViews(user_id) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return apiCall('get', `/api/saved-views/${user_id}`)
      .then((res)=> {
        resolve(res);
        user_id === 'shared' ? dispatch(loadSharedViews(res)) : dispatch(loadViews(res))
      })
      .catch((err)=> {
        dispatch(addError(err ? err.message : err));
        reject(err);
      });
    });
  };
};

export function toggleSharedView(viewData) {
	return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('post', `/api/saved-views/share`, viewData)
			.then((view) => {
				dispatch(toggleIsShared(view))
				resolve(view)
			})
			.catch(err=>{
				dispatch(addError(err ? err.message : err))
				reject(err);
			})
		})
	}
}

export function checkDefaultViewBeforeDelete(viewData) {
	return dispatch => {
		return new Promise((resolve, reject) => {
			return apiCall('post', `/api/saved-views/check-default`, viewData)
			.then((res) => {
				resolve(res);
			})
			.catch(err => {
				dispatch(addError(err ? err.message : err));
				reject(err);
			})
		})
	}
}
