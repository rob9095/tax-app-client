import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TaskCheckbox from './TaskCheckbox';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  })
});

class TasklistPopover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: []
    }
    this.handleCheckmarkToggle = this.handleCheckmarkToggle.bind(this)
  }

  handleCheckmarkToggle = (task) => {
    this.props.handleToggle(task)
  }

  componentDidMount() {
    this.setState({
      tasks: this.props.tasks,
    })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tasks: newProps.tasks,
    })
  }

  handleHidePopover = () => {
    this.props.onHidePopover();
  }

  render() {
    if (this.state.tasks === undefined) {
        return(
          <div />
        )
    }
    let checkboxes = this.state.tasks.map(t=>(
      <TaskCheckbox
        key={t}
        label={t}
        handleToggle={this.handleCheckmarkToggle}
        activeTasks={this.props.activeTasks}
      />
    ))
    const { classes } = this.props;
    return(
      <div className={classes.root}>
      <div className="checkbox-container">
        <span onClick={this.handleHidePopover} className="popover-close"><CloseIcon color="primary" /></span>
        <Paper className={classes.root} elevation={4}>
          <div className="task-checkboxes">
            {checkboxes}
          </div>
        </Paper>
      </div>
    </div>
    )
  }
}

TasklistPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TasklistPopover);
