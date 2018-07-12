import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { addError, removeError } from '../store/actions/errors';
import { updateUser } from '../store/actions/account';
import {
  fetchAndUpdateCompletedMilestones,
  fetchAndUpdateTasklists,
  fetchDBProjects,
  fetchTeamworkProjectData,
  updateProjectsDB,
  getUserProfileImage
} from '../store/actions/teamworkApi';
import { getDetailedProjects, mapTasksToProjects } from '../store/actions/projects';
import { requestAndUpdateTasks } from '../store/actions/tasks';
import { getMessages, getMessageReplies } from '../store/actions/messages';
import { withStyles } from '@material-ui/core/styles';
import SetupLog from './SetupLog';
import SetupCompleteModal from './SetupCompleteModal';
import ProgressBar from './ProgressBar';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
    backgroundColor: 'transparent',
  },
  stepContainer: {
    backgroundColor: 'transparent',
  }
});

function getSteps() {
  return ['Add Api Key', 'Import Projects', 'Import Tasklists', 'Import Tasks', 'Import Messages', 'Import Message Replies'];
}

class SetupSteps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      showNext: true,
      showBack: false,
      buttonDisabled: true,
      apiKey: '',
      inputError: false,
      errorMessage: null,
      isLoading: false,
      resultsArr: [],
      showLog: false,
      projectCount: 0,
      setupComplete: false,
      counter: 0,
      redirect: false,
    }
  }

  componentDidMount() {
    if (this.props.currentUser.isAuthenticated) {
      this.setState({
        setupComplete: this.props.currentUser.user.setupComplete,
      })
      this.props.fetchDBProjects()
      .then((data)=>{
        this.setState({
          projectCount: data.length,
        })
      })
      .catch(()=>{
        this.props.addError('Unable to reach local server')
      })
      if (this.props.currentUser.user.apiKey){
        this.setState({
          apiKey: this.props.currentUser.user.apiKey,
          buttonDisabled: false,
        })
      }
    } else {
      this.setState({
        redirect: true,
      })
    }
  }

  getStepContent = (step) => {
    // about 5 seconds for each api call, teamwork api is slow sometimes...
    let minutes = this.state.projectCount * .05
    switch (step) {
      case 0:
        return null;
      case 1:
        return 'Import the Teamwork Projects. This might take a few seconds.';
      case 2:
        return `Import the Teamwork Tasklists for each Project. This will take around ${minutes.toFixed(1)} minutes.`;
      case 3:
        return `Import the Teamwork Tasks for each Tasklist/Project. This will take around ${minutes.toFixed(1)} minutes.`
      case 4:
        return `Import the Teamwork Message ID's for each Project. This will take around ${minutes.toFixed(1)} minutes.`
      case 5:
        return `Import the Replies for each Teamwork Message. This will take around ${minutes.toFixed(1)} minutes.`
      default:
        return 'Unknown step';
    }
  }

  // form actions
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      buttonDisabled: e.target.value.length > 0 ? false : true,
      inputError: e.target.value.length === 0 && this.state.inputError ? false : null,
      errorMessage: e.target.value.length === 0 && this.state.inputError ? false : null,
    });
  };

  handleSubmit = () => {
    const user = {
      ...this.props.currentUser.user,
      apiKey: this.state.apiKey,
    }
    // first check if the api key works, will return the profile image url
    return this.props.getUserProfileImage(user, user.email, false)
    .then((res)=>{
      // update the users profile image
      this.props.getUserProfileImage(user, user.email, true)
      // update the account with api key
      this.props.updateUser(user)
      return {
        res,
        isComplete: true,
      }
    })
    .catch((err)=>{
      return {
        message: 'Invalid API Key',
        status: 'error',
      }
    })
  }

  // Redux Actions
  buildProjectData = () => {
    return this.props.updateProjectsDB(this.props.currentUser.user)
    .then((res)=>{
      const results = res.projectsAdded.map(p=>({
        resultType: 'Project',
        name: p.name,
        project_id: p.teamwork_id,
        id: p.teamwork_id,
      }))
      this.setState({
        showLog: true,
        resultsArr: results,
        projectCount: res.projectsAdded.length,
      })
      return {
        ...res,
        isComplete: true,
      }
    })
    .catch((err)=>{
      return err
    })

    //remove this, occurs in step 1
    //this.props.currentUser.user.profileImageUrl ? null : this.props.getUserProfileImage(this.props.currentUser.user, this.props.currentUser.user.email, true);
  }

  updateCompletedDates = () => {
    this.props.fetchAndUpdateCompletedMilestones();
  }

  triggerTaskRequest = (id) => {
    return new Promise((resolve, reject) => {
      return setTimeout(()=>{
        return this.props.requestAndUpdateTasks(id,this.props.currentUser.user.apiKey)
        .then((data)=>{
          resolve(data)
          const results = data.tasksAdded.map(t=>({
            resultType: 'Task',
            name: t.content,
            project_id: t.teamworkProject_id,
            projectName: t.projectName,
            id: t.teamwork_id,
          }))
          if (this.state.resultsArr.length > 0) {
            this.setState({
              resultsArr: [...this.state.resultsArr, ...results],
            })
          } else {
            this.setState({
              showLog: true,
              resultsArr: results,
            })
          }
        })
        .catch((err)=>{
          reject(err)
        })
      }, 500)
    })
  }

  fetchAndUpdateTasks = async() => {
  	let counter = 0;
    for (let p of this.props.projects.projectsInDB) {
      let result = await this.triggerTaskRequest(p.teamwork_id)
      counter++
      this.setState({
        counter
      })
  	}
    if (counter === this.props.projects.projectsInDB.length) {
      return {
        results: this.state.resultsArr,
        isComplete: true,
      }
    }
  }

  triggerTaskListRequest = (id) => {
    return new Promise(async (resolve, reject) => {
      return setTimeout(() => {
        return this.props.fetchAndUpdateTasklists(id, this.props.currentUser.user.apiKey)
        .then((data)=>{
          resolve(data)
          const results = data.tasklistsAdded.map(t=>({
            resultType: 'Tasklist',
            name: t.taskName,
            project_id: t.teamworkProject_id,
            projectName: t.projectName,
            id: t.teamwork_id,
          }))
          if (this.state.resultsArr.length > 0) {
            this.setState({
              resultsArr: [...this.state.resultsArr, ...results],
            })
          } else {
            this.setState({
              showLog: true,
              resultsArr: results,
            })
          }
        })
        .catch((err)=>{
          reject(err)
        })
      }, 500)
    })
  }

  buildTasklistData = async() => {
    let counter = 0;
    for (let p of this.props.projects.projectsInDB) {
      let result = await this.triggerTaskListRequest(p.teamwork_id)
      counter++
      this.setState({
        counter
      })
    }
    if (counter === this.props.projects.projectsInDB.length) {
      return {
        results: this.state.resultsArr,
        isComplete: true,
      }
    }
  }

  triggerGetMessages = (id) => {
    return new Promise(async (resolve, reject) => {
      return setTimeout(() => {
        return this.props.getMessages(id,this.props.currentUser.user.apiKey)
        .then((data)=>{
          let result = {
            resultType: 'Message ID',
            name: data.internalProjectMessageId,
            project_id: data.teamwork_id,
            projectName: data.name,
            id: data.teamwork_id,
          }
          if (data.status === 'No Messages') {
            result = {
              resultType: 'Message ID',
              status: 'warning',
              name: 'No Messages Found',
              project_id: id,
              projectName: '',
              id,
            }
            resolve(result)
          } else {
            resolve(data)
          }
          if (this.state.resultsArr.length > 0) {
            this.setState({
              resultsArr: [...this.state.resultsArr, result],
            })
          } else {
            this.setState({
              showLog: true,
              resultsArr: [result],
            })
          }
        })
        .catch((err)=>{
          reject(err);
        })
      }, 500)
    })
  }

  fetchProjectMessages = async () => {
    let counter = 0;
    for (let p of this.props.projects.projectsInDB) {
      let result = await this.triggerGetMessages(p.teamwork_id)
      counter++
      this.setState({
        counter
      })
    }
    if (counter === this.props.projects.projectsInDB.length) {
      return {
        results: this.state.resultsArr,
        isComplete: true,
      }
    }
  }

  triggerGetMessageReplies = (project_id,message_id,projectName) => {
    return new Promise(async (resolve,reject) => {
      return setTimeout(() => {
        return this.props.getMessageReplies(project_id,message_id,this.props.currentUser.user.apiKey)
        .then((data)=>{
          resolve(data);
          const results = data.messageRepliesAdded.map(m=>({
            resultType: 'Message Reply',
            name: m.body.length > 45 ? m.body.substring(0, 45) + '...' : m.body,
            project_id: m.projectId,
            projectName,
            id: m.teamwork_id,
          }))
          if (this.state.resultsArr.length > 0) {
            this.setState({
              resultsArr: [...this.state.resultsArr, ...results],
            })
          } else {
            this.setState({
              showLog: true,
              resultsArr: results,
            })
          }
        })
        .catch((err)=>{
          reject(err)
        })
      }, 500)
    })
  }

  fetchMessageReplies = async () => {
    let counter = 0;
    for (let p of this.props.projects.projectsInDB) {
      let result = await this.triggerGetMessageReplies(p.teamwork_id,p.internalProjectMessageId,p.name)
      counter++
      this.setState({
        counter
      })
    }
    if (counter === this.props.projects.projectsInDB.length) {
      return {
        results: this.state.resultsArr,
        isComplete: true,
      }
    }
  }

  // stepper actions

  handleStepAction = (step) => {
    switch (step) {
      case 0:
        console.log('first step was hit!')
        return this.handleSubmit()
      case 1:
        console.log('step two was hit!')
        return this.buildProjectData()
      case 2:
        console.log('step three was hit!')
        return this.buildTasklistData()
      case 3:
        console.log('step four was hit')
        return this.fetchAndUpdateTasks()
      case 4:
        console.log('step five was hit!')
        return this.fetchProjectMessages()
      case 5:
        console.log('step six was hit!')
        return this.fetchMessageReplies()
      case 6:
        console.log('step seven was hit! were done!')
        this.setState({
          isLoading: false,
          buttonDisabled: false,
        });
      default:
        return `Unknown Step`
    }
  }

  handleNext = async() => {
    this.setState({
      inputError: false,
      errorMessage: null,
      isLoading: true,
      resultsArr: [],
      showLog: false,
      buttonDisabled: true,
    })
    let response = await this.handleStepAction(this.state.activeStep);
    console.log('the response is')
    console.log(response)
    response === undefined || response === null ? response = {status: 'error', message: 'Unable to connect to server, please try again'} : null
    setTimeout(()=>{
      if (response.status !== 'error' && response.isComplete === true) {
        this.setState({
          activeStep: this.state.activeStep + 1,
          isLoading: false,
          buttonDisabled: false,
          counter: 0,
        });
      } else {
        this.setState({
          inputError: true,
          errorMessage: response.message,
          isLoading: false,
          counter: 0,
        })
      }
    },500)
    // get fresh project data
    this.props.fetchDBProjects();
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleFinish = async() => {
    this.setState({
      inputError: false,
      errorMessage: null,
      isLoading: true,
      resultsArr: [],
      showLog: false,
      buttonDisabled: true,
    })
    const projects = await this.props.getDetailedProjects();
    this.props.mapTasksToProjects(projects)
    .then(async(res)=>{
      const user = {
        email: this.props.currentUser.user.email,
        setupComplete: true,
      }
      await this.props.updateUser(user)
      this.setState({
        setupComplete: true,
        redirect: true,
        isLoading: false,
      })
    })
    .catch((err)=>{
      console.log(err)
      this.setState({
        errorMessage: 'Unable to connect to server, please try again'
      })
    })
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, setupComplete } = this.state;
    return (
      <div className="setup-steps">
        {this.state.setupComplete && (
          <SetupCompleteModal />
        )}
        <h1>Setup</h1>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepContainer}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{this.getStepContent(index)}</Typography>
                  <div className="action-container">
                    {this.state.isLoading && activeStep > 1 && (
                      <ProgressBar
                        projectCount={this.state.projectCount}
                        completed={this.state.counter}
                      />
                    )}
                    {activeStep !== 0 && (
                      <span className="error">
                        {this.state.errorMessage && (this.state.errorMessage)}
                      </span>
                    )}
                    <div>
                      {this.state.showBack && (
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.button}
                        >
                          Back
                        </Button>
                      )}
                      {activeStep === 0 && (
                        <FormControl className="api-form">
                          <span>Please enter your Teamwork API Key</span>
                          {this.state.inputError && (
                            <span className="error">
                              {this.state.errorMessage}
                            </span>
                          )}
                          <Input
                            error={this.state.inputError}
                            autoComplete="off"
                            id="apiKey"
                            type="text"
                            name="apiKey"
                            placeholder='Teamwork API Key'
                            onChange={this.handleChange}
                            value={this.state.apiKey}
                          />
                        </FormControl>
                      )}
                      {this.state.showNext && (
                        <Button
                          disabled={this.state.buttonDisabled}
                          variant="raised"
                          color="primary"
                          onClick={this.handleNext}
                          className={classes.button}
                        >
                        {this.state.isLoading ?
                          <CircularProgress size={24} color="inherit" />
                          :
                          activeStep === 0 ?
                            'Verify'
                            :
                            'Start Import'
                        }
                        </Button>
                      )}
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>{`Please finish the setup process to view the Project Dashboard`}</Typography>
              <Button
                variant="raised"
                color="primary"
                disabled={activeStep === 0}
                onClick={this.handleFinish}
                className={classes.button}
              >
                {this.state.isLoading ?
                  <CircularProgress size={24} color="inherit" />
                :
                  'Finish'
                }
              </Button>
          </Paper>
        )}
        {this.state.showLog && (
          <SetupLog
            results={this.state.resultsArr}
            activeStep={this.state.activeStep}
          />
        )}
        {this.state.redirect && (
          <Redirect to='/' />
        )}
      </div>
    );
  }
}

SetupSteps.propTypes = {
  classes: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
    projects: state.projects,
	};
}

export default compose(withStyles(styles), connect(mapStateToProps, {
  requestAndUpdateTasks,
  fetchAndUpdateCompletedMilestones,
  fetchTeamworkProjectData,
  updateProjectsDB,
  fetchDBProjects,
  fetchAndUpdateTasklists,
  getMessages,
  getMessageReplies,
  getUserProfileImage,
  updateUser,
  getDetailedProjects,
  mapTasksToProjects,
  removeError,
  addError,
 }))(SetupSteps);
