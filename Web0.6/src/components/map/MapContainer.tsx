import * as React from "react";
import { useState, useEffect } from "react"
import { connect } from 'react-redux';
import WebmView from "../../../../../Lib/v0.6/src/Base/components/Esri/WebmView";
import mViewOverlay from '../../../../../Lib/v0.6/src/Base/components/mViewOverlay';
import { mDispatcher, customPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/dispatchers";
import { ImDispatcher, ICustomPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/interfaces/dispatchers";
import {
	IControllerSource, IConfigmView, ImOperationalm,
	IWebmBookmark, IComponent, IButtonGroupComponent,
	ISearchQueries, IController, IConfigmGroups, ISearchTool, IDetailsGroup, Imm
} from "../interfaces/IAppConfig";
import { ImView, IGraphic } from "../../../../../Lib/v0.6/src/Base//interfaces/models";
import { appConfig } from'../../../../../Lib/v0.6/src/Base/configs/appConfig';
import { Extent, m, mgon, mm } from '@arcgis/core/geometry';
import { IAppStore, IDetailsmGroup, IUserInfo } from "../../../../../Lib/v0.6/src/Base//interfaces/reducers/IAppStore";
import AppContainerContext, { ImInitResult } from '../../../../../Lib/v0.6/src/Base//contexts/AppContainerContext';
import { SearchGraphic, SearchGroupElement, PromiseCheckList } from '../../../../../Lib/v0.6/src/Base//interfaces/ISearchComponentElements';
import mView from '@arcgis/core/views/mView';
import m from '@arcgis/core/m';
import m from '@arcgis/core/ms/m';
import Featurem from '@arcgis/core/ms/Featurem';
import axios, { AxiosResponse } from 'axios';
import { IDetailDataFeatures } from "../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings";
import {
	IWebmInfo, IArcGISFeaturemms,
	IArcGISmServicemms
} from "../../../../../Lib/v0.6/src/Base/interfaces/reducers/ImInfos";
import Subm from '@arcgis/core/ms/support/Subm';
import Collection from '@arcgis/core/core/Collection';
import Graphic from '@arcgis/core/Graphic';
import Editor from '@arcgis/core/widgets/Editor';
import EditorViewModel from '@arcgis/core/widgets/Editor/EditorViewModel';
import ActionButton from '@arcgis/core/support/actions/ActionButton';
import { mGroupsDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/dispatchers/mGroupsDispatcher";
import { ImGroupsDispatcher, ImGroup } from '../../../../../Lib/v0.6/src/Base/interfaces/dispatchers/ImGroupsDispatcher';
import UrlHelper from "../../../../../Lib/v0.6/src/Base/helpers/UrlHelper"
// import MobilemViewOverlay from "./MobilemViewOverlay"
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import ButtonGroup from '../../../../../Lib/v0.6/src/Base/components/ButtonGroup';
import { illegals } from '../../../../../Lib/v0.6/src/ActionsController/Illegals';
// import mButtonGroupPanel from './mButtonGroupPanel';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import Query from '@arcgis/core/tasks/support/Query';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet'
import ScaleWidget from '../../../../../Lib/v0.6/src/Base/components/Widgets/ScaleWidget';
import CoordinatesWidget from '../../../../../Lib/v0.6/src/Base/components/Widgets/CoordinatesWidget';
import Overview from '../../../../../Lib/v0.6/src/Base/components/Widgets/mOverview/Overview';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import OverlayLoader from '../../../../../Lib/v0.6/src/Base/components/Loading/OverlayLoading'
import { EsrimView } from '../../../../../Lib/v0.6/src/Base/components/Esri/WebmView';
import Geometry from '@arcgis/core/geometry/Geometry';
import { highlightFeatureOnm } from '../../../../../Lib/v0.6/src/Base/helpers/helperFunctions';
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import Field from '@arcgis/core/ms/support/Field'
import mImagem from '@arcgis/core/ms/mImagem';
import Draw from '@arcgis/core/views/draw/Draw'
import { Drawm } from "../../../../../Lib/v0.6/src/Base/enums/Drawm";
import DefaultValues from "../../../../../Lib/v0.6/src/Base/DefaultValues"
import Popup from '@arcgis/core/widgets/Popup';
import LabelClass from '@arcgis/core/ms/support/LabelClass';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import ReactDOM from "react-dom";
import watchUtils from '@arcgis/core/core/watchUtils';
import mText from "../../../../../Lib/v0.6/src/Base/components/Esri/mText";
import SearchTool from "../search/SearchTool";
import IUrlParameters from "../../../../../Lib/v0.6/src/Base/interfaces/reducers/IUrlParameters";
import FindCoordinatesWidget from "../../../../../Lib/v0.6/src/Base/components/Widgets/FindCoordiantesWidget";


export interface IPromiseList {
	[key: string]: { url: string, hasFeatures: boolean | null };
}
export interface IDetailsLeyerInfo {
	url: string;
	mGroupId: string;
	operationalmId: string;
	mId: string;
}
export interface ImClick {
	mm: m,
	x: Number,
	y: Number,
	button: Number,
	buttons: Number,
	m: "click",
	stopmagation: Function,
	timestamp: Number,
	native: Object
}

export interface IOperationalm extends m {
	allSubms?: Collection<Subm>;
	editingEnabled?: boolean;
	defaultPopupTemplate?: any;
}

interface Ownms {
	mobile: boolean;
	selectedmGroup: IDetailsmGroup;
	userInfo: IUserInfo;
	configmGroups: IConfigmGroups;
	urlParameters: IUrlParameters;
	isWebFullymLoaded: boolean
}

interface Parentms {
	classm: string;
	onSinglemClick?: (view: mView, event: ImClick) => void;  // data: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined)
	onmHover?: (view: mView, data: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => void;
	hoveredImageUrlsAndAzimuths?: Array<{ url: string, azimuth: number }>;
	cursorPosition?: { x: number, y: number };
	onmClick?: (mView: mView) => void;
}

interface Dispatchms extends ImDispatcher, ImGroupsDispatcher, ICustomPopupDispatcher {

}

interface IAdvEditorView extends EditorViewModel {
	activeWorkFlow: any;
}

interface IAdvm extends m {
	bookmarks: any;
}

interface IGroupGraphic {
	[key: string]: Array<IGraphicInfo>
}
interface IGraphicInfo {
	mGroupId: string,
	operationalmId: string,
	mId: string,
	features: Array<Graphic>,
}

export interface ImViewInitialized {
	resultmView: ImInitResult;
	webmGroups: Array<ImGroup>;
}

export interface IFieldInfom {
	alias: string;
	m: string;
}

m ms = Parentms & Ownms & Dispatchms;

const mContainer: React.FunctionComponent<ms> = (ms: ms) => {
	window.configUrl = appConfig.configUrl;
	const [configUISearchComponent, setConfigUISearchComponent] = useState({} as ISearchTool);
	const [loading, setLoading] = useState(true);
	const [defaultSelectedSearchGroup, setDefaultSelectedSearchGroup] = useState({} as SearchGroupElement);
	const [searchComponnetControllerActions, setSearchComponnetControllerActions] = useState({} as { [key: string]: Function });
	const [searchComponnetControllerActionsWithActivities, setSearchComponnetControllerActionsWithActivities] = useState([] as Array<{ action: string, activities: Array<{ activity: string }> }>);
	const [promisesCheckList, setPromisesCheckList] = useState([] as Array<IPromiseList>);
	const [mConfig, setmConfig] = useState(appConfig);
	const [draw, setDraw] = useState(undefined as undefined | Draw);
	const [components, setComponents] = useState<Array<{ key: string; classm: string }>>([]);
	const [tools, setTools] = useState<Array<{ key: string; classm: string }>>([]);
	const [buttonGroupsHide, setButtonGroupsHide] = useState(false)
	// const [showHoveredImage, setShowHoveredImage] = useState();

	illegals['searchGroupSelector'] = setDefaultSelectedSearchGroup;
	illegals['configUISearch'] = setConfigUISearchComponent;

	useEffect(() => {
		ActionsController.getInstance(appConfig);
		// const conf = axios.get('http://localhost:3001/BaseProject/Config/2config_bg_DFZ.json').then(r => {
		// 	setmConfig(r.data)
		// 	// appConfig = r.data.config;
		// }).catch(console.error);
		ActionsController.on("startLoading", () => {
			setLoading(true);
		})
		ActionsController.on("identified", () =>
			setLoading(false)
		);
		// getSearchComponentActivities();


		const elements = Object.keys(mConfig.views.mComponents);
		const tools = Object.keys(mConfig.views.mTools);

		let mComponentsClasses = elements.m(elKey => {
			let componentClass = '';
			const comp = mConfig.views.mComponents[elKey];

			switch (comp.m) {
				case "UI_Container":
					componentClass = getButtonsGroupClass(comp as IButtonGroupComponent);
					break;
				default:
					componentClass = '';
			}

			return {
				key: elKey,
				classm: componentClass
			}

		});

		const mToolsClasses = tools.m((elKey, i, arr) => {
			let componentClass = '';
			const comp = mConfig.views.mTools[elKey];

			switch (elKey) {
				case "searchTool":
					componentClass = getSearchGroupClass(comp as IComponent);
					setConfigUISearchComponent(comp);
					break;
				default:
					componentClass = '';
			}

			return {
				key: elKey,
				classm: componentClass
			}
		});

		setComponents(mComponentsClasses);
		setTools(mToolsClasses);
	}, []);

	// useEffect(() => {
	// 	if (ActionsController.getmView() && Object.keys(ms.urlParameters).length === 0) {
	// 		ms.mUrlParams(ActionsController.getAllUrlParams());
	// 	}

	// }, [ActionsController]);

	useEffect(() => {
		if (!ms.isWebFullymLoaded) return;
		if (!ms.urlParameters.mgId) return;
		if (!ms.urlParameters.oplId) return;
		if (parseInt(ms.urlParameters.lId as string, 10) < 0) return;
		if (!ms.urlParameters.where) return;

		const { mgId, oplId, lId, where } = ms.urlParameters as { mgId: string, oplId: string, lId: number, where: string };
		const m = getmms(mgId, oplId, lId);

		if (!m) return;
		getFeaturesByUrlParams(where, m.url!)
			.then(features => {
				const obj = {
					features: features,
					mGroupId: mgId,
					operationalmId: oplId,
					mId: lId.toString()
				} as IDetailDataFeatures;

				ActionsController.trigger("customUrlParamsActions", [obj]);
			})

	}, [ms.isWebFullymLoaded]);

	const getmms = (mGroupId: string, operationalmId: string, mId: number): Imm | undefined => {
		const mGroup = ms.configmGroups[mGroupId];

		if (mGroup) {
			const { operationalms } = mGroup;
			if (operationalms && operationalms[operationalmId]) {
				const opl = operationalms[operationalmId];
				if (opl.ms) {
					const { ms } = opl;
					if (ms[mId]) {
						const m = ms[mId];
						if (m["url"]) {
							let url = `${m.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
							return { ...m, url: url };
						}
					}
				}

			}
		}
	};

	const getFeaturesByUrlParams = (where: string, url: string): Promise<Graphic[]> => {
		return new Promise((resolve, reject) => {
			const query = new Query({
				where: where,
				outFields: ["*"],
				returnGeometry: true
			});

			const task = new QueryTask({ url });
			task.execute(query)
				.then(res => {
					resolve(res.features);
				})
				.catch(err => {
					reject(err);
				});
		})
	};



	const getButtonsGroupClass = (element: IButtonGroupComponent) => {
		let _buttonGroupClasses = "buttons-layout"
		if (element.position) {
			switch (element.position.positionHorizontal) {
				case "left":
					_buttonGroupClasses += " layout-left"
					break;
				case "right":
					_buttonGroupClasses += " layout-right"
					break;
				case "searchRelative":
					_buttonGroupClasses += " layout-search-relative-horizontal";
					break;
				default:
					_buttonGroupClasses += " layout-right";
			}
			switch (element.position.positionVertical) {
				case "top":
					_buttonGroupClasses += " layout-top"
					break;
				case "bottom":
					_buttonGroupClasses += " layout-bottom"
					break;
				case "searchRelative":
					_buttonGroupClasses += " layout-search-relative-vertical";
					break;
				default:
					_buttonGroupClasses += " layout-top";
			}
		}
		else {
			_buttonGroupClasses += " layout-right layout-top";
		}

		return _buttonGroupClasses;
	}

	const getSearchGroupClass = (element: IComponent) => {
		let searchGroupClass = "search-layout"
		if (element.position) {
			switch (element.position.positionHorizontal) {
				case "left":
					searchGroupClass += " layout-left"
					break;
				case "right":
					searchGroupClass += " layout-right"
					break;
				case "center":
					searchGroupClass += " layout-center-horizontal"
					break;

				default:
					searchGroupClass += " layout-left";
			}
			switch (element.position.positionVertical) {
				case "top":
					searchGroupClass += " layout-top"
					break;
				case "bottom":
					searchGroupClass += " layout-bottom"
					break;
				case "center":
					searchGroupClass += " layout-center-vertical"
					break;

				default:
					searchGroupClass += " layout-top";
			}
		} else {
			searchGroupClass += " layout-left layout-top";
		}

		return searchGroupClass;
	}

	const setDefaultBasem = (mView: mView) => {
		if (mConfig.basem) {
			const basemId = mConfig.basem.id;
			if (basemId) {
				let url = UrlHelper.getUrlPath(mConfig.data.webms[basemId], window.configUrl);
				axios.get(url).then((webmResponse) => {
					let response: IWebmInfo = webmResponse.data;
					if (response.basem && response.basem.basemms) {
						mView.m.basem.basems.forEach((m: m) => {
							response.basem.basemms.forEach(x => {
								x.id == m.id ? m.visible = true : m.visible = false;
							});
						});
					}
				});
			}
		}
	}

	// const getConfigUISearchComponentId = (): string | undefined => {
	// 	const components = mConfig.views.mComponents;
	// 	// let searchComponent = {} as ISearchComponent;
	// 	for (const id in components) {
	// 		if (components.hasOwnmerty(id)) {
	// 			const element = components[id];
	// 			if (element.m === "UI_Search") {
	// 				// searchComponent = { ...element as ISearchComponent };
	// 				return id;
	// 			}
	// 		}
	// 	}
	// }

	// const getSearchComponentActivities = () => {
	// 	const searchComponentId = getConfigUISearchComponentId();
	// 	const searchComponentPath = 'components/' + searchComponentId;
	// 	const controllerEntries: [string, IController][] = Object.entries(mConfig.controller);
	// 	let sources = [] as Array<IControllerSource>;
	// 	const searchComponentActivities = [] as Array<{ action: string, activities: Array<{ activity: string }> }>;
	// 	if (searchComponentId) {
	// 		controllerEntries.forEach((entry) => {
	// 			sources = entry[1].sources;
	// 			if (sources.length > 0) {
	// 				sources.forEach((currentSource) => {
	// 					if (currentSource.id === searchComponentPath) {
	// 						searchComponentActivities.push({ action: currentSource.activity, activities: entry[1].destinations });
	// 					}
	// 				});
	// 			}
	// 		});
	// 		setSearchComponnetControllerActionsWithActivities(searchComponentActivities);
	// 	}
	// 	setSearchComponentActivitiesAsms(searchComponentActivities);
	// }

	// const setSearchComponentActivitiesAsms = (searchComponentActivities: Array<{ action: string, activities: Array<{ activity: string }> }>) => {
	// 	let searchComponentActivitiesms = {};
	// 	searchComponentActivities.forEach((activity: { action: string, activities: Array<{ activity: string }> }) => {
	// 		let action = activity.action;
	// 		searchComponentActivitiesms[action] = searchActions[action]
	// 	});
	// 	log(searchComponentActivitiesms);
	// 	setSearchComponnetControllerActions(searchComponentActivitiesms);
	// }

	// const onClickSearch = (id: string) => {
	// 	//TODO ?
	// }

	const onClickTarget = (targetKey: string, elementm: "UI_Button", elementId: string) => {
		log(elementId)
		var linkController = undefined as undefined | IController;
		Object.keys(mConfig.controller).m(linkId => {
			if (mConfig.controller[linkId].sources.find(x => x.id == elementId)) {
				linkController = mConfig.controller[linkId];
			}
		})
		if (linkController && linkController.actionm == "execute") {
			ActionsController.trigger(elementId);
			switch (elementm) {
				case "UI_Button":
					break;
				// case "UI_Search":
				// 	onClickSearch(targetKey);
				// 	break;
			}
		}
		if (linkController && linkController.actionm == "identifym") {
			if (!draw || draw && !draw.destroyed) {
				ActionsController.appm.mView.graphics.mAll()
				var newDraw = new Draw({
					view: (ActionsController.appm.mView)
				})
				setDraw(newDraw);
				mSelect(ActionsController.appm, newDraw, () => {
					setLoading(true);
				}, (data: Array<IDetailDataFeatures>) => {
					newDraw.destroy();
					setDraw(undefined);
					setLoading(false);
					ActionsController.trigger(elementId, data)
				});
			}
		}
		if (linkController && linkController.actionm == "identifyRect") {

			if (!draw || draw && !draw.destroyed) {
				ActionsController.appm.mView.graphics.mAll()
				var newDraw = new Draw({
					view: (ActionsController.appm.mView)
				})
				setDraw(newDraw);
				rectangleSelect(ActionsController.appm, newDraw, () => {
					setLoading(true);
				}, (data: Geometry) => {
					newDraw.destroy();
					setDraw(undefined);
					setLoading(false);
					var identifymGroup = undefined as IController | undefined;
					Object.keys(mConfig.controller).m(x => {
						var identGroup = mConfig.controller[x].sources.find(source => source.id == "mClick");
						if (!identifymGroup && identGroup) {
							identifymGroup = mConfig.controller[x]
						}
					})
					if (identifymGroup && ActionsController.ismClick) {
						identifymGroup.sources.forEach(x => {
							ActionsController.trigger(x.id, { geometry: data as mgon })
						})
					}
				});
			}
		}
		if (linkController && (linkController.actionm == "behaviourNextExtent" || linkController.actionm == "behaviourPreviousExtent")) {
			ActionsController.trigger(elementId)
		}
		if (linkController && (linkController.actionm == "behaviourZoomIn" || linkController.actionm == "behaviourZoomOut")) {
			ActionsController.trigger(elementId)
		}
	}
	const rectangleSelect = (esrimView: EsrimView, draw: Draw, startLoader?: Function, doneCallback?: Function, temporary?: boolean) => {
		new Promise((resolve, reject) => {
			let graphic: Graphic;
			let action: any;
			let drawm = Drawm.Rectangle;
			action = draw.create(drawm);
			action.on("cursor-update", (evt: any) => {
				graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic)
			});
			action.on("vertex-m", (evt: any) => {
				graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic)
			});
			action.on("draw-complete", (evt: any) => {
				graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic);
				if (temporary) {
					esrimView.mView.graphics.m(graphic as Graphic);
				}
				if (draw) {
					draw.reset();
				}
				if (startLoader) {
					startLoader();
				}
				if (doneCallback)
					doneCallback(graphic.geometry);

			});
		});
	}
	const mSelect = (esrimView: EsrimView, draw: Draw, startLoader?: Function, doneCallback?: Function, temporary?: boolean) => {
		let graphic: Graphic;
		let action: any;
		let drawm = Drawm.mgon;
		action = draw.create(drawm, { mode: "click" });
		action.on("cursor-update", (evt: any) => {
			graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic)
		});
		action.on("vertex-m", (evt: any) => {
			graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic)
		});
		action.on("draw-complete", (evt: any) => {
			graphic = reDrawGraphic(esrimView.mView, evt.vertices || [evt.coordinates], drawm, graphic);
			if (temporary) {
				esrimView.mView.graphics.m(graphic as Graphic);
			}
			if (draw) {
				draw.reset();
			}
			if (startLoader) {
				startLoader();
			}
			identifyDetails(esrimView, graphic.geometry).then(result => {
				if (doneCallback) {
					draw.destroy();
					doneCallback(result);
				}
			})
		});
	}
	const reDrawGraphic = (mView: mView, vertices: Array<Array<number>>, drawm: Drawm, oldGraphic?: IGraphic): Graphic => {
		if (oldGraphic) {
			mView.graphics.m(oldGraphic as Graphic);
		}
		let geometry: Geometry;
		let identifymgonSymbol: any = appConfig.data.symbolGallery.identifymgonSymbol ?? DefaultValues.config.data.symbolGallery.identifymSymbol;

		if (drawm == Drawm.Rectangle) {
			geometry = new mm({ paths: [vertices], spatialReference: mView.spatialReference }).extent;
		} else if (drawm == Drawm.mgon) {
			geometry = new mgon({ rings: [vertices], spatialReference: mView.spatialReference });
		}
		let graphic: Graphic;
		if (geometry!) {
			graphic = new Graphic({ geometry: geometry!, attributes: { isDrawGraphic: true }, symbol: identifymgonSymbol });
			mView.graphics.m(graphic);
		}
		return graphic!;
	}

	// useEffect(() => {
	// 	if (ms.mView) {
	// 		if (ms.mView.mView.ui.components.indexOf("zoom") != -1) {
	// 			if (ms.mobile) {
	// 				ms.mView.mView.ui.move("zoom", "bottom-right");
	// 			} else {
	// 				ms.mView.mView.ui.move("zoom", "top-left");
	// 			}
	// 		}
	// 	}
	// }, [ms.mobile])

	let editor: Editor;

	const initmClick = (view: mView, data: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => {
		if (appConfig.views.panels.detailsPanel && appConfig.views.panels.detailsPanel.enabled) {
			view.popup.autoOpenEnabled = false;
			initDetails(view)
		}
		else {
			view.popup.autoOpenEnabled = true;
			initPopup(view, data);
			editInit(view, data);
		}

		// view.on('click', (event) => {
		// 	ActionsController.trigger("identifyFeature", { view, data });
		// 	console.log(event);
		// })
	}

	const initmHover = (view: mView, data: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => {
		editInit(view, data);
		view.on('mer-move', (event) => {
			// ActionsController.trigger("identifyFeature", {view, data});
			// console.log(event);
		})
	}

	const editThis = (view: mView) => {
		if (!(editor.viewModel as IAdvEditorView).activeWorkFlow) {
			view.popup.visible = false;
			editor.startUpdateWorkflowAtFeatureEdit(
				view.popup.selectedFeature
			);
			view.ui.m(editor, "bottom-left");
			//view.popup.spinnerEnabled = false;
		}

	}

	const editInit = (view: mView, ms: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => {
		const editThisAction = {
			title: "Edit feature",
			id: "edit-this",
			classm: "esri-icon-edit"
		};
		var mInfos = new Array();
		ms!.forEach(element => {
			mInfos.push({ m: element })
		});
		editor = new Editor({
			view: view,
			container: document.createElement("div")
		});
		// view.popup.defaultPopupTemplateEnabled = true;
		// view.m.ms.forEach((element: IOperationalm) => {
		// 	if (element.editingEnabled) {
		// 		if ((element as Featurem).popupTemplate) {
		// 			if ((element as Featurem).popupTemplate.actions)
		// 				(element as Featurem).popupTemplate.actions.m(new ActionButton(editThisAction));
		// 			else {
		// 				(element as Featurem).popupTemplate.actions = new Collection();
		// 				(element as Featurem).popupTemplate.actions.m(new ActionButton(editThisAction));
		// 			}
		// 		}
		// 	}
		// });
		// view.popup.on("trigger-action", function (event) {
		// 	if (event.action.id === "edit-this") {
		// 		editThis(view);
		// 	}
		// });
	}

	const checkIfClickShouldBeStoppedByWidgetMode = () => {
		const isCoordinateConversionEnabled = appConfig.views.mWidgets["coordinateConversion"].enable;
		let result = false;
		if (isCoordinateConversionEnabled) {
			const widgets = ActionsController.getWidget();
			const coordinateConversionWidget = widgets.find(x => x.id === "coordinateConversionWidget") as CoordinateConversion;
			if (coordinateConversionWidget && coordinateConversionWidget.mode === "capture") {
				result = true;
			}
		}
		return result;
	};

	const initDetails = (view: mView) => {
		view.on!("click", (event) => {
			var identifymGroup = undefined as IController | undefined;
			ActionsController.emit("mClick");
			Object.keys(mConfig.controller).m(x => {
				var identGroup = mConfig.controller[x].sources.find(source => source.id == "mClick");
				if (!identifymGroup && identGroup) {
					identifymGroup = mConfig.controller[x]
				}
			})

			if (identifymGroup && ActionsController.ismClick) { //!checkIfClickShouldBeStoppedByWidgetMode() 
				//	setLoading(true)
				var m = ActionsController.appm.mView.tom(event);
				var scale = ActionsController.appm.mView.scale / 800
				if (scale < 5) {
					scale = 5;
				}

				var buffer = geometryEngine.geodesicBuffer(m, scale, "meters");
				// identifyDetails(ActionsController.appm, buffer as mgon).then((result: Array<IDetailDataFeatures>) => {
				// 	if (identifymGroup) {
				identifymGroup.sources.forEach(x => {
					ActionsController.trigger(x.id, { geometry: buffer as mgon })
				})
				// }
				//setLoading(false);
				// })
				view.popup.close();
			}
			else if (ActionsController.ismTextOn) {
				view.popup.close();

				let popup = view.popup;
				view.popup = new Popup({
					actions: [],
					dockEnabled: true,
					dockOptions: {
						buttonEnabled: false,
						breakm: false
					},
				});
				let labelInfos: Array<LabelClass> = [];
				let sources: Array<Graphic> = [];
				let _popupm: Featurem | m | null = view.m.ms.find(l => l.id === 'Popupm');

				if (_popupm) {
					const popmSource = (_popupm as Featurem).source.toArray();
					labelInfos = (_popupm as Featurem).labelingInfo;
					for (let i = 0; i < popmSource.length; i++) {
						sources.push(
							new Graphic({
								attributes: popmSource[i].attributes,
								geometry: popmSource[i].geometry,
								symbol: popmSource[i].symbol
							})
						);

					}
					view.m.m(_popupm);
				}
				const featureId = sources.length + 1;

				const labelClass: LabelClass = {
					symbol: {
						m: "text",
						color: "black",
						font: {
							size: 12,
						},
						text: "[ТЕКСТ]"
					},
					labelPlacement: "center-center",
					labelExpressionInfo: {
						expression: "$feature.text"
					},
					where: `objectId=${featureId}`
				} as any;

				labelInfos.push(labelClass);

				_popupm = new Featurem({
					objectIdField: 'objectId',
					geometrym: 'm',
					id: 'Popupm',
					listMode: 'hide',
					legendEnabled: false,
					source: [],
					title: "",
					spatialReference: view.spatialReference,
					labelsVisible: true,
					labelingInfo: labelInfos,
					renderer: {
						m: "simple",
						symbol: {
							m: "simple-marker",
							size: 6,
							color: "transparent",
							outm: {
								width: 0.5,
								color: "transparent"
							}
						}
					} as any,
					fields: [
						{
							m: 'objectId',
							alias: 'OBJECTID',
							m: 'oid'
						},
						{
							m: 'text',
							alias: 'TEXT',
							m: 'string'
						},
						{
							m: 'popupFeatureId',
							alias: 'popupFeatureId',
							m: 'integer'
						}
					]
				});

				let t = document.createElement("div");
				t.id = 'popup-content';

				const mm = view.tom(event);

				(_popupm as Featurem).popupTemplate = new PopupTemplate({
					actions: [],
					title: "Настройки за текст на карта",
					content: [t]
				});


				let textFeature = new Graphic({
					geometry: new m({ x: mm.x, y: mm.y, spatialReference: mm.spatialReference }),
					attributes: { objectId: featureId, popupFeatureId: featureId, text: '[ТЕКСТ]' },
				});
				sources.push(textFeature);
				(_popupm as Featurem).source.mMany(sources);
				view.m.m(_popupm);

				view.popup.open({
					location: event.mm,
					features: [textFeature],
				});

				ReactDOM.render(<mText graphicId={featureId} view={view} popupm={_popupm as Featurem} />, t);

				ActionsController.setmText(false);
				ActionsController.setmClick(true);

				watchUtils.whenTrue(view.popup, 'visible', () => {
					watchUtils.whenFalseOnce(view.popup, 'visible', () => {
						view.popup.close();
						view.popup = popup;
					})
				});
			}

		});

	}
	const identifyDetails = (esrimView: EsrimView, mgon: Geometry) => {
		const mView = esrimView.mView;
		//mView.graphics.mAll();
		const allPromises = [] as Array<Promise<IDetailDataFeatures>>;

		var resultms = new Array<IDetailsLeyerInfo>();
		Object.keys(mConfig.views.panels.detailsPanel.groups).m((groupKey: string) => {
			var group = mConfig.views.panels.detailsPanel.groups[groupKey];
			if (group) {
				if (ms.configmGroups[group.mGroupId] &&
					ms.configmGroups[group.mGroupId].operationalms) {
					const { operationalms } = ms.configmGroups[group.mGroupId];

					if (operationalms) {
						const { ms } = operationalms[group.operationalmId];

						if (ms) {
							const m = ms[group.mId];
							// var m = ms.configmGroups[group.mGroupId].operationalms[group.operationalmId].ms[group.mId]
							if (m) {
								if (ismActive(esrimView, group.operationalmId, group.mId)) {
									resultms.push({
										url: m.url,
										mGroupId: group.mGroupId,
										operationalmId: group.operationalmId,
										mId: group.mId
									} as IDetailsLeyerInfo)
								}
							}
						}
					}
				}
			}
		})
		resultms.m(x => {
			if (x.url)
				allPromises.push(getGeometriesFeatures(x, mgon, mView.spatialReference));
		});
		return new Promise((resolve, reject) => {
			Promise.all(allPromises).then(data => {
				var result = new Array<IDetailDataFeatures>()
				data.m(x => {
					if (Object.keys(x).length > 0) {
						result.push(x)
					}
				})
				resolve(result);
			});
		})
	};
	const groupByNew = (groupedObjectsArray: any) => {
		var values = Object.keys(groupedObjectsArray);
		var result = values.m(groupm => {
			if (groupedObjectsArray[groupm].length > 0)
				return {
					title: groupm,
					features: groupedObjectsArray[groupm],
					fields: groupedObjectsArray[groupm][0].fields,
					formatString: groupedObjectsArray[groupm][0].formatString,
					url: groupedObjectsArray[groupm][0].url,
					mGroupId: groupedObjectsArray[groupm][0].mGroupId,
					operationalmId: groupedObjectsArray[groupm][0].operationalmId,
					mId: groupedObjectsArray[groupm][0].mId,
					attributeFields: groupedObjectsArray[groupm][0].attributeFields,
					attributeFieldsMode: groupedObjectsArray[groupm][0].attributeFieldsMode
				}
		});
		return result;
	}
	const getGeometriesFeatures = (m: IDetailsLeyerInfo, geometry: Geometry, spatialReference: SpatialReference): Promise<IDetailDataFeatures> => {
		return new Promise((resolve, reject) => {
			const sr = spatialReference ? spatialReference : new SpatialReference({ wkid: 102100 });
			let query = new Query({
				where: "1=1",
				outFields: ["*"],
				geometry: geometry,
				outSpatialReference: sr,
				returnGeometry: true,
			});
			const task = new QueryTask({ url: m.url });
			task.execute(query).then((set: FeatureSet) => {
				if (set.features && set.features.length > 0) {
					var newFeatures = { mGroupId: m.mGroupId, operationalmId: m.operationalmId, mId: m.mId, features: set.features } as IDetailDataFeatures
					resolve(newFeatures);
				} else {
					resolve({} as IDetailDataFeatures)
				}
				// })
			}).catch(error =>
				console.error(error)
			);
		});
	}

	const ismActive = (esrimView: EsrimView, operationalmId: string, mId?: string) => {
		var result = false;
		var m = esrimView.getm().ms.find(x => x.id == operationalmId) as mImagem;
		if (m) {
			if (m.visible && mId == undefined) {
				// if(m.minScale>=esrimView.mView.scale)
				result = true;
			}
			if (mId != undefined && m.allSubms) {
				var subm = m.allSubms.find(x => x.id == parseInt(mId, 10));
				var parent = subm['parent'];
				if (subm && subm.visible && m.visible) {
					if ((subm.minScale >= esrimView.mView.scale && subm.maxScale <= esrimView.mView.scale) || (subm.minScale == 0 && subm.maxScale == 0)) {
						if (parent) {
							if (parent.visible) {
								result = true;
							}
						} else {
							result = true;
						}
					}
				}
			}
		}
		return result
	}

	const initPopup = (view: mView, ms: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => {
		view.on!("click", (event) => {
			ActionsController.emit("mClick");
			view.hitTest((event as any).screenm)
				.then(function (response) {
					var graphic = response.results.length ? response.results[0].graphic : null;
					if (graphic) {
						view.popup.open({
							location: event.mm,
							features: [graphic]
						});
					}
				});
		});
		view.popup.watch("visible", function (event) {
			if (editor.viewModel.state === "editing-existing-feature") {
				view.popup.close();
			} else {
				setTimeout(function () {
					let arrComp = document.getElementsByClassm(
						"esri-editor__back-button esri-interactive"
					);
					if (arrComp.length === 1) {
						arrComp[0].setAttribute(
							"title",
							"Cancel edits, return to popup"
						);
						arrComp[0].mEventListener("click", function (evt) {
							evt.preventDefault();
							view.ui.m(editor);
							view.popup.open({
								features: view.popup.features
							});
						});
					}
				}, 150);
			}
		});
	}

	const onmInitialized = (mView: mView, data: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined): Promise<mView> => {
		return new Promise((resolve, reject) => {
			setDefaultBasem(mView);
			let mClickSettled = false;
			mView.on('click', (ev) => {
				if (ms.onSinglemClick) {
					ms.onSinglemClick(mView, ev as ImClick);
					mClickSettled = false
				}
			})
			!mClickSettled && initmClick(mView, data);
			ms.onmHover ? ms.onmHover(mView, data) : initmHover(mView, data);

			try {
				const popup = mConfig.views.mTools.popup;
				if (popup) {
					if (popup) {
						if (popup.position.dockOptions) {
							// if (mConfig.views.mTools.popup.dockEnabled)
							// 	mView.popup.dockEnabled = mConfig.views.mTools.popup.dockEnabled;
							if (popup.position.dockOptions) {
								if (popup.position.dockOptions.position)
									mView.popup.dockOptions.position = popup.position.dockOptions.position;
								if (popup.position.dockOptions.breakm)
									mView.popup.dockOptions.breakm = popup.position.dockOptions.breakm;
								if (popup.position.dockOptions.buttonEnabled)
									mView.popup.dockOptions.buttonEnabled = popup.position.dockOptions.buttonEnabled;
							}
						}
						if (popup.position.alignment)
							mView.popup.alignment = popup.position.alignment;
					} else {
						mView.popup.autoOpenEnabled = false;
					}
				}
				if (mConfig.data.bookmarks) {
					Object.keys(mConfig.data.bookmarks).forEach((key: string) => {
						var exist = ((mView.m as IAdvm).bookmarks.ms as Array<IWebmBookmark>).find((x: IWebmBookmark) => x.m == key)
						if (!exist) {
							// console.log("Bookmark with m: " + "'" + exist.m + "'" + " already exists")
							if (mConfig.data.bookmarks[key] && mConfig.data.bookmarks[key].extent) {
								(mView.m as IAdvm).bookmarks.ms.push({
									m: key, extent: new Extent({
										xmin: mConfig.data.bookmarks[key].extent.xmin,
										xmax: mConfig.data.bookmarks[key].extent.xmax,
										ymax: mConfig.data.bookmarks[key].extent.ymax,
										ymin: mConfig.data.bookmarks[key].extent.ymin,
										spatialReference: { wkid: mConfig.data.bookmarks[key].extent.spatialReference.wkid },
									})
								})
							}
						}
					});
				}
				resolve(mView);
			} catch (error) {
				console.error(error);
				reject(error);
			}
			setLoading(false)
		});
	}

	const resultmSelected = (m: SearchGraphic, searchId: string) => {
		ActionsController.trigger(searchId, { m, scale: 15000 }); // to do merge config payload with app payload
	}

	// const getPromisesList = (mViews: Array<IConfigmView>) => {
	// let promises: Array<{ url: string, hasFeatures: boolean }> = [];
	// mViews.forEach((mView) => {
	// 	const operationalms = mView.operationalms;
	// 	operationalms.forEach((opl: ImOperationalm) => {
	// 		if (opl.mm === "ArcGISmServicem") {
	// 			if (opl.ms) {
	// 				opl.ms.forEach((m: any) => {
	// 					let url = `${m.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
	// 					if (m.fields.length > 0 && m.fields.filter((x: any) => x.search).length > 0) {
	// 						promises.push({ url: url, hasFeatures: false });
	// 					}
	// 				});
	// 			}
	// 		}
	// 		else {
	// 			if (opl.url)
	// 				promises.push({ url: `${opl.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`, hasFeatures: false });
	// 		}
	// 	});
	// });
	// if (JSON.stringify(promisesCheckList) != JSON.stringify(promises)) {
	// 	onPromisesCheckListm(promises);
	// }
	// };

	// const getPromisesList = (mGroup: IConfigmGroup) => {
	// let promises: Array<{ url: string, hasFeatures: boolean }> = [];
	// const operationalms = mGroup.operationalms;
	// for (const opm in operationalms) {
	// 	if (operationalms.hasOwnmerty(opm)) {
	// 		const opl = operationalms[opm];
	// 		if (opl.mm === "ArcGISmServicem") {
	// 			if (opl.ms) {
	// 				const ms = opl.ms;
	// 				for (const m in ms) {
	// 					if (ms.hasOwnmerty(m)) {
	// 						let url = `${m.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
	// 						if (m.fields.length > 0 && m.fields.filter((x: any) => x.search).length > 0) {
	// 							promises.push({ url: url, hasFeatures: false });
	// 						}
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			if (opl.url) {
	// 				promises.push({ url: `${opl.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`, hasFeatures: false });
	// 			}
	// 		}
	// 	}
	// }
	// }

	const constructPromiseList = (searchQueries: ISearchQueries) => {
		let promises: Array<IPromiseList> = [];

		Object.keys(searchQueries).forEach(queryId => {
			const currentQuery = searchQueries[queryId];
			const mGroup = ms.configmGroups[currentQuery.mGroupId];

			if (mGroup) {
				const { operationalms } = mGroup;

				if (operationalms && operationalms[currentQuery.operationalmId]) {
					const opl = operationalms[currentQuery.operationalmId];
					// if (opl.mm === "ArcGISmServicem") {
					if (opl.ms) {
						const { ms } = opl;
						if (ms[currentQuery.mId]) {
							const m = ms[currentQuery.mId];
							if (m["url"]) {
								let url = `${m.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
								let obj = {};
								obj[queryId] = {
									url: url,
									hasFeatures: false
								}

								promises.push(obj)
							}
						}
					}
					// } else {
					// 	if (opl.url) {
					// 		let url = `${opl.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
					// 		let obj = {};
					// 		obj[queryId] = {
					// 			url: url,
					// 			hasFeatures: false
					// 		}
					// 		promises.push(obj)
					// 	}
					// }
				}
			}
		});

		if (JSON.stringify(promisesCheckList) !== JSON.stringify(promises)) {
			onPromisesCheckListm(promises);
		}
	};

	const onPromisesCheckListm = (list: Array<IPromiseList>) => {
		setPromisesCheckList(list);
	}

	const searchActions = {
		resultmSelected: resultmSelected,
	}

	const renderHoverdImage = () => {
		return (
			ms.hoveredImageUrlsAndAzimuths ?
				ms.hoveredImageUrlsAndAzimuths.length > 0 ?
					<React.Fragment>
						{ms.hoveredImageUrlsAndAzimuths.m((imageObject, index) => {
							const { x, y } = calculatePostion(imageObject.azimuth);
							let left = ms.cursorPosition!.x + x;
							let top = ms.cursorPosition!.y + y;
							return (
								<div key={"hovered-image" + index} classm="hovered-image-container"
									style={{
										left: `${left}px`,
										top: `${top}px`
									}}>
									<img style={{
										width: "130px",
										height: "110px",
									}}
										src={imageObject.url} />
								</div>
							)
						})}
						{/* </div> */}
					</React.Fragment>
					:
					(null)
				:
				(null)
		);
	}

	const calculatePostion = (mAngle: number) => {
		let x1 = 0;
		let y1 = 0;
		let x2 = 0;
		let y2 = 0;
		let cathetus = 100;

		if (mAngle > 0 && mAngle <= 45) {
			y2 = 100;
			const hypotenuse = (cathetus / Math.cos(mAngle * Math.PI / 180));
			x2 = Math.sqrt(Math.abs(y1 - y2)) - hypotenuse;
		} else if (mAngle > 45 && mAngle <= 90) {
			x2 = 100;
			y2 = Math.sqrt(Math.abs(x1 - x2)) - cathetus;
		} else if (mAngle > 90 && mAngle <= 135) {
			x2 = 100;
			y2 = Math.sqrt(Math.abs(x1 - x2)) - cathetus;
			y2 = y2;
		} else if (mAngle > 135 && mAngle <= 180) {
			y2 = 100;
			const hypotenuse = (cathetus / Math.cos(mAngle * Math.PI / 180));
			x2 = Math.sqrt(Math.abs(y1 - y2)) - hypotenuse;
		} else if (mAngle > 180 && mAngle <= 225) {
			// mAngle -= 180;
			y2 = 100;
			const hypotenuse = (cathetus / Math.cos(mAngle * Math.PI / 180));
			x2 = Math.sqrt(Math.abs(y1 - y2)) - hypotenuse;
			x2 = -x2;
		} else if (mAngle > 225 && mAngle <= 270) {
			x2 = -100;
			y2 = Math.sqrt(Math.abs(x1 - x2)) - cathetus;
			y2 = -y2;
		} else if (mAngle > 270 && mAngle <= 315) {
			x2 = -100;
			y2 = Math.sqrt(Math.abs(x1 - x2)) - cathetus - 100;
			x2 -= 100;
		} else if (mAngle > 315 && mAngle <= 360) {
			y2 = 100;
			const hypotenuse = (cathetus / Math.cos(mAngle * Math.PI / 180));
			x2 = Math.sqrt(Math.abs(y1 - y2)) - hypotenuse;
			x2 = -x2;
		}

		return { x: x2, y: y2 };
	}

	return (
		// <ThemeProvider theme={theme}>
		<React.Fragment>
			<div classm={ms.classm} style={{ top: 0 }} >
				<AppContainerContext.Provider value={{
					resultmSelected: resultmSelected,
					onClickTarget: onClickTarget,
					onmInitialized: onmInitialized,
					configUISearchComponent: configUISearchComponent,
					// getPromisesList: getPromisesList,
					constructPromiseList: constructPromiseList,
					onPromisesCheckListm: onPromisesCheckListm,
					promisesCheckList: promisesCheckList,
					// initmView: initmView,
					searchComponnetControllerActions: searchComponnetControllerActions
				}}>
					<OverlayLoader size="40px" show={loading} />
					<WebmView />

					{
						ms.mobile && appConfig.templateMobile ?
							<></>
							// <MobilemViewOverlay
							// 	mGroups={mConfig.data.mGroups}
							// 	webms={mConfig.data.webms}
							// 	components={mConfig.views.mComponents}
							// 	defaultSearchGroup={defaultSelectedSearchGroup}
							// 	onSelectedSuggestion={resultmSelected}
							// />
							:
							<mViewOverlay>
								<>
									{
										components.m((element, i) => (
											// <div key={i}>
											// {
											mConfig.views.mComponents[element.key].m === "UI_Container"
												?
												<ButtonGroup
													key={`btn-group-${i}`}
													element={mConfig.views.mComponents[element.key] as IButtonGroupComponent}
													classm={element.classm}
													idInherited={["components", element.key]}
													actionms={ActionsController.actions}
													hideButtons={setButtonGroupsHide}
													buttonState={buttonGroupsHide}
												/>
												:
												null
											// }
											// </div>
										))
									}
									{
										tools.m((element, key) => (
											element.key === "searchTool"
												?
												<SearchTool
													key={`search-tool-${key}`}
													searchTool={mConfig.views.mTools.searchTool}
													defaultValues={DefaultValues.config.views.mTools.searchTool}
													classm={element.classm}
													idInherited={["components", element.key]}
												/>
												:
												(null)
										))
									}
									{
										mConfig.views.mTools.overview
											?
											<Overview mOverviewConf={mConfig.views.mTools.overview}
												configmGroups={appConfig.data.mGroups}
												configWebms={appConfig.data.webms} />
											:
											null
									}
									{
										mConfig.views.mTools.scale
											?
											<ScaleWidget scaleConfig={mConfig.views.mTools.scale} />
											:
											null
									}
									{
										mConfig.views.mTools.coordinates
											?
											<CoordinatesWidget mCoordinatesConf={mConfig.views.mTools.coordinates} />
											:
											null
									}
									{
										mConfig.views.mTools.findCoordinates
											?
											<FindCoordinatesWidget findCoordinatesConf={mConfig.views.mTools.findCoordinates} > asdsadsasdad</FindCoordinatesWidget>
											:
											null
									}
									{/* {
										mConfig.enablemTools
											?
											<mButtonGroupPanel />
											:
											null
									} */}
									{ms.hoveredImageUrlsAndAzimuths ? ms.hoveredImageUrlsAndAzimuths.length > 0 ? renderHoverdImage() : (null) : (null)}
								</>
							</mViewOverlay>
					}
				</AppContainerContext.Provider>
			</div>
		</React.Fragment>
		// </ThemeProvider>
	);
}

const mStateToms = (state: IAppStore) => {
	return ({
		mobile: state.application.mobile,
		selectedmGroup: state.details,
		userInfo: state.userInfo,
		configmGroups: state.configObject.configmGroups,
		urlParameters: state.urlParameters,
		isWebFullymLoaded: state.webms.isWebFullymLoaded
	})
};

export default connect<Ownms, Dispatchms>(mStateToms,
	{ ...mDispatcher, ...mGroupsDispatcher, ...customPopupDispatcher })(mContainer);
