import { apiCall, teamworkApiCall } from '../../services/api';
import { addError } from './errors';
import { REMOVE_PROJECT } from '../actionTypes';

export const removeProject = (id) => ({
	type: REMOVE_PROJECT,
  id
})

export function getDetailedProjects() {
  return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('get', '/api/projects/detailed')
			.then((projects) => {
				resolve(projects);
			})
			.catch(err => {
				dispatch(addError(err ? err.message : err));
				reject(err);
			})
		});
	}
}

export function mapTasksToProjects(data) {
  return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('post', '/api/projects/map-projects', data)
			.then((data) => {
				resolve(data);
			})
			.catch(err => {
				dispatch(addError(err ? err.message : err));
				reject(err);
			})
		});
	}
}

export function deleteProject(teamwork_id) {
  return dispatch => {
    return new Promise((resolve,reject) => {
      return apiCall('delete', `/api/projects/delete/${teamwork_id}`)
      .then((project)=>{
        resolve(project)
        dispatch(removeProject(project._id))
      })
      .catch((err)=>{
        dispatch(addError(err ? err.message : err))
      })
    })
  }
}
