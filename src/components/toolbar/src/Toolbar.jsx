/*!
 * Copyright 2017 by ChartIQ, Inc.
 * All rights reserved.
 */

import React from "react";
import ReactDOM from "react-dom";
import { FinsembleProvider } from "@chartiq/finsemble-ui/react/components/FinsembleProvider";
import {
	ToolbarShell,
	FavoritesShell,
	DragHandle,
	RevealAll,
	MinimizeAll,
	AutoArrange,
	Search,
	AdvancedAppLauncherMenu,
	WorkspaceManagementMenu,
	ToolbarSection,
} from "@chartiq/finsemble-ui/react/components/Toolbar";
import { FileMenu } from "./FileMenu";
import { useHotkey } from "@chartiq/finsemble-ui/react/hooks/useHotkey";
import "@chartiq/finsemble-ui/react/assets/css/finsemble.css";
import "../../../../assets/css/theme.css";

const Toolbar = () => {
	useHotkey(["ctrl", "alt", "shift", "r"], () => FSBL.restartApplication());
	useHotkey(["ctrl", "alt", "up"], () =>
		FSBL.Clients.LauncherClient.bringWindowsToFront()
	);
	useHotkey(["ctrl", "alt", "down"], () =>
		window.FSBL.Clients.WorkspaceClient.minimizeAll()
	);

	return (
		<ToolbarShell
			hotkeyShow={["ctrl", "alt", "t"]}
			hotkeyHide={["ctrl", "alt", "h"]}
		>
			<ToolbarSection className="left">
				<DragHandle />
				<FileMenu />
				<Search openHotkey={["ctrl", "alt", "f"]} />
				<WorkspaceManagementMenu />
				<AdvancedAppLauncherMenu enableQuickComponents={true} />
			</ToolbarSection>
			<ToolbarSection className="center" hideBelowWidth={115}>
				<div className="divider" />
				<FavoritesShell />
			</ToolbarSection>
			<ToolbarSection className="right">
				<div className="divider"></div>
				<AutoArrange />
				<MinimizeAll />
				<RevealAll />
			</ToolbarSection>
			<div className="resize-area"></div>
		</ToolbarShell>
	);
};

ReactDOM.render(
	<FinsembleProvider>
		<Toolbar />
	</FinsembleProvider>,
	document.getElementById("Toolbar-component-wrapper")
);
