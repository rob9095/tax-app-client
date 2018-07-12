import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/actions/auth';
import { fetchAndUpdateCompletedMilestones, fetchAndUpdateTasklists , fetchDBProjects , fetchTeamworkProjectData, updateProjectsDB } from '../store/actions/teamworkApi';
import { requestAndUpdateTasks } from '../store/actions/tasks';
import Button from '@material-ui/core/Button';

class Homepage extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    logout = e => {
      e.preventDefault();
      this.props.logout();
    }

    buildProjectData = () => {
      this.props.updateProjectsDB();
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

    componentDidMount() {
      if(this.props.currentUser.isAuthenticated) {
        //this.props.fetchTeamworkProjectData();
        this.props.fetchDBProjects();
      }
    }

    render() {
      const { currentUser } = this.props;
      if(!currentUser.isAuthenticated){
    		return (
    			<div className="home-hero">
    				<h1>Tax-App Web Portal</h1>
    				<h4>Singup</h4>
    				<Link to="/signup" className="btn btn-primary">
    					Signup
    				</Link>
            <h4>Login</h4>
    				<Link to="/signin" className="btn btn-primary">
    					Login
    				</Link>
    			</div>
    		);
    	}
    	return (
    		<div>
          <h2>You logged in congrats fool!</h2>
          <button onClick={this.logout}>Logout</button>
          <button onClick={this.buildProjectData}>Build the Project Database!</button>
          <button onClick={this.buildTasklistData}>Build the Tasklist Database!</button>
          <button onClick={this.updateCompletedDates}>Update Completed Dates via Milestones!</button>
          <button onClick={this.fetchAndUpdateTasks}>Fetch and Update Tasks</button>
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
    projects: state.projects
	};
}

export default connect(mapStateToProps, { logout, requestAndUpdateTasks, fetchAndUpdateCompletedMilestones, fetchTeamworkProjectData, updateProjectsDB, fetchDBProjects, fetchAndUpdateTasklists })(Homepage);
