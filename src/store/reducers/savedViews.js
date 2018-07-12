import { LOAD_VIEWS, ADD_VIEW, REMOVE_VIEW, TOGGLE_VIEW_SHARE } from '../actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_VIEWS:
      return [...action.views];
    case ADD_VIEW:
      return [...state, action.view];
    case REMOVE_VIEW:
      return state.filter(view => view._id !== action.id);
    case TOGGLE_VIEW_SHARE:
      return state.map(v =>{
        if (action.view._id === v._id) {
          return {
            ...v,
            isShared: action.view.isShared,
          }
        } else {
          return {
            ...v
          }
        }
      })
    default:
      return state;
  }
}
