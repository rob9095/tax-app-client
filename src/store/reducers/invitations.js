import { LOAD_INVITES, ADD_INVITE, REMOVE_INVITE } from '../actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case LOAD_INVITES:
      return [...action.invites];
    case ADD_INVITE:
      return [...state, action.invite];
    case REMOVE_INVITE:
      return state.filter(invite => invite._id !== action.id);
    default:
      return state;
  }
}
