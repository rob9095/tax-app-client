import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAndUpdateCompletedMilestones, fetchAndUpdateTasklists , fetchDBProjects , fetchTeamworkProjectData, updateProjectsDB, getUserProfileImage } from '../store/actions/teamworkApi';
import { requestAndUpdateTasks } from '../store/actions/tasks';
import { getMessages, getMessageReplies } from '../store/actions/messages';
import Button from '@material-ui/core/Button';
import OnBoardingTabs from '../containers/OnBoardingTabs';
import AccountPage from '../containers/AccountPage';

//update fuctions to send api key from current user!

class Setup extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    buildProjectData = () => {
      this.props.updateProjectsDB(this.props.currentUser.user);
      this.props.currentUser.user.profileImageUrl ? null : this.props.getUserProfileImage(this.props.currentUser.user, this.props.currentUser.user.email, true);
    }

    updateCompletedDates = () => {
      this.props.fetchAndUpdateCompletedMilestones();
    }

    fetchAndUpdateTasks = () => {
      this.props.requestAndUpdateTasks(this.props.projects.projectsInDB);
    }

    triggerTaskListRequest = (id) => {
      return new Promise(async (resolve, reject) => {
        try{
          setTimeout(() => {
            this.props.fetchAndUpdateTasklists(id);
            resolve(id);
          }, 1000)
        }catch(err) {
          reject(err);
        }
      })
    }

    buildTasklistData = async () => {
      for (let p of this.props.projects.projectsInDB) {
        let result = await this.triggerTaskListRequest(p.teamwork_id);
        console.log(result);
      }
    }

    triggerGetMessages = (id) => {
      return new Promise(async (resolve, reject) => {
        try {
          setTimeout(() => {
            this.props.getMessages(id,this.props.currentUser.user.apiKey)
            resolve(id)
          }, 1000)
        } catch(err) {
          reject(err);
        }
      })
    }

    fetchProjectMessages = async () => {
      for (let p of this.props.projects.projectsInDB) {
        let result = await this.triggerGetMessages(p.teamwork_id)
        console.log(result)
      }
    }

    triggerGetMessageReplies = (project_id,message_id) => {
      return new Promise(async (resolve,reject) => {
        try {
          setTimeout(() => {
            this.props.getMessageReplies(project_id,message_id,this.props.currentUser.user.apiKey)
            resolve(project_id);
          }, 1000)
        } catch(err) {
          reject(err);
        }
      })
    }

    fetchMessageReplies = async () => {
      for (let p of this.props.projects.projectsInDB) {
        let result = await this.triggerGetMessageReplies(p.teamwork_id,p.internalProjectMessageId)
        console.log(result)
      }
    }

    componentDidMount() {
      if (this.props.currentUser.isAuthenticated) {
        //this.props.fetchTeamworkProjectData();
        this.props.fetchDBProjects();
      }
    }

    render() {
      const { currentUser, errors } = this.props;
      if(!currentUser.isAuthenticated){
    		return (
    			<OnBoardingTabs errors={errors} />
    		);
    	}
      if(!currentUser.user.apiKey){
        return (
          <div>
            <span>Please add your API key!</span>
          </div>
        );
      }
    	return (
    		<div>
          <h2>Setup your account</h2>
          <button onClick={this.buildProjectData}>Build the Project Database!</button>
          <button onClick={this.buildTasklistData}>Build the Tasklist Database!</button>
          <button onClick={this.updateCompletedDates}>Update Completed Dates via Milestones! (depreciated)</button>
          <button onClick={this.fetchAndUpdateTasks}>Fetch and Update Tasks</button>
          <button onClick={this.fetchProjectMessages}>Fetch Messages IDs!</button>
          <button onClick={this.fetchMessageReplies}>Fetch Messages Replies!</button>
            <Button color="primary">
          Primary
        </Button>
    		</div>
    	);
    }
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    projects: state.projects,
	};
}

export default connect(mapStateToProps, { requestAndUpdateTasks, fetchAndUpdateCompletedMilestones, fetchTeamworkProjectData, updateProjectsDB, fetchDBProjects, fetchAndUpdateTasklists, getMessages, getMessageReplies, getUserProfileImage })(Setup);
