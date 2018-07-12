import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  searchInput: {
    margin: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 5,
    borderRadius: 5,
  },
  filledIcon: {
    color: theme.palette.primary.dark,
  },
});

class SearchSelectInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.onClearSearch > 0) {
      newProps.onClearSearch -1 === this.props.onClearSearch ? this.setState({input: ''}) : null
    }
  }

  handleKeyPress = e => {
    if (e.key == 'Enter') {
      this.handleSearch(e.target.value);
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.handleSearch(e.target.value);
  };

  handleSearch = (value) => {
    this.props.onSearch(value, this.props.isDate);
  }

  render() {
    const { classes, isDate } = this.props;
    return(
      <div>
        <TextField
          placeholder={isDate ? 'MM/DD' : null }
          className='search-input'
          autoComplete="off"
          id="table-search-input"
          type="text"
          name="input"
          onKeyPress={this.handleKeyPress}
          onChange={this.handleChange}
          value={this.state.input}
          InputProps={{
            endAdornment: (
              <InputAdornment
                className="search-button"
                position="end"
                onClick={this.handleSearch}
              >
                <SearchIcon className={classes.filledIcon} />
              </InputAdornment>
            ),
          }}
        />
      </div>
    )
  }
}

SearchSelectInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchSelectInput);
