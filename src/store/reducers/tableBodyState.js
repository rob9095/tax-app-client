import { SAVE_TABLE_BODY_STATE } from '../actionTypes';


const tableBodyState = (state = {}, action) => {
  switch (action.type) {
    case SAVE_TABLE_BODY_STATE:
      return {
        ...action.state,
      };
    default:
      return state;
  }
}

export default tableBodyState;
