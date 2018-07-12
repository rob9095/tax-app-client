import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactChartkick, { BarChart, ColumnChart } from 'react-chartkick';
import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
ReactChartkick.addAdapter(Chart);

class ProjectChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      options: {
        animation: {
          easing: "easeOutElastic",
		      duration: 800,
        },
        plugins: {
          datalabels: {
            display: true,
            color: '#fff'
          }
        },
      }
    }
  }

  componentDidMount() {
    let projectLastTasks = {};
    this.props.projectData.projectsInDB.forEach(p => {
      if (projectLastTasks[p.lastTasklistChanged]) {
        projectLastTasks[p.lastTasklistChanged]++
      } else {
        projectLastTasks[p.lastTasklistChanged] = 1
      }
    })
    this.setState({
      chartData: projectLastTasks
    })
  }

  render() {
    const { projectData } = this.props
    return(
      <ColumnChart label="Projects" id="projects-chart" colors={["#c49e9f"]}  options={this.state.options} data={this.state.chartData} />
    )
  }

}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    projects: state.projects
	};
}

export default connect(mapStateToProps, {})(ProjectChart);
