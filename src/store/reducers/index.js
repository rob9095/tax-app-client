import { combineReducers } from 'redux';
import currentUser from './currentUser';
import errors from './errors';
import projects from './projects';
import invitations from './invitations';
import tableBodyState from './tableBodyState';
import tableHeadState from './tableHeadState';
import savedViews from './savedViews';
import sharedViews from './sharedViews';
import savedView from './savedView';
import defaultView from './defaultView';

const rootReducer = combineReducers({
	currentUser,
	errors,
	projects,
	invitations,
	tableHeadState,
	tableBodyState,
	savedViews,
	sharedViews,
	savedView,
	defaultView,
});

export default rootReducer;
