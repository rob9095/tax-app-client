import { apiCall, teamworkApiCall } from '../../services/api';
import { LOAD_TEAMWORK_DATA, LOAD_PROJECTS_FROM_DB } from '../actionTypes';
import {addError, removeError} from './errors';
import { setCurrentUser, setAuthorizationToken } from './account';

export function loadDBProjects(projectsInDB) {
	return{
		type: LOAD_PROJECTS_FROM_DB,
		projectsInDB
	};
};

export function fetchTeamworkProjectData() {
  const url = 'https://taxsamaritan.teamwork.com/projects.json?status=ALL?createdAfterDate=2017-04-01?includePeople=true'
	return dispatch => {
		return new Promise((resolve,reject) => {
			return teamworkApiCall('get', url)
			.then((data) => {
				console.log(data);
				resolve();
			})
			.catch(err => {
        console.log(err);
				reject();
			})
		});
	}
};

export function fetchDBProjects() {
  return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('get', '/api/projects')
			.then((projects) => {
        dispatch(loadDBProjects(projects));
				resolve(projects);
			})
			.catch(err => {
				dispatch(addError(err ? err.message : err));
				reject(err ? err.message : err);
			})
		});
	}
}

export function getUserProfileImage(currentUser, email, updateCurrentUser) {
	// we know the company id so just hard coding it here
	// todo in future -> send request to get all companies, return list to show user, ask which company they want to link, use that id
	const url = `https://taxsamaritan.teamwork.com/companies/31966/people.json`;
	const key = currentUser.apiKey;
	return dispatch => {
		return new Promise((resolve,reject) => {
			return teamworkApiCall('get', url, key)
			.then(async (data) => {
				const user = data.people.filter((person) => person['email-address'].toLowerCase() === email.toLowerCase())
				if (user.length > 0 && updateCurrentUser) {
					const formattedUser = {
						email: currentUser.email,
						profileImageUrl: user[0]['avatar-url']
					}
					return new Promise((resolve,reject) => {
						return apiCall('post', `/api/account/update`, formattedUser)
						.then(({token, ...user}) => {
							localStorage.setItem('jwtToken', token);
							setAuthorizationToken(token);
							dispatch(setCurrentUser(user));
							dispatch(addError('Changes Saved!'));
							resolve(user);
						})
						.catch(err => {
							dispatch(addError(err ? err.message : err));
							reject(err);
						})
					})
				} else if (user.length > 0 && !updateCurrentUser) {
					resolve(user[0]['avatar-url'])
				} else {
					dispatch(addError(`No Teamwork users found with email ${email}`))
					reject(`No Teamwork users found with email ${email}`);
				}
			})
			.catch((err) => {
				dispatch(addError(err));
				reject(err);
			})
		})
	}
}

export function updateProjectsDB(currentUser) {
  const url = 'https://taxsamaritan.teamwork.com/projects.json?status=ACTIVE'
	return dispatch => {
		return new Promise((resolve,reject) => {
			let localResponse = null;
			return teamworkApiCall('get', url, currentUser.apiKey)
			.then(async (data) => {
        console.log(data);
        let projects = data.projects;
          // add each project to array, include name, id, created-on, status, category
          let formatedProjects = [];
          projects.forEach(p=> {
            formatedProjects.push({
              teamwork_id: p.id,
              name: p.name,
              createdOn: p['created-on'],
              status: p.status,
							preparer: p.category.name,
            })
          })
					// send formatted array to backend to add to DB
					const projectData = {
						"projects": formatedProjects//.filter(p=>p.teamwork_id === '246876')
					}
					let response = await handleLocalApiRequest(projectData, 'projects')
					resolve(response);
			})
			.catch(err => {
				console.log(err)
				dispatch(addError(err));
				reject(err);
			})
		});
	}
};

export const fetchAndUpdateTasklists = (id, apiKey) => {
    const url = `https://taxsamaritan.teamwork.com/projects/${id}/tasklists.json?status=all`
  	return dispatch => {
  		return new Promise((resolve,reject) => {
  			return teamworkApiCall('get', url, apiKey)
  			.then(async (data) => {
          let tasklists = data.tasklists;
            let formattedTaskLists = [];
            tasklists.forEach(t => {
              formattedTaskLists.push({
                teamwork_id: t.id,
                teamworkProject_id: t.projectId,
                projectName: t.projectName,
                taskName: t.name,
                complete: t.complete,
                status: t.status,
                uncompleteCount: t['uncomplete-count']
              })
            })
            // send formatted array to backend to add to DB
            const taskListData = {
              "tasklists": formattedTaskLists
            }
						let response = await handleLocalApiRequest(taskListData, 'tasklists')
  					resolve(response);
  			})
  			.catch(err => {
  				dispatch(addError(err ? err.message : err));
  				reject(err);
  			})
  		});
  	}
};


const handleLocalApiRequest = (data, type) => {
  return new Promise((resolve,reject) => {
    setTimeout(()=> {
      return apiCall('post', `/api/${type}`, data)
      .then((res) => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
    }, 100)
  });
}

const processChunk = (arr) => {
  return new Promise(async (resolve,reject) => {
    try {
      let formatedRequest = {
        milestones: arr
      }
      let result = await handleLocalApiRequest(formatedRequest, 'milestones');
      console.log(result);
      resolve();
    } catch(err) {
      reject(err);
    }
  })
}

const chunkifyArray = (arr) => {
  return new Promise(async (resolve,reject) => {
    try {
      let results = [];
      let chunkIndex = 0;
      const l = parseInt(arr.length);
      const totalChunks = parseInt(arr.length/50)
      const chunkLength = parseInt(l / totalChunks);
      for (let n = 1; n <= totalChunks; n++) {
        let chunk = [];
        if (n === totalChunks) {
          chunk = arr.slice(chunkIndex)
        } else {
          chunk = arr.slice(chunkIndex, chunkIndex + chunkLength)
        }
        chunkIndex = chunkIndex + chunkLength;
        results.push(chunk);
      }
      console.log(results);
      for (let chunk of results) {
        let result = await processChunk(chunk);
        resolve(result);
      }
    } catch(err) {
      reject(err);
    }
  })
}

export const fetchAndUpdateCompletedMilestones = (arr) => {
  const url = 'https://taxsamaritan.teamwork.com/milestones.json?find=completed&pageSize=1000';
  return dispatch => {
    return new Promise((resolve,reject) => {
      return teamworkApiCall('get', url)
      .then(async (data) => {
        let result = await chunkifyArray(data.milestones)
        resolve(result);
      })
      .catch(err => {
        console.log(err);
        reject();
      })
    });
  }
}
