import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';

class TaskCheckbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      isLoading: false,
    };
  }

  handleChange = name => event => {
    this.props.handleToggle(this.props.label);
    this.setState({ [name]: event.target.checked });
  };

  componentDidMount() {
    let isChecked = this.props.activeTasks.filter(t => t.label === this.props.label)
    if (isChecked.length > 0){
      this.setState({
        checked: true,
      })
    }
  }

  render() {
    return (
      <div>
        <FormControlLabel
          control={
            <Switch
              disableRipple={true}
              checked={this.state.checked}
              onChange={this.handleChange('checked')}
              value={this.props.label}
              color="primary"
            />
          }
          label={this.props.label}
        />
      </div>
    );
  }
}

export default TaskCheckbox;
