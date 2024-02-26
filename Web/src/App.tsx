import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import * as React from 'react';
import { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import m = require("esri/m");
import { ImDispatcher, IPopupDispatcher, ICustomPopupDispatcher } from "ReactTemplate/Base/interfaces/dispatchers";
import {  mDispatcher, popupDispatcher, customPopupDispatcher } from "ReactTemplate/Base/actions/dispatchers";
import { ImView } from "ReactTemplate/Base/interfaces/models";
import { Grid } from '@material-ui/core';
import { setBrowserInfo } from "ReactTemplate/Base/actions/dispatchers/browserInfoDispatcher";
import { IBrowserInfoDispatcher } from "ReactTemplate/Base/interfaces/dispatchers/IBrowserInfoDispatcher";
import { OnClickAction } from 'ReactTemplate/Base/enums/mEvents';
import mListView from "ReactTemplate/Base/components/Esri/Widgets/mListView";
import LegendView from "ReactTemplate/Base/components/Esri/Widgets/LegendView";
import { IUrlInfo, IAppConfig, IPanelTable, IPanelm, IConfigmGroup, IConfigmGroups } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { IAppStore, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import mContainer from 'ReactTemplate/Base/components/mContainer';
import mWrapper from 'ReactTemplate/Base/components/mWrapper'
import ActionsController from 'ReactTemplate/ActionsController/ActionsController';
import { createRef } from 'react';
import DetailsComponent from './components/popup/DetailsComponent';
import CreateFeature from './components/create/CreateFeature';
import TableContainer3 from 'ReactTemplate/Base/components/AttributeTable/TableContainer3';
import TabComponent from './components/TabComponent';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Print from 'ReactTemplate/Base/components/Esri/Widgets/Print';
import TabButtons from './components/TabButtons';
import PanelColumnSplitter from './components/PanelColumnSplitter';
import PanelRowSplitter from './components/PanelRowSplitter';

import { ThemeProvider } from "../../../Lib/V0.5/node_modules/@material-ui/core";

import { theme } from './theme';
import { IDetailDataFeatures } from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';

export const THEMES = {
	['Blueprint']: 'mosaic-blueprint-theme',
	['None']: '',
};


export const Panel = (ms: {
	panelm: IPanelm,
	index: number,
	configmGroups: IConfigmGroups,
	appConfig: IAppConfig,
	groupIndex?: number, setSelectedTab: (id: string) => void, selectedTab: string,
	ism: (panelm: IPanelm) => boolean,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, groupIndex?: number) => void,
	parentHeight: number,
	userInfo:IUserInfo
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
							<DetailsComponent documentPreviewUrl={ms.appConfig.sitemerties['documentUrl']} setSelectedTab={
								ms.setSelectedTab
									? ms.setSelectedTab
									: ms.setSelectedTab
							}
								selectedTab={ms.selectedTab ? ms.selectedTab : ""}
								detailInfo={ms.appConfig.views.panels.detailsPanel}
								attributesText={ms.appConfig.sitemerties['attributesLabel']}
								documentText={ms.appConfig.sitemerties['documentLabel']}

							/>
							:
							ms.panelm.m === "create" ?
								<CreateFeature 
									selectText={ms.appConfig.sitemerties['selectLabel']}
									attributesText={ms.appConfig.sitemerties['attributesLabel']}
									documentText={ms.appConfig.sitemerties['documentLabel']}
									dialogDocumentText={ms.appConfig.sitemerties['dialogDocumentLabel']}
									okDocumentText={ms.appConfig.sitemerties['okDocumentLabel']}
									cancelDocumentText={ms.appConfig.sitemerties['cancelDocumentLabel']}
									mDocumentText={ms.appConfig.sitemerties['mDocumentLabel']}
									deleteDocumentText={ms.appConfig.sitemerties['deleteDocumentLabel']}
									buttons={ms.appConfig.views.panels.createPanel.buttons}
									groups={ms.appConfig.views.panels.createPanel.groups} 
									settlementUrl={ms.appConfig.sitemerties['settlementUrl']}
									helpText={ms.appConfig.sitemerties['uploadHelpText']}
									active={ms.panelm.id==ms.selectedTab}
									municipalityUrl={ms.appConfig.sitemerties['municipalityUrl']}
									districtUrl={ms.appConfig.sitemerties['districtUrl']} />
								:
								ms.panelm.m === "legend" ?
									<LegendView mView={ActionsController.getmView()} />
									:
									
										ms.panelm.m === "table" ?
											<TableContainer3
												tableInfo={ms.appConfig.views.panels.attributeTablePanel[ms.panelm.id] as IPanelTable}
												mGroups={ms.appConfig.data.mGroups}
												webms={ms.appConfig.data.webms}
												tableId={ms.panelm.id}
												refreshButtonText={ms.appConfig.views.panels.attributeTablePanel.refreshButtonText}
												mRefreshButtonText={ms.appConfig.views.panels.attributeTablePanel.mRefreshButtonText}
												nextIconButtonText={ms.appConfig.views.panels.attributeTablePanel.nextIconButtonText}
												backIconButtonText={ms.appConfig.views.panels.attributeTablePanel.backIconButtonText}
												labelRowsPerPage={ms.appConfig.views.panels.attributeTablePanel.labelRowsPerPage}
												ofText={ms.appConfig.views.panels.attributeTablePanel.ofText}
												pageText={ms.appConfig.views.panels.attributeTablePanel.pageText}
												rowText={ms.appConfig.views.panels.attributeTablePanel.rowText}
											/>
											:
											ms.panelm.m === "print" ?
												<Print serviceUrl={ms.appConfig.views.panels.printPanel.printServiceUrl.url} />
												:
												ms.panelm.m === "group" ?
													<Grid container alignms={"stretch"} style={{ height: "100%", width: "100%", position: 'relative' }}>
														{ms.panelm.children?.m((panelm: IPanelm, i: number, arr) => {
															return (
																<React.Fragment key={`panelm-${panelm.id}-${i}`}>
																	<Panelm
																		key={`panelNestedmGroup_${panelm.m}`}
																		panelm={panelm}
																		index={i}
																		configmGroups={ms.configmGroups}
																		groupIndex={ms.index}
																		setSelectedTab={ms.setSelectedTab}
																		selectedTab={ms.selectedTab}
																		ism={ms.ism}
																		togglePanel={ms.togglePanel}
																		appConfig={ms.appConfig}
																		userInfo={ms.userInfo}
																	/>
																	{!panelm.hidden && arr[i + 1] && !arr[i + 1].hidden ?
																		<PanelRowSplitter
																			key={`horizontal-splitter-${i}`}
																			upperPanelmId={panelm.id}
																			lowerPanelmId={arr[i + 1].id}
																			index={i}
																			parentHeight={ms.parentHeight}
																			parentPanleId={ms.panelm.id} />
																		:
																		(null)
																	}
																</React.Fragment>
															)
														})}
													</Grid>
													:
													ms.panelm.m === "tabs" ?
														ms.panelm.ms && ms.panelm.ms.length > 0 ?
															<TabComponent
																panelm={ms.panelm}
																index={ms.index}
																groupIndex={ms.groupIndex}
																togglePanel={ms.togglePanel}
																ism={ms.ism}
																appConfig={ms.appConfig}
																configmGroups={ms.configmGroups}
																selectedTab={ms.selectedTab}
																userInfo={ms.userInfo}
																setSelectedTab={ms.setSelectedTab ? ms.setSelectedTab : ms.setSelectedTab}
															/>
															:
															<div>TODO</div>
														:
														<div></div>

			}
		</>
	)
}

const Panelm = (ms: {
	panelm: IPanelm,
	index: number,
	configmGroups: IConfigmGroups,
	groupIndex?: number,
	setSelectedTab: (id: string) => void,
	selectedTab: string,
	ism: (panelm: IPanelm) => boolean,
	togglePanel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, groupIndex?: number) => void,
	appConfig: any,
	userInfo:IUserInfo
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
						? { minHeight: ms.panelm.height, flexGrow: 1, pmingRight: "0px" }
						: { minHeight: ms.panelm.height, flexGrow: 1, pmingRight: "0px", position: "relative" }
					: ms.panelm.hidden
						? { minHeight: ms.panelm.height, pmingRight: "0px" }
						: { minHeight: ms.panelm.height, pmingRight: "0px", position: "relative" }
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
					setSelectedTab={ms.setSelectedTab}
					selectedTab={ms.selectedTab}
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
					/>
					:
					null
			}
		</Grid>
	);
}

export m Theme = keyof mof THEMES;

interface Dispatchms extends ImDispatcher, IPopupDispatcher, IBrowserInfoDispatcher, ICustomPopupDispatcher {
	
}

interface Parentms {
	uis?: Array<string>;
	appConfig: IAppConfig;
}

interface Ownms {
	mView: ImView | undefined;
	mobile: boolean;
	height: number,
	userInfo: IUserInfo;
	configObjectmGroups: IConfigmGroups;
	panelmsObj: IPanelm[];
}

m ms = Parentms & Dispatchms & Ownms

interface State {
	credentialsRestoreAttempted: boolean;
	urlPrefix: string;
	containerRef: React.RefObject<HTMLDivElement>,
	selectedPanel: { panelId: string, tab: number };
	panelms: Array<IPanelm>
	panelClass: string;
	selectedTab: string;

}


const PANELSHOW = 'panel show'
const PANELHIDE = 'panel hide'
const DIRECTIONRIGHT = "right"
const DIRECTIONLEFT = "left"
const DIRECTIONMIDDLE = "middle"

declare global { interface Window { setCookie: (m: string, value: string, days?: number) => void; getCookie: (m: string) => string; eraseCookie: (m: string, paths: Array<string>) => void; } }
class App extends React.PureComponent<ms, State> {
	m: m;

	constructor(ms: ms) {
		super(ms);
		this.ms.setmOnClick(OnClickAction.IdentifyToTables);
		this.state = {
			credentialsRestoreAttempted: false,
			urlPrefix: "",
			containerRef: createRef<HTMLDivElement>(),
			selectedPanel: {} as { panelId: string, tab: number },
			// panelms: this.ms.appConfig['libm'].panelInfo,
			panelms: this.ms.panelmsObj,
			panelClass: PANELSHOW,
			selectedTab: "",
		}
		// this.setSelectedTab = this.setSelectedTab.bind(this);
	}

	componentDidMount() {
		this.setState({ urlPrefix: this.getUrlPrefix() });
	}

	componentDidUpdate() {

		// if (!this.ms.userInfo.userm) {
		// 	this.ms.setDetailData([] as IDetailDataFeatures[]);
		// }
	}

	getUrlPrefix(): string {
		var result = ""
		if (this.state.urlPrefix) {
			result = this.state.urlPrefix;
		} else {
			if (this.isValidUrl(window.configUrl)) {
				var configPrefix = window.configUrl.substring(0, window.configUrl.lastIndexOf("/"));
				if (configPrefix) {
					result = configPrefix;
				}
			} else {
				result = location.protocol + '//' + location.host + location.pathm + window.configUrl.substring(0, window.configUrl.lastIndexOf("/"));
			}
		}
		return result;
	}

	isValidUrl(input: string) {
		try {
			new URL(input);
			return true;
		} catch (_) {
			return false;
		}
	}

	getUrlPath(urlInfo: IUrlInfo): string {
		let result: string = "";
		switch (urlInfo.urlm) {
			case "absolute":
				result = urlInfo.url;
				break;
			case "configRelative":
				result = this.getUrlPrefix() + "/" + urlInfo.url;
				break;
			// case "siteRelative":
			// 	result = location.protocol + '//' + location.host + location.pathm + urlInfo.url;
			// 	break;
			default:
				{
					if (this.isValidUrl(urlInfo.url)) {
						result = urlInfo.url;
					}
					else {
						result = this.state.urlPrefix + "/" + urlInfo.url;
					}
				}
		}
		return result;
	}

	getWindowRibbonAndSearchPanelHeight = () => {
		const ribbon: HTMLDivElement | null = document.querySelector(".esri-bg-ribbon");
		let ribbonHeight = 0;
		if (ribbon) {
			ribbonHeight = ribbon.offsetHeight;
		}
		const windowHeight = this.ms.height ? this.ms.height : window.innerHeight;
		return { windowHeight: windowHeight, ribbonHeight }
	}

	calculateMosaicRootHeight = () => {
		const heights = this.getWindowRibbonAndSearchPanelHeight();
		const { windowHeight, ribbonHeight } = heights;
		const mosaicRootHeight = windowHeight - ribbonHeight;
		return mosaicRootHeight;
	}

	getm = () => {
		return ActionsController.getmView()
	}

	togglePanel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number, groupIndex?: number) => {
		var result = [...this.state.panelms];
		if (groupIndex != undefined) {
			if (result[groupIndex].children && result[groupIndex].children[index] && result[groupIndex].children[index].hidden) {
				result[groupIndex].children[index].hidden = false;
			} else {
				result[groupIndex].children[index].top = e.currentTarget.getBoundingClientRect().top;
				result[groupIndex].children[index].hidden = true;
			}
		} else {
			if (result[index].hidden) {
				result[index].hidden = false;
			} else {
				result[index].top = e.currentTarget.getBoundingClientRect().top;
				result[index].hidden = true;
			}
		}
		this.setState({ panelms: result })
	}

	setSelectedTab = (id: string) => {
		this.setState({
			...this.state,
			selectedTab: id
		});
	}

	ism(panelm: IPanelm) {
		var result = false;
		if (panelm.m == "m") {
			result = true
		}
		if (panelm.m == "group") {
			if (panelm.children && panelm.children.find(x => x.m == "m")) {
				result = true;
			}
		}
		return result;
	}

	render() {
		return (
			<ThemeProvider theme={theme}>

				<div style={{ width: "100%", height: "100%", backgroundColor: "rgb(229, 229, 229, 0.5)", overflowX: 'hidden' }}>
					{this.ms.configObjectmGroups?
						<Grid ref={this.state.containerRef} container alignms={"stretch"} style={{ height: "100%", width: "100%", flexWrap: "nowrap" }} spacing={1}>
							{/* {this.ms.panelmsObj.m((panelm: IPanelm, index: number) => {
							return (this.renderPanelm(panelm, index, this.ms.configObjectmGroups));
						})} */}
							{this.ms.panelmsObj.m((panelm: IPanelm, index: number, arr) => (
								<React.Fragment key={`panel-fragment-${panelm.id}-${index}`}>
									<>
										<Panelm
											key={`panelm_${panelm.m}_${index}`}
											panelm={panelm}
											index={index}
											configmGroups={this.ms.configObjectmGroups}
											appConfig={this.ms.appConfig}
											setSelectedTab={this.setSelectedTab}
											selectedTab={this.state.selectedTab}
											ism={this.ism}
											togglePanel={this.togglePanel}
											userInfo={this.ms.userInfo}
										/>
										{!panelm.hidden && arr[index + 1] && !arr[index + 1].hidden ?
											<PanelColumnSplitter
												key={`vertical-divider-${index}`}
												leftPanelmId={panelm.id}
												rightPanelmId={arr[index + 1].id}
												index={index} />
											:
											(null)
										}
									</>
								</React.Fragment>
							))}
						</Grid> : <div></div>
					}
				</div>
			</ThemeProvider>

		);
	}
}

const mStateToms = (state: IAppStore) => {
	return ({
		userInfo: state.userInfo,
		mView: state.m.mView,
		loggedIn: state.application.loggedIn,
		mobile: state.application.mobile,
		height: state.application.height,
		configObjectmGroups: state.configObject.configmGroups,
		panelmsObj: state.panelms
	})
};

export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), {
	 ...mDispatcher, setBrowserInfo, ...popupDispatcher, ...customPopupDispatcher
})(App);
