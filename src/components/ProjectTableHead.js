import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TasklistMenu from '../containers/TasklistMenu';
import SearchSelect from '../containers/SearchSelect';
import Checkbox from '@material-ui/core/Checkbox';
import { saveTableState } from '../store/actions/savedTableViews';
import { SAVE_TABLE_HEAD_STATE } from '../store/actionTypes';
import { handleSavedViewDisplay, clearSavedViewDisplay } from '../store/actions/savedTableView';
import CircularProgress from '@material-ui/core/CircularProgress';

class ProjectTableHead extends Component {
  constructor(props) {
    super(props);
    this.state= {
      noSort: false,
      currentTaskName: '',
      showAddTasksMenu: false,
      currentEvent: null,
      currentTasks: [],
      columnData: [],
      currentColumn: '',
      lastCheckedTask: null,
      savedViewTitle: '',
      tasks: [],
      currentColumnIsTasklist: false,
      currentColumnIsTask: false,
      currentColumnLabel: '',
      searchOpen: true,
      selectAllLoading: false,
    }
    this.handleTasklistMenuSelect = this.handleTasklistMenuSelect.bind(this);
  }

  updateColumnData = (lastCheckedTask) => {
    let updatedColumnData = this.state.columnData
    updatedColumnData.forEach(c => {
      if (c.label === lastCheckedTask && c.isTask === true) {
          c.hidden = !c.hidden
          console.log(`${lastCheckedTask} was just ${c.hidden === true ? 'hidden' : 'displayed' }`)
      }
    })
    this.setState({
      columnData: updatedColumnData,
      lastCheckedTask: lastCheckedTask,
    })
    this.props.onShowShowTasklistTasks(lastCheckedTask)
  }

  handleViewUpdate = (view, viewTitle) => {
    console.log(`we confirmed that the new title: ${viewTitle} is different from the last one: ${this.state.savedViewTitle}`)
    console.log('the view is')
    console.log(view)
    // then clear any tasks if they exist
    let data = this.state.columnData
    data.forEach(c => {
    if (c.hidden === false && c.isTask === true) {
          console.log(`clearing task ${c.label}`)
          this.updateColumnData(c.label);
        }
    })
    // show new tasks
    for (let t of view.headerState.tasks) {
      console.log(`showing task ${t}`)
      this.updateColumnData(t)
    }
    this.setState({
      ...view.headerState,
      savedViewTitle: viewTitle,
    })
    console.log('we updated the view in the header because the title was different')
    this.props.triggerViewUpdate(view)
  }

  componentWillReceiveProps(newProps) {

    if (newProps.resetTrigger === true && this.props.resetTrigger === false) {
      console.log('reset from header hit')
      this.generateColumnData(true);
      if (this.props.loadDefaultView) {
        //display the view if we have it
        this.handleViewUpdate(this.props.defaultView[0], this.props.defaultView[0].title)
      } else {
        this.props.triggerViewUpdate();
      }
      this.props.toggleResetTrigger();
    }

    if (newProps.lastCheckedTask !== this.props.lastCheckedTask || newProps.removeTask !== this.props.removeTask) {
      this.updateColumnData(newProps.lastCheckedTask)
      // let updatedState = this.state
      // updatedState.columnData.forEach(c => {
      //   if (c.label === newProps.lastCheckedTask && c.isTask === true) {
      //       c.hidden = !c.hidden
      //       console.log(c)
      //   }
      // })
      // this.props.onShowShowTasklistTasks(newProps.lastCheckedTask)
      // updatedState.lastCheckedTask = newProps.lastCheckedTask
      // this.setState({
      //   ...updatedState
      // })
    }

    if (newProps.saveState === true && this.props.saveState === false) {
      // this.props.saveTableState(this.state,'SAVE_TABLE_HEAD_STATE');
      this.props.toggleGetHeadState(this.state);
    }

    // if (newProps.viewCheck) {
    //   if (newProps.viewCheck[0].title !== this.props.viewCheck[0].title) {
    //     console.log('we have loaded a saved different view available in table header')
    //     for (let t of newProps.viewCheck[0].headerState.tasks) {
    //       this.updateColumnData(t)
    //     }
    //     this.setState({
    //       ...newProps.viewCheck[0].headerState,
    //     })
    //     console.log('we updated the view in the header')
    //     this.props.triggerViewUpdate(newProps.viewCheck[0].bodyState, newProps.viewCheck[0].headerState.tasks);
    //   }
    // }

      const viewCheck = Object.entries(newProps.savedView)
      if (newProps.savedView.length > 0) {
      const viewTitle = newProps.savedView[0].title
      const view = newProps.savedView[0]

      console.log('we have a saved view(s) available in table header')
      // console.log(newProps.savedView[0].title)
      if (viewTitle !== this.state.savedViewTitle && viewTitle !== undefined) {
        this.handleViewUpdate(view, viewTitle)
      }
    }
  }

  handleTasklistMenuSelect = (option) => {
    if (option === 'Sort') {
      this.props.onRequestSort(this.state.currentEvent, this.state.currentColumn);
    } else {
      // find any shown tasks
      let activeTasks = this.state.columnData.filter(c => c.isTask === true && c.hidden === false )
      this.props.onShowPopOver(this.state.currentTasks, this.state.currentColumn, activeTasks)
    }
  }

  createSortHandler = (property,isTasklist,tasks,isTask,label) => event => {
    if (isTasklist) {
      this.setState({
        showAddTasksMenu: true,
        currentEvent: event,
        currentTasks: tasks,
      })
    } else if (isTask) {
      this.props.onRequestSort(event, label, isTask);
    } else {
      this.props.onRequestSort(event, property)
    }
    this.setState({
      currentColumn: property,
      currentColumnIsTasklist: isTasklist,
      currentColumnIsTask: isTask ? isTask : false,
      currentColumnLabel: label,
    })
  };

  showTasklistTasks = (tasklistName, tasks) => event => {
      // this.setState({
      //   initialPaymentReceivedTask: true,
      // })
      this.props.onShowPopOver(tasks, tasklistName)
      this.props.projects.projectsInDB.forEach(p => {
      let columnTasklists = p.tasklists.filter(t => t.taskName === tasklistName)
      //this.props.onShowShowTasklistTasks(columnTasklists)
    })
  }

  handleSearchMenuItemSelect = (searchArr, recentValue, column) => {
    let removeFilter = null;
    console.log('the recent value in table head is')
    console.log(recentValue)
    const check = searchArr.filter(e => e.value === recentValue)
    if (check.length > 0) {
      searchArr = searchArr.filter(e => e.value !== recentValue);
      removeFilter = recentValue;
    } else {
      searchArr.push({value: recentValue, column});
    }
    this.props.onTableSearch(searchArr, removeFilter);
  }

  handleSelectAllClick = (event,checked) => {
    if (this.props.rowsPerPage > 200) {
      this.setState({
        selectAllLoading: true,
      })
      setTimeout(()=>{
        this.props.onSelectAllClick(event,checked);
      }, 100)
      setTimeout(()=>{
        this.setState({
          selectAllLoading: false,
        })
      }, 1000)
    } else {
      this.props.onSelectAllClick(event,checked);
    }
  }

  generateColumnData = (reset) => {
    const columnData = [
      {
        id: 'projectName',
        hidden: false,
        numeric: false,
        disablePadding: false,
        label: 'Project',
      },
      {
        id: 'preparer',
        hidden: false,
        numeric: false,
        disablePadding: true,
        label: 'Preparer',
      },
      {
        id: 'clientLastName',
        hidden: false,
        numeric: false,
        disablePadding: true,
        label: 'Client Last Name',
      },
      {
        id: 'clientFirstName',
        hidden: false,
        numeric: false,
        disablePadding: true,
        label: 'Client First Name',
      },
      {
        id: 'lastTasklistChanged',
        hidden: false,
        numeric: false,
        disablePadding: false,
        label: 'Status',
      },
      {
        id: 'projectNotes',
        hidden: false,
        numeric: false,
        disablePadding: true,
        label: 'Notes',
        noSearch: true,
      },
      {
        id: 'dateProjectCreated',
        hidden: false,
        numeric: false,
        disablePadding: true,
        label: 'Date Project Created',
        isDate: true,
        noSearch: true,
      },
      {
        id: 'initialPaymentReceivedTask',
        hidden: true,
        tasklistName: 'INITIAL PAYMENT',
        numeric: false,
        disablePadding: true,
        label: 'Initial Payment Recieved',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'initialPaymentTask',
        hidden: true,
        tasklistName: 'INITIAL PAYMENT',
        numeric: false,
        disablePadding: true,
        label: 'Initial Payment',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'initialPayment',
        hidden: false,
        tasklistName: 'INITIAL PAYMENT',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Initial Payment',
        tasks: ['Initial Payment','Initial Payment Recieved'],
        noSearch: true,
      },
      {
        id: 'gettingStartedTask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Getting Started',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'taxOrganizerTask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Tax Organizer',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qTravelWorksheetTask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Travel Worksheet',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qFbarForm8938Task',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-FBAR and Form 8938',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qForm5471Task',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Form 5471 (Foreign Corporation)',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qScheduleATask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Schedule A',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qScheduleCTask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Schedule C',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qScheduleDTask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Schedule D',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'qScheduleETask',
        hidden: true,
        tasklistName: 'PROVIDE INFORMATION',
        numeric: false,
        disablePadding: true,
        label: 'Questionnaire-Schedule E',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'provideInformation',
        hidden: false,
        tasklistName: 'PROVIDE INFORMATION',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Provide Information',
        tasks: ['Getting Started','Tax Organizer','Questionnaire-Travel Worksheet','Questionnaire-FBAR and Form 8938','Questionnaire-Form 5471 (Foreign Corporation)','Questionnaire-Schedule A','Questionnaire-Schedule C','Questionnaire-Schedule D','Questionnaire-Schedule E'],
        noSearch: true,
      },
      {
        id: 'clientWelcomeCallTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Client Welcome Call',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'auditProtectionTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Audit Protection Plan - IRS Monitoring',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'workPaperPrepTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Workpaper Preparation',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'dataEntryTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Data Entry',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'dataEntryReviewTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Data Entry Review',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'dataEntryCorrectionsTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Data Entry Corrections',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'finalReviewTask',
        hidden: true,
        tasklistName: 'PREPARATION',
        numeric: false,
        disablePadding: true,
        label: 'Final Review',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'preparation',
        hidden: false,
        tasklistName: 'PERPARATION',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Preparation',
        tasks: ['Client Welcome Call','Audit Protection Plan - IRS Monitoring','Workpaper Preparation', 'Data Entry', 'Data Entry Review', 'Data Entry Corrections', 'Final Review'],
        noSearch: true,
      },
      {
        id: 'finalPaymentReceivedTask',
        hidden: true,
        tasklistName: 'FINALIZE PAYMENT',
        numeric: false,
        disablePadding: true,
        label: 'Final Payment Received',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'finalInvoiceDueTask',
        hidden: true,
        tasklistName: 'FINALIZE PAYMENT',
        numeric: false,
        disablePadding: true,
        label: 'Final Invoice Due',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'finalizePayment',
        hidden: false,
        tasklistName: 'FINALIZE PAYMENT',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Finalize Payment',
        tasks: ['Final Payment Received','Final Invoice Due'],
        noSearch: true,
      },
      {
        id: 'returnReviewTask',
        hidden: true,
        tasklistName: 'CLIENT REVIEW',
        numeric: false,
        disablePadding: true,
        label: 'Return Review Instructions',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'steamlinedProcedureTask',
        hidden: true,
        tasklistName: 'CLIENT REVIEW',
        numeric: false,
        disablePadding: true,
        label: 'Streamlined Procedure Instructions',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'clientReviewCallTask',
        hidden: true,
        tasklistName: 'CLIENT REVIEW',
        numeric: false,
        disablePadding: true,
        label: 'Client Review Call',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'clientReview',
        hidden: false,
        tasklistName: 'CLIENT REVIEW',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Client Review',
        tasks: ['Return Review Instructions','Streamlined Procedure Instructions','Client Review Call'],
        noSearch: true,
      },
      {
        id: 'closingLetterTask',
        hidden: true,
        tasklistName: 'FINALIZE ENGAGEMENT',
        numeric: false,
        disablePadding: true,
        label: 'Closing Letter',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'closeEngagementTask',
        hidden: true,
        tasklistName: 'FINALIZE ENGAGEMENT',
        numeric: false,
        disablePadding: true,
        label: 'Close Engagement & Archive Teamwork Project',
        isTask: true,
        noSearch: true,
      },
      {
        id: 'finalizeEngagement',
        hidden: false,
        tasklistName: 'FINALIZE ENGAGEMENT',
        isTasklist: true,
        numeric: false,
        disablePadding: true,
        label: 'Finalize Engagment',
        tasks: ['Closing Letter','Close Engagement & Archive Teamwork Project'],
        noSearch: true,
      },
    ];
    // if we are restting we want to keep the columnData, otherwise use fresh columnData
    this.setState({
      columnData: reset === true ? this.state.columnData : columnData,
    })
    //wait some time to check for default view
    console.log('in table head')
    console.log(this.props.loadDefaultView)
    setTimeout(()=>{
      if (this.props.loadDefaultView) {
        //display it
          this.handleViewUpdate(this.props.defaultView[0], this.props.defaultView[0].title)
      }
    },100)
  }

  componentDidMount() {
    this.generateColumnData();
  }

  render() {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, searchViewOpen, tableData } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            {this.state.selectAllLoading ?
                <CircularProgress color="secondary" size={20} className="select-all-loader" />
               :
               <Checkbox
                 disableRipple={true}
                 indeterminate={numSelected > 0 && numSelected < rowCount}
                 checked={numSelected === rowCount}
                 onChange={this.handleSelectAllClick}
               />
            }
          </TableCell>
          {this.state.columnData.map(column => {
            {if (column.hidden !== true){
              return (
                  <TableCell
                    key={column.id}
                    numeric={column.numeric}
                    padding={column.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === column.id ? order : false}
                    className={column.isTasklist ? 'column-head tasklist' : 'column-head'}
                  >
                    {searchViewOpen && !column.noSearch && (
                      <div className="search-container"
                        key={column.id}
                      >
                        <SearchSelect
                          key={column.id}
                          column={column}
                          tableData={this.props.tableData}
                          onSearchMenuItemSelect={this.handleSearchMenuItemSelect}
                          currentFilters={this.props.currentFilters}
                          showNoResults={this.props.showNoResults}
                          noResultValue={this.props.noResultValue}
                         />
                      </div>
                    )}
                    {/* <Tooltip
                      title="Sort"
                      placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    > */}
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={order}
                        onClick={this.createSortHandler(column.id,column.isTasklist,column.tasks,column.isTask,column.label)}
                        //onMouseOver={this.showTasklistTasks(column.tasklistName)}
                      >
                      {column.isTasklist ? <TasklistMenu label={column.label} handleSelect={this.handleTasklistMenuSelect} /> : column.label }
                      {/* {column.tasklistName === undefined ?
                        column.label
                        :
                        <span onMouseOver={this.showTasklistTasks(column.tasklistName,column.tasks)}>{column.label}</span>
                      } */}
                      </TableSortLabel>
                    {/* </Tooltip> */}
                    {/* {column.isTasklist ? <TasklistModal tasks={column.tasks} /> :null} */}
                  </TableCell>
              )
            }}
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

ProjectTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onShowShowTasklistTasks: PropTypes.func.isRequired,
  onShowPopOver: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  projects: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    projects: state.projects,
    tableState: state.tableState,
    savedView: state.savedView,
    defaultView: state.defaultView,
	};
}

export default connect(mapStateToProps, { saveTableState, handleSavedViewDisplay })(ProjectTableHead);
