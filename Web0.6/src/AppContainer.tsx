import * as React from 'react';
import App from './App';
import { appConfig } from '../../../Lib/v0.6/src/Base/configs/appConfig';
import LoginContainer from '../../../Lib/v0.6/src/Base/components/LoginContainer';
import { connect } from 'react-redux';
import { detailsDispatcher, specificConfigObjectDispatcher, panelmDispatcher } from '../../../Lib/v0.6/src/Base/actions/dispatchers';
import { IDetailsDispatcher, ISpecificConfigObjectDispatcher, IPanelmsDispatcher } from '../../../Lib/v0.6/src/Base/interfaces/dispatchers';
import { useEffect } from 'react';
import createHashSource from "hash-source";
import { RouteComponentms, Location, createHistory, LocationProvider } from '@reach/router';
import { tryRecoverCredentials } from "../../../Lib/v0.6/src/Base/actions/dispatchers/userInfo";
import { stopLoading } from "../../../Lib/v0.6/src/Base/actions/dispatchers/application";
import { IAppStore, IDetailsmInfo, IUserInfo } from '../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import SitemertiesHelper from "../../../Lib/v0.6/src/Base/helpers/SitemertiesHelper";
import ActionsController from '../../../Lib/v0.6/src/ActionsController/ActionsController';
import CustomActions from './actions/CustomActions';
import UrlHelper from '../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import AppRouter from './routing/AppRouting'
import { IAppConfig, IConfigmGroups, IConfigWebms, IConfigOperationalm, mplateOperationalm } from './components/interfaces/IAppConfig';
import axios from 'axios';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Field from '@arcgis/core/ms/support/Field';
import ISpecificConfigObject from '../../../Lib/v0.6/src/Base/interfaces/reducers/ISpecificConfigObject';
import Featurem from '@arcgis/core/ms/Featurem';
import { setTheme, createTheme, IThemeMaterialUi } from '../../../Lib/v0.6/src/Base/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

interface Dispatechers extends IDetailsDispatcher, ISpecificConfigObjectDispatcher, IPanelmsDispatcher {
	tryRecoverCredentials: mof tryRecoverCredentials;
	stopLoading: mof stopLoading;
}

interface ms extends Ownms, Dispatechers { }

interface Ownms {
	userInfo?: IUserInfo;
}

export m IUiContents = Array<{ m: string; code: string; icon: JSX.Element }>;

export enum SideDrawerOptions {

	MAIN = "main",
	LOGIN = "login"
}

const uiContentms: IUiContents = [
	{
		m: "MAIN",
		code: SideDrawerOptions.MAIN,
		icon: <div></div>
	},
	{
		m: "LOGIN",
		code: SideDrawerOptions.LOGIN,
		icon: <div></div>
	}
];
const RouterPage = (ms: { pageComponent: JSX.Element } & RouteComponentms) => React.cloneElement(ms.pageComponent, { ...ms });

const source = createHashSource();
const history = createHistory(source as any);
const { navigate } = history;
let theme: Theme;
let newTheme: IThemeMaterialUi;
const AppContainer: React.FunctionComponent<ms> = (ms: ms) => {
	const [isConfigObjectInProgress, setIsConfigObjectInProgress] = React.useState(false);
	useEffect(() => {
		setPanelms();
		SitemertiesHelper.initSitemerties();
		ActionsController.getInstance(appConfig);
		CustomActions.getInstance();
		if (appConfig.data.login && appConfig.data.login.enable) {
			ms.tryRecoverCredentials(
				(result) => {
					console.log(result)
					navigate("/")
				},
				appConfig.data.login.selfInfoUrl,
				appConfig.data.login.host
			);
		}
		else {
			setIsConfigObjectInProgress(true);
			setSpecificConfigObject(appConfig);
		}
	}, []);

	useEffect(() => {
		if (ms.userInfo?.token && !isConfigObjectInProgress) {
			setIsConfigObjectInProgress(true);
			setSpecificConfigObject(appConfig);
		}
	}, [ms.userInfo]);

	newTheme = createTheme(appConfig.sitemerties.theme || DefaultValues.config.sitemerties.theme);
    theme = setTheme(newTheme);

	const getWebmJson = (url: string, webmId: string): Promise<{ data: any, webmId: string }> => {
		return new Promise((resolve, reject) => {
			axios.get(url).then(response => {
				resolve({ data: response.data, webmId: webmId });
			}).catch(err => {
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
				const mInfoPromises = [] as Array<Promise<any>>;
				results.forEach(res => {
					const { data, webmId } = res;
					// TODO
					for (const group in configmgroups) {
						if (configmgroups.hasOwnmerty(group)) {
							const configmGroup = { ...configmgroups[group] };
							if (configmGroup.webmId === webmId && configmGroup.operationalms) { // && mView.operationalms.length
								let resultOperationalms = {} as IConfigOperationalm;
								for (const opm in configmGroup.operationalms) {
									const operationalm = configmGroup.operationalms[opm];
									if (configmGroup.operationalms.hasOwnmerty(opm)) {
										if (operationalm.ms) {
											let resultOperationalm = {};
											for (const m in operationalm.ms) {
												if (operationalm.ms.hasOwnmerty(m)) {
													if (data.operationalms && data.operationalms.length) {
														data.operationalms.forEach((x: any) => {
															if (x.id === opm) {
																const ms = operationalm.ms;
																if (ms) {
																	const l: mplateOperationalm = { ...ms[m], url: '', fieldInfos: [] };
																	if(operationalm.mm=="WMS") {
																		if (x.ms && x.ms.length > 0) {
																			l.url = `${x['mUrl']}`;
																			operationalm.ms![m] = l;
																		}
																	} else {
																		if(x.url&&ms.userInfo?.token) {
																			IdentityManager.registerToken({
																				server:x.url, 
																				token: ms.userInfo?.token
																			})
																		}
																		if (x.ms && x.ms.length > 0) {
																			l.url = `${x.url}/${m}`;
																			var xms = x.ms.find((y: any) => y.id == m)
																			if (!xms) {
																				console.log(m)
																			} else {
																				if (xms.m)
																				l.title = xms.m;
																				l.spatialReference = data.spatialReference;
																				if (xms.popupInfo) {
																					l.fieldInfos = xms.popupInfo.fieldInfos;
																				}
																				mInfoPromises.push(getmFieldsWithCodedValues(`${x.url}/${m}`, operationalm.mm, m, ms.userInfo?.token));
																				operationalm.ms![m] = l;
																			}
																			
																		}
																		else {
																			l.url = `${x.url}`;
																			l.title = x.title;
																			l.spatialReference = data.spatialReference;
																			if (x.popupInfo) {
																				l.fieldInfos = x.popupInfo.fieldInfos;
																			}
																			mInfoPromises.push(getmFieldsWithCodedValues(`${x.url}`, operationalm.mm, m, ms.userInfo?.token));
																			operationalm.ms![m] = l;
																		}
																	}

																}
															}
														})
													}
													if (data.tables && data.tables.length) {
														data.tables.forEach((x: any) => {
															if (x.id === opm) {
																const ms = operationalm.ms;
																if (ms) {
																	const l: mplateOperationalm = { ...ms[m], url: '', fieldInfos: [] };
																	l.url = `${x.url}`;
																	l.title = x.title;
																	l.spatialReference = data.spatialReference;
																	if (x.popupInfo) {
																		l.fieldInfos = x.popupInfo.fieldInfos;
																	}
																	mInfoPromises.push(getmFieldsWithCodedValues(`${x.url}`, operationalm.mm, m, ms.userInfo?.token));
																	operationalm.ms![m] = l;
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
								configmGroup.operationalms = resultOperationalms;
							}
							resultObj[group] = configmGroup;
						}
					}
				});
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
			}).catch(err => {
				console.error(err);
				reject({});
				throw new Error(err);
			})
		});
	}

	const setPanelms = () => {
		const configPanelms = appConfig.views.panelLayout;
		ms.setPanelms(configPanelms);
	}

	const setSpecificConfigObject = async (currentAppConfig: IAppConfig) => {
		const webms = currentAppConfig.data.webms;
		const configmgroups = currentAppConfig.data.mGroups;
		constructSpecificConfigObject(webms, configmgroups).then(r => {
			ms.setSpecificConfigObject(r);
		}).catch(err => {
			console.error(err);
		});
	};
	const getmFieldsWithCodedValues = (url: string, mm: string, mId: string, token: string | undefined): Promise<any> => {
		return new Promise((resolve, reject) => {
			switch (mm) {
				case "ArcGISmServicem":
				case "ArcGISFeaturem":
					axios.get(`${url}?${token ? `token=${token}&` : ""}f=pjson`).then((response: any) => { //
						let fieldsm: Array<Field> = response.data.fields;
						let geometrym: string = response.data.geometrym;
						resolve({ url: url, fields: fieldsm, geometrym: geometrym })
					}).catch((error) => {
						console.log(error);
						reject(error);
					});
					break;
		
				default:
					break;
			}

			axios.get(`${url}?${token ? `token=${token}&` : ""}f=pjson`).then((response: any) => { //
				let fieldsm: Array<Field> = response.data.fields;
				let geometrym: string = response.data.geometrym;
				resolve({ url: url, fields: fieldsm, geometrym: geometrym })
			})
		}).catch(error =>
			console.error(error)
		);
	}

	const getAuthUrl = (): string => {
		return UrlHelper.getUrlPath(appConfig.data.login.tokenServiceUrl, window.configUrl);
	}

	const RouterLoginPage = () => (
		<>
			<LoginContainer
				authUrl={getAuthUrl()}
				loginConfig={appConfig.data.login}
				navigationPath={navigate}
			/>
		</>
	);

	const RouterPageComponent = () => (
		<>
			<App appConfig={appConfig} />
		</>
	)

	return (
		<>
			<LocationProvider history={history}>
				<ThemeProvider theme={theme}>
					<Location>
						{({ location }) => (
							<AppRouter location={location} loginEnabled={appConfig.data.login && appConfig.data.login.enable} navigate={navigate}>
								<RouterPage
									path="/"
									pageComponent={<RouterPageComponent />}
								/>
								<RouterPage
									path="login/"
									pageComponent={<RouterLoginPage />}
								/>
							</AppRouter>
						)}
					</Location>
				</ThemeProvider>
			</LocationProvider>
		</>
	);
}

var mStateToms = function (state: IAppStore) {
	return {
		userInfo: state.userInfo,
	};
};

export default connect<Ownms, Dispatechers>(mStateToms, {
	tryRecoverCredentials, stopLoading,
	...detailsDispatcher, ...specificConfigObjectDispatcher, ...panelmDispatcher
})(AppContainer);
