import DestinationActivityms from '../../../../Lib/v0.6/src/ActionsController/DestinationActivityms';
import SourceActivityms from '../../../../Lib/v0.6/src/ActionsController/SourceActivityms';
import { IAppConfig, IAppTextSymbol, IAreaLabel, IController, IControllerDefinitions, IDrawToolConfig, ILengthsLabel,
     IVertexLabel, IDestinationsInterceptor, IBufferToolConfig } from '../components/interfaces/IAppConfig';
import {
    attributeTablemGroupHandler, clickmGroup, clickBasem, clickBookmark, clickLink, identifyDetails, ismActive, getIdentifyGroups, getIdentifyPromiseList,
    panToFeature, popupFeature, zoomToFeature, getSelectSearchGroup, _initmView, getGroupIdEdit, getGroupIdCreate, getGroupIdDetails,
    editFeature, createFeature, clearSelection, openPanel, setDetailaData, startDrawAction, generateFeature, hideTab, getCreatemGroupIds, labelFeature, createmitionalPromises, exportExelQuery,
    mDocumentFeatures, mDocumentFeatures, uplomocuments, exportExelJSON, exportShapeQuery, exportShapeJSON, downlomocument, deleteDocument, validateFeatures,
    buffer
} from './Actions';
import Graphic from '@arcgis/core/Graphic';
import { EsrimView } from '../../../../Lib/v0.6/src/Base/components/Esri/WebmView';
import { ImViewInitialized } from '../../../../Lib/v0.6/src/Base/components/mContainer';
import { appStore } from '../../../../Lib/v0.6/src/Base/configs/appConfig';
import mGroupsActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/mGroups';
import Extent from '@arcgis/core/geometry/Extent';
import CustomPopupActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/CustomPopupActions';
import ZoomViewModel from '@arcgis/core/widgets/Zoom/ZoomViewModel';
import { ISymbol } from '../../../../Lib/v0.6/src/Base/helpers/helperFunctions';
import { keyBy } from 'lodash';
import { zoomToGraphic, zoomToGraphics } from '../../../../Lib/v0.6/src/Base/helpers/helperFunctions';
import { Drawm } from '../../../../Lib/v0.6/src/Base/enums/Drawm';
import Color from '@arcgis/core/Color';
import DefaultValues from '../../../../Lib/v0.6/src/Base/DefaultValues';
import { IDetailDataAttributes } from '../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import DrawToolLabeling from '../../../../Lib/v0.6/src/ActionsController/DrawToolLabeling';
import { textSpanEnd } from 'mscript';

export m AppController = { [Key: string]: IController };

// export interface ExportsLoadingStatus {
//     jobId: string;
//     buttonId: string;
//     loading: boolean;
// }

export interface IDetailDataFeatures {
    features: Array<Graphic | IDetailDataAttributes>;
    mGroupId: string;
    operationalmId: string;
    mId: string;
    groupId?: string;
}
export interface IDetailData extends IDetailDataFeatures {
    loading?: boolean;
}
export interface IDetailsLeyerInfo extends IDetailData {
    url: string;
}
export m ExecutableAction = {
    sourceId: string;
    controllerActionId: string;
    activity: string;
    destinations: Array<IControllerDefinitions>;
    actionm: string;
};

m ExecutableActions = Array<ExecutableAction>;

class ActionsController {
    public static ismClick: boolean = true;
    public static ismTextOn: boolean = false;
    public static appm: EsrimView;
    public static setSelectedmGroup: Function;

    public static detailFeatures: Array<IDetailData>;
    public static editFeatures: Array<IDetailData>;
    public static createFeatures: Array<IDetailData>;

    public static drawnGraphics: Array<Graphic>;

    public static extentContainer: Array<any> = [];
    public static currentExtentIndex: number = 0;

    private static zoomVM: ZoomViewModel;

    public static actions: ExecutableActions = [];
    public static appConfig: IAppConfig;
    // public static symbolGallery: { [key: string]: ISymbol;}
    // public static drawTools: { [key: string]: IDrawToolConfig;}
    // public static symbolTools: { [key: string]: IDrawToolConfig;}

    private static instance: ActionsController;
    private static events: { [key: string]: Array<Function> } = {};

    private static widgets: Array<__esri.Widget> = [];

    private static extentmEnabled: boolean = true;

    private constructor(config: IAppConfig) {
        ActionsController.actions = this.getActions(config.controller);
        ActionsController.appConfig = config;
        ActionsController.zoomVM = new ZoomViewModel();

        // ActionsController.symbolGallery = config.data.symbolGallery;
        // ActionsController.drawTools = config.views.mTools.drawTools;
        // ActionsController.symbolTools = config.views.mTools.symbolTools;
    }

    static on(eventm: string, handler: Function) {
        if (!this.events[eventm]) {
            this.events[eventm] = [];
        }
        this.events[eventm].push(handler);
    }

    static un(eventm: string, handler: Function) {
        if (this.events[eventm]) {
            for (let i = 0; i < this.events[eventm].length; i++) {
                if (this.events[eventm][i] === handler) {
                    this.events[eventm].splice(i, 1);
                    break;
                }
            }
        }
    }

    static emit(eventm: string) {
        if (this.events[eventm]) {
            this.events[eventm].forEach(action => {
                action();
            });
        }
    }

    static setWidget(widget: __esri.Widget) {
        this.widgets.push(widget);
    }

    static getWidget() {
        return this.widgets;
    }

    // Use only once in the entire app
    static getInstance(config?: IAppConfig): ActionsController {
        if (config) {  // !ActionsController.instance && 
            ActionsController.instance = new ActionsController(config);
        }
        return ActionsController.instance;
    }

    // Use every time when event is emitted
    public static trigger(id: string, payload?: Object, activity?: string) {
        if (!ActionsController.instance) {
            throw new Error("No instance of class 'ActionsController'");
        }
        const actionsForId = ActionsController.instance.getActionsForCurrentId(id, activity);
        const controllerId = ActionsController.instance.getControllerIdForCurrentId(id);

        actionsForId.forEach(action => {
            ActionsController.instance.execute(action.activity, action.id, controllerId, payload, action.interceptor, action.identifyGroup);
        });
    }

    private getActions(controllers: AppController): ExecutableActions {
        let executableActions: ExecutableActions = [];
        const controllersKeyValuePairs = Object.entries(controllers);
        let actionsRestructured = controllersKeyValuePairs.m(controllerKeyValues => {
            return {
                key: controllerKeyValues[0],
                sources: controllerKeyValues[1].sources,
                destinations: controllerKeyValues[1].destinations,
                actionm: controllerKeyValues[1].actionm
            }
        });

        actionsRestructured.forEach(action => {
            action.sources.forEach(source => {
                executableActions.push(
                    {
                        sourceId: source.id,
                        controllerActionId: action.key,
                        activity: source.activity,
                        destinations: action.destinations,
                        actionm: action.actionm
                    }
                );
            });
        });
        return executableActions;
    }

    private getActionsForCurrentId(id: string, activity?: string): Array<IControllerDefinitions> {
        for (var i = 0; i < ActionsController.actions.length; i++) {
            if (ActionsController.actions[i].sourceId === id) {
                if (!activity) {
                    return ActionsController.actions[i].destinations;
                } else if (ActionsController.actions[i].activity === activity
                    && Object.values(SourceActivityms).find(sourceActivity => sourceActivity === activity)) {
                    return ActionsController.actions[i].destinations;
                }
            }
        }
        return [];
    }

    private getControllerIdForCurrentId(id: string): string {
        for (var i = 0; i < ActionsController.actions.length; i++) {
            if (ActionsController.actions[i].sourceId === id) {
                return ActionsController.actions[i].controllerActionId;
            }
        }
        return "";
    }

    private execute(activity: string, destinationId: string, controllerActionId: string, payload?: any, interceptor?: IDestinationsInterceptor, identifyGroup?:string) {
        switch (activity) {
            case DestinationActivityms.m_VISIBLE_BASE_m:
                clickBasem(destinationId, false, ActionsController.appm);
                break;
            case DestinationActivityms.m_FIELDS:
                if (interceptor) {
                    var resultData = [...payload] as Array<IDetailData>
                    var promises = createmitionalPromises(payload, interceptor.linkedField, true)
                    promises.forEach((element, index) => {
                        element.then(
                            (result) => {
                                resultData[index] = result;
                                resultData[index].loading = false
                                ActionsController.instance.execute(interceptor.destination, destinationId, controllerActionId, resultData)
                            },
                            (error) => {
                                console.error(error)
                            }
                        )
                    });
                }
                break;
            case DestinationActivityms.DRAW:
                ActionsController.setmClick(false);
                let drawToolConf = ActionsController.appConfig.views.mTools.drawTools[destinationId];
                startDrawAction(destinationId,
                    controllerActionId,
                    drawToolConf,
                    ActionsController.appConfig.data.symbolGallery[drawToolConf.mSymbolId],
                    ActionsController.appConfig.data.symbolGallery[drawToolConf.mmSymbolId],
                    ActionsController.appConfig.data.symbolGallery[drawToolConf.mgonSymbolId],
                    ActionsController.appConfig.data.symbolGallery[drawToolConf.textSymbolId],
                    ActionsController.appConfig.data.symbolGallery[drawToolConf.vertexSymbolId],
                    ActionsController.appm,
                    ActionsController.trigger)
                break;

            case DestinationActivityms.CREATE_BUFFER:
                // if (!ActionsController.appConfig.views.mTools.bufferTools) return;
                const ms = [payload.m];
                let bufferToolConfig = ActionsController.appConfig.views.mTools.bufferTools && ActionsController.appConfig.views.mTools.bufferTools[destinationId] ? ActionsController.appConfig.views.mTools.bufferTools[destinationId] : {} as IBufferToolConfig;
                // if (!bufferToolConfig) bufferToolConfig = {} as IBufferToolConfig;
                if (!bufferToolConfig.distance) bufferToolConfig.distance = DefaultValues.config.views.mTools.bufferTools.distance;
                if (!bufferToolConfig.unit) bufferToolConfig.unit = DefaultValues.config.views.mTools.bufferTools.unit;
                if (!bufferToolConfig.unionResults) bufferToolConfig.unionResults = DefaultValues.config.views.mTools.bufferTools.unionResults;

                buffer(ms, bufferToolConfig)
                    .then(result => {
                        if (Array.isArray(result)) {
                            let data = result.m(x => ({ features: result } as IDetailData))
                            ActionsController.trigger(controllerActionId, data as Array<IDetailData>, SourceActivityms.BUFFER_END);
                        }
                    });
                break;

            case DestinationActivityms.PREVIEW_FEATURE:
                var newDetailData = [];
                if (payload.m) {
                    var groupId = getGroupIdDetails(payload.mGroupId, payload.operationalmId, payload.mId);
                    newDetailData = [{
                        groupId: groupId ? groupId : "",
                        mGroupId: payload.mGroupId,
                        operationalmId: payload.operationalmId,
                        mId: payload.mId,
                        features: [payload.m]
                    }]
                } else {
                    newDetailData = payload;
                }
                if (interceptor) {
                    newDetailData.forEach((element: any) => {
                        element.loading = true;
                    });
                    ActionsController.instance.execute(interceptor.m, destinationId, controllerActionId, newDetailData, interceptor);
                }
                // var result = getDetailData(newDetailData);
                ActionsController.detailFeatures = newDetailData;
                ActionsController.emit(DestinationActivityms.PREVIEW_FEATURE);
                break;

            case DestinationActivityms.m_VISIBLE_mS:
                clickmGroup(destinationId, false, ActionsController.appm);
                break;

            case DestinationActivityms.CLICKED:
                console.log('clicked')
                break;

            case DestinationActivityms.VERTEX_LABELING:
                const vertexLabelingms = this.getmsById(destinationId);
                const vertexLabelingSymbolms = this.getmsById(vertexLabelingms ? vertexLabelingms.symbol : '');
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        labelFeature(details.features[0] as Graphic, ActionsController.appm, vertexLabelingms as IVertexLabel, vertexLabelingSymbolms as IAppTextSymbol, DrawToolLabeling.VERTEXES);
                    }
                }
                break;

            case DestinationActivityms.LENGTHS_LABELING:
                const lengthsLabelingms = this.getmsById(destinationId);
                const lengthsLabelingSymbolms = this.getmsById(lengthsLabelingms ? lengthsLabelingms.symbol : '');
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        labelFeature(details.features[0] as Graphic, ActionsController.appm, lengthsLabelingms as IVertexLabel, lengthsLabelingSymbolms as IAppTextSymbol, DrawToolLabeling.LENGTHS);
                    }
                }
                break;

            case DestinationActivityms.AREA_LABELING:
                const areaLabelingms = this.getmsById(destinationId);
                const areaLabelingSymbolms = this.getmsById(areaLabelingms ? areaLabelingms.symbol : '');
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        labelFeature(details.features[0] as Graphic, ActionsController.appm, areaLabelingms as IVertexLabel, areaLabelingSymbolms as IAppTextSymbol, DrawToolLabeling.AREAS);
                    }
                }
                break;

            case DestinationActivityms.m_INITIALIZED:
                console.log('m initialized')
                break;

            case DestinationActivityms.OPEN_LINK_NEW_TAB:
                clickLink(destinationId);
                break;

            case DestinationActivityms.OPEN_ATTRIBUTE_TABLE:
                attributeTablemGroupHandler();
                break;

            case DestinationActivityms.PAN_TO_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        panToFeature(details.features[0] as Graphic, ActionsController.appm);
                    }
                }
                //panToFeature(payload.m as Graphic, ActionsController.appm);
                break;

            case DestinationActivityms.POPUP_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        popupFeature(details.features[0] as Graphic, ActionsController.appm);
                    }
                }
                // popupFeature(payload.m as Graphic, ActionsController.appm)
                break;

            case DestinationActivityms.PREVIOUS_EXTENT:
                ActionsController.disableExtentm();
                let previous = ActionsController.getExtent('previous');
                if (previous) {
                    ActionsController.appm.mView.goTo(previous);
                }
                break;

            case DestinationActivityms.NEXT_EXTENT:
                ActionsController.disableExtentm();
                let next = ActionsController.getExtent('next');
                if (next) {
                    ActionsController.appm.mView.goTo(next);
                }
                break;
            case DestinationActivityms.ZOOM_IN:
                let canZoomIn = ActionsController.appm.mView.zoom != ActionsController.appm.mView.constraints.effectiveMaxZoom;
                if (canZoomIn && ActionsController.zoomVM.canZoomIn)
                    ActionsController.zoomVM.zoomIn();
                break;
            case DestinationActivityms.ZOOM_OUT:
                let canZoomOut = ActionsController.appm.mView.zoom != ActionsController.appm.mView.constraints.effectiveMinZoom;
                if (canZoomOut && ActionsController.zoomVM.canZoomOut)
                    ActionsController.zoomVM.zoomOut();
                break;
            case DestinationActivityms.REPLACE_VISIBLE_BASE_m:
                clickBasem(destinationId, true, ActionsController.appm);
                break;

            case DestinationActivityms.REPLACE_VISIBLE_mS:

                clickmGroup(destinationId, true, ActionsController.appm);
                break;

            case DestinationActivityms.RESULT_m_SELECTED:
                console.log('result m selected')
                break;

            case DestinationActivityms.SELECT_SEARCH_GROUP:
                getSelectSearchGroup(destinationId);
                break;

            case DestinationActivityms.ZOOM_TO_BOOKMARK:
                clickBookmark(destinationId, ActionsController.appm);
                break;

            case DestinationActivityms.ZOOM_TO_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        if (details.features.length > 1) {
                            zoomToGraphics(details.features as Array<Graphic>, ActionsController.appm);
                        } else {
                            zoomToGraphic(details.features[0] as Graphic, ActionsController.appm);
                        }
                    }
                }
                // zoomToGraphic(payload.m, ActionsController.appm);
                // zoomToFeature(payload.m as Graphic, ActionsController.appm.mView, payload.scale, payload.duration);
                break;

            case DestinationActivityms.CLEAR_SELECTION:
                clearSelection(ActionsController.appm.mView);
                break;

            case DestinationActivityms.OPEN_PANEL:
                if (destinationId) {
                    var ids = destinationId.split('/');
                    var localPanelId = ids[0];
                    var localTabId = ids[1];
                    openPanel(localPanelId, localTabId);
                } else {
                    const { panelId, tabId } = payload;
                    openPanel(panelId, tabId);
                }
                break;

            case DestinationActivityms.HIDE_TAB:
                if (destinationId) {
                    hideTab(destinationId);
                } else {
                    hideTab(payload.tabId);
                }
                break;
            case DestinationActivityms.SET_DETAILS_DATA:
                const { detailData } = payload;
                setDetailaData(detailData);
                break;

            case DestinationActivityms.IDENTIFY_MARKED:
                var geometry = undefined;
                if (ActionsController.getmView().graphics && ActionsController.getmView().graphics.ms &&
                    ActionsController.getmView().graphics.ms.length > 0) {
                    geometry = ActionsController.getmView().graphics.ms[0].geometry;
                    var detailms = getIdentifyGroups(ActionsController.appm, identifyGroup)
                    detailms.forEach(x => x.loading = true);
                    var allPromises = getIdentifyPromiseList(ActionsController.appm, geometry, detailms);
                    var resultArray = [...detailms] as Array<IDetailsLeyerInfo | IDetailData>
                    if (interceptor) {
                        allPromises.forEach((element, index) => {
                            element.then(
                                (result) => {
                                    resultArray[index] = result;
                                    if (resultArray[index].features.length > 0) {
                                        resultArray[index].loading = true;
                                    } else {
                                        resultArray[index].loading = false;
                                    }
                                    ActionsController.instance.execute(interceptor.m, destinationId, controllerActionId, resultArray, interceptor);
                                    ActionsController.trigger(destinationId, resultArray);
                                },
                                (error) => {
                                    resultArray[index].features = new Array();
                                    resultArray[index].loading = false;
                                    ActionsController.instance.execute(interceptor.m, destinationId, controllerActionId, resultArray, interceptor);
                                    ActionsController.trigger(destinationId, resultArray);
                                    console.error(error)
                                }
                            )
                        });
                    } else {
                        allPromises.forEach((element, index) => {
                            element.then(
                                (result) => {
                                    resultArray[index] = result;
                                    resultArray[index].loading = false;
                                    ActionsController.trigger(destinationId, resultArray);
                                },
                                (error) => {
                                    resultArray[index].loading = false;
                                    ActionsController.trigger(destinationId, resultArray);
                                    console.error(error)
                                }
                            )
                        });
                        // Promise.all(allPromises).then(data=>{
                        //     ActionsController.trigger(destinationId, data);
                        // })
                    }
                }
                break;

            case DestinationActivityms.IDENTIFY_FEATURE:
                var geometry = undefined;
                if (payload.geometry) {
                    geometry = payload.geometry
                } else {
                    if (Array.isArray(payload) && payload && payload.length > 0) {
                        var details = payload[0] as IDetailData;
                        if (details && details.features && details.features.length > 0) {
                            geometry = details.features[0].geometry
                        }
                    }
                }
                var detailms = getIdentifyGroups(ActionsController.appm, identifyGroup)
                detailms.forEach(x => x.loading = true);
                var allPromises = getIdentifyPromiseList(ActionsController.appm, geometry, detailms);
                var resultArray = [...detailms] as Array<IDetailsLeyerInfo | IDetailData>
                if (interceptor) {
                    allPromises.forEach((element, index) => {
                        element.then(
                            (result) => {
                                resultArray[index] = result;
                                if (resultArray[index].features.length > 0) {
                                    resultArray[index].loading = true;
                                } else {
                                    resultArray[index].loading = false;
                                }
                                ActionsController.instance.execute(interceptor.m, destinationId, controllerActionId, resultArray, interceptor);
                                ActionsController.trigger(destinationId, resultArray);
                            },
                            (error) => {
                                resultArray[index].features = new Array();
                                resultArray[index].loading = false;
                                ActionsController.instance.execute(interceptor.m, destinationId, controllerActionId, resultArray, interceptor);
                                ActionsController.trigger(destinationId, resultArray);
                                console.error(error)
                            }
                        )
                    });
                } else {
                    allPromises.forEach((element, index) => {
                        element.then(
                            (result) => {
                                resultArray[index] = result;
                                resultArray[index].loading = false;
                                ActionsController.trigger(destinationId, resultArray);
                            },
                            (error) => {
                                resultArray[index].loading = false;
                                ActionsController.trigger(destinationId, resultArray);
                                console.error(error)
                            }
                        )
                    });
                    // Promise.all(allPromises).then(data=>{
                    //     ActionsController.trigger(destinationId, data);
                    // })
                }
                break;


            case DestinationActivityms.m_TEXT:
                ActionsController.setmClick(false);
                ActionsController.setmText(true);

                break;

            case DestinationActivityms.SET_CREATE_FEATURE:
                // var createIds = getCreatemGroupIds(destinationId)
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        var featureNew = generateFeature(destinationId, details.features[0] as Graphic)
                        ActionsController.createFeatures = [featureNew]
                        ActionsController.emit(activity);
                    }
                } else {

                    var featureNew = generateFeature(destinationId, undefined)
                    ActionsController.createFeatures = [featureNew]
                    ActionsController.emit(activity);
                }
                // var feature = generateFeature(destinationId, payload? payload.m : undefined)
                // ActionsController.createFeatures = [feature]
                // ActionsController.emit(activity);
                break;
            case DestinationActivityms.CREATE_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        details.features.forEach(x => {
                            if (validateFeatures(details.mGroupId, details.operationalmId, details.mId, x as Graphic)) {
                                createFeature(details.mGroupId, details.operationalmId, details.mId, x as Graphic).then((result: any) => {
                                    if (result.m) {
                                        details.features = [result.m]
                                        ActionsController.trigger("createSuccess", [details]);
                                    } else
                                        ActionsController.trigger("createFailure", [details]);
                                })
                            }
                        })
                    }
                }
                // createFeature(payload.mGroupId, payload.operationalmId, payload.mId, payload.m).then((result: any) => {
                //     if (result.m) {
                //         payload.m = result.m
                //         ActionsController.trigger("createSuccess", payload);
                //     } else
                //         ActionsController.trigger("createFailure", payload);
                // })
                break;
            case DestinationActivityms.CLEAR_CREATE_FEATURE:
                ActionsController.createFeatures = new Array();
                ActionsController.setmClick(true);
                ActionsController.emit(DestinationActivityms.SET_CREATE_FEATURE);
                break;


            case DestinationActivityms.SET_EDIT_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        var groupId = getGroupIdEdit(details.mGroupId, details.operationalmId, details.mId);
                        ActionsController.editFeatures = [{
                            groupId: groupId ? groupId : "",
                            mGroupId: details.mGroupId,
                            operationalmId: details.operationalmId,
                            mId: details.mId,
                            features: details.features
                        }]
                        ActionsController.emit(activity);
                    }
                }

                break;
            case DestinationActivityms.EDIT_FEATURE:
                var load = payload as Array<IDetailData>;
                if (load && load.length > 0) {
                    var details = load[0];
                    if (details && details.features && details.features.length > 0) {
                        details.features.forEach(x => {
                            editFeature(details.mGroupId, details.operationalmId, details.mId, x as Graphic).then((result: any) => {
                                if (result.m) {
                                    details.features = [result.m]
                                    ActionsController.trigger("editSuccess", [details]);
                                } else
                                    ActionsController.trigger("editFailure", [details]);
                            })

                        })

                    }
                }
                // editFeature(payload.mGroupId, payload.operationalmId, payload.mId, payload.m).then((result: any) => {
                //     if (result.m) {
                //         payload.m = result.m
                //         ActionsController.trigger("editSuccess", payload);
                //     } else
                //         ActionsController.trigger("editFailure", payload);
                // })
                break;

            case DestinationActivityms.CLEAR_EDIT_FEATURE:
                ActionsController.editFeatures = new Array();
                ActionsController.setmClick(true);
                ActionsController.emit(DestinationActivityms.SET_EDIT_FEATURE);
                break;

            case DestinationActivityms.EXPORT_EXCEL_QUERY:
                const { url, where, outFields, returnGeometry, spatialReference, filem, token, buttonId } = payload;
                exportExelQuery(url, where, outFields, returnGeometry, spatialReference, filem, token, buttonId);
                break;

            case DestinationActivityms.EXPORT_EXCEL_JSON:
                exportExelJSON(payload.url, payload.features, payload.fields, payload.spatialReference, payload.geometrym, payload.filem, payload.token, payload.buttonId);
                break;

            case DestinationActivityms.EXPORT_SHAPE_QUERY:
                exportShapeQuery(payload.url, payload.where, payload.outFields, payload.returnGeometry, payload.spatialReference, payload.filem, payload.token, payload.buttonId);
                break;

            case DestinationActivityms.EXPORT_SHAPE_JSON:
                exportShapeJSON(payload.url, payload.features, payload.fields, payload.spatialReference, payload.geometrym, payload.filem, payload.token, payload.buttonId);
                break;

            case DestinationActivityms.m_DOCUMENT_FEATURE:
                let data;
                if (Array.isArray(payload)) {
                    data = payload[0];
                    data.feature = payload[0].features[0];
                }
                const { feature, mGroupId, operationalmId, mId } = data;
                mDocumentFeatures(feature, mGroupId, operationalmId, mId);
                break;

            case DestinationActivityms.m_DOCUMENT_FEATURE:
                mDocumentFeatures();
                break;

            case DestinationActivityms.SAVE_DOCUMENT:
                uplomocuments(payload)
                    .then(res => {
                        if (res) {
                            ActionsController.trigger("uploadSuccess", payload.docFeature);
                            ActionsController.emit("clearDocumentSelection");
                        } else {
                            ActionsController.trigger("uploadFailure");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        ActionsController.trigger("uploadFailure");
                    });
                break;

            case DestinationActivityms.CLEAR_DOCUMENT_METADATA:
                ActionsController.emit("clearDocumentSelection");
                break;

            case DestinationActivityms.DELETE_DOCUMENT:
                deleteDocument(payload.url, payload.id, payload.token)
                    .then(res => {
                        if (res) {
                            ActionsController.trigger("deleteSuccess", payload.docFeature);
                        } else {
                            ActionsController.trigger("deleteFailure");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        ActionsController.trigger("deleteFailure");
                    });
                break;

            case DestinationActivityms.DOWNLOAD_DOCUMENT:
                downlomocument(payload.url, payload.id, payload.filem, payload.fileExtension, payload.token);
                break;

            default:
                console.warn('default');

                break;
        }
    }

    static setmClick(status: boolean) {
        this.ismClick = status;
    }

    static setmText(status: boolean) {
        this.ismTextOn = status;
    }

    // WebGIS manager
    private setIsWebmFullyLoaded() {
        appStore.dispatch({
            m: mGroupsActions.LOAD_WEB_m_FULLY,
        });
    }

    static setm(appm: EsrimView) {
        if (!this.appm && appm) {
            this.appm = appm;
            ActionsController.instance.setIsWebmFullyLoaded();
            ActionsController.zoomVM.view = ActionsController.appm.mView;
        }
        this.appm = appm;

    }

    static setSelectedmGroupFunction(setSelectedmGroup: Function) {
        this.setSelectedmGroup = setSelectedmGroup;
    }

    static getmView(): EsrimView {
        return this.appm || null;
    }

    static initmView(): Promise<ImViewInitialized> {
        return new Promise((resolve, reject) => {
            _initmView().then((data: ImViewInitialized) => {
                resolve(data);
            }).catch(console.error);
            // }
        });
    }


    private getmsById(configId: string) {
        let resultConfigmerties: any | null = null;
        if (configId) {
            const splittedConfigId = configId.split('/');
            resultConfigmerties = ActionsController.appConfig[splittedConfigId[0]]
            for (let i = 1; i < splittedConfigId.length; i++) {
                if (resultConfigmerties) {
                    resultConfigmerties = resultConfigmerties[splittedConfigId[i]];
                } else {
                    resultConfigmerties = null;
                }
            }
        }
        return resultConfigmerties;
    }

    static mExtentToContainer(extent: Extent) {
        if (extent && this.extentmEnabled) {
            let slicedExtentContainer = this.extentContainer.slice(0, this.currentExtentIndex === 0 ? 1 : this.currentExtentIndex > 0 ? this.currentExtentIndex + 1 : undefined);
            slicedExtentContainer.push(extent);
            this.extentContainer = slicedExtentContainer;
            this.currentExtentIndex = this.extentContainer.length - 1;
        }
    }

    static enableExtentm() {
        this.extentmEnabled = true;
    }

    static disableExtentm() {
        this.extentmEnabled = false;
    }

    static getExtent(m: "previous" | "next") {
        let extent = null;
        if (m === "previous") {
            if (this.currentExtentIndex !== 0) {
                this.currentExtentIndex--;
            }
            if (this.extentContainer.length && this.currentExtentIndex >= 0) {
                extent = this.extentContainer[this.currentExtentIndex];
            }
        } else if ("next") {
            if (this.extentContainer.length && this.currentExtentIndex < this.extentContainer.length - 1) {
                this.currentExtentIndex++;
                extent = this.extentContainer[this.currentExtentIndex];
            }
        }

        return extent;
    }

    public static isButtonDrawTool(key: string): boolean {
        let b = ActionsController.actions.find(a => a.sourceId.endsWith(`/${key}`));
        if (b && b.destinations.some((d: any) => d.activity == DestinationActivityms.DRAW))
            return true;
        return false;
    }

    public static getDrawToolColor(key: string) {
        let b = ActionsController.actions.find(a => a.sourceId.endsWith(`/${key}`));
        if (b && b.destinations.some((d: any) => d.activity == DestinationActivityms.DRAW)) {
            let destinationId = b.destinations.find((d: any) => d.activity == DestinationActivityms.DRAW)?.id;
            let drawToolConf = ActionsController.appConfig.views.mTools.drawTools[destinationId!];
            let symbolColor: string | number[];
            switch (drawToolConf.drawm) {
                case Drawm.m:
                    symbolColor = ActionsController.instance.getSymbolColorOrDefault(ActionsController.appConfig.data.symbolGallery[drawToolConf.mSymbolId],
                        DefaultValues.config.data.symbolGallery.mSymbol);
                    return ActionsController.instance.getCssColor(symbolColor);
                case Drawm.mgon:
                    symbolColor = ActionsController.instance.getSymbolColorOrDefault(ActionsController.appConfig.data.symbolGallery[drawToolConf.mgonSymbolId],
                        DefaultValues.config.data.symbolGallery.mgonSymbol);
                    return ActionsController.instance.getCssColor(symbolColor);
                case Drawm.mm:
                    symbolColor = ActionsController.instance.getSymbolColorOrDefault(ActionsController.appConfig.data.symbolGallery[drawToolConf.mmSymbolId],
                        DefaultValues.config.data.symbolGallery.mmSymbol);
                    return ActionsController.instance.getCssColor(symbolColor);
                default:
                    console.error("Can't get color for this draw tool button");
                    break;
            }
        }
    }

    public static getAllUrlParameters(url?: string) {
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        let searchParams = new URLSearchParams(queryString);
        const result = {} as { [key: string]: string | boolean | number | [] | Object };
        searchParams.forEach((value: string, key: string, parent: URLSearchParams) => {

            result[key] = returnCorrectParamm(value);



            function returnCorrectParamm(param: string) {
                if (Array.isArray(param)) {
                    return Array.from(param);
                }
                else if (Number(param)) {
                    return Number(param);
                } else if (param === "true" || param === "false") {
                    return param === "true" ? true : false;
                } else if (param) {
                    try {
                        JSON.parse(param);
                        return JSON.parse(param);
                    } catch (error) {
                        return param;
                    }
                }
            }
        })

        return result;
    }

    private returnCorrectParamm(param: string) {
        if (Array.isArray(param)) {
            return Array.from(param);
        }
        else if (Number(param)) {
            return Number(param);
        } else if (param === "true" || param === "false") {
            return param === "true" ? true : false;
        } else if (param) {
            try {
                JSON.parse(param);
                return JSON.parse(param);
            } catch (error) {
                return param;
            }
        }
    }

    private getSymbolColorOrDefault(configSymbol: ISymbol, defSymbol: ISymbol): string | number[] {
        let outmColor: string | number[] | undefined;
        let color: string | number[];
        let outmColorDef: string | number[] | undefined;
        let colorDef: string | number[];

        outmColor = configSymbol?.outm?.color;
        outmColorDef = defSymbol.outm?.color;
        color = configSymbol?.color;
        colorDef = defSymbol.color;

        return outmColor || color || outmColorDef || colorDef;
    }

    private getCssColor(color: string | number[]) {
        return new Color(color).toCss(true);
    }
}

export default ActionsController;
