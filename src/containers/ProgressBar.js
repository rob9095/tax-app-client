import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: 0,
      count: 0,
    }
  }

  componentDidMount() {
    let completed = 0;
    console.log(completed)
    if (this.props.completed === undefined || this.props.completed === null) {
      this.setState({
        completed,
        count: this.props.projectCount,
      })
    } else {
      completed = (this.props.completed / this.props.projectCount)*100
      this.setState({
        completed: this.props.completed,
        count: this.props.projectCount,
      })
    }
  }

  componentWillReceiveProps(newProps){
    if (newProps.completed > this.props.completed) {
      const completed = (newProps.completed / this.state.count)*100
      console.log(completed)
      this.setState({
        completed,
      })
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <LinearProgress variant="determinate" value={this.state.completed} />
      </div>
    );
  }
}

ProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressBar);
