/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/

import React from "react";
import ReactDOM from "react-dom";
//Finsemble font-icons, general styling, and specific styling.
import "../../assets/css/font-finance.css";
import "../../assets/css/finsemble.css";
import "../floatingTitlebar.css";
import { Actions as HeaderActions, Store as HeaderStore } from "./stores/headerStore";
import TabbingSection from "./components/Tabbing";
import * as storeExports from "./stores/tabbingStore";

let isDragging = false;
let lastDragEventLeave = false;
let hover = false;
/**
 * This is our floating titlebar. .
 *
 * @class AppLauncher
 * @extends {React.Component}
 */
class FloatingTitlebar extends React.Component {
	constructor(props) {
		super(props);
		this.finWindow = fin.desktop.Window.getCurrent();
		this.state = {
			size: "small",
			tabs: [],
			shouldContractOnStop: false,
			hasTabs: storeExports.Actions.getTabs().length
		};
		this.onActionClick = this.onActionClick.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onTabsUpdated = this.onTabsUpdated.bind(this);
		this.contractWindow = this.contractWindow.bind(this);
		this.expandWindow = this.expandWindow.bind(this);
		this.onTilingStart = this.onTilingStart.bind(this);
		this.onTilingStop = this.onTilingStop.bind(this);
	}

	componentWillMount() {
		storeExports.Store.addListener({ field: "tabs" }, this.onTabsUpdated);
		HeaderStore.addListener("expandWindow", this.expandWindow);
		FSBL.Clients.RouterClient.addListener("DockingService.startTilingOrTabbing", this.onTilingStart);
		FSBL.Clients.RouterClient.addListener("DockingService.stopTilingOrTabbing", this.onTilingStop);
	}
	componentWillunMount() {
		storeExports.Store.removeListener({ field: "tabs" }, this.onTabsUpdated);
		FSBL.Clients.RouterClient.removeListener("DockingService.startTilingOrTabbing", this.onTilingStart);
		FSBL.Clients.RouterClient.removeListener("DockingService.stopTilingOrTabbing", this.onTilingStop);

	}
	onTilingStart(err, response) {
		this.setState({
			hadTabs: storeExports.Actions.getTabs().length,
			shouldContractOnStop: this.state.size === "small" &&
				HeaderStore.getCompanionWindow().windowName !== response.data.windowIdentifier.windowName
		}, () => {
			if (this.state.size === "small" &&
				HeaderStore.getCompanionWindow().windowName !== response.data.windowIdentifier.windowName) {
				this.expandWindow();// expand the window if this isn't the tabbing window
			}
		})

	}
	onTilingStop() {
		let shouldContractOnStop = this.state.shouldContractOnStop
		var self = this;
		this.setState({ shouldContractOnStop: false }, () => {
			if (shouldContractOnStop && self.state.hadTabs &&
				storeExports.Actions.getTabs().length < 2) {
				self.contractWindow();// contract the window if it wasn't expanded before and there are no tab
			}
		});
	}

	onDragStart(e) {
		isDragging = true;
		e.dataTransfer.setData("text/json", JSON.stringify(storeExports.Actions.getWindowIdentifier()));
		FSBL.Clients.WindowClient.startTilingOrTabbing({
			windowIdentifier: storeExports.Actions.getWindowIdentifier()
		});
	}
	onDragEnd(e) {
		isDragging = false;
		FSBL.Clients.Logger.system.debug("Tab drag stop");
		var mousePositionOnDragEnd = {
			x: e.nativeEvent.screenX,
			y: e.nativeEvent.screenY
		}
		if (!FSBL.Clients.WindowClient.isPointInBox(mousePositionOnDragEnd, FSBL.Clients.WindowClient.options)) {
			FSBL.Clients.WindowClient.stopTilingOrTabbing({ mousePosition: mousePositionOnDragEnd });
		}
	}
	onComponentDidMount() {
	}
	onComponentDidUpdate() {
	}
	onTabsUpdated() {
		let tabs = storeExports.Actions.getTabs();
		var self = this;
		if (tabs && tabs.length && tabs.length > 1) {

			return this.setState({ hasTabs: true })
		}
		this.setState({ hasTabs: false }, function () {
		})
	}
	contractWindow() {
		var self = this;
		HeaderActions.contractWindow(function () {
			self.setState({ size: "small" })
		})
	}
	expandWindow() {
		var self = this;
		setTimeout(() => {
			self.setState({ size: "large" })
			HeaderActions.expandWindow(function () {
			})
		}, 0);
	}
	onActionClick(event) {// We catch the click event here before it has a change to propagate down to the tags.
		if (isDragging) return;
		if (event) {
			event.stopPropagation();
			event.nativeEvent.stopImmediatePropagation();
		}
		this.state.size === "small" ? this.expandWindow() : this.contractWindow();

	}
	render() {
		let headerClasses = "fsbl-header fsbl-tabs-enabled";
		//If we're showing tabs, we throw these classes on to modify styles.

		headerClasses += " fsbl-tabs-enabled";

		if (this.state.tabs.length > 1) {
			headerClasses += " fsbl-tabs-multiple";
		}
		let actionClasses = "actionButton"
		var self = this;

		if (this.state.size === "small") {
			actionClasses += " tabs-expand";
			return <div onClickCapture={(e) => { this.onActionClick(e) }}
				draggable="true"
				onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} className="headerContainer " >
				<div className={actionClasses}></div>
			</div >
		}

		return <div className={headerClasses} onDragOver={this.onDragOver} onDragEnd={this.onDragEnd} onDragEnter={function () {
			lastDragEventLeave = false;
		}}>
			<div id="actionbutton" onClickCapture={function (e) { self.onActionClick(e) }} className="actionButton tabs-contract"></div>
			<TabbingSection />
		</div >
	}
}

FSBL.addEventListener("onReady", function () {
	HeaderActions.initialize(function () {
		storeExports.initialize(HeaderStore.getCompanionWindow(), function () {
			storeExports.Actions.setWindowIdentifier(HeaderStore.getCompanionWindow().identifier)
			ReactDOM.render(
				<FloatingTitlebar />
				, document.getElementById("bodyHere"));
		})
	});
});
