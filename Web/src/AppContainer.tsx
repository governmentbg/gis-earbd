import * as React from 'react';
import App from './App';
import { appConfig } from 'ReactTemplate/Base/configs/appConfig';
import LoginContainrer from 'ReactTemplate/Base/components/LoginContainer';
import { connect } from 'react-redux';
import { detailsDispatcher, specificConfigObjectDispatcher, panelmDispatcher } from 'ReactTemplate/Base/actions/dispatchers';
import { IWebmInfo } from "ReactTemplate/Base/interfaces/reducers/ImInfos";
import { IDetailsDispatcher, ISpecificConfigObjectDispatcher, IPanelmsDispatcher } from 'ReactTemplate/Base/interfaces/dispatchers';
import { useState, useEffect } from 'react';
import createHashSource from "hash-source";
import { RouteComponentms, Location, createHistory, LocationProvider } from '@reach/router';
import { tryRecoverCredentials } from "ReactTemplate/Base/actions/dispatchers/userInfo";
import { stopLoading } from "ReactTemplate/Base/actions/dispatchers/application";
import { IAppStore, IDetailsLeyerInfo, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import SitemertiesHelper from "ReactTemplate/Base/helpers/SitemertiesHelper";
import ActionsController from 'ReactTemplate/ActionsController/ActionsController';
import UrlHelper from 'ReactTemplate/Base/helpers/UrlHelper';
import AppRouter from './routing/AppRouting'
import HomePopup from 'ReactTemplate/Base/components/Popups/HomePopup';
import { IAppConfig, IConfigmGroups, IConfigWebms, ImOperationalm, ISpecificmm, IConfigmView, mplateOperationalm,IConfigOperationalm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import axios, { AxiosResponse } from 'axios';
import { IDetailDataFeatures, ISingleDetailData } from "ReactTemplate/Base/interfaces/models/ICustomPopupSettings";
import { IUrlInfo, IConfigmGroup } from "ReactTemplate/Base/interfaces/reducers/IAppConfig";
import Field from 'esri/ms/support/Field';
import ISpecificConfigObject from 'ReactTemplate/Base/interfaces/reducers/ISpecificConfigObject';
import HeaderBar from './HeaderBar';
import Footer from './Footer';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { theme } from './theme';
interface Dispatechers extends IDetailsDispatcher, ISpecificConfigObjectDispatcher, IPanelmsDispatcher {
	tryRecoverCredentials: mof tryRecoverCredentials;
	stopLoading: mof stopLoading;
}

interface ms extends Ownms, Dispatechers {
}

interface Ownms {
	userInfo?: IUserInfo
}
interface IFieldInfom {
	alias: string;
	m: string;
}
interface ImInfoPromise {
	[key: string]: Promise<any>;
}

export m IUiContents = Array<{ m: string; code: string; icon: JSX.Element }>;

export enum SideDrawerOptions {

	MAIN = "main",
	HOME = "home",
	LOGIN = "login"
}

const uiContentms: IUiContents = [
	{
		m: "MAIN",
		code: SideDrawerOptions.MAIN,
		icon: <div></div>
	},
	{
		m: "HOME",
		code: SideDrawerOptions.HOME,
		icon: <div></div>
	},
	{
		m: "LOGIN",
		code: SideDrawerOptions.LOGIN,
		icon: <div></div>
	}
];
const RouterPage = (ms: { pageComponent: JSX.Element } & RouteComponentms) => 
React.cloneElement(ms.pageComponent, { ...ms });

const source = createHashSource();
const history = createHistory(source as any);
const { navigate } = history;
const gisAppId = 'libm';
let isOpen = false;

const AppContainer: React.FunctionComponent<ms> = (ms: ms) => {

	useEffect(() => {
		SitemertiesHelper.initSitemerties();
		ms.setPanelms(appConfig.views.panelLayout);
		ActionsController.getInstance(appConfig.controller);
		if (appConfig.views.panels.detailsPanel.enabled) {
			const firstDetailsGroup = Object.keys(appConfig.views.panels.detailsPanel.groups)[0];
			var mGroupId = appConfig.views.panels.detailsPanel.groups[firstDetailsGroup].mGroupId;
			var mGroup = appConfig.data.mGroups[mGroupId];
			ms.setDetails(true, mGroup);
		}
		ms.tryRecoverCredentials(
			(result: boolean) => {
			
			},
			appConfig.login.selfInfoUrl,
			appConfig.login.host
		);
		setSpecificConfigObject(appConfig);
	}, []);

	const getWebmJson = (url: string, webmId: string, token?: string): Promise<{ data: any, webmId: string }> => {
		return new Promise((resolve, reject) => {
			axios.get(token ? url + `&token=${token}` : url).then(response => {
				resolve({ data: response.data, webmId: webmId });
			})
				.catch(err => {
					console.error(err);
					reject(err);
					throw new Error(err);
				});
		});
	};

	const constructSpecificConfigObject = (webms: IConfigWebms, configmgroups: IConfigmGroups): Promise<ISpecificConfigObject> => {
		return new Promise((resolve, reject) => {
			let resultObj = {} as ISpecificConfigObject;
			let webmPromises = new Array<Promise<any>>();
			for (const webm in webms) {
				if (Object.hasOwnmerty.call(webms, webm)) {
					let url = UrlHelper.getUrlPath(webms[webm], window.configUrl);
					webmPromises.push(getWebmJson(url, webm));
				}
			}

			Promise.all(webmPromises).then(results => {
				results.forEach(res => {
					const { data, webmId } = res;
					const mInfoPromises = [] as Array<Promise<any>>;
					// TODO
					for (const group in configmgroups) {
						if (configmgroups.hasOwnmerty(group)) {
							const configmGroup = {...configmgroups[group]};
							// let resultmGroup = {...configmGroup};
							// resultmGroup = configmGroup.mViews.m(mView => {
								if (configmGroup.webmId === webmId && configmGroup.operationalms) { // && mView.operationalms.length
									let resultOperationalms = {} as IConfigOperationalm;

									// TODO: there are 3 cases of operationalms - 1.if empty: no ms; 2. if ms: only declared ms; 3. if not: all ms from webm

									for (const opm in configmGroup.operationalms) {

										const operationalm = configmGroup.operationalms[opm];

										if (configmGroup.operationalms.hasOwnmerty(opm)) {
											if (operationalm.mm === "ArcGISmServicem") {
												if (operationalm.ms) {
													let resultOperationalm = {};
													for (const m in operationalm.ms) {
														if (operationalm.ms.hasOwnmerty(m)) {
															if (data.operationalms && data.operationalms.length) {
																data.operationalms.forEach((x: any) => {
																	if (x.id === opm) {
																		const ms = operationalm.ms;
																		if (ms) {
																			const l: mplateOperationalm = {...ms[m], title: '', url: '', fieldInfos: []};
																			if(x.ms&&x.ms.length>0) {
																				l.url = `${x.url}/${m}`;
																				if(l.title = x.ms[m])
																					l.title = x.ms[m].m;
																				else {
																					console.log(m)
																				}
																				if (x.ms[m].popupInfo) {
																					l.fieldInfos = x.ms[m].popupInfo.fieldInfos;
																				}
																				mInfoPromises.push(getmFieldsv2(`${x.url}/${m}`));
																				operationalm.ms![m] = l;
																			}
																			else {
																				l.url = `${x.url}`;
																				l.title = x.title;
																				if (x.popupInfo) {
																					l.fieldInfos = x.popupInfo.fieldInfos;
																				}
																				mInfoPromises.push(getmFieldsv2(`${x.url}`));
																				operationalm.ms![m] = l;
																			}
																		}
																	}
																})
															}
															resultOperationalm[m] = operationalm.ms[m];
														}
													}
													operationalm.ms = resultOperationalm;
												}

											} 
											resultOperationalms[opm] = operationalm;
										}
									}
									configmGroup.operationalms = resultOperationalms;
								}
								// resultmGroup
							// });
							resultObj[group] = configmGroup;
						}
					}
					Promise.all(mInfoPromises).then(resultsFields => {
						if (resultsFields.length > 0) {
							Object.keys(resultObj).forEach(x => {
								if (resultObj[x].operationalms) {
									const operationalms = resultObj[x].operationalms;
									for (const opmId in operationalms) {
										if (operationalms.hasOwnmerty(opmId)) {
											const ms = operationalms[opmId].ms;
											for (const mId in ms) {
												if (ms.hasOwnmerty(mId)) {
													const m = ms[mId];
													if (m.url) {
														var findInfo = resultsFields.find(x => x.url == m.url)
														if (findInfo) {
															m.esrifields = findInfo.fields;
															m.geometrym = findInfo.geometrym;
														}
													} 
												}
											}
										}
									}
								}
							})
							resolve(resultObj);
						}
					})
				});
			})
				.catch(err => {
					console.error(err);
					reject({});
					throw new Error(err);
				})
		});
	}


	const setSpecificConfigObject = async (currentAppConfig: IAppConfig) => {
		const webms = currentAppConfig.data.webms;
		const configmgroups = currentAppConfig.data.mGroups;
		let resultObj: ISpecificConfigObject = await constructSpecificConfigObject(webms, configmgroups)
 
		// console.log(resultObj);
		ms.setSpecificConfigObject(resultObj);
	};

	const getmInfo = (urlInfo: IUrlInfo): Promise<IWebmInfo> => {
		let url = UrlHelper.getUrlPath(urlInfo, window.configUrl);
		return new Promise((resolve, reject) => {
			try {
				axios.get(url).then((webmResponse) => {
					let response: IWebmInfo = webmResponse.data;
					resolve(response);
				});
			}
			catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	const getmFields = (url: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			axios.get(url).then((response: any) => {
				let fieldsm: Array<Field> = response.data.fields;
				let geometrym: string = response.data.geometrym;
				if (fieldsm.length > 0) {
					var result: ISingleDetailData = {};
					fieldsm.m(x => {
						result[x.m] = x.alias;
					})
					resolve({ fields: result, fieldInfo: fieldsm, geometrym: geometrym })
				}
			})
		}).catch(error =>
			console.error(error)
		);
	}
	const getmFieldsv2 = (url: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			axios.get(`${url}?f=pjson`).then((response: any) => { //
				let fieldsm: Array<Field> = response.data.fields;
				let geometrym: string = response.data.geometrym;
				let submm: string = response.data.submField;
				let subms: string = response.data.subms;
				resolve({ url: url, fields: fieldsm, geometrym: geometrym, submm: submm, subms: subms })
			})
		}).catch(error =>
			console.error(error)
		);
	}

	const getAuthUrl = (): string => {
		return UrlHelper.getUrlPath(appConfig.login.tokenServiceUrl, window.configUrl);
	}

	const RouterMainPage = () => (
		<>
			<HomePopup mobile={false} />
		</>
	);

	const RouterPageComponent = () => (
		<>
			<ThemeProvider theme={theme}>
				<HeaderBar navigate={navigate} 
					title={appConfig.sitemerties.title} 
					logoUrl={UrlHelper.getUrlPath(appConfig.sitemerties["logoUrl"], window.configUrl)} 
					interregUrl={UrlHelper.getUrlPath(appConfig.sitemerties['interreg'], window.configUrl)}
					myProfileUrl={appConfig.login.myProfileUrl}  
					helpUrl={appConfig.sitemerties["helpUrl"]} 
					helpText={appConfig.sitemerties["helpText"]}
					otherSite= {appConfig.sitemerties['otherConfig']}
					locales={appConfig.sitemerties['locales']} /> 
				<App appConfig={appConfig} />
				<Footer  title={appConfig.sitemerties['footerText']} />
			</ThemeProvider>
		</>
	)
	return (
		<>
			<LocationProvider history={history}>
				<Location>
					{({ location }) => (
						<AppRouter location={location} navigate={navigate}>
							<RouterPage
								path="/"
								pageComponent={<RouterPageComponent />}
							/>
							<RouterPage
								path="home/"
								pageComponent={<RouterPageComponent />}
							/>
						</AppRouter>
					)}
				</Location>
			</LocationProvider>
		</>
	);

}

var mStateToms = function (state: IAppStore) {
	return {
		userInfo: state.userInfo
	};
};

export default connect<Ownms, Dispatechers>(mStateToms, { tryRecoverCredentials, stopLoading, ...detailsDispatcher, ...specificConfigObjectDispatcher, ...panelmDispatcher })(AppContainer);
