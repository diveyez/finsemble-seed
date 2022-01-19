/*!
 * Copyright 2017 by ChartIQ, Inc.
 * All rights reserved.
 */

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FinsembleProvider } from "@finsemble/finsemble-ui/react/components/FinsembleProvider";
import {
    ToolbarShell,
    FavoritesShell,
    DragHandle,
    RevealAll,
    MinimizeAll,
    NotificationControl,
    AutoArrange,
    Search,
    Dashbar,
    AdvancedAppLauncherMenu,
    AppLauncherMenu,
    WorkspaceManagementMenu,
    ToolbarSection,
} from "@finsemble/finsemble-ui/react/components/toolbar";
import { FileMenu } from "./FileMenu";
import { useHotkey } from "@finsemble/finsemble-ui/react/hooks/useHotkey";
import "@finsemble/finsemble-ui/react/assets/css/finsemble.css";
import "../../../../public/assets/css/theme.css";
import { AppLaunchers } from "../../defaultAuthentication/AppLaunchers";
import { DashbarView } from "@finsemble/finsemble-ui/react/types/dashbarTypes";

/**
 * Note: Set `FSBL.debug = true` if you need to reload the toolbar during development.
 * By default, it prevents the system from closing it so that users aren't lost without
 * a main window into finsemble functionality.
 */
const Toolbar = () => {
    useHotkey(["ctrl", "alt", "shift", "r"], () => FSBL.restartApplication());
    useHotkey(["ctrl", "alt", "up"], () => FSBL.Clients.LauncherClient.bringWindowsToFront());
    useHotkey(["ctrl", "alt", "down"], () => window.FSBL.Clients.WorkspaceClient.minimizeAll());

    return (
        <ToolbarShell hotkeyShow={["ctrl", "alt", "t"]} hotkeyHide={["ctrl", "alt", "h"]}>
            <ToolbarSection className="left">
                <DragHandle />
                <FileMenu />
                <Search openHotkey={["ctrl", "alt", "f"]} />
                <WorkspaceManagementMenu />
                {/* Component that generates dynamically configured menus */}
                <AppLaunchers align="left" />
            </ToolbarSection>
            <ToolbarSection className="center" hideBelowWidth={115}>
                <div className="divider" />
                <FavoritesShell />
            </ToolbarSection>
            <ToolbarSection className="right">
                <div className="divider"></div>
                <AppLaunchers align="right" />
                <AutoArrange />
                <MinimizeAll />
                <RevealAll />
                <NotificationControl />
            </ToolbarSection>
            <div className="resize-area"></div>
        </ToolbarShell>
    );
};

ReactDOM.render(
	<FinsembleProvider>
		<Toolbar />
		<Dashbar />
	</FinsembleProvider>,
	document.getElementById("Toolbar-tsx")
);
