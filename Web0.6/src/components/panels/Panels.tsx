import * as React from 'react';
import { useState, useEffect } from 'react';
import { IAppConfig, IPanelTable, IPanelm, IConfigmGroups, ITableSettings } from '../interfaces/IAppConfig';
import { IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import mListView from "../../../../../Lib/v0.6/src/Base/components/Esri/Widgets/mListView";
import LegendView from '../../../../../Lib/v0.6/src/Base/components/Esri/Widgets/LegendView';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import mContainer from '../../../../../Lib/v0.6/src/Base/components/mContainer';
import DetailsPanel from '../details/DetailsPanel';
import CreatePanel from '../details/CreatePanel';
import EditPanel from '../details/EditPanel';
import TableContainer from '../table/TableContainer';
import Print from '../../../../../Lib/v0.6/src/Base/components//Esri/Widgets/Print';
import { Grid } from '@material-ui/core';
import PanelRowSplitter from '../../../../../Lib/v0.6/src/Base/components/PanelRowSplitter';
import PanelColumnSplitter from '../../../..//../Lib/v0.6/src/Base/components/PanelColumnSplitter';
import TabComponent from './TabComponent';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import mWrapper from '../../../../../Lib/v0.6/src/Base/components/mWrapper';
import TabButtons from './TabButtons';
import { ContentPanel } from '../../../../../Lib/v0.6/src/Base/components/ContentPanel';
import DefaultValues from "../../../../../Lib/v0.6/src/Base/DefaultValues"
import DocumentsPanel from '../details/DocumentsPanel';

const DIRECTIONLEFT = "left"
const DIRECTIONMIDDLE = "middle"
const PANELSHOW = 'panel show'
const PANELHIDE = 'panel hide'
const DIRECTIONRIGHT = "right"

export const Panel = (ms: {
	panelm: IPanelm,
	index: string,
	configmGroups: IConfigmGroups,
	appConfig: IAppConfig,
	groupIndex?: string,
	// setSelectedTab: (id: string) => void,
	// selectedTab: string,
	ism: (panelm: IPanelm) => boolean,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: string, groupIndex?: string) => void,
	parentHeight: number,
	userInfo: IUserInfo
}) => {
	return (
		<>
			{
				ms.panelm.m === "m"
					?
					<mContainer classm={"main-pro"} />
					:
					ms.panelm.m === "ms" ?
						<mListView mView={ActionsController.getmView()} />
						:
						ms.panelm.m === "popup" ?
							<DetailsPanel
								detailInfo={ms.appConfig.views.panels.detailsPanel}
							/>
							:
							ms.panelm.m === "create" ?
								<CreatePanel
									buttons={ms.appConfig.views.panels.createPanel.buttons}
									groups={ms.appConfig.views.panels.createPanel.groups} 
									messages={ms.appConfig.views.panels.createPanel.messages} />
								:
								ms.panelm.m === "legend" ?
									<LegendView mView={ActionsController.getmView()} />
									:
									ms.panelm.m === "documents" ?
										<DocumentsPanel
											groups={ms.appConfig.views.panels.documentsPanel.groups}
											defaultValues={DefaultValues.config.views.panels.documentsPanel}
										/>
										:
										ms.panelm.m === "edit" ?
											<EditPanel
												buttons={ms.appConfig.views.panels.editPanel.buttons}
												messages={ms.appConfig.views.panels.editPanel.messages}
												groups={ms.appConfig.views.panels.editPanel.groups} />
											:
											ms.panelm.m === "table" ?
											<TableContainer
													tableInfo={ms.appConfig.views.panels.attributeTablePanel.tables[ms.index] as IPanelTable}
													tableId={ms.index}
													tableSettings={ms.appConfig.views.panels.attributeTablePanel.tableSettings}
													defaultValues={DefaultValues.config.views.panels.attributeTablePanel}
													appConfig={ms.appConfig}
												/>
												:
												ms.panelm.m === "print" ?
													<Print serviceUrl={ms.appConfig.views.panels.printPanel.printServiceUrl.url} />
													:
													ms.panelm.m === "group" ?
														<Grid container alignms={"stretch"} style={{ height: "100%", width: "100%", position: 'relative' }}>
															{ms.panelm.children ?
																Object.keys(ms.panelm.children).m((key: string, index: number, arr) => { //(panelm: IPanelm, index: number, arr) => (
																	var panelm = (ms.panelm.children as {[key: string]: IPanelm})[key];
																	return (
																		<React.Fragment key={`panelm-${key}-${index}`}>
																			<Panelm
																				key={`panelNestedmGroup_${panelm.m}`}
																				panelm={panelm}
																				index={key}
																				marginLeft={panelm.columnSplitter ? "-4px" : undefined}
																				configmGroups={ms.configmGroups}
																				groupIndex={ms.index}
																				// setSelectedTab={ms.setSelectedTab}
																				// selectedTab={ms.selectedTab}
																				ism={ms.ism}
																				togglePanel={ms.togglePanel}
																				appConfig={ms.appConfig}
																				userInfo={ms.userInfo}
																			/>
																			{panelm.rowSplitter &&
																				!panelm.hidden &&
																				ms.panelm.children &&
																				ms.panelm.children[arr[index + 1]] &&
																				!ms.panelm.children[arr[index + 1]].hidden ?
																				<PanelRowSplitter
																					key={`horizontal-splitter-${index}`}
																					upperPanelmId={key}
																					lowerPanelmId={arr[index + 1]}
																					index={key}
																					parentHeight={ms.parentHeight}
																					parentPanleId={ms.index} />
																				:
																				(null)
																			}
																			{panelm.columnSplitter &&
																				!panelm.hidden &&
																				ms.panelm.children &&
																				ms.panelm.children[arr[index + 1]] &&
																				!ms.panelm.children[arr[index + 1]].hidden ?
																				<PanelColumnSplitter
																					key={`vertical-divider-${index}`}
																					leftPanelmId={key}
																					rightPanelmId={arr[index + 1]}
																					index={index} />
																				:
																				(null)
																			}
																		</React.Fragment>
																	)
																}) : ""}
														</Grid>
														: 
														ms.panelm.m === "tabs" ?
															ms.panelm.ms && Object.keys(ms.panelm.ms).length > 0 ?
																<TabComponent
																	panelm={{ ...ms.panelm }}
																	//ms={...ms.panelm.ms}
																	index={ms.index}
																	groupIndex={ms.groupIndex}
																	togglePanel={ms.togglePanel}
																	ism={ms.ism}
																	appConfig={ms.appConfig}
																	configmGroups={ms.configmGroups}
																	// selectedTab={ms.selectedTab}
																	userInfo={ms.userInfo}
																	parentHeight={ms.parentHeight}
																// setSelectedTab={ms.setSelectedTab ? ms.setSelectedTab : ms.setSelectedTab}
																/>
																:
																<div>TODO</div>
															:
															ms.panelm.m === "content" ?
																<ContentPanel resourceUrl={ms.appConfig.views.panels.contentPanel[ms.index].resourceUrl} />
																:
																<div></div>

			}
		</>
	)
}

export const Panelm = (ms: {
	panelm: IPanelm,
	index: string,
	configmGroups: IConfigmGroups,
	groupIndex?: string,
	marginLeft?: string,
	marginRight?: string,
	// setSelectedTab: (id: string) => void,
	// selectedTab: string,
	ism: (panelm: IPanelm) => boolean,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: string, groupIndex?: string) => void,
	appConfig: any,
	userInfo: IUserInfo
}) => {

	const [icon, setIcon] = useState<JSX.Element | null>(null);
	const [mHeight, setmHeight] = useState(0);
	const mRef = React.useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (mRef && mRef.current) {
			const height = mRef.current.clientHeight;
			setmHeight(height);
		}
	}, []);

	useEffect(() => {
		let _icon = null;
		switch (ms.panelm.hideDirection) {
			case DIRECTIONRIGHT:
				_icon = ms.panelm.hidden ?
					<ArrowLeftIcon fontSize={"small"} style={{ height: "16px", width: "16px" }} /> :
					<ArrowRightIcon fontSize={"small"} style={{ height: "16px", width: "16px" }} />
				break;
			case DIRECTIONLEFT:
				_icon = ms.panelm.hidden ?
					<ArrowRightIcon fontSize={"small"} style={{ height: "16px", width: "16px" }} /> :
					<ArrowLeftIcon fontSize={"small"} style={{ height: "16px", width: "16px" }} />
				break;
			case DIRECTIONMIDDLE:
				_icon = ms.panelm.hidden ?
					<ArrowDropUpIcon fontSize={"small"} style={{ height: "16px", width: "16px", marginBottom: "7px" }} /> :
					<ArrowDropDownIcon fontSize={"small"} style={{ height: "16px", width: "16px", marginBottom: "7px" }} />
				break;
		}
		setIcon(_icon);
	}, [ms.panelm.hidden]);


	return (
		<Grid
			ref={ms.panelm.m === "group" ? mRef : null}
			classm={
				ms.panelm.hidden
					? PANELHIDE
					: PANELSHOW
			}
			style={
				ms.ism(ms.panelm)
					? ms.panelm.hidden
						? {
							
							minHeight: ms.panelm.height, flexGrow: 1, pmingRight: "0px",
							marginLeft: ms.marginLeft ? ms.marginLeft : "0",
							marginRight: ms.marginRight ? ms.marginRight : "0"
						}
						: {
						
							minHeight: ms.panelm.height, flexGrow: 1, pmingRight: "0px", position: "relative",
							marginLeft: ms.marginLeft ? ms.marginLeft : "0",
							marginRight: ms.marginRight ? ms.marginRight : "0"
						}
					: ms.panelm.hidden
						? {
							
							minHeight: ms.panelm.height, pmingRight: "0px",
							marginLeft: ms.marginLeft ? ms.marginLeft : "0",
							marginRight: ms.marginRight ? ms.marginRight : "0"
						}
						: {
							height: ms.panelm.height,
							minHeight: ms.panelm.height, pmingRight: "0px", position: "relative",
							marginLeft: ms.marginLeft ? ms.marginLeft : "0",
							marginRight: ms.marginRight ? ms.marginRight : "0"
						}
			}
			key={ms.panelm.m}
			m
			xs={ms.panelm.grid.xs}
			sm={ms.panelm.grid.sm}
			md={ms.panelm.grid.md}
			lg={ms.panelm.grid.lg}
			xl={ms.panelm.grid.xl}>

			<mWrapper
				index={ms.index}
				groupIndex={ms.groupIndex}
				panelm={ms.panelm}
				togglePanel={
					!ms.ism(ms.panelm)
						&& ms.panelm.hideDirection
						? ms.togglePanel
						: undefined
				}
				title={ms.panelm.title}
				component={<Panel
					panelm={ms.panelm}
					index={ms.index}
					configmGroups={ms.configmGroups}
					appConfig={ms.appConfig}
					groupIndex={ms.groupIndex}
					// setSelectedTab={ms.setSelectedTab}
					// selectedTab={ms.selectedTab}
					ism={ms.ism}
					togglePanel={ms.togglePanel}
					parentHeight={mHeight}
					userInfo={ms.userInfo}
				/>} />
			{
				icon
					?
					<TabButtons
						click={ms.togglePanel}
						icon={icon}
						index={ms.index}
						m={ms.panelm}
						groupIndex={ms.groupIndex}
						appConfig={ms.appConfig}
					/>
					:
					null
			}
		</Grid>
	);
}