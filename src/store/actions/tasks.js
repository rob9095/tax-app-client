import { apiCall, teamworkApiCall } from '../../services/api';
import { LOAD_TEAMWORK_DATA, LOAD_PROJECTS_FROM_DB } from '../actionTypes';
import {addError, removeError} from './errors';

const buildPages = (num) => {
	let pageCount = num
	let pages = [];
	for (let n = 1; n<=pageCount; n++ ) {
		pages.push(n)
	}
	return pages;
}

const handleLocalApiRequest = (data, type) => {
  return new Promise((resolve,reject) => {
    setTimeout(()=> {
			console.log(data)
      return apiCall('post', `/api/${type}`, data)
      .then((res) => {
        resolve(res);
        console.log(res);
      })
      .catch(err => {
        reject(err);
      })
    }, 250)
  });
}

export const requestAndUpdateTasks = (project_id, apiKey) => {
  const url = `https://taxsamaritan.teamwork.com/projects/${project_id}/tasks.json?includeCompletedTasks=true&pageSize=250`
	return dispatch => {
		return new Promise((resolve,reject) => {
			return teamworkApiCall('get', url, apiKey)
			.then(async (data) => {
	      let result = await handleLocalApiRequest(data, 'tasks');
	      resolve(result);
			})
			.catch(err => {
				reject(err);
			})
		});
	}
}
