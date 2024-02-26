// import '@blueprintjs/core/lib/css/blueprint.css';
// import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import * as React from 'react';
import { createRef } from 'react';
import { connect } from 'react-redux';
import m from '@arcgis/core/m';
import { ImDispatcher, IPopupDispatcher, ICustomPopupDispatcher, IUrlParametersDispatcher } from "../../../Lib/v0.6/src/Base/interfaces/dispatchers";
import { mDispatcher, popupDispatcher, customPopupDispatcher, urlParametersDispatcher } from "../../../Lib/v0.6/src/Base/actions/dispatchers";
import { Grid } from '@material-ui/core';
import { tryRecoverCredentials } from "../../../Lib/v0.6/src/Base/actions/dispatchers/userInfo";
import { setBrowserInfo } from "../../../Lib/v0.6/src/Base/actions/dispatchers/browserInfoDispatcher";
import { IBrowserInfoDispatcher } from "../../../Lib/v0.6/src/Base/interfaces/dispatchers/IBrowserInfoDispatcher";
import { OnClickAction } from '../../../Lib/v0.6/src/Base/enums/mEvents';
import { IUrlInfo, IAppConfig, IPanelm, IConfigmGroups } from './components/interfaces/IAppConfig';
import { IAppStore, IUserInfo } from '../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import ActionsController from '../../../Lib/v0.6/src/ActionsController/ActionsController';
import PanelColumnSplitter from '../../../Lib/v0.6/src/Base/components/PanelColumnSplitter';
import PanelRowSplitter from '../../../Lib/v0.6/src/Base/components/PanelRowSplitter';
import { Panelm } from './components/Panels/Panels';
import IUrlParameters from '../../../Lib/v0.6/src/Base/interfaces/reducers/IUrlParameters';


interface Dispatchms extends ImDispatcher, IPopupDispatcher, IBrowserInfoDispatcher,
	ICustomPopupDispatcher, IUrlParametersDispatcher {
	tryRecoverCredentials: mof tryRecoverCredentials;
}
interface IPanelms {
	[key: string]: IPanelm;
}

interface Parentms {
	uis?: Array<string>;
	appConfig: IAppConfig;
}

interface Ownms {
	height: number,
	userInfo: IUserInfo;
	configObjectmGroups: IConfigmGroups;
	panelms: IPanelms;
	urlParameters: IUrlParameters;
}

m ms = Parentms & Dispatchms & Ownms

interface State {
	credentialsRestoreAttempted: boolean;
	urlPrefix: string;
	containerRef: React.RefObject<HTMLDivElement>,
	panelms: IPanelms;
	panelClass: string;
	selectedTab: string;
}

const PANELSHOW = 'panel show'
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
			panelms: this.ms.panelms || {},
			panelClass: PANELSHOW,
			selectedTab: ""
		}
	}

	componentDidMount() {
		this.setState({ urlPrefix: this.getUrlPrefix() });
		// const newParams = ActionsController.getAllUrlParams();
		this.ms.mUrlParams(ActionsController.getAllUrlParameters());
	}

	findPanel(panelIdTom: string): IPanelm | undefined {
		let detailData = this.state.panelms;
		let panelTomKey = Object.keys(detailData).find(key => {
			var m = detailData[key];
			let result: boolean = false;
			if (key == panelIdTom) {
				result = true;
			} else if (m.m === "tabs") {
				var resKey = Object.keys(m.ms).find(mKey => m.ms[mKey].title === panelIdTom);
				if (resKey)
					result = true;
			}
			return result;
		});
		let panelTom = undefined;
		if (panelTomKey)
			panelTom = detailData[panelTomKey]
		return panelTom;
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
			case "siteRelative":
				result = location.protocol + '//' + location.host + location.pathm + urlInfo.url;
				break;
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

	// setSelectedTab = (id: string) => {
	// 	this.setState({
	// 		...this.state,
	// 		selectedTab: id
	// 	});
	// }

	// getWindowRibbonAndSearchPanelHeight = () => {
	// 	const ribbon: HTMLDivElement | null = document.querySelector(".esri-bg-ribbon");
	// 	let ribbonHeight = 0;
	// 	if (ribbon) {
	// 		ribbonHeight = ribbon.offsetHeight;
	// 	}
	// 	const windowHeight = this.ms.height ? this.ms.height : window.innerHeight;
	// 	return { windowHeight: windowHeight, ribbonHeight }
	// }

	// calculateMosaicRootHeight = () => {
	// 	const heights = this.getWindowRibbonAndSearchPanelHeight();
	// 	const { windowHeight, ribbonHeight } = heights;
	// 	const mosaicRootHeight = windowHeight - ribbonHeight;
	// 	return mosaicRootHeight;
	// }

	getm = () => {
		return ActionsController.getmView()
	}

	togglePanel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: string, groupIndex?: string) => {
		const result = { ...this.ms.panelms };
		if (groupIndex !== undefined) {
			const group = this.findm(groupIndex, result)
			if (group && group.children) {
				const m = this.findm(index, group.children);
				if (m) {
					if (m.hidden) {
						m.hidden = false;
					} else {
						m.top = "15px" //e.currentTarget.getBoundingClientRect().top;
						m.hidden = true;
					}
				}
			}

			// if (result[groupIndex].children && (result[groupIndex].children as IPanelms)[index] && (result[groupIndex].children as IPanelms)[index].hidden) {
			// 	(result[groupIndex].children as IPanelms)[index].hidden = false;
			// } else {
			// 	(result[groupIndex].children as IPanelms)[index].top = e.currentTarget.getBoundingClientRect().top;
			// 	(result[groupIndex].children as IPanelms)[index].hidden = true;
			// }
		} else {
			const m = this.findm(index, result);
			if (m) {
				if (m.hidden) {
					m.hidden = false;
				} else {
					m.top = e.currentTarget.getBoundingClientRect().top;
					m.hidden = true;
				}
			}
			// if (result[index].hidden) {
			// 	result[index].hidden = false;
			// } else {
			// 	result[index].top = e.currentTarget.getBoundingClientRect().top;
			// 	result[index].hidden = true;
			// }
		}
		this.setState({ panelms: result })
	}

	findm = (id: string, panels?: { [key: string]: IPanelm }) => {
		var ids = id.split('/');
		var panel = undefined as IPanelm | undefined;
		if (panels) {
			Object.keys(panels).forEach(x => {
				if (x == id) {
					panel = panels[x];
				} else {
					if (panels[x].children) {
						var possibleResult = this.findm(id, panels[x].children)
						if (possibleResult) {
							panel = possibleResult;
						}
					}
				}
			})
		}
		return panel;
	}

	ism(panelm: IPanelm) {
		var result = false;
		if (panelm.m == "m") {
			result = true
		}
		if (panelm.m == "group") {
			if (panelm.children && panelm.children && Object.keys(panelm.children).find(x => panelm.children && panelm.children[x].m == "m")) {
				result = true;
			}
		}
		return result;
	}

	render() {
		return (
			<div style={{ width: "100%", height: "100%", backgroundColor: "rgb(229, 229, 229, 0.5)", overflowX: 'hidden' }}>
				{this.ms.configObjectmGroups ?
					<Grid ref={this.state.containerRef} container style={{ height: "100%", width: "100%" }} >
						{Object.keys(this.ms.panelms).m((key: string, index: number, arr) => { //(panelm: IPanelm, index: number, arr) => (
							var panelm = this.ms.panelms[key];
							return <React.Fragment key={`panel-fragment-${key}-${index}`}>
								<>
									<Panelm
										key={`panelm_${this.ms.panelms[key].m}_${index}`}
										panelm={panelm}
										marginLeft={panelm.columnSplitter ? "-4px" : undefined}
										index={key}
										configmGroups={this.ms.configObjectmGroups}
										appConfig={this.ms.appConfig}
										// selectedTab={this.state.selectedTab}
										ism={this.ism}
										togglePanel={this.togglePanel}
										userInfo={this.ms.userInfo}
									/>
									{panelm.columnSplitter && !panelm.hidden && this.ms.panelms[arr[index + 1]] && !this.ms.panelms[arr[index + 1]].hidden ?
										<PanelColumnSplitter
											key={`vertical-divider-${index}`}
											leftPanelmId={key}
											rightPanelmId={arr[index + 1]}
											index={index} />
										:
										(null)
									}
								</>
							</React.Fragment>
						})}
					</Grid> : <div></div>
				}
			</div>
		);
	}
}

const mStateToms = (state: IAppStore) => {
	return ({
		userInfo: state.userInfo,
		height: state.application.height,
		configObjectmGroups: state.configObject.configmGroups,
		panelms: state.panelms,
		urlParameters: state.urlParameters,
	})
};

export default connect<Ownms, Dispatchms, {}>(mStateToms, {
	...mDispatcher, setBrowserInfo, tryRecoverCredentials, ...popupDispatcher, ...customPopupDispatcher,
	...urlParametersDispatcher
})(App);
