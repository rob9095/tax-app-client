import { LOAD_SAVED_VIEW, CLEAR_SAVED_VIEW } from '../actionTypes';


const savedView = (state = [], action) => {
  switch (action.type) {
    case LOAD_SAVED_VIEW:
      return [action.view]
    case CLEAR_SAVED_VIEW:
      return state.filter(view => view._id !== action.id);
    default:
      return state;
  }
}

export default savedView;
