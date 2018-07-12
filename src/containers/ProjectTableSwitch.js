import React from 'react';
import Switch from '@material-ui/core/Switch';

class ProjectTableSwitch extends React.Component {
  state = {
    checked: false,
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    return (
      <div>
        <Switch
          checked={this.state.checked}
          onChange={this.handleChange('checked')}
          value="checked"
          color="primary"
        />
      </div>
    );
  }
}

export default ProjectTableSwitch;
