import React, { Component } from 'react';
import ReactChartkick, { ColumnChart } from 'react-chartkick';
import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
ReactChartkick.addAdapter(Chart);

class PreparerBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      showToolTip: false,
      top: null,
      left: null,
      value: null,
      key: null,
      }
  }

  componentDidMount() {
    let preparers = {};
    this.props.projectData.forEach(p => {
      if (preparers[p.preparer]) {
        preparers[p.preparer]++
      } else {
        if (p.preparer !== undefined && p.preparer !== '') {
          preparers[p.preparer] = 1
        }
      }
    })
    const data = Object.entries(preparers).filter(p=>p[1] > 2)
    console.log(data)
    this.setState({
      chartData: data
    })
  }

  //<ColumnChart label="Projects" id="projects-chart" colors={["#c49e9f"]}  options={this.state.options} data={this.state.chartData} />

  render() {
    const { projectData } = this.props
    return(
      <span>
        <ColumnChart label="Projects" id="projects-chart" colors={["#c49e9f"]}  options={this.state.options} data={this.state.chartData} />
      </span>
    )
  }

}

export default PreparerBarChart;
