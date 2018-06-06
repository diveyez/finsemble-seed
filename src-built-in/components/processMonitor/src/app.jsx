import React from "react";
import ReactDOM from "react-dom";
import { Store, Actions } from "./stores/ProcessMonitorStore";
import ListHeader from "./components/ListHeader";
import ProcessStatistics from "./components/ProcessStatistics";
import ChildWindows from "./components/ChildWindows";
import "../processMonitor.css";
import { EMPTY_TOTALS, SIMPLE_MODE_STATISTICS } from "./constants";
import { statReducer, round, bytesToSize } from "./helpers"
//Not used right now. Currently using alerts. This is for the future.
export default class ProcessMonitor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			processList: []
		};
		this.bindCorrectContext();
	}
	bindCorrectContext() {
		this.onProcessListChanged = this.onProcessListChanged.bind(this);

	}
	onProcessListChanged(err, response) {
		let { value } = response;
		this.setState({
			processList: value
		})
	}
	componentDidMount() {
		Store.addListener({ field: "processList" }, this.onProcessListChanged);
	}
	componentWillUnmount() {
		Store.removeListener({ field: "processList" }, this.onProcessListChanged);
	}
	render() {
		//simple mode: CPU, memory
		//Advanced mode: add more.
		//Use helpers.bytesToSize.
		//Array of process components.
		let totals = this.state.processList.length ? this.state.processList.reduce(statReducer) : EMPTY_TOTALS;
		return (
			<div>
				<div className="process-list-wrapper">
					<ListHeader fields={SIMPLE_MODE_STATISTICS
					} />
					<div className="process-list">
						{this.state.processList.map((proc, i) => {
							return (<div className="process">
								<ProcessStatistics
									mode="advanced"
									fields={SIMPLE_MODE_STATISTICS
									}
									groupModifier={i}
									stats={proc.statistics} />
								<ChildWindows childWindows={proc.childWindows} />
							</div>)
						})}
					</div>
				</div>

				<div className="summary-statistics-wrapper">
					<div className="summary-statistics-header">
						Totals
					</div>
					<div className="summary-statistics">
						{typeof totals.statistics.cpuUsage !== "undefined" &&
							<div className="summary-statistic">
								<div className="summary-statistic-label">
									CPU
								</div>
								<div className="summary-statistic-number">
									{round(totals.statistics.cpuUsage, 2) + "%"}
								</div>
							</div>
						}
						{typeof totals.statistics.workingSetSize !== "undefined" &&
							<div className="summary-statistic">
								<div className="summary-statistic-label">
									Memory
								</div>
								<div className="summary-statistic-number">
									{bytesToSize(totals.statistics.workingSetSize)}
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		)
	}
}

FSBL.addEventListener("onReady", function () {
	// var Test = require('./test');
	console.log("appLauncher app onReady");

	Actions.initialize(function (store) {
		ReactDOM.render(
			<ProcessMonitor />
			, document.getElementById("ProcessMonitor-component-wrapper"));
	});
});