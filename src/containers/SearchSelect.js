import React from 'react';
import PropTypes from 'prop-types';
import SearchSelectInput from './SearchSelectInput';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Moment from 'react-moment';
var moment = require('moment');
moment().format();

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  label: {
    fontSize: 12,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class SearchSelect extends React.Component {
  state = {
    val: [],
    data: [],
    displayData: [],
    clearSearch: 0,
  };

  handleChange = event => {
    this.setState({
      val: event.target.value,
      displayData: this.state.data,
      clearSearch: this.state.clearSearch + 1,
    });
    let searchArr = this.state.val.map((v) => ({value: v, column: this.props.column}))
    this.props.onSearchMenuItemSelect(searchArr, event.nativeEvent.target.firstChild.data, this.props.column);
  };

  componentWillReceiveProps(newProps) {
    if (newProps.currentFilters.length === 0 && this.props.currentFilters.length > 1) {
      this.setState({
        val: [],
      })
    }

    if (newProps.showNoResults === true && this.props.showNoResults === false) {
      this.setState({
        val: this.state.val.filter(v => v !== this.props.noResultValue),
      })
    }
    if (newProps.currentFilters.length === 0) {
      console.log(`no filters is search select!`)
      this.setState({
        val: [],
      })
    }
  }

  componentDidMount(){
    if (this.props.currentFilters.length > 0) {
      let vals = this.props.currentFilters.map(f => (f.value))
      this.setState({
        val: vals,
      })
    }
    const columnId = this.props.column.id;
    const isTask = this.props.column.isTask;
    const columnLabel = this.props.column.label;
    const data = this.props.tableData.map((p => (
      isTask ? p[columnLabel].lastChangedOn : p[columnId]
    )))
    .filter((v, i, a) => a.indexOf(v) === i && v !== undefined && v !== '')
    .map((v => (
      v ? v.split('.')[1] === '000Z' ? {id: v, isDate: true} : {id: v, isDate: false} : {}
    )))
    .sort((a,b) => a.isDate ? (b.id < a.id ? -1 : 1) : (a.id < b.id ? -1 : 1))
    this.setState({
      data,
      displayData: data,
    })
    // let date = moment("2018-04-24T01:00:34.000Z", moment.ISO_8601).format('M/D/YY');
    // console.log(date)
  }

  handleSearch = (input, isDate) => {
    if (input.length > 0) {
      let day, month, year, dateMatchType = null;
      if (isDate) {
        const inputSplit = input.split('/')
        if (inputSplit.length === 0 || inputSplit.length === 1) {
          month = inputSplit[0];
          day = '01'
          year = (new Date()).getFullYear();
          dateMatchType = 'month'
        } else if (inputSplit.length === 2) {
          if (inputSplit[1] !== '') {
            month = inputSplit[0];
            day = inputSplit[1];
            year = (new Date()).getFullYear();
            dateMatchType = 'day'
          } else {
            month = inputSplit[0];
            day = '01'
            year = (new Date()).getFullYear();
            dateMatchType = 'month'
          }
        } else if (inputSplit.length === 3) {
          if (inputSplit[2] !== '') {
            month = inputSplit[0];
            day = inputSplit[1];
            year = inputSplit[2].length <= 2 ? `20${inputSplit[2]}` : inputSplit[2]
            dateMatchType = 'day'
          } else {
            month = inputSplit[0];
            day = inputSplit[1];
            year = (new Date()).getFullYear();
            dateMatchType = 'day'
          }
        }
        console.log(`${year}-${month}-${day}`, dateMatchType)
      }
      const displayData = isDate ?
        this.state.data.filter(v => moment(v.id, moment.ISO_8601).isSame(`${year}-${month}-${day}`, dateMatchType))
        :
        this.state.data.filter(v => v.id.toLowerCase().indexOf(input) !== -1)
      this.setState({
        displayData,
      })
    } else {
      this.setState({
        displayData: this.state.data
      })
    }
  }

  render() {
    const { classes, theme, column, tableData } = this.props;
    setTimeout(()=>{
      if (this.state.vals) {
        console.log('the selected values are')
        console.log(this.state.vals)
      }
    },5000)
    return (
      <div className={classes.container}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple" className={classes.label}>Search</InputLabel>
          <Select
            multiple
            value={this.state.val}
            onChange={this.handleChange}
            input={<Input id="select-multiple" />}
            MenuProps={MenuProps}
          >
            <SearchSelectInput
              onSearch={this.handleSearch}
              onClearSearch={this.state.clearSearch}
              isDate={column.isTask || column.isTasklist || column.isDate ? true : false}
            />
            {this.state.displayData.map((val,i) => (
              <MenuItem
                key={i}
                value={val.id}
                style={{
                  fontWeight:
                    this.state.val.indexOf(val) === -1
                      ? theme.typography.fontWeightRegular
                      : theme.typography.fontWeightMedium,
                }}
              >
                {val.id && val.isDate ? <Moment format="M/D/YY">{val.id}</Moment> : val.id ? val.id : 'N/A'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

SearchSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SearchSelect);
