import { SAVE_TABLE_HEAD_STATE } from '../actionTypes';


const tableHeadState = (state = {}, action) => {
  switch (action.type) {
    case SAVE_TABLE_HEAD_STATE:
      return {
        ...action.state,
      };
    default:
      return state;
  }
}

export default tableHeadState;
