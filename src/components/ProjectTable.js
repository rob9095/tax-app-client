import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Moment from 'react-moment';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Close from '@material-ui/icons/Close';
import TasklistMenu from '../containers/TasklistMenu';
import NoResultsModal from '../containers/NoResultsModal';
import ProjectTableToolbar from './ProjectTableToolbar';
import ProjectTableHead from './ProjectTableHead';
import ProjectNotes from './ProjectNotes';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tasklistCol: {
    minWidth: 130,
  }
});

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'projectName',
      selected: [],
      data: [].sort((a, b) => (a.projectName < b.projectName ? -1 : 1)),
      dataCopy: [],
      currentFilters: [],
      page: 0,
      rowsPerPage: 20,
      lastCheckedTask: '',
      getHeaderState: false,
      showSaveModal: false,
      savedViewTitle: '',
      headState: {},
      searchOpen: false,
      checkboxLoading: false,
      isLoading: true,
      showNoResults: false,
      resetTrigger: false,
      rowsPerPageOptions: [25,50,100,250],
      noResultValue: '',
      chart: '',
    };
    this.sanitizeName = this.sanitizeName.bind(this);
    this.handleShowPopover = this.handleShowPopover.bind(this)
    this.handleShowTasklistTask = this.handleShowTasklistTask.bind(this);
    this.handleViewUpdate = this.handleViewUpdate.bind(this);
  }

  sanitizeName = (s) => {
    let check = s.split('').filter(s => s === '-')
    if (check.length === 0) {
      let firstName = s
      let lastName = '';
      return({firstName, lastName})
    }
    let split = s.split('-')
    let splitTwo = split[1].split('_')
    let lastName = splitTwo[0];
    if (splitTwo[1] === undefined) {
      let firstName = lastName;
      return({firstName, lastName})
    }
    let splitThree = splitTwo[1].split(' ');
    let firstName = splitThree[0]
    let secondCheck = firstName.split('').filter(s => s === '(')
    if (secondCheck.length > 0 ) {
      let anotherSplit = firstName.split('(');
      firstName = anotherSplit[0];
    }
    return({firstName, lastName})
  }

  sanitizeTasklists = (project) => {

  }

  componentWillReceiveProps(newProps) {
    if (newProps.chart !== this.state.chart) {
      this.setState({
        chart: newProps.chart,
      })
    }
  }

  componentDidMount(){
    this.generateTableData();
  }

  generateTableData = () => {
    // generate the data and save it to state
    let projects = this.props.projects.projectsInDB;
    //console.log(projects)
    //let formattedProjectData = [];

    let formattedProjectData = projects.map(p => {
      let clientNames = this.sanitizeName(p.name)
      let ipTaskDate, piTaskDate, fpTaskDate, pTaskDate, feTaskDate, crTaskDate = false;
      let ipInitialPaymentDate, ipInitialPaymentCompleted, ipInitialPaymentRecievedDate, ipInitialPaymentRecievedCompleted, piGettingStartedDate, piGettingStartedCompleted, piTaxOrganizerDate, piTaxOrganizerCompleted, piQTravelWorksheetDate, piQTravelWorksheetCompleted, piQFbarDate, piQFbarCompleted, piQForm5471Date, piQForm5471Completed, piQScheduleADate, piQScheduleACompleted, piQScheduleCDate, piQScheduleCCompleted, piQScheduleDDate, piQScheduleDCompleted, piQScheduleEDate, piQScheduleECompleted, pClientWelcomeCallDate, pClientWelcomeCallCompleted, pAuditProtectionDate, pAuditProtectionCompleted,pWorkPaperPrepDate, pWorkPaperPrepCompleted, pDataEntryDate, pDataEntryCompleted, pDataEntryReviewDate, pDataEntryReviewCompleted = false;
      let pDataEntryCorrectionsDate, pDataEntryCorrectionsCompleted, pFinalReviewDate, pFinalReviewCompleted, fpFinalPaymentReceivedDate, fpFinalPaymentReceivedCompleted, fpFinalInvoiceDueDate, fpFinalInvoiceDueCompleted, crReturnReviewInstructionsDate, crReturnReviewInstructionsCompleted, crStreamlinedProcedureDate, crStreamlinedProcedureCompleted, crClientReviewCallDate, crClientReviewCallCompleted, feClosingLetterDate, feClosingLetterCompleted, feCloseEngagementDate, feCloseEngagementCompleted = false;

      let ipTask = p.tasklists.filter(t => t.taskName === 'INITIAL PAYMENT' && t.complete === true);
      ipTask.length === 0 || ipTask[0].complete === false ? ipTaskDate = false : ipTaskDate = ipTask[0].lastChangedOn;
      // tasks for Initial Payment tasklist
      if (ipTask.length > 0) {
        // inital payment task
        let intialPaymentTask = ipTask[0].tasks.filter(task => task.content === 'Initial Payment')
        if (intialPaymentTask[0] !== undefined && intialPaymentTask[0].completed !== false) {
          ipInitialPaymentDate = intialPaymentTask[0].lastChangedOn
          ipInitialPaymentCompleted = intialPaymentTask[0].completed
        }

        // intial payment recieved task
        let intialPaymentRecievedTask = ipTask[0].tasks.filter(task => task.content === 'Initial Payment Received')
        if (intialPaymentRecievedTask[0] !== undefined && intialPaymentRecievedTask[0].completed !== false) {
          ipInitialPaymentRecievedDate = intialPaymentRecievedTask[0].lastChangedOn
          ipInitialPaymentRecievedCompleted = intialPaymentRecievedTask[0].completed
        }
      }
      let piTask = p.tasklists.filter(t => t.taskName === 'PROVIDE INFORMATION');
      piTask.length === 0 || piTask[0].complete === false ? piTaskDate = false : piTaskDate = piTask[0].lastChangedOn;
      //tasks for Provide Information tasklist
      if (piTask.length > 0) {
      // 'Getting Started'
      let gettingStartedTask = piTask[0].tasks.filter(task => task.content === 'Getting Started')
      if (gettingStartedTask[0] !== undefined && gettingStartedTask[0].completed !== false) {
        piGettingStartedDate = gettingStartedTask[0].lastChangedOn
        piGettingStartedCompleted = gettingStartedTask[0].completed
      }

      // 'Tax Organizer'
      let taxOrangizerTask = piTask[0].tasks.filter(task => task.content === 'Tax Organizer')
      if (taxOrangizerTask[0] !== undefined && taxOrangizerTask[0].completed !== false) {
        piTaxOrganizerDate = taxOrangizerTask[0].lastChangedOn
        piTaxOrganizerCompleted = taxOrangizerTask[0].completed
      }

      // 'Questionnaire-Travel Worksheet'
      let qTravelWorksheetTask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Travel Worksheet')
      if (qTravelWorksheetTask[0] !== undefined && qTravelWorksheetTask[0].completed !== false) {
        piQTravelWorksheetDate = qTravelWorksheetTask[0].lastChangedOn
        piQTravelWorksheetCompleted = qTravelWorksheetTask[0].completed
      }

      // 'Questionnaire-FBAR and Form 8938'
      let qFbarTask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-FBAR and Form 8938')
      if (qFbarTask[0] !== undefined && qFbarTask[0].completed !== false) {
        piQFbarDate = qFbarTask[0].lastChangedOn
        piQFbarCompleted = qFbarTask[0].completed
      }

      // 'Questionnaire-Form 5471 (Foreign Corporation)'
      let qForm5471Task = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Form 5471 (Foreign Corporation)')
      if (qForm5471Task[0] !== undefined && qForm5471Task[0].completed !== false) {
        piQForm5471Date = qForm5471Task[0].lastChangedOn
        piQForm5471Completed = qForm5471Task[0].completed
      }

      // 'Questionnaire-Schedule A'
      let qScheduleATask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Schedule A')
      if (qScheduleATask[0] !== undefined && qScheduleATask[0].completed !== false) {
        piQScheduleADate = qScheduleATask[0].lastChangedOn
        piQScheduleACompleted = qScheduleATask[0].completed
      }

      // 'Questionnaire-Schedule C'
      let qScheduleCTask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Schedule C')
      if (qScheduleCTask[0] !== undefined && qScheduleCTask[0].completed !== false) {
        piQScheduleCDate = qScheduleCTask[0].lastChangedOn
        piQScheduleCCompleted = qScheduleCTask[0].completed
      }

      // 'Questionnaire-Schedule D'
      let qScheduleDTask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Schedule D')
      if (qScheduleDTask[0] !== undefined && qScheduleDTask[0].completed !== false) {
        piQScheduleDDate = qScheduleDTask[0].lastChangedOn
        piQScheduleDCompleted = qScheduleDTask[0].completed
      }

      // 'Questionnaire-Schedule E'
      let qScheduleETask = piTask[0].tasks.filter(task => task.content === 'Questionnaire-Schedule E')
      if (qScheduleETask[0] !== undefined && qScheduleETask[0].completed !== false) {
        piQScheduleEDate = qScheduleETask[0].lastChangedOn
        piQScheduleECompleted = qScheduleETask[0].completed
      }
      }

      let pTask =  p.tasklists.filter(t => t.taskName === 'PREPARATION');
      pTask.length === 0 || pTask[0].complete === false ? pTaskDate = false : pTaskDate = pTask[0].lastChangedOn;
      // tasks for PREPARATION tasklists
      if (pTask.length > 0) {
        // 'Client Welcome Call'
        let clientWelcomeCallTask = pTask[0].tasks.filter(task => task.content === 'Client Welcome Call')
        if (clientWelcomeCallTask[0] !== undefined && clientWelcomeCallTask[0].completed !== false) {
          pClientWelcomeCallDate = clientWelcomeCallTask[0].lastChangedOn
          pClientWelcomeCallCompleted = clientWelcomeCallTask[0].completed
        }

        // 'Audit Protection Plan - IRS Monitoring'
        let auditProtectionTask = pTask[0].tasks.filter(task => task.content === 'Audit Protection Plan - IRS Monitoring')
        if (auditProtectionTask[0] !== undefined && auditProtectionTask[0].completed !== false) {
          pAuditProtectionDate = auditProtectionTask[0].lastChangedOn
          pAuditProtectionCompleted = auditProtectionTask[0].completed
        }

        // 'Workpaper Preparation'
        let workPaperPrepTask = pTask[0].tasks.filter(task => task.content === 'Workpaper Preparation')
        if (workPaperPrepTask[0] !== undefined && workPaperPrepTask[0].completed !== false) {
          pWorkPaperPrepDate = workPaperPrepTask[0].lastChangedOn
          pWorkPaperPrepCompleted = workPaperPrepTask[0].completed
        }

        // 'Data Entry'
        let dataEntryTask = pTask[0].tasks.filter(task => task.content === 'Data Entry')
        if (dataEntryTask[0] !== undefined && dataEntryTask[0].completed !== false) {
          pDataEntryDate = dataEntryTask[0].lastChangedOn
          pDataEntryCompleted = dataEntryTask[0].completed
        }

        // 'Data Entry Review'
        let dataEntryReviewTask = pTask[0].tasks.filter(task => task.content === 'Data Entry Review')
        if (dataEntryReviewTask[0] !== undefined && dataEntryReviewTask[0].completed !== false) {
          pDataEntryReviewDate = dataEntryReviewTask[0].lastChangedOn
          pDataEntryReviewCompleted = dataEntryReviewTask[0].completed
        }

        // 'Data Entry Corrections'
        let dataEntryCorrectionsTask = pTask[0].tasks.filter(task => task.content === 'Data Entry Corrections')
        if (dataEntryCorrectionsTask[0] !== undefined && dataEntryCorrectionsTask[0].completed !== false) {
          pDataEntryCorrectionsDate = dataEntryCorrectionsTask[0].lastChangedOn
          pDataEntryCorrectionsCompleted = dataEntryCorrectionsTask[0].completed
        }

        // 'Final Review'
        let finalReviewTask = pTask[0].tasks.filter(task => task.content === 'Final Review')
        if (finalReviewTask[0] !== undefined && finalReviewTask[0].completed !== false) {
          pFinalReviewDate = finalReviewTask[0].lastChangedOn
          pFinalReviewCompleted = finalReviewTask[0].completed
        }
      }
      let fpTask = p.tasklists.filter(t => t.taskName === 'FINALIZE PAYMENT');
      fpTask.length === 0 || fpTask[0].complete === false ? fpTaskDate = false : fpTaskDate = fpTask[0].lastChangedOn;
      // tasks for Finalize Payment Tasklist
      if (fpTask.length > 0) {
        // 'Final Payment Received'
        let finalPaymentReceivedTask = fpTask[0].tasks.filter(task => task.content === 'Final Payment Received')
        if (finalPaymentReceivedTask[0] !== undefined && finalPaymentReceivedTask[0].completed !== false) {
          fpFinalPaymentReceivedDate = finalPaymentReceivedTask[0].lastChangedOn
          fpFinalPaymentReceivedCompleted = finalPaymentReceivedTask[0].completed
        }

        // 'Final Invoice Due'
        let finalInvoiceDueTask = fpTask[0].tasks.filter(task => task.content === 'Final Invoice Due')
        if (finalInvoiceDueTask[0] !== undefined && finalInvoiceDueTask[0].completed !== false) {
          fpFinalInvoiceDueDate = finalInvoiceDueTask[0].lastChangedOn
          fpFinalInvoiceDueCompleted = finalInvoiceDueTask[0].completed
        }
      }
      let crTask = p.tasklists.filter(t => t.taskName === 'CLIENT REVIEW');
      crTask.length === 0 || crTask[0].complete === false ? crTaskDate = false : crTaskDate = crTask[0].lastChangedOn;
      // tasks for client review tasklist
      if (crTask.length > 0) {
        // 'Return Review Instructions'
        let returnReviewInstructionsTask = crTask[0].tasks.filter(task => task.content === 'Return Review Instructions')
        if (returnReviewInstructionsTask[0] !== undefined && returnReviewInstructionsTask[0].completed !== false) {
          crReturnReviewInstructionsDate = returnReviewInstructionsTask[0].lastChangedOn
          crReturnReviewInstructionsCompleted = returnReviewInstructionsTask[0].completed
        }

        // 'Streamlined Procedure Instructions'
        let streamlinedProcedureTask = crTask[0].tasks.filter(task => task.content === 'Streamlined Procedure Instructions')
        if (streamlinedProcedureTask[0] !== undefined && streamlinedProcedureTask[0].completed !== false) {
          crStreamlinedProcedureDate = streamlinedProcedureTask[0].lastChangedOn
          crStreamlinedProcedureCompleted = streamlinedProcedureTask[0].completed
        }

        // 'Client Review Call'
        let clientReviewCallTask = crTask[0].tasks.filter(task => task.content === 'Client Review Call')
        if (clientReviewCallTask[0] !== undefined && clientReviewCallTask[0].completed !== false) {
          crClientReviewCallDate = clientReviewCallTask[0].lastChangedOn
          crClientReviewCallCompleted = clientReviewCallTask[0].completed
        }
      }

      let feTask = p.tasklists.filter(t => t.taskName === 'FINALIZE ENGAGEMENT');
      feTask.length === 0 || feTask[0].complete === false ? feTaskDate = false : feTaskDate = feTask[0].lastChangedOn;
      // tasks for finalize engagement tasklist
      if (feTask.length > 0) {
        // 'Closing Letter'
        let closingLetterTask = feTask[0].tasks.filter(task => task.content === 'Closing Letter')
        if (closingLetterTask[0] !== undefined && closingLetterTask[0].completed !== false) {
          feClosingLetterDate = closingLetterTask[0].lastChangedOn
          feClosingLetterCompleted = closingLetterTask[0].completed
        }

        // 'Close Engagement & Archive Teamwork Project'
        let closeEngagementTask = feTask[0].tasks.filter(task => task.content === 'Close Engagement & Archive Teamwork Project')
        if (closeEngagementTask[0] !== undefined && closeEngagementTask[0].completed !== false) {
          feCloseEngagementDate = closeEngagementTask[0].lastChangedOn
          feCloseEngagementCompleted = closeEngagementTask[0].completed
        }

      }
      return {
        id: p.teamwork_id,
        projectName: p.name,
        preparer: p.preparer ? p.preparer : 'N/A',
        clientFirstName: clientNames.firstName,
        clientLastName: clientNames.lastName,
        lastTasklistChanged: p.lastTasklistChanged,
        projectNotes: p.messageReplies,
        dateProjectCreated: p.createdOn,
        initialPayment: ipTaskDate,
        "Initial Payment Recieved": {
          hidden: true,
          lastChangedOn: ipInitialPaymentRecievedDate,
          completed: ipInitialPaymentRecievedCompleted,
        },
        "Initial Payment": {
          hidden: true,
          lastChangedOn: ipInitialPaymentDate,
          completed: ipInitialPaymentCompleted,
        },
        provideInformation: piTaskDate,
        "Getting Started": {
          hidden: true,
          lastChangedOn: piGettingStartedDate,
          completed: piGettingStartedCompleted,
        },
        "Tax Organizer": {
          hidden: true,
          lastChangedOn: piTaxOrganizerDate,
          completed: piTaxOrganizerCompleted,
        },
        "Questionnaire-Travel Worksheet": {
          hidden: true,
          lastChangedOn: piQTravelWorksheetDate,
          completed: piQTravelWorksheetCompleted,
        },
        "Questionnaire-FBAR and Form 8938": {
          hidden: true,
          lastChangedOn: piQFbarDate,
          completed: piQFbarCompleted,
        },
        "Questionnaire-Form 5471 (Foreign Corporation)": {
          hidden: true,
          lastChangedOn: piQForm5471Date,
          completed: piQForm5471Completed,
        },
        "Questionnaire-Schedule A": {
          hidden: true,
          lastChangedOn: piQScheduleADate,
          completed: piQScheduleACompleted,
        },
        "Questionnaire-Schedule C": {
          hidden: true,
          lastChangedOn: piQScheduleCDate,
          completed: piQScheduleCCompleted,
        },
        "Questionnaire-Schedule D": {
          hidden: true,
          lastChangedOn: piQScheduleDDate,
          completed: piQScheduleDCompleted,
        },
        "Questionnaire-Schedule E": {
          hidden: true,
          lastChangedOn: piQScheduleEDate,
          completed: piQScheduleECompleted,
        },
        preparation: pTaskDate,
        "Client Welcome Call": {
          hidden: true,
          lastChangedOn: pClientWelcomeCallDate,
          completed: pClientWelcomeCallCompleted,
        },
        "Audit Protection Plan - IRS Monitoring": {
          hidden: true,
          lastChangedOn: pAuditProtectionDate,
          completed: pAuditProtectionCompleted,
        },
        "Workpaper Preparation": {
          hidden: true,
          lastChangedOn: pWorkPaperPrepDate,
          completed: pWorkPaperPrepCompleted,
        },
        "Data Entry": {
          hidden: true,
          lastChangedOn: pDataEntryDate,
          completed: pDataEntryCompleted,
        },
        "Data Entry Review": {
          hidden: true,
          lastChangedOn: pDataEntryReviewDate,
          completed: pDataEntryReviewCompleted,
        },
        "Data Entry Corrections": {
          hidden: true,
          lastChangedOn: pDataEntryCorrectionsDate,
          completed: pDataEntryCorrectionsCompleted,
        },
        "Final Review": {
          hidden: true,
          lastChangedOn: pFinalReviewDate,
          completed: pFinalReviewCompleted,
        },
        finalizePayment: fpTaskDate,
        "Final Payment Received": {
          hidden: true,
          lastChangedOn: fpFinalPaymentReceivedDate,
          completed: fpFinalPaymentReceivedCompleted,
        },
        "Final Invoice Due": {
          hidden: true,
          lastChangedOn: fpFinalInvoiceDueDate,
          completed: fpFinalInvoiceDueCompleted,
        },
        clientReview: crTaskDate,
        "Return Review Instructions": {
          hidden: true,
          lastChangedOn: crReturnReviewInstructionsDate,
          completed: crReturnReviewInstructionsCompleted,
        },
        "Streamlined Procedure Instructions": {
          hidden: true,
          lastChangedOn: crStreamlinedProcedureDate,
          completed: crStreamlinedProcedureCompleted,
        },
        "Client Review Call": {
          hidden: true,
          lastChangedOn: crClientReviewCallDate,
          completed: crClientReviewCallCompleted,
        },
        finalizeEngagement: feTaskDate,
        "Closing Letter": {
          hidden: true,
          lastChangedOn: feClosingLetterDate,
          completed: feClosingLetterCompleted,
        },
        "Close Engagement & Archive Teamwork Project": {
          hidden: true,
          lastChangedOn: feCloseEngagementDate,
          completed: feCloseEngagementCompleted,
        },
      }
      //formattedProjectData.push(formattedProject);
    })
    console.log(formattedProjectData)
    this.setState({
      data: formattedProjectData,
      dataCopy: formattedProjectData,
      isLoading: this.props.loadDefaultView ? true : false,
      rowsPerPageOptions: [...this.state.rowsPerPageOptions, formattedProjectData.length],
      chart: this.props.chart,
    })
  }

  handleShowPopover = (tasks,tasklistName,activeTasks) => {
    this.props.onTogglePopover(tasks,tasklistName,activeTasks)
  }

  handleShowTasklistTask = (task) => {

    let updatedData = this.state.dataCopy
    updatedData.forEach(p => {
      p[task].hidden = !p[task].hidden
      // console.log(p[task].hidden)
    })

    // let updatedData = this.state.data.map(p => {
    //   let newProject = {
    //     ...p
    //   };
    //   newProject[task].hidden = false
    //   return newProject;
    // });
    this.setState({
      data: updatedData,
      lastCheckedTask: task,
    })
  }

  handleRequestSort = (event, property, isTask, view) => {
    console.log('im about to sort some stuff')
    const orderBy = property;
    let order = 'desc';
    let data = this.state.data;
    if (view) {
      console.log('its a view I will sort!')
      console.log(view.bodyState.orderBy)
      console.log(view.bodyState.order)
      order = view.bodyState.order;
    } else {
      if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
      }
    }

    if (isTask) {
      data =
        order === 'desc'
            ? this.state.data.sort((a, b) => (b[orderBy].lastChangedOn === undefined ) - (a[orderBy].lastChangedOn === undefined) || (b[orderBy].lastChangedOn < a[orderBy].lastChangedOn ? -1 : 1))
            : this.state.data.sort((a, b) => (a[orderBy].lastChangedOn === undefined ) - (b[orderBy].lastChangedOn === undefined) || (a[orderBy].lastChangedOn < b[orderBy].lastChangedOn ? -1 : 1));
    } else {
      data =
        order === 'desc'
            ? this.state.data.sort((a, b) => (b[orderBy] === false ) - (a[orderBy] === false) || (b[orderBy] < a[orderBy] ? -1 : 1))
            : this.state.data.sort((a, b) => (a[orderBy] === false ) - (b[orderBy] === false) || (a[orderBy] < b[orderBy] ? -1 : 1));
    }

    // this.state.data.sort((a,b) => {
    //   console.log(a[orderBy])
    // })
    this.setState({
      data,
      order,
      orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleSelectUpdate = (id, load) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected, checkboxLoading: load });
  }

  handleClick = (event, id) => {
    if (this.state.rowsPerPage > 200) {
        this.setState({
          checkboxLoading: true,
          checkboxClicked: id,
        })
        setTimeout(()=>{
          this.handleSelectUpdate(id, true);
        },100)
        setTimeout(()=>{
          this.setState({ checkboxLoading: false });
        }, 500)
    } else {
        this.handleSelectUpdate(id, false);
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    if (event.target.value > 200) {
      this.handleToggleLoad()
      setTimeout(()=>{
        this.handleToggleLoad()
      },1000)
    }
    this.setState({page: 0})
    setTimeout(()=> {
      this.setState({ rowsPerPage: event.target.value });
    },250)
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  handleShowSaveModal = () => {
    this.setState({
      showSaveModal: !this.state.showSaveModal,
    })
  }

  handleGetHeadState = (headerState) => {
    console.log('the header state is')
    console.log(headerState)
    this.setState({
      getHeaderState: !this.state.getHeaderState,
    })
    if (headerState) {
      this.setState({
        headState: {
          ...headerState,
        }
      })
    }
    if (this.state.getHeaderState) {
      this.handleShowSaveModal();
    }
  }

  handleSearchViewToggle = () => {
    this.setState({
      searchOpen: !this.state.searchOpen
    })
  }

  handleViewUpdate = (view) => {
    if (!view) {
      console.log('we need to remove filters and requery fresh data')
      this.handleTableSearch([], 'clearFilters');
      return
    }
    this.setState({
      ...view.bodyState,
    })
    console.log('we updated the table body state!')
    console.log(this.state)
    console.log(view.bodyState)
    // check if we need to sort
    if (!view.headerState.noSort) {
      console.log('we needa sort!')
      if (view.headerState.currentColumnIsTask) {
        this.handleRequestSort(null, view.headerState.currentColumnLabel, true, view);
      } else {
        this.handleRequestSort(null, view.headerState.currentColumn, false, view)
      }
    }
    if (view.bodyState.currentFilters.length > 0) {
      console.log('we need to filter!')
      this.handleTableSearch(view.bodyState.currentFilters);
    } else {
      console.log('we need to remove filters and requery fresh data')
      this.handleTableSearch([], 'clearFilters');
    }
    setTimeout(()=>{
      this.setState({
        isLoading: false,
      })
    },300)
  }

  handleTableSearch = (searchArr, removeFilter) => {
    console.log(`the incoming search Arr is`)
    console.log(searchArr)
    let results = [];
    let filters = this.state.currentFilters.filter(f => f.value !== removeFilter);
    removeFilter === 'clearFilters' ? filters = [] : null
    console.log(`the current filters are`)
    console.log(filters)
    if (searchArr.length === 0 && filters.length === 0) {
      console.log(`we have no search items or filters, resetting data!`)
      console.log(this.state.dataCopy)
      this.setState({
        data: this.state.dataCopy,
        currentFilters: [],
        rowsPerPage: this.props.loadDefaultView ? this.props.defaultView.bodyState.rowsPerPage : 25,
        page: 0,
      })
      return
    } else if (searchArr.length === 0 && filters.length > 0) {
      console.log(`we have no search items but we do have filters`)
      console.log(`the filters/searchArr are now:`)
      console.log(filters)
      searchArr = filters;
    } else if (searchArr.length > 0 && filters.length > 0) {
      let arr = [...filters, ...searchArr];
      searchArr =[];
      let searchItems = {};
      for (let item of arr) {
        if (searchItems[item.value]) {
          console.log(`duplicate found: ${item.value}`)
        } else {
          searchItems[item.value] = true;
          searchArr.push(item)
        }
      }
    }
    console.log(`We are about to search the searchArr which is now:`)
    console.log(searchArr)
    let cols = {}
    for (let searchItem of searchArr) {
      console.log(`the searchItem is ${searchItem.value}`)
      let result = results.length > 0 && !cols[searchItem.column.id] ?
        results.filter(p => p[searchItem.column.id].indexOf(searchItem.value) !== -1)
        :
        this.state.dataCopy.filter(p => p[searchItem.column.id].indexOf(searchItem.value) !== -1)
      const check = filters.filter(el => el.value === searchItem.value);
      if (check.length > 0) {
        console.log('dont push the filter')
      } else {
        if (result.length > 0) {
          console.log('pushing filter')
          filters.push({column: searchItem.column, value: searchItem.value})
        }
      }
      results.length > 0 && !cols[searchItem.column.id] ? results = [...result] : results.push(...result)
      console.log(`result for ${searchItem.value} is`)
      console.log(result)
      cols[searchItem.column.id] = true
    }
    console.log(`the complied results are:`)
    console.log(results)
    if (results.length > 0) {
      this.setState({
        data: results,
        rowsPerPage: results.length,
        currentFilters: filters,
      })
    } else {
      this.setState({
        showNoResults: true,
        noResultValue: searchArr[searchArr.length-1].value,
      })
      //alert('no results')
    }
  }

  handleToggleLoad = () => {
    this.setState({
      isLoading: !this.state.isLoading,
    })
  }

  handleProjectDelete = (id) => {
    this.setState({
      data: this.state.data.filter(p => p.id !== id),
      dataCopy: this.state.dataCopy.filter(p => p.id !== id),
      selected: [],
    })
  }

  handleTableReset = () => {
    console.log('reset from table hit')
    this.setState({
      resetTrigger: true,
    })
  }

  handleResetTriggerToggle = () => {
    this.setState({
      resetTrigger: !this.state.resetTrigger,
    })
  }

  handleShowNoResultsToggle = (clearFilter) => {
    this.setState({
      showNoResults: !this.state.showNoResults,
    })
  }

  render() {
    const { classes, projectData, lastCheckedTask, removeTask } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, dataCopy } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    let currentTasks = [];
    if (this.state.data.length > 0) {
      let obj = this.state.data[0]
      for (let el in obj) {
        if (typeof obj[el] === 'object') {
          if (obj[el].hidden === false) {
            currentTasks.push(el)
          }
        }
      }
    }
    return (
      <div className={this.state.isLoading ? 'table-container loading' : 'table-container'}>
        <Paper className={classes.root}>
          {this.state.isLoading && (
            <div className="table-loader">
              <CircularProgress />
            </div>
          )}
          {this.state.showNoResults && (
            <NoResultsModal
              onTableReset={this.handleResetTriggerToggle}
              toggleShowNoResults={this.handleShowNoResultsToggle}
            />
          )}
            <ProjectTableToolbar
              currentTasks={currentTasks}
              numSelected={selected.length}
              toggleGetHeadState={this.handleGetHeadState}
              openSaveModal={this.state.showSaveModal}
              toggleSaveModel={this.handleShowSaveModal}
              bodyState={this.state}
              toggleSearchView={this.handleSearchViewToggle}
              searchViewOpen={this.state.searchOpen}
              rowsPerPage={this.state.rowsPerPage}
              selectedProjects={this.state.selected}
              toggleLoad={this.handleToggleLoad}
              onProjectDelete={this.handleProjectDelete}
            />
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <ProjectTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
                projects={projectData}
                onShowShowTasklistTasks={this.handleShowTasklistTask}
                onShowPopOver={this.handleShowPopover}
                lastCheckedTask={lastCheckedTask}
                removeTask={removeTask}
                saveState={this.state.getHeaderState}
                toggleGetHeadState={this.handleGetHeadState}
                triggerViewUpdate={this.handleViewUpdate}
                searchViewOpen={this.state.searchOpen}
                tableData={dataCopy}
                onTableSearch={this.handleTableSearch}
                currentFilters={this.state.currentFilters}
                rowsPerPage={this.state.rowsPerPage}
                loadDefaultView={this.props.loadDefaultView}
                resetTrigger={this.state.resetTrigger}
                toggleResetTrigger={this.handleResetTriggerToggle}
                showNoResults={this.state.showNoResults}
                noResultValue={this.state.noResultValue}
              />
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      key={n.id}
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        {this.state.checkboxLoading && this.state.checkboxClicked === n.id ?
                          <CircularProgress color="secondary" size={20} className="select-all-loader" />
                          :
                          <Checkbox
                           disableRipple={true}
                           checked={isSelected}
                           onClick={event => this.handleClick(event, n.id)}
                          />
                        }
                      </TableCell>
                      <TableCell className="table-cell">{n.projectName}</TableCell>
                      <TableCell className="table-cell" padding="none">{n.preparer}</TableCell>
                      <TableCell className="table-cell" padding="none">{n.clientLastName}</TableCell>
                      <TableCell className="table-cell" padding="none">{n.clientFirstName}</TableCell>
                      <TableCell className="table-cell">{n.lastTasklistChanged}</TableCell>
                      <TableCell className="table-cell" padding="none">
                        <ProjectNotes notes={n.projectNotes} />
                      </TableCell>
                      <TableCell className="table-cell" padding="none">
                        <Moment format="M/D/YY">{n.dateProjectCreated}</Moment>
                      </TableCell>
                      {!n['Initial Payment'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Initial Payment'].completed ?
                            <Moment format="M/D/YY">{n['Initial Payment'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Initial Payment Recieved'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Initial Payment Recieved'].completed ?
                            <Moment format="M/D/YY">{n['Initial Payment Recieved'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.initialPayment ? <Moment format="M/D/YY">{n.initialPayment}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                      {!n['Getting Started'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Getting Started'].completed ?
                            <Moment format="M/D/YY">{n['Getting Started'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Tax Organizer'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Tax Organizer'].completed ?
                            <Moment format="M/D/YY">{n['Tax Organizer'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Travel Worksheet'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Travel Worksheet'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Travel Worksheet'].lastChangedOn}</Moment>
                            :
                            n['Questionnaire-Travel Worksheet'].completed === undefined ? <span>N/A</span> : <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-FBAR and Form 8938'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-FBAR and Form 8938'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-FBAR and Form 8938'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Form 5471 (Foreign Corporation)'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Form 5471 (Foreign Corporation)'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Form 5471 (Foreign Corporation)'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Schedule A'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Schedule A'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Schedule A'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Schedule C'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Schedule C'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Schedule C'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Schedule D'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Schedule D'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Schedule D'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Questionnaire-Schedule E'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Questionnaire-Schedule E'].completed ?
                            <Moment format="M/D/YY">{n['Questionnaire-Schedule E'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.provideInformation ? <Moment format="M/D/YY">{n.provideInformation}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                      {!n['Client Welcome Call'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Client Welcome Call'].completed ?
                            <Moment format="M/D/YY">{n['Client Welcome Call'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Audit Protection Plan - IRS Monitoring'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Audit Protection Plan - IRS Monitoring'].completed ?
                            <Moment format="M/D/YY">{n['Audit Protection Plan - IRS Monitoring'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Workpaper Preparation'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Workpaper Preparation'].completed ?
                            <Moment format="M/D/YY">{n['Workpaper Preparation'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Data Entry'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Data Entry'].completed ?
                            <Moment format="M/D/YY">{n['Data Entry'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Data Entry Review'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Data Entry Review'].completed ?
                            <Moment format="M/D/YY">{n['Data Entry Review'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Data Entry Corrections'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Data Entry Corrections'].completed ?
                            <Moment format="M/D/YY">{n['Data Entry Corrections'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Final Review'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Final Review'].completed ?
                            <Moment format="M/D/YY">{n['Final Review'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.preparation ? <Moment format="M/D/YY">{n.preparation}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                      {!n['Final Payment Received'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Final Payment Received'].completed ?
                            <Moment format="M/D/YY">{n['Final Payment Received'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Final Invoice Due'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Final Invoice Due'].completed ?
                            <Moment format="M/D/YY">{n['Final Invoice Due'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.finalizePayment ? <Moment format="M/D/YY">{n.finalizePayment}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                      {!n['Return Review Instructions'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Return Review Instructions'].completed ?
                            <Moment format="M/D/YY">{n['Return Review Instructions'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Streamlined Procedure Instructions'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Streamlined Procedure Instructions'].completed ?
                            <Moment format="M/D/YY">{n['Streamlined Procedure Instructions'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Client Review Call'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Client Review Call'].completed ?
                            <Moment format="M/D/YY">{n['Client Review Call'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.clientReview ? <Moment format="M/D/YY">{n.clientReview}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                      {!n['Closing Letter'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Closing Letter'].completed ?
                            <Moment format="M/D/YY">{n['Closing Letter'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      {!n['Close Engagement & Archive Teamwork Project'].hidden && (
                        <TableCell className="table-cell tasklist-task" padding="none">
                          {n['Close Engagement & Archive Teamwork Project'].completed ?
                            <Moment format="M/D/YY">{n['Close Engagement & Archive Teamwork Project'].lastChangedOn}</Moment>
                            :
                            <Close className="incomplete-tasklist" />
                          }
                        </TableCell>
                      )}
                      <TableCell className="table-cell tasklist" padding="none">
                        {n.finalizeEngagement ? <Moment format="M/D/YY">{n.finalizeEngagement}</Moment> : <Close className="incomplete-tasklist" />}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={13} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={this.state.rowsPerPageOptions}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    projects: state.projects,
    tableState: state.tableState,
	};
}

export default compose(withStyles(styles), connect(mapStateToProps, { }), )(EnhancedTable);
