import { LOAD_FULL_DEFAULT_VIEW, CLEAR_FULL_DEFAULT_VIEW } from '../actionTypes';


const defaultView = (state = [], action) => {
  switch (action.type) {
    case LOAD_FULL_DEFAULT_VIEW:
      return [action.view]
    case CLEAR_FULL_DEFAULT_VIEW:
      return state.filter(view => view._id !== action.id);
    default:
      return state;
  }
}

export default defaultView;
