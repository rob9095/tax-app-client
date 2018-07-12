import { SET_CURRENT_USER, LOAD_DEFAULT_VIEW } from '../actionTypes';

const DEFAULT_STATE = {
	isAuthenticated: false,
	user: {}
}

export default (state = DEFAULT_STATE, action) => {
	switch(action.type) {
		case SET_CURRENT_USER:
			return {
				isAuthenticated: !!Object.keys(action.user).length,
				user: action.user
			};
		case LOAD_DEFAULT_VIEW:
			return {
				...state,
				user: {
					...state.user,
					defaultView: action.id,
				}
			}
		default:
			return state;
	}
};
