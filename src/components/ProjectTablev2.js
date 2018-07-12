  import React, { Component } from 'react';
  import { Row, Col, Table, Icon, Switch, Radio, Form, Divider } from 'antd';
  const FormItem = Form.Item;
  var moment = require('moment');
  moment().format();

  const columns = [ {
      dataIndex: 'projectName',
      className: 'project-table-head',
      key: 'projectName',
      hidden: false,
      numeric: false,
      disablePadding: false,
      title: 'Project',
      noSearch: true },
    { dataIndex: 'preparer',
      key: 'preparer',
      hidden: false,
      numeric: false,
      disablePadding: true,
      title: 'Preparer' },
    { dataIndex: 'clientLastName',
      key: 'clientLastName',
      sorter: function(a,b){return a[this.key] > b[this.key] ? -1 : 1},
      hidden: false,
      numeric: false,
      disablePadding: true,
      title: 'Client Last Name' },
    { dataIndex: 'clientFirstName',
      key: 'clientFirstName',
      hidden: false,
      numeric: false,
      disablePadding: true,
      title: 'Client First Name' },
    { dataIndex: 'lastTasklistChanged',
      key: 'lastTasklistChanged',
      hidden: false,
      numeric: false,
      disablePadding: false,
      title: 'Status' },
    { dataIndex: 'projectNotes',
      key: 'projectNotes',
      hidden: false,
      numeric: false,
      disablePadding: true,
      title: 'Notes',
      noSearch: true },
    { dataIndex: 'dateProjectCreated',
      key: 'dateProjectCreated',
      hidden: false,
      numeric: false,
      disablePadding: true,
      title: 'Date Project Created',
      isDate: true,
      noSearch: true },
    { dataIndex: 'Initial Payment Recieved.lastChangedOn',
      key: 'initialPaymentReceivedTask',
      hidden: true,
      tasklistName: 'INITIAL PAYMENT',
      numeric: false,
      disablePadding: true,
      title: 'Initial Payment Recieved',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Initial Payment.lastChangedOn',
      key: 'initialPaymentTask',
      hidden: true,
      tasklistName: 'INITIAL PAYMENT',
      numeric: false,
      disablePadding: true,
      title: 'Initial Payment',
      isTask: true,
      noSearch: true },
    { dataIndex: 'initialPayment',
      key: 'initialPayment',
      hidden: false,
      tasklistName: 'INITIAL PAYMENT',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Initial Payment',
      tasks: [ 'Initial Payment', 'Initial Payment Recieved' ],
      noSearch: true },
    { dataIndex: 'Getting Started.lastChangedOn',
      key: 'gettingStartedTask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Getting Started',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Tax Organizer.lastChangedOn',
      key: 'taxOrganizerTask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Tax Organizer',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Travel Worksheet.lastChangedOn',
      key: 'qTravelWorksheetTask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Travel Worksheet',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-FBAR and Form 8938.lastChangedOn',
      key: 'qFbarForm8938Task',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-FBAR and Form 8938',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Form 5471 (Foreign Corporation).lastChangedOn',
      key: 'qForm5471Task',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Form 5471 (Foreign Corporation)',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Schedule A.lastChangedOn',
      key: 'qScheduleATask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Schedule A',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Schedule C.lastChangedOn',
      key: 'qScheduleCTask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Schedule C',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Schedule D.lastChangedOn',
      key: 'qScheduleDTask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Schedule D',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Questionnaire-Schedule E.lastChangedOn',
      key: 'qScheduleETask',
      hidden: true,
      tasklistName: 'PROVIDE INFORMATION',
      numeric: false,
      disablePadding: true,
      title: 'Questionnaire-Schedule E',
      isTask: true,
      noSearch: true },
    { dataIndex: 'provideInformation',
      key: 'provideInformation',
      hidden: false,
      tasklistName: 'PROVIDE INFORMATION',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Provide Information',
      tasks:
       [ 'Getting Started',
         'Tax Organizer',
         'Questionnaire-Travel Worksheet',
         'Questionnaire-FBAR and Form 8938',
         'Questionnaire-Form 5471 (Foreign Corporation)',
         'Questionnaire-Schedule A',
         'Questionnaire-Schedule C',
         'Questionnaire-Schedule D',
         'Questionnaire-Schedule E' ],
      noSearch: true },
    { dataIndex: 'Client Welcome Call.lastChangedOn',
      key: 'clientWelcomeCallTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Client Welcome Call',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Audit Protection Plan - IRS Monitoring.lastChangedOn',
      key: 'auditProtectionTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Audit Protection Plan - IRS Monitoring',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Workpaper Preparation.lastChangedOn',
      key: 'workPaperPrepTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Workpaper Preparation',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Data Entry.lastChangedOn',
      key: 'dataEntryTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Data Entry',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Data Entry Review.lastChangedOn',
      key: 'dataEntryReviewTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Data Entry Review',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Data Entry Corrections.lastChangedOn',
      key: 'dataEntryCorrectionsTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Data Entry Corrections',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Final Review.lastChangedOn',
      key: 'finalReviewTask',
      hidden: true,
      tasklistName: 'PREPARATION',
      numeric: false,
      disablePadding: true,
      title: 'Final Review',
      isTask: true,
      noSearch: true },
    { dataIndex: 'preparation',
      key: 'preparation',
      hidden: false,
      tasklistName: 'PERPARATION',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Preparation',
      tasks:
       [ 'Client Welcome Call',
         'Audit Protection Plan - IRS Monitoring',
         'Workpaper Preparation',
         'Data Entry',
         'Data Entry Review',
         'Data Entry Corrections',
         'Final Review' ],
      noSearch: true },
    { dataIndex: 'Final Payment Received.lastChangedOn',
      key: 'finalPaymentReceivedTask',
      hidden: true,
      tasklistName: 'FINALIZE PAYMENT',
      numeric: false,
      disablePadding: true,
      title: 'Final Payment Received',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Final Invoice Due.lastChangedOn',
      key: 'finalInvoiceDueTask',
      hidden: true,
      tasklistName: 'FINALIZE PAYMENT',
      numeric: false,
      disablePadding: true,
      title: 'Final Invoice Due',
      isTask: true,
      noSearch: true },
    { dataIndex: 'finalizePayment',
      key: 'finalizePayment',
      hidden: false,
      tasklistName: 'FINALIZE PAYMENT',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Finalize Payment',
      tasks: [ 'Final Payment Received', 'Final Invoice Due' ],
      noSearch: true },
    { dataIndex: 'Return Review Instructions.lastChangedOn',
      key: 'returnReviewTask',
      hidden: true,
      tasklistName: 'CLIENT REVIEW',
      numeric: false,
      disablePadding: true,
      title: 'Return Review Instructions',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Streamlined Procedure Instructions.lastChangedOn',
      key: 'steamlinedProcedureTask',
      hidden: true,
      tasklistName: 'CLIENT REVIEW',
      numeric: false,
      disablePadding: true,
      title: 'Streamlined Procedure Instructions',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Client Review Call.lastChangedOn',
      key: 'clientReviewCallTask',
      hidden: true,
      tasklistName: 'CLIENT REVIEW',
      numeric: false,
      disablePadding: true,
      title: 'Client Review Call',
      isTask: true,
      noSearch: true },
    { dataIndex: 'clientReview',
      key: 'clientReview',
      hidden: false,
      tasklistName: 'CLIENT REVIEW',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Client Review',
      tasks:
       [ 'Return Review Instructions',
         'Streamlined Procedure Instructions',
         'Client Review Call' ],
      noSearch: true },
    { dataIndex: 'Closing Letter.lastChangedOn',
      key: 'closingLetterTask',
      hidden: true,
      tasklistName: 'FINALIZE ENGAGEMENT',
      numeric: false,
      disablePadding: true,
      title: 'Closing Letter',
      isTask: true,
      noSearch: true },
    { dataIndex: 'Close Engagement & Archive Teamwork Project.lastChangedOn',
      key: 'closeEngagementTask',
      hidden: true,
      tasklistName: 'FINALIZE ENGAGEMENT',
      numeric: false,
      disablePadding: true,
      title: 'Close Engagement & Archive Teamwork Project',
      isTask: true,
      noSearch: true },
    { dataIndex: 'finalizeEngagement',
      key: 'finalizeEngagement',
      hidden: false,
      tasklistName: 'FINALIZE ENGAGEMENT',
      isTasklist: true,
      numeric: false,
      disablePadding: true,
      title: 'Finalize Engagment',
      tasks:
       [ 'Closing Letter',
         'Close Engagement & Archive Teamwork Project' ],
      noSearch: true } ];

  // const data = [];
  // for (let i = 1; i <= 350; i++) {
  //   data.push({
  //     key: i,
  //     name: 'John Brown',
  //     age: `${i}2`,
  //     address: `New York No. ${i} Lake Park`,
  //     'object Test': {
  //       value: 'hey',
  //       hidden: false,
  //     },
  //     description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  //   });
  // }

  const expandedRowRender = record => <p>{record.description}</p>;
  const title = () => 'Here is title';
  const showHeader = true;
  const footer = () => 'Here is footer';
  const scroll = { y: 240 };
  const pagination = { position: 'bottom' };

  class ProjectTablev2 extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        bordered: false,
        loading: true,
        pagination,
        size: 'default',
        expandedRowRender,
        title: undefined,
        showHeader,
        footer,
        rowSelection: {},
        scroll: undefined,
        data: [],
        dataCopy: [],
        columns: [],
        taskToggle: true,
        sortedInfo: {
          order: 'descend',
          columnKey: 'clientLastName',
        },
      }
    }

    handleChange = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      this.setState({
        filteredInfo: filters,
        sortedInfo: sorter,
        pagination,
      });
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

    componentDidMount(){
      // generate the data and save it to state
      let projects = this.props.projectData.projectsInDB;
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
          key: p.teamwork_id,
          id: p.teamwork_id,
          projectName: p.name,
          preparer: p.preparer ? p.preparer : 'N/A',
          clientFirstName: clientNames.firstName,
          clientLastName: clientNames.lastName,
          lastTasklistChanged: p.lastTasklistChanged,
          projectNotes: 'notes',
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
      }).map(p => {
        let projectKeys = Object.keys(p).filter(val => val !== 'key')
        for (let col of projectKeys){
          if (p[col].hidden === true){
            p[col].lastChangedOn = p[col].completed ?
            moment(p[col].lastChangedOn, moment.ISO_8601).format('M/D/YY')
            :
            <Icon type="close" />
          }
          let date = moment(p[col], moment.ISO_8601).format('M/D/YY')
          if (date !== 'Invalid date') {
            p[col] = date
          } else if (p[col] === false) {
            p[col] = <Icon type="close" style={{ fontSize: 16, color: '#08c' }} />
          }
        }
        return {
          ...p
        }
      })
      this.handleTaskToggle();
      console.log(formattedProjectData)
      this.setState({
        pagination: {
          pageSize: formattedProjectData.length
        },
        data: formattedProjectData,
        dataCopy: formattedProjectData,
        columns,
        loading: false,
      })
    }

    handleToggle = (prop) => {
      return (enable) => {
        this.setState({ [prop]: enable });
      };
    }

    handleSizeChange = (e) => {
      this.setState({ size: e.target.value });
    }

    handleExpandChange = (enable) => {
      this.setState({ expandedRowRender: enable ? expandedRowRender : undefined });
    }

    handleTitleChange = (enable) => {
      this.setState({ title: enable ? title : undefined });
    }

    handleHeaderChange = (enable) => {
      this.setState({ showHeader: enable ? showHeader : false });
    }

    handleFooterChange = (enable) => {
      this.setState({ footer: enable ? footer : undefined });
    }

    handleRowSelectionChange = (enable) => {
      this.setState({ rowSelection: enable ? {} : undefined });
    }

    handleScollChange = (enable) => {
      this.setState({ scroll: enable ? scroll : undefined });
    }

    handlePaginationChange = (e) => {
      const { value } = e.target;
      this.setState({
        pagination: value === 'none' ? false : { position: value },
      });
    }

    handleTaskToggle = () => {
      this.setState({
        loading: true,
      })
      let updatedCols = columns.filter(c => c.isTask === !this.state.taskToggle || c.isTask === undefined)
      setTimeout(()=> {
        this.setState({
          taskToggle: !this.state.taskToggle,
          columns: updatedCols,
          loading: false,
        })
      }, 1000)
    }

    render() {
      const state = this.state;

      return (
        <Row>
          <Col span={24}>
            <div>
              <div className="components-table-demo-control-bar">
                <Form layout="inline">
                  <FormItem label="Bordered">
                    <Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />
                  </FormItem>
                  <FormItem label="loading">
                    <Switch checked={state.loading} onChange={this.handleToggle('loading')} />
                  </FormItem>
                  <FormItem label="Title">
                    <Switch checked={!!state.title} onChange={this.handleTitleChange} />
                  </FormItem>
                  <FormItem label="Column Header">
                    <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
                  </FormItem>
                  <FormItem label="Footer">
                    <Switch checked={!!state.footer} onChange={this.handleFooterChange} />
                  </FormItem>
                  <FormItem label="Expandable">
                    <Switch checked={!!state.expandedRowRender} onChange={this.handleExpandChange} />
                  </FormItem>
                  <FormItem label="Checkbox">
                    <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
                  </FormItem>
                  <FormItem label="Toggle Tasks">
                    <Switch checked={this.state.taskToggle} onChange={this.handleTaskToggle} />
                  </FormItem>
                  <FormItem label="Fixed Header">
                    <Switch checked={!!state.scroll} onChange={this.handleScollChange} />
                  </FormItem>
                  <FormItem label="Size">
                    <Radio.Group size="default" value={state.size} onChange={this.handleSizeChange}>
                      <Radio.Button value="default">Default</Radio.Button>
                      <Radio.Button value="middle">Middle</Radio.Button>
                      <Radio.Button value="small">Small</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                  <FormItem label="Pagination">
                    <Radio.Group
                      value={state.pagination ? state.pagination.position : 'none'}
                      onChange={this.handlePaginationChange}
                    >
                      <Radio.Button value="top">Top</Radio.Button>
                      <Radio.Button value="bottom">Bottom</Radio.Button>
                      <Radio.Button value="both">Both</Radio.Button>
                      <Radio.Button value="none">None</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Form>
              </div>
              <Table {...this.state} pagination={{pageSize: this.state.pagination.pageSize, showSizeChanger: true, pageSizeOptions: ['25','50','100','250',`${this.state.data.length}`] }}  columns={this.state.columns} dataSource={this.state.data} onChange={this.handleChange} />
            </div>
          </Col>
        </Row>
      );
    }
  }

  export default ProjectTablev2;
