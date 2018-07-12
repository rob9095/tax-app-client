
import { LOAD_TEAMWORK_DATA, LOAD_PROJECTS_FROM_DB, REMOVE_PROJECT } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case LOAD_TEAMWORK_DATA:
      return {
        data: action.projects
      };
    case LOAD_PROJECTS_FROM_DB:
      return {
        projectsInDB: action.projectsInDB
      }
    case REMOVE_PROJECT:
      return {
        projectsInDB: [...state.projectsInDB.filter(project => project._id !== action.id)]
      }
    default:
      return state;
  }
}
