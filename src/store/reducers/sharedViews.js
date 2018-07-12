import { LOAD_SHARED_VIEWS } from '../actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_SHARED_VIEWS:
      return [...action.views];
    default:
      return state;
  }
}
