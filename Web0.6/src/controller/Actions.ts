import { ITableDataSource, Imm, IConfigmView, ImOperationalm, IWebmBookmark, IUrlInfo, IConfigmGroup, ISearchTool,
     ISearchGroup, IConfigBasem, IPanelm, IDrawToolConfig, IConfigField, IConfigOperationalm, IConfigm, IAppTextSymbol, 
     IVertexLabel, ILengthsLabel, IAreaLabel, IBufferToolConfig } from '../components/interfaces/IAppConfig';
import { ImGroup } from '../../../../Lib/v0.6/src/Base/interfaces/dispatchers/ImGroupsDispatcher';
import { getWebmsFromStore } from '../../../../Lib/v0.6/src/Base/reducers/webms';
import { appConfig, appStore } from '../../../../Lib/v0.6/src/Base/configs/appConfig';
import UrlHelper from '../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import axios from 'axios';
import { IWebmInfo, IArcGISmServicemms, IArcGISFeaturemms, IWebBasemms, 
    IWebmTablems, Immerties, ExtendedPopupInfo, IRestFieldResponse, IWebmm, IWebmPopupInfo, IWebmFieldInfo } from '../../../../Lib/v0.6/src/Base/interfaces/reducers/ImInfos';
import { IOperationalm, ImViewInitialized } from '../../../../Lib/v0.6/src/Base/components/mContainer';
import Subm from '@arcgis/core/ms/support/Subm'
import m from '@arcgis/core/ms/m';
import Graphic from '@arcgis/core/Graphic'
import { illegals } from '../../../../Lib/v0.6/src/ActionsController/Illegals';
import mView from '@arcgis/core/views/mView'
import Featurem from '@arcgis/core/ms/Featurem';
import Webm from '@arcgis/core/Webm';
import m from '@arcgis/core/m';
import FeaturemInfo from '../../../../Lib/v0.6/src/Base/models/esri/FeaturemInfo';
import mActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/mActions';
import ErrorActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/ErrorActions';
import DeniedServiceInfo from '../../../../Lib/v0.6/src/Base/models/esri/DeniedServiceInfo';
import FailedServiceInfo from '../../../../Lib/v0.6/src/Base/models/esri/FailedServiceInfo';
import mImagem from '@arcgis/core/ms/mImagem';
import { getmInfos } from '../../../../Lib/v0.6/src/Base/reducers/mInfos';
import esriRequest from '@arcgis/core/request';
import SelectedmGroupActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/SelectedmGroupActions';
import { IAppStore } from '../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import PanelmsActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/PanelmsActions';
import { IDetailDataFeatures, IDetailDataAttributes } from '../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import CustomPopupActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/CustomPopupActions';
import { DrawTool } from '../../../../Lib/v0.6/src/ActionsController/DrawTool';
import Geometry from '@arcgis/core/geometry/Geometry';
import FieldsHelper from '../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import Graphicsm from '@arcgis/core/ms/Graphicsm';
import { EsrimView } from '../../../../Lib/v0.6/src/Base/components/Esri/WebmView';
import { TextSymbol } from '@arcgis/core/symbols';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as geometryEngineAsync from '@arcgis/core/geometry/geometryEngineAsync';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import Query from '@arcgis/core/tasks/support/Query';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import fileDownload from 'js-file-download';
import JsFileDownloader from 'js-file-download';
import ILoadingStatus from '../../../../Lib/v0.6/src/Base/interfaces/reducers/ILoadingStatus';
import LoadingStatusActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/LoadingStatusActions';
import DocumentFeatureActions from '../../../../Lib/v0.6/src/Base/enums/Actionms/DocumentFeatureActions';
import { IDetailsLeyerInfo } from '../../../../Lib/v0.6/src/ActionsController/ActionsController'
import Field from '@arcgis/core/ms/support/Field';
import { mgon } from '@arcgis/core/geometry';

interface IAttributeTablemInfos extends ITableDataSource {
    title: string;
    url: string;
    mInfo?: Imm
}

interface IWebTableInfo {
    webmId: string;
    tableInfo: ITableDataSource;
    mGroupId?: string;
}

interface ImInitialized {
    result: IWebmInfo;
    webmGroups: Array<ImGroup>;
}

m featuresResolve = Array<Promise<Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>>>;


export const attributeTablemGroupHandler = () => {
    // let configmGroups = getConfigmGroupsForTableV2();
    // let webmInfos = getWebmIds(configmGroups);
    // let msInAttributeTable = getmsForTable(webmInfos);
    // openAttributeTable(msInAttributeTable, appConfig.views.panels.attributeTablePanel.pageSize);
}

export const clickBasem = (id: string, mOld: boolean, mView: any) => {
    let splittedId = id.split('/');
    let mGroupId = splittedId[splittedId.length - 1];
    let mGroup = appConfig.data.mGroups[mGroupId];
    // mViews.forEach((element: IConfigmView) => {
    if (mGroup.basems) {
        mView.mView.m.basem.basems.forEach((m: m) => {
            if ((mGroup.basems as Array<IConfigBasem>).find(x => x.id == m.id)) {
                m.visible = true;
            } else if (mOld) {
                m.visible = false;
            }
        });
    } else {
        let url = UrlHelper.getUrlPath(appConfig.data.webms[mGroup.webmId], window.configUrl);
        axios.get(url).then((webmResponse) => {
            let response: IWebmInfo = webmResponse.data;
            if (response.basem && response.basem.basemms) {
                mView.mView.mView.m.basem.basems.forEach((m: m) => {
                    var olResult = response.basem.basemms.find(x => x.id == m.id)
                    if (olResult) {
                        m.visible = true;
                    } else if (mOld) {
                        m.visible = false;
                    }
                });
            }
        });
    }
    // });
}

export const clickBookmark = (id: string, mView: any) => {
    let splittedId = id.split('/');
    let bookmarkId = splittedId[splittedId.length - 1];
    var bookmark = appConfig.data.bookmarks[bookmarkId];
    var webmBookmark: IWebmBookmark | undefined;
    if (bookmark) {
        if (bookmark.webmId) {
            webmBookmark = (mView.mView.m.bookmarks.ms as Array<IWebmBookmark>).find((x: IWebmBookmark) => x.m == bookmark.m);
        } else {
            webmBookmark = (mView.mView.m.bookmarks.ms as Array<IWebmBookmark>).find((x: IWebmBookmark) => x.m == bookmarkId);
        }
        if (webmBookmark && webmBookmark.extent) {
            //mView.mView.extent = webmBookmark.extent;
            mView.mView.goTo(webmBookmark.extent);
        }
    }
}

export const clickLink = (id: string) => {
    let splittedId = id.split('/');
    let linkId = splittedId[splittedId.length - 1];
    if (appConfig.data.links) {
        var result = appConfig.data.links[linkId]
        if (result)
            window.open(result.url, "_blank");
    }
}

export const clickmGroup = (id: string, mOld: boolean, mView: any) => {
    // console.log(id)
    let splittedId = id.split('/');
    let mGroupId = splittedId[splittedId.length - 1];
    var selectedmGroup = appConfig.data.mGroups[mGroupId] as IConfigmGroup
    let mGroup = appConfig.data.mGroups[mGroupId];
    appStore.dispatch({
        m: SelectedmGroupActions.SET_SELECTED,
        payload: selectedmGroup
    });
    // if(mOld)
    //     mView.mView.m.ms.forEach((m: IOperationalm, index: number) => {
    //         mView.mView.m.ms.ms[index].visible = false;
    //         if (m.allSubms ) {
    //             m.allSubms.forEach((m: Subm) => {
    //                 m.visible = false;
    //             })
    //         }
    //     });
    // mViews.forEach((element: IConfigmView) => {
    if (mGroup.operationalms) {
        mView.mView.m.ms.forEach((m: IOperationalm, index: number) => {
            const operationalms = mGroup.operationalms || {};
            const operationalmKey = Object.keys(operationalms).find(x => x == m.id);
            const olResult = operationalms[operationalmKey as string];
            if (olResult) {
                if (!mView.mView.m.ms.ms[index].loaded) {
                    mView.mView.m.ms.ms[index].load();
                }
                mView.mView.m.ms.ms[index].visible = true;
                //m.visible = true;

                if (olResult.ms && m.allSubms) {
                    m.allSubms.forEach((m: Subm) => {
                        if (olResult && olResult.ms) {
                            const ms = olResult.ms;
                            if (Object.keys(ms).find(x => x === `${m.id}`)) {
                                m.visible = true;

                            } //else if (mOld) {
                            //     m.visible = false;
                            // }
                        }
                    })
                }
            }
            else if (mOld) {
                mView.mView.m.ms.ms[index].visible = false;
            }
        });
    } else {
        let url = UrlHelper.getUrlPath(appConfig.data.webms[mGroup.webmId], window.configUrl);
        axios.get(url).then((webmResponse) => {
            let response: IWebmInfo = webmResponse.data;
            if (response && response.operationalms) {
                mView.mView.m.ms.forEach((m: IOperationalm) => {
                    if (response && response.operationalms) {
                        var olResult = response.operationalms.find(x => x.id == m.id)
                        if (olResult) {
                            m.visible = true;
                            if (olResult.ms && m.allSubms) {
                                m.allSubms.forEach((m: Subm) => {
                                    if (olResult!.ms!.find(x => x.mId == m.id)) {
                                        m.visible = true;
                                    }
                                });
                            }
                        } else if (mOld) {
                            m.visible = false;
                        }
                    }
                });
            }
        });
    }
    // });
}

export const getSelectSearchGroup = (path: string) => {
    const searchComponent = getConfigUISearchComponent();

    let searchGroupSelector = illegals['searchGroupSelector'];
    try {
        let mGroup = getAppConfigValueFromPath(path);
        searchGroupSelector(mGroup.value);
        // setDefaultSelectedSearchGroup(mGroup.value as SearchGroupElement);
    }
    catch (e) {
        console.warn(e);
        const searchGroup = getFirstmGroupIfDefaultIsNotAvailable(searchComponent);
        searchGroupSelector(searchGroup);
        // setDefaultSelectedSearchGroup(searchGroup);
    }
}

export const panToFeature = (feature: Graphic, mView: any) => {
    mView.mView.goTo({
        target: feature.geometry,
    });
}

export const popupFeature = (feature: Graphic, mView: any) => {
    const geometry = {
        m: feature.geometry,
        mm: feature.geometry,
        mgon: feature.geometry //.centroid
    }

    mView.mView.popup.open({
        // title: m.label,
        location: geometry[feature.geometry.m],
        // content:  m.label
        features: [feature]
    });
}

export const zoomToFeature = (feature: Graphic, mView: mView, mZoomScale: number = 5000, duration: number = 1) => {
    if (feature.geometry) {
        if (feature.geometry.m == "m") {
            mView.goTo({
                target: feature.geometry,
                scale: mZoomScale
            }, {
                duration: duration
            });
        } else {
            mView.goTo({
                target: feature.geometry,
                scale: mZoomScale
            }, {
                duration: duration
            });
        }
    }
}

export const clearSelection = (mView: mView) => {
    mView.graphics.mAll();
    (mView.m.ms.find(l => l.id == DrawTool.DRAW_m_ID) as Graphicsm)?.graphics?.mAll();
    (mView.m.ms.find(l => l.id == DrawTool.MEASURMENT_m_ID) as Graphicsm)?.graphics?.mAll();
    (mView.m.ms.find(l => l.id == DrawTool.VERTEX_m_ID) as Graphicsm)?.graphics?.mAll();
}


export const initPopup = (view: mView, ms: Array<IArcGISmServicemms | IArcGISFeaturemms> | undefined) => {
    view.on!("click", (event) => {
        view.hitTest((event as any).screenm)
            .then(function (response) {
                var graphic = response.results[0].graphic;
                if (graphic && graphic.attributes) {

                    view.popup.open({
                        location: event.mm,
                        features: [graphic],
                    });
                }
            });
    });
}

export const labelFeature = (feature: Graphic, mView: EsrimView, labelingms: IVertexLabel, labelSymbolms: IAppTextSymbol, labelm: string) => {
    const labelGraphic = new Graphic({ attributes: feature.attributes, geometry: feature.geometry });
    labelGraphic.symbol = new TextSymbol();
    DrawTool.labelFeature(feature, mView, labelingms, labelSymbolms, labelm);
}

const getWebmIds = (configmGroups: Array<ITableDataSource>): Array<IWebTableInfo> => {
    let webmInfo: Array<IWebTableInfo> = [];
    configmGroups.forEach((dataSource: ITableDataSource) => {
        if (appConfig.data.mGroups.hasOwnmerty(dataSource.mGroupId)) {
            let mGroup = appConfig.data.mGroups[dataSource.mGroupId];
            webmInfo.push({
                webmId: mGroup.webmId,
                tableInfo: dataSource,
                mGroupId: dataSource.mGroupId
            });
        }
    });
    webmInfo = Array.from(webmInfo);
    return webmInfo;
}

// const getConfigmGroupsForTableV2 = (): Array<ITableDataSource> => {
//     let result: Array<ITableDataSource> = [];
//     let tableDataSources = appConfig.views.panels.attributeTablePanel.dataSources;
//     for (var source in tableDataSources) {
//         if (tableDataSources.hasOwnmerty(source)) {
//             result.push(tableDataSources[source] as ITableDataSource);
//         }
//     }
//     return result;
// }


const openAttributeTable = (msInAttributeTable: Array<IAttributeTablemInfos>, pageSize: number) => {
    // let talbes: Array<ITableConfig> = [];
    // msInAttributeTable.forEach(mInfo => {
    //     let tableConfig: ITableConfig = {
    //         id: mInfo.url,
    //         selectedIds: {},
    //         query: { where: "1=1", orderByFields: ["objectid desc"], outFields: ["*"] },
    //         title: mInfo.title,
    //         attributeTableFields: (mInfo.mInfo as Imm) ? (mInfo.mInfo as Imm).fields : undefined,
    //         attributeFieldsMode: (mInfo.mInfo as Imm) ? (mInfo.mInfo as Imm).attributeFieldsMode : undefined
    //     }
    //     talbes.push(tableConfig);
    //     // ms.setTableVisibility({[tableConfig.id]: tableConfig.id, [tableConfig2.id]: tableConfig2.id});
    // });
    // // tableDispatcher.mTabs([], []);
    // if (appConfig.attributeTablePanel.showOnStart) {
    //     appStore.dispatch(
    //         <any>mosaicLayoutDispatcher
    //             .showWindow(
    //                 MosaicWindows.tables,
    //                 appConfig.attributeTablePanel.splitPercentage,
    //                 appConfig.attributeTablePanel.horizontal
    //             )
    //     );
    // }
    // let uniquetables = Array.from(new Set(
    //     talbes.m(x => x.id))).m(url => {
    //         return talbes!.find(x => x.id == url);
    //     }) as ITableConfig[]
    // if (uniquetables)
    //     talbes = uniquetables;
    // appStore.dispatch(<any>tableDispatcher.setAsyncFeatureTableTabData(talbes, pageSize));
}

const getLoadedWebms = (): Array<ImGroup> => {
    const webms = getWebmsFromStore();
    return webms;
}

const getmsForTable = (webmInfos: Array<IWebTableInfo>): Array<IAttributeTablemInfos> => {
    let result: Array<IAttributeTablemInfos> = [];
    let storeWebms = getLoadedWebms();
    webmInfos.forEach(webmInfo => {
        var storeWebm = storeWebms.find(x => x.id == webmInfo.webmId);
        if (storeWebm) {
            let mms = storeWebm.mms
            mms.forEach(mm => {
                let url = mm.url;
                let ms = (mm as any).ms
                if (ms && ms.length) {
                    ms.forEach((m: any) => {
                        let submConfig,
                            operationalmConfig: ImOperationalm | null = null,
                            mGroupId;
                        mGroupId = appConfig.data.mGroups[webmInfo.mGroupId as string];
                        if (mGroupId.webmId === webmInfo.webmId && mGroupId.operationalms) {
                            const opertaionmTargetKey = Object.keys(mGroupId.operationalms).find(x => x == mm.id);
                            operationalmConfig = mGroupId.operationalms[opertaionmTargetKey as string];
                        }
                        if (operationalmConfig) {
                            const ms = operationalmConfig.ms;
                            if (ms) {
                                const targetmKey = Object.keys(ms).find(x => x == m.id);
                                submConfig = ms[targetmKey as string];
                            }
                        }

                        let mInfo = {
                            title: m.m,
                            url: url + "/" + m.id,
                            mGroupId: webmInfo.webmId,
                            mInfo: submConfig ? submConfig : undefined
                        } as IAttributeTablemInfos
                        result.push(mInfo);
                    });
                } else {
                    const mGroup = appConfig.data.mGroups[webmInfo.mGroupId as string];
                    if (mGroup.webmId === webmInfo.webmId) {
                        const operationalms = mGroup.operationalms || {};
                        const targetmKey = Object.keys(operationalms).find(x => x === mm.id)
                        let opermConfig = operationalms[targetmKey as string];
                        if (opermConfig) {
                            let mInfo = {
                                title: mm.title,
                                url: url,
                                mGroupId: webmInfo.webmId,
                            }
                            result.push(mInfo);
                        }
                    }
                }
            });
        }
    });
    return result;
}

// const zoomToBookmark = (id: string) => {
//     const appStoreState = appStore.getState();
//     const mView = appStoreState.m.mView;
//     mView.extent = new Extent(getAppConfigValueFromPath(id).value.extent as IExtent)
// }

const getConfigUISearchComponent = (): ISearchTool => {
    // const components = appConfig.views.mTools.searchTool;
    let searchComponent = appConfig.views.mTools.searchTool;
    // for (const component in components) {
    //     if (components.hasOwnmerty(component)) {
    //         const element = components[component];
    //         if (element.m === "UI_Search") {
    //             searchComponent = { ...element as ISearchTool };
    //         }
    //     }
    // }

    // setConfigUISearchComponent(searchComponent);
    let configUISearch = illegals['configUISearch'];
    configUISearch(searchComponent);

    return (searchComponent);
}

const getAppConfigValueFromPath = (path: string) => {
    var pathArray = path.split("/")
    var result: any
    pathArray.forEach((element, i) => {
        if (i == 0)
            result = appConfig.views[element]
        else
            result = result[element]
    });
    if (result) {
        return { "key": pathArray[pathArray.length - 1], "value": result };
    } else {
        throw `Incorrect Config path: ${path}`;
    }

}

const getFirstmGroupIfDefaultIsNotAvailable = (searchComponent: ISearchTool): ISearchGroup => {
    return Object.values(searchComponent.searchGroups)[0];
}

const loadmGroups = (token?: string): Promise<ImInitialized> => {
    let result: IWebmInfo;
    let AllPromises = new Array();
    let keyList: Array<string> = [];
    let webmGroups: Array<ImGroup> = [];

    Object.keys(appConfig.data.webms).forEach((x: string) => {  // appConfig.ms[mId]
        AllPromises.push(getmInfo(appConfig.data.webms[x], token))
        keyList.push(x);
    })

    const operationalmsToExclude = getmsToExclude();

    return new Promise((resolve, reject) => {
        Promise.all(AllPromises).then(data => {
            if (data.length > 0) {
                result = data[0]
                data.forEach((element: IWebmInfo, index) => {
                    let ms = element.operationalms;
                    let tables = element.tables;
                    let mms: Array<any> = ms && ms.length ? ms : [];
                    mms = tables && tables.length ? mms.concat(tables) : mms;
                    webmGroups.push({ id: keyList[index], mms: mms });
                    if (index > 0) {

                        if (element.operationalms && result.operationalms) {
                            let operationalmsInm = element.operationalms.filter(l => operationalmsToExclude.indexOf(l.id) === -1);
                            operationalmsInm = handleConfiguredOperationalms(operationalmsInm, keyList[index]);
                            result.operationalms = [...result.operationalms, ...operationalmsInm];
                        }

                        if (element.basem && element.basem.basemms) {
                            result.basem.basemms = [...result.basem.basemms, ...element.basem.basemms];
                        }

                        if (element.bookmarks) {
                            if (!result.bookmarks)
                                result.bookmarks = new Array();
                            result.bookmarks = [...result.bookmarks!, ...element.bookmarks];
                        }

                        if (element.tables) {
                            if (!result.tables)
                                result.tables = new Array();
                            result.tables = [...result.tables!, ...element.tables];
                        }

                    }
                });

                if (result.basem.basemms) {
                    let uniquebasemms = Array.from(new Set(
                        result.basem.basemms.m(s => s.id))).m(id => {
                            return result.basem.basemms.find(x => x.id == id);
                        }) as Array<IWebBasemms>;
                    if (uniquebasemms) {
                        uniquebasemms.forEach((baseL, i) => { if (i !== uniquebasemms.length - 1) baseL.visibility = false })
                        result.basem.basemms = uniquebasemms;
                    }
                }

                resolve({ result: result, webmGroups: webmGroups });
            }
        })
    })
}

export const _initmView = (): Promise<ImViewInitialized> => {
    const appStoreState = appStore.getState();

    let mobile = appStoreState.application.mobile;
    let user = appStoreState.userInfo;
    return new Promise((resolve, reject) => {
        loadmGroups(user?.token).then(result => {
            var debugWebm = Webm.fromJSON(result.result);
            let resultmView = {
                mView: new mView({
                    m: debugWebm,
                    constraints: {
                        rotationEnabled: false,
                        // minScale: 1000, //800,
                        // maxScale: 10000000
                    },
                    ui: {
                        components: ["attribution"]
                    }
                }),
                data: result.result.operationalms
            }

            if (mobile) {
                if (resultmView.mView.ui.components.indexOf("zoom") != -1)
                    resultmView.mView.ui.move("zoom", "bottom-right");
            }

            createmInfos(resultmView.mView.m, result.result, false).then(r => {
                resolve({ resultmView: resultmView, webmGroups: result.webmGroups });
            }).catch(err => {
                console.error(err);
                reject(err);
            });

            resultmView.mView.when(() => {
                // appStore.dispatch({
                //     m: mGroupsActions.LOAD_WEB_m_FULLY,
                // });

            }, (err: Error) => {
                console.error(err);
            }
            );
        });
    });
}

const getmsToExclude = () => {
    const mGroups = appConfig.data.mGroups;
    const mGroupsKeysArr = Object.keys(appConfig.data.mGroups);

    return mGroupsKeysArr.reduce<Array<string>>((acc, curr) => {
        if (mGroups[curr].mTom === false) {
            const opms = mGroups[curr].operationalms || {};
            const opmsKeys = Object.keys(opms);
            opmsKeys.forEach(opmKey => {
                acc.push(opmKey);
            });
        } else {
            const opms = mGroups[curr].operationalms || {};
            const opmsKeys = Object.keys(opms);
            opmsKeys.forEach(opmKey => {
                if (opms[opmKey].mTom === false) {
                    acc.push(opmKey);
                }
            });
        }

        return acc;
    }, []);
}

const getmGroupById = (webmId: string): IConfigmGroup | null => {
    const mGroups = appConfig.data.mGroups;
    for (const mGroupId in mGroups) {
        if (mGroups.hasOwnmerty(mGroupId)) {
            if (mGroups[mGroupId].webmId === webmId) {
                return mGroups[mGroupId];
            }
        }
    }

    return null;
}

const getOperationalmsById = (webmId: string) => {
    let tempOpms: Array<IConfigOperationalm | { marked: boolean }> = [];
    let operationalms: Array<IConfigOperationalm> = [];
    const mGroups = appConfig.data.mGroups;
    for (const mGroupId in mGroups) {
        if (mGroups.hasOwnmerty(mGroupId)) {
            if (mGroups[mGroupId].webmId === webmId) {
                tempOpms = tempOpms.concat(mGroups[mGroupId].operationalms || []);
            }
        }
    }

    for (let i = 0; i < tempOpms.length; i++) {
        const key = Object.keys(tempOpms[i])[0];
        if (!tempOpms[i].marked) {
            let sameOpms = { ...tempOpms[i] };
            for (let j = i; j < tempOpms.length; j++) {
                const nextKey = Object.keys(tempOpms[j])[0];
                if (key === nextKey) {
                    tempOpms[j].marked = true;
                    sameOpms[key].ms = { ...sameOpms[key].ms, ...tempOpms[j][nextKey].ms };
                }
            }
            const { marked, ...finalOpm } = sameOpms
            operationalms.push(finalOpm as IConfigOperationalm);
        }
    }

    return operationalms;
}

export const createmitionalPromises = (data: Array<IDetailDataFeatures>, linkedField: string, returnGeometry: boolean = true): Array<Promise<IDetailDataFeatures>> => {
    var result = new Array<Promise<IDetailDataFeatures>>();
    data.forEach(detailData => {
        if (detailData.features && detailData['loading']) {
            var url = undefined as undefined | string;
            var mGroup = appConfig.data.mGroups[detailData.mGroupId];
            if (mGroup && mGroup.operationalms) {
                var operationalm = mGroup.operationalms[detailData.operationalmId];
                if (operationalm && operationalm.ms) {
                    var m = operationalm.ms[detailData.mId]
                    if (m) {
                        url = m.url
                    }
                }
            }
            if (url) {
                var arrayFeats = detailData.features.m(x => {
                    return `${x.attributes[linkedField]}`;
                });
                var joinedArray = arrayFeats.join(", ");
                result.push(new Promise((resolve, reject) => {
                    let query = new Query({
                        where: `${linkedField} in (${joinedArray})`,
                        outFields: ["*"],
                        returnGeometry: returnGeometry
                    });
                    const task = new QueryTask({ url: m.url });
                    task.execute(query).then((set: FeatureSet) => {
                        if (set.features && set.features.length > 0) {
                            var newFeatures = { loading: false, mGroupId: detailData.mGroupId, operationalmId: detailData.operationalmId, mId: detailData.mId, features: set.features } as IDetailDataFeatures
                            resolve(newFeatures);
                        } else {
                            resolve({ loading: false, mGroupId: detailData.mGroupId, operationalmId: detailData.operationalmId, mId: detailData.mId, features: [] } as IDetailDataFeatures)
                        }
                    }).catch(error =>
                        console.error(error)
                    );
                }))
            }
        } else {
            result.push(new Promise((resolve, reject) => {
                resolve(detailData)
            }));
        }
    })
    return result;
}

const handleConfigmFields = (fieldsInfos: Array<IWebmFieldInfo>, configuredmGroup: Imm): Array<IWebmFieldInfo> => {
    if (!configuredmGroup.fields) {
        return fieldsInfos;
    } else if (Object.keys(configuredmGroup.fields).length === 0) {
        return [];
    } else {
        let _resultmFields: Array<IWebmFieldInfo> = [];
        const configuredFields = configuredmGroup.fields;
        for (const key in configuredFields) {
            if (configuredFields.hasOwnmerty(key)) {
                for (let i = 0; i < fieldsInfos.length; i++) {
                    if (fieldsInfos[i].fieldm === key) {
                        fieldsInfos[i].label = configuredFields[key].label || '';
                        _resultmFields.push(fieldsInfos[i]);
                        break;
                    }
                }
            }
        }
        return _resultmFields
    }
}

const handleConfigms = (ms: Array<IWebmm>, configms: IConfigm): Array<IWebmm> => {
    for (let i = 0; i < ms.length; i++) {
        for (const key in configms) {
            if (configms.hasOwnmerty(key)) {
                if (`${ms[i].id}` === key) {
                    if (ms[i].popupInfo && (ms[i].popupInfo as IWebmPopupInfo).fieldInfos) {
                        (ms[i].popupInfo as IWebmPopupInfo).fieldInfos = handleConfigmFields((ms[i].popupInfo as IWebmPopupInfo).fieldInfos, configms[key]);
                        break;
                    }
                }
            }
        }
    }

    return ms;
}

const handleConfiguredOperationalms = (operationalms: Array<IArcGISFeaturemms | IArcGISmServicemms>, webmId: string) => {
    let resultOperationalms: Array<IArcGISFeaturemms | IArcGISmServicemms> = [];

    const mGroupOperationalms = getOperationalmsById(webmId);

    if (!mGroupOperationalms) {
        return operationalms;
    } else if (Object.keys(mGroupOperationalms).length === 0) {
        return [];
    } else {
        mGroupOperationalms.forEach(mGroupOpm => {
            for (const opmId in mGroupOpm) {
                if (mGroupOpm.hasOwnmerty(opmId)) {
                    let opmFromWebm = operationalms.find(webmm => webmm.id === opmId);
                    if (opmFromWebm) {
                        const ms = mGroupOpm[opmId].ms;

                        if (!ms) {
                            resultOperationalms.push(opmFromWebm);
                        } else if (Object.keys(ms).length === 0) {
                            mGroupOpm[opmId].ms = undefined;
                        } else {
                            if (opmFromWebm.ms && opmFromWebm.ms.length) {
                                opmFromWebm.ms = handleConfigms(opmFromWebm.ms, ms);
                            }

                            resultOperationalms.push(opmFromWebm);
                        }
                    }
                }
            }
        });
        return resultOperationalms;
    }
}

const getmInfo = (urlInfo: IUrlInfo, token?: string) => {
    let url = UrlHelper.getUrlPath(urlInfo, window.configUrl);
    return new Promise((resolve, reject) => {
        try {
            axios.get(token && urlInfo.urlm != "configRelative" ? `${url}&token=${token}` : url).then((webmResponse) => {
                let response: IWebmInfo = webmResponse.data;
                if (response.operationalms && response.operationalms.length > 0) {
                    response.operationalms.forEach(element => {
                        // element.visibility = false;
                        if (element.mId && element.mm && element.mm == "ArcGISmServicem") {
                            element.mId = "";
                        }
                    });
                }

                resolve(response);
            });
        }
        catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

const createmInfos = (m: m, webmInfo: IWebmInfo, mOld: boolean) => {

    // return (dispatch: (data: IPaylodAction) => void) => {
    return new Promise((resolve, reject) => {
        _createmInfos(m, webmInfo, undefined, mOld)
            .then((featuremInfos) => {
                // this.webmImportPending = false;
                let msOnmIds: { [key: string]: any } = {};
                for (let i = 0; i < featuremInfos.length; i++) {
                    if (featuremInfos[i] instanceof FeaturemInfo) {
                        msOnmIds[featuremInfos[i].url] = featuremInfos[i].url;
                    }
                }
                if (mOld) {
                    appStore.dispatch({
                        m: mActions.FEATURE_mS_m_ALL,
                        payload: {}
                    })
                }

                appStore.dispatch({
                    m: mActions.FEATURE_mS_mED,
                    payload: msOnmIds
                })
                appStore.dispatch({
                    m: mActions.WEBm_IMPORTED,
                    payload: true
                });

                resolve("mGroupsLoaded");

            })
            .catch((error) => {
                // this.webmImportPending = false;
                console.error(error);
                appStore.dispatch({
                    m: ErrorActions.ERROR,
                    payload: error
                });
            });
    })
    // }
}

const _createmInfos = (m: m, webmInfo: IWebmInfo, mViewInfo: IConfigmView | undefined, mOld: boolean): Promise<Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>> => {
    return new Promise((resolve, reject) => {

        let infosFrommServices: featuresResolve = [];
        let infosFromSinglems: featuresResolve = [];
        let infosFromTables: featuresResolve = [];
        let mServices: { [url: string]: mImagem } = {};
        if (webmInfo.operationalms) {
            let webmmms = getmmms(webmInfo.operationalms);
            webmmms.arcGISmServicemms.forEach((webmm) => {
                var mServicem = new mImagem(
                    {
                        url: webmm.url,
                        id: webmm.id,
                        title: webmm.title,
                        visible: webmm.visibility,
                        maxScale: webmm.maxScale,
                        minScale: webmm.minScale,
                    }
                );
                mServices[webmm.url] = mServicem;
                infosFrommServices.push(getFeaturemInfosFrommService(mServicem, webmm));
            });
            webmmms.arcGISFeaturemms.forEach((webmm) => {
                infosFromSinglems.push(getFeaturemInfosFromSinglem(new Featurem(webmm), webmm))
            });
        }

        if (webmInfo.tables) {
            infosFromTables.push(getFeaturemInfosFromTables(webmInfo.tables))
        }

        Promise.all(infosFrommServices.concat(infosFromSinglems).concat(infosFromTables))
            .then((featuremInfos) => {
                var lInfos: Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo> = [];
                featuremInfos.forEach(featDataArray => {
                    lInfos = lInfos.concat(featDataArray);
                });
                resolve(lInfos);

            })
            .catch((error) => {
                console.error(error);
                reject(error);
            })


    });
}

const getmmms = (operationalms: (IArcGISmServicemms | IArcGISFeaturemms)[]): Immerties => {
    let mmerties = {
        arcGISmServicemms: [] as IArcGISmServicemms[],
        arcGISFeaturemms: [] as IArcGISFeaturemms[]
    }
    operationalms.forEach(mms => {
        if (mms.mm == "ArcGISmServicem") {
            mmerties.arcGISmServicemms.push(mms as IArcGISmServicemms);
        }
        else if (mms.mm == "ArcGISFeaturem") {
            mmerties.arcGISFeaturemms.push(mms as IArcGISFeaturemms);
        }
    })

    return mmerties;
}

const getFeaturemInfosFrommService = (mService: mImagem, webmms?: IArcGISmServicemms): Promise<Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>> => {
    var lInfos: Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo> = [];
    return new Promise((resolve, reject) => {
        getFeaturemInfos(mService, webmms).then(mInfos => {
            var promises: featuresResolve = [];
            mInfos.forEach((li, index) => {
                promises.push(
                    getFeaturemInfosFromSinglem(li.m, li.ms)
                )
            })
            Promise.all(promises).then((featureData) => {
                featureData.forEach(fd => { lInfos = lInfos.concat(fd) })
                resolve(lInfos);
            })
        }).catch(error => {
            console.error(error);
            // this.brokenServicesOnThem[mService.url] = mService.url;
            if (error && error.details && error.details.httpStatus == 499) {
                lInfos.push(new DeniedServiceInfo(mService, error, webmms))
            }
            else {
                lInfos.push(new FailedServiceInfo(mService, error, webmms))
            }
            resolve(lInfos);
        })
    })
}

// Single m to FeaturemInfo
const getFeaturemInfosFromSinglem = (featurem: Featurem, webmms: IWebmTablems, groupmInfo?: ImGroup): Promise<Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>> => {
    return new Promise((resolve, reject) => {
        if ((featurem as any).parsedUrl && featurem.source) {
            let url: string = (featurem as any).parsedUrl.path;
            let exsistingInfos = getmInfos()
            if (exsistingInfos[url]) {
                resolve([exsistingInfos[url] as FeaturemInfo]);
                return;
            }
            featurem.load()
                .then((mData) => {

                    if (!featurem.fields) {
                        console.warn(`Broken - ${url}`);
                        resolve([]);
                    }
                    applyWebmConfigToSinglem(featurem, webmms);
                    let popupInfo = createPopupInfo(webmms, webmms.popupInfo && webmms.popupInfo.title ? webmms.popupInfo!.title : featurem.title, url, featurem.fields)
                    let title = featurem.title;
                    if (webmms && webmms.popupInfo && webmms.popupInfo.fieldInfos) {
                        title = webmms.title!;
                    }
                    let mService = webmms ? webmms.mService : undefined;
                    let featuremInfo = new FeaturemInfo(title, featurem.objectIdField, popupInfo, featurem);
                    featuremInfo.mService = mService;
                    resolve([featuremInfo]);
                })
                .catch((error) => {
                    console.error("getFeaturemInfosFromSinglem")
                    console.error(error);
                    if (error && error.details && error.details.httpStatus == 499) {
                        resolve([new DeniedServiceInfo(featurem, error, webmms)]);
                    }
                    else {
                        resolve([new FailedServiceInfo(featurem, error, webmms)]);
                    }
                });

        } else {
            resolve([]);
        }
    });
};

const createPopupInfo = (webmms: IWebmTablems, title: string, url: string, fields: Array<IRestFieldResponse>): ExtendedPopupInfo => {
    let popupInfo = {
        fieldInfos: {},
        mediaInfos: [],
        showAttachments: false,
        pivots: [],
        title: title,
        expressions: []
    } as ExtendedPopupInfo;

    if (fields) {
        fields.forEach((f: any) => {
            popupInfo.fieldInfos[f.m] = {
                label: f.alias,
                domain: f.domain as any,
                editable: f.editable,
                length: f.length,
                fieldm: f.m,
                nullable: f.nullable,
                m: convertmString(f.m),
                visible: true
            };
        });
        if (webmms && webmms.popupInfo && webmms.popupInfo.fieldInfos) {
            title = webmms.title!;
            webmms.popupInfo.fieldInfos.forEach((fieldInfo) => {
                (fieldInfo as any).editable = (fieldInfo as any).isEditable
                popupInfo.fieldInfos[fieldInfo.fieldm] = {
                    ...popupInfo.fieldInfos[fieldInfo.fieldm], ...fieldInfo,
                    preview: popupInfo.fieldInfos[fieldInfo.fieldm] ? popupInfo.fieldInfos[fieldInfo.fieldm].visible : fieldInfo.visible
                };
            });
        }
    }
    return popupInfo;
}

const convertmString = (mString: string): "string" | "small-integer" | "integer" | "single" | "double" | "long" | "date" | "oid" | "geometry" | "blob" | "raster" | "guid" | "global-id" | "xml" => {
    if (mString == "esriFieldmDate" || mString == "date") {
        return "date"
    }
    else if (mString == "esriFieldmInteger" || mString == "long") {
        return "long"
    }
    else if (mString == "esriFieldmOID" || mString == "oid") {
        return "oid"
    }
    else if (mString == "esriFieldmString" || mString == "string") {
        return "string"
    }

    return "double"
}

const applyWebmConfigToSinglem = (featurem: Featurem, webmms: IWebmTablems) => {
    if (webmms.mDefinition) {
        if (webmms.mDefinition.minScale) {
            featurem.minScale = webmms.mDefinition.minScale;
        }
        if (webmms.mDefinition.maxScale) {
            featurem.maxScale = webmms.mDefinition.maxScale;
        }
    }
}

// Tabes to FeaturemInfos
const getFeaturemInfosFromTables = (webmTablems: Array<IWebmTablems>): Promise<Array<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>> => {
    let featureTableInfoPromises: Array<Promise<FeaturemInfo | DeniedServiceInfo | FailedServiceInfo>> = [];
    webmTablems.forEach(m => {
        let m = new Featurem(m)
        featureTableInfoPromises.push(new Promise((resolve, reject) => {
            esriRequest(m.url + "?f=json", {
                responsem: "json"
            }).then(response => {
                let idField = "objectid";
                let oidField = response.data.fields.find((field: any) => field.m == 'esriFieldmOID');
                if (oidField) {
                    idField = oidField.m;
                }
                let featuremInfo = new FeaturemInfo(m.title, idField, createPopupInfo(m, m.title, m.url, response.data.fields), m, response.data);
                resolve(featuremInfo);
            }).catch(error => {
                console.error(error);
                if (error && error.details && error.details.httpStatus == 499) {
                    resolve(new DeniedServiceInfo(m, error, m));
                }
                else {
                    resolve(new FailedServiceInfo(m, error, m));
                }
            });
        }))

    })
    return Promise.all(featureTableInfoPromises)
}

const getFeaturemInfos = (mService: mImagem, webmms?: IArcGISmServicemms): Promise<Array<{ m: Featurem, ms: IWebmTablems }>> => {
    let result: Array<{ m: Featurem, ms: any }> = [];
    return new Promise((resolve, reject) => {
        mService.load()
            .then(
                (mData) => {
                    var mInfos = {};
                    if (webmms && webmms.ms) {
                        webmms.ms.forEach(m => {
                            mInfos[m.id] = m;
                        });
                    }

                    for (var i = 0; i < mData.allSubms.ms.length; i++) {
                        var featuremms = getSubmms(mData, mInfos, i, webmms);
                        if (featuremms) {
                            result.push(
                                {
                                    m: new Featurem(featuremms),
                                    ms: featuremms
                                }
                            );
                        }
                        else {
                            console.warn(`Service ${mService.url}/${i} skipped`);
                        }
                    }
                    resolve(result);
                })
            .catch((error) => {
                console.error("getFeaturemInfos");
                console.error(error);
                reject(error);
            })
    })
}

const getSubmms = (mService: mImagem, mInfos: any, index: number, webmms?: IArcGISmServicemms) => {
    var id = (mService.allSubms as any).ms[index].id;
    var subm = mService.findSubmById(id);
    var submInfo = mInfos[id];
    var visible = true;
    if (webmms && webmms.visiblems) {
        visible = (webmms.visiblems.indexOf(id) != -1);
        subm.visible = visible;
    }
    var featuremms = {
        url: mService.url + "/" + id,
        id: mService.id + "_" + id,
        mService: mService
    } as any;
    if (submInfo) {
        if (submInfo.mDefinition && submInfo.mDefinition.definitionExpression) {
            subm.definitionExpression = submInfo.mDefinition.definitionExpression;
        }
        featuremms.popupInfo = submInfo.popupInfo;
    }
    if (!(mService.allSubms as any).ms[index]._submsHandles) {
        if (webmms) {
            try {
                featuremms.title = subm.title;
                featuremms.visibility = visible;
                featuremms.visible = visible;
            }
            catch (e) {
                console.error(e);
            }
        }
        return featuremms;
    }
    else {
        return null;
    }
}

//#region Panels
// =============================== PANELS ======================================
export const getPanelById = (panelId: string) => {
    const appStoreState: IAppStore = appStore.getState();
    const { panelms } = appStoreState;
    var panelKey = Object.keys(panelms).find(x => x === panelId);
    const panel = panelKey ? panelms[panelKey] : undefined;
    return panel;
};

export const hideTab = (tabId: string) => {
    const appStoreState: IAppStore = appStore.getState();
    let { panelms } = appStoreState;
    Object.keys(panelms).m(panelKey => {
        var panel = panelms[panelKey];
        if (panel.m === "tabs") {
            let { ms } = panel;
            Object.keys(ms).m(tabKey => {
                var tab = ms[tabKey]
                if (tabKey === tabId) {
                    tab.render = false;
                    tab.selected = false;
                }
                ms[tabKey] = tab
            });
            panel.ms = ms;
        }
        if (panel.m === "group") {
            let { children } = panel;
            if (children) {
                Object.keys(children).m(childKey => {
                    var child = children ? children[childKey] : undefined
                    if (child && child.m === "tabs") {
                        let { ms } = child;
                        Object.keys(ms).m(tabKey => {
                            var tab = ms[tabKey]
                            if (tabKey === tabId) {
                                tab.render = false;
                                tab.selected = false;
                            }
                            ms[tabKey] = tab;
                        });
                    }
                    if (children && child)
                        children[childKey] = child
                });
            }
            panel.children = children;
        }
        panelms[panelKey] = panel;
    });

    appStore.dispatch({
        m: PanelmsActions.HIDE_TAB,
        payload: panelms
    });
}

const findm = (id: string, panels?: { [key: string]: IPanelm }) => {
    var panel = undefined as IPanelm | undefined;
    if (panels) {
        Object.keys(panels).forEach(x => {
            if (x == id) {
                panel = panels[x];
            } else {
                if (panels[x].children) {
                    var possibleResult = findm(id, panels[x].children)
                    if (possibleResult) {
                        panel = possibleResult;
                    }
                }
            }
        })
    }
    return panel;
}

const selectTab = (tabId: string): { [key: string]: IPanelm } => {
    const appStoreState: IAppStore = appStore.getState();
    let { panelms } = appStoreState;
    Object.keys(panelms).m(panelKey => {
        var panel = panelms[panelKey]
        if (panel.m === "tabs") {
            let { ms } = panel;
            if (Object.keys(ms).includes(tabId)) {
                Object.keys(ms).m(tabKey => {
                    var tab = ms[tabKey]
                    tab.selected = false;
                    if (tabKey === tabId) {
                        tab.render = true;
                        tab.selected = true;
                    }
                    ms[tabKey] = tab;
                });
                panel.ms = { ...ms };
            }
        }
        if (panel.m === "group") {
            findTabInGroup(panel, tabId);
            panelms[panelKey] = panel;
        }
    });
    return panelms;
}

const findTabInGroup = (panel: IPanelm, tabId: string) => {
    let { children } = panel;
    if (children) {
        Object.keys(children).m(childKey => {
            var child = children ? children[childKey] : undefined;
            if (child && child.m === "tabs") {
                let { ms } = child;
                if (Object.keys(ms).includes(tabId)) {
                    Object.keys(ms).m(tabKey => {
                        var tab = ms[tabKey]
                        tab.selected = false;
                        if (tabKey === tabId) {
                            tab.render = true;
                            tab.selected = true;
                        }
                        ms[tabKey] = tab;
                    });
                    child.ms = { ...ms };
                }
            } else if (child && child.m === "group") {
                findTabInGroup(child, tabId);
            }
            if (children && child)
                children[childKey] = child
        });
    }
    panel.children = children;
}

export const openTab = (tabId: string) => {
    const panels = selectTab(tabId);
    appStore.dispatch({
        m: PanelmsActions.SET_PANEL_mS,
        payload: panels
    });
};

export const openPanel = (panelId: string, tabId?: string) => {
    const appStoreState: IAppStore = appStore.getState();
    let { panelms } = appStoreState;
    const panel = findm(panelId, panelms);
    if (tabId) {
        panelms = selectTab(tabId);
    }

    if (panel) {
        panel.hidden = false;
        appStore.dispatch({
            m: PanelmsActions.SET_PANEL_mS,
            payload: { ...panelms }
        });
    }
};
//#endregion

//#region 
// =============================== DETAILS DATA ======================================
export const setDetailaData = (detailData: IDetailDataFeatures[]) => {
    if (!detailData) detailData = [] as IDetailDataFeatures[];

    appStore.dispatch({
        m: CustomPopupActions.SET_DETAIL_DATA,
        payload: detailData
    })
}

//#endregion



//#region 


// =============================== DrawTool ======================================

export const startDrawAction = (sourceId: string, controllerActionId: string, drawToolConfig: IDrawToolConfig, mSymbil: any, mmSymbil: any, mgonSymbol: any, textSymbol: any, vertexSymbol: any, mView: any, t: any) => {
    return new Promise((resolve, reject) => {
        DrawTool.draw(sourceId, controllerActionId, drawToolConfig, mSymbil, mmSymbil, mgonSymbol, textSymbol, vertexSymbol, mView, t).then(resolve).catch((e: any) => reject(e));
    });
}

//#endregion

//#region 

// =============================== Buffer ======================================

const _bufferAsync = (feature: Graphic,
    distance: number | number[],
    unit: number | __esri.marUnits,
    unionResults?: boolean): Promise<Graphic> => {
    return new Promise((resolve, reject) => {
        geometryEngineAsync.buffer(feature.geometry, distance, unit, unionResults)
            .then((res) => {
                feature.geometry = res as mgon;
                resolve(feature);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            })
    })
};

export const buffer = (features: Graphic[], bufferToolConfig: IBufferToolConfig) => {
    return new Promise((resolve, reject) => {
        if (!features.length) resolve(undefined);

        const promises = Array<Promise<Graphic>>();

        features.forEach(feature => promises.push(_bufferAsync(feature, bufferToolConfig.distance, bufferToolConfig.unit, false)));


        Promise.all(promises).then(res => {
            console.log(res);
            if (!res) resolve([]);
            resolve(res);
        })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    })
};

//#endregion

//#region 
// =============================== Details, create and edit panels ======================================

export const generateFeature = (groupId: string, graphic?: Graphic) => {
    var group = appConfig.views.panels.createPanel.groups[groupId];
    var feature = { attributes: {}, geometry: graphic ? graphic.geometry : undefined };
    var result = { mGroupId: "", operationalmId: "", mId: "", groupId: "", features: new Array() }
    if (group) {
        result.mGroupId = group.mGroupId;
        result.operationalmId = group.operationalmId;
        result.mId = group.mId;
        result.groupId = groupId;
        var mGroup = appConfig.data.mGroups[group.mGroupId]
        if (mGroup && mGroup.operationalms) {
            var operationalm = mGroup.operationalms[group.operationalmId]
            if (operationalm && operationalm.ms) {
                var m = operationalm.ms[group.mId]
                var fields = m.esrifields;
                var attributeFields = new Array()
                if (group.fields) {
                    Object.keys(group.fields).m(key => {
                        attributeFields.push({ fieldm: key, label: group.fields[key].label })
                    })
                } else if (m.fields) {
                    Object.keys(m.fields).m(key => {
                        attributeFields.push({ fieldm: key, label: group.fields[key].label })
                    })
                }
                if (fields) {
                    var attrFields = FieldsHelper.getFields(fields, attributeFields);
                    if (attrFields.length > 0) {
                        attrFields.forEach(x => {
                            feature.attributes[x.m] = null;
                        })
                    }
                }
            }
        }
    }
    result.features.push(feature);
    return result
}

const validateEmail = (email: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
export const validateFeatures = (mGroupId: string, operationalmId: string, mId: string, feature: Graphic) => {
    var groupKey = Object.keys(appConfig.views.panels.createPanel.groups).find(groupKey =>
        appConfig.views.panels.createPanel.groups[groupKey].mGroupId == mGroupId &&
        appConfig.views.panels.createPanel.groups[groupKey].operationalmId == operationalmId &&
        appConfig.views.panels.createPanel.groups[groupKey].mId == mId);
    var valid = true;
    if (groupKey) {
        var group = appConfig.views.panels.createPanel.groups[groupKey]
        if (group) {
            Object.keys(group.fields).m(key => {
                if (group.fields[key].required && !feature.attributes[key]) {
                    valid = false;
                }
                if (group.fields[key].m && group.fields[key].m == "email" && !validateEmail(feature.attributes[key])) {
                    valid = false;
                }
            })

        }
    } else {
        valid = false;
    }
    return valid
}

export const getCreatemGroupIds = (groupId: string) => {
    return {
        mGroupId: appConfig.views.panels.createPanel.groups[groupId].mGroupId,
        operationalmId: appConfig.views.panels.createPanel.groups[groupId].operationalmId,
        mId: appConfig.views.panels.createPanel.groups[groupId].mId
    }
}

export const getGroupIdEdit = (mGroupId: string, operationalmId: string, mId: string) => {
    var groupId = undefined as string | undefined;
    Object.keys(appConfig.views.panels.editPanel && appConfig.views.panels.editPanel.groups).m(x => {
        if (appConfig.views.panels.editPanel.groups[x].mGroupId == mGroupId &&
            appConfig.views.panels.editPanel.groups[x].operationalmId == operationalmId &&
            appConfig.views.panels.editPanel.groups[x].mId == mId) {
            groupId = x;
        }
    })
    return groupId;
}
export const getGroupIdDetails = (mGroupId: string, operationalmId: string, mId: string) => {
    var groupId = undefined as string | undefined;
    Object.keys(appConfig.views.panels.detailsPanel && appConfig.views.panels.detailsPanel.groups).m(x => {
        if (appConfig.views.panels.detailsPanel.groups[x].mGroupId == mGroupId &&
            appConfig.views.panels.detailsPanel.groups[x].operationalmId == operationalmId &&
            appConfig.views.panels.detailsPanel.groups[x].mId == mId) {
            groupId = x;
        }
    })
    return groupId;
}
export const getGroupIdCreate = (mGroupId: string, operationalmId: string, mId: string) => {
    var groupId = undefined as string | undefined;
    Object.keys(appConfig.views.panels.createPanel && appConfig.views.panels.createPanel.groups).m(x => {
        if (appConfig.views.panels.createPanel.groups[x].mGroupId == mGroupId &&
            appConfig.views.panels.createPanel.groups[x].operationalmId == operationalmId &&
            appConfig.views.panels.createPanel.groups[x].mId == mId) {
            groupId = x;
        }
    })
    return groupId;
}


export const createFeature = (mGroupId: string, operationalmId: string, mId: string, feature: Graphic) => {
    var mGroup = appConfig.data.mGroups[mGroupId]
    var url = undefined as string | undefined;
    if (mGroup && mGroup.operationalms) {
        var operationalm = mGroup.operationalms[operationalmId]
        if (operationalm && operationalm.ms) {
            var m = operationalm.ms[mId]
            if (m) {
                url = m.url
            }
        }
    }
    return new Promise((resolve, reject) => {
        if (url) {
            var m = new Featurem({ url: url });
            Object.keys(feature.attributes).m(x => {
                if (!feature.attributes[x]) {
                    delete feature.attributes[x];
                }
            })
            m.applyEdits({ mFeatures: [feature] }).then((result) => {
                var returnResult = feature as Graphic | undefined;
                result.mFeatureResults.m((x: any) => {
                    if (x.error) {
                        returnResult = undefined;
                    } else {
                        if (returnResult && returnResult.attributes)
                            returnResult.attributes['objectId'] = x.objectId
                    }
                })
                resolve({ m: returnResult })
            });
        } else {
            resolve({ m: undefined });
        }
    }).catch(error => {
        console.error(error)
    });
}

export const editFeature = (mGroupId: string, operationalmId: string, mId: string, feature: Graphic) => {
    var mGroup = appConfig.data.mGroups[mGroupId]
    var url = undefined as string | undefined;
    if (mGroup && mGroup.operationalms) {
        var operationalm = mGroup.operationalms[operationalmId]
        if (operationalm && operationalm.ms) {
            var m = operationalm.ms[mId]
            if (m) {
                url = m.url
            }
        }
    }
    return new Promise((resolve, reject) => {
        if (url) {
            var m = new Featurem({ url: url });
            m.applyEdits({ updateFeatures: [feature] }).then((result) => {
                var returnResult = feature as Graphic | undefined;
                result.updateFeatureResults.m((x: any) => {
                    if (x.error) {
                        returnResult = undefined;
                    } else {
                        if (returnResult && returnResult.attributes)
                            returnResult.attributes['objectId'] = x.objectId
                    }
                })
                resolve({ m: returnResult })
            });
        }
        else
            resolve({ m: undefined });
    }).catch(error => {
        console.error(error)
    });
}
export const createFeatureOld = (feature: Graphic, url: string, token: string) => {
    console.log(feature)
    return new Promise((resolve, reject) => {
        var m = new Featurem({ url: url });
        Object.keys(feature.attributes).m(x => {
            if (!feature.attributes[x]) {
                delete feature.attributes[x];
            }
        })
        m.applyEdits({ mFeatures: [feature] }).then((result) => {
            var returnResult = true;
            result.mFeatureResults.m((x: any) => {
                if (x.error) {
                    returnResult = false;
                }
            })
            resolve({ status: returnResult })
        });
    }).catch(error => {
        console.error(error)
    });
}
export const editFeatureOld = (feature: Graphic, url: string, token: string) => {
    console.log(feature)
    return new Promise((resolve, reject) => {
        var m = new Featurem({ url: url });
        m.applyEdits({ updateFeatures: [feature] }).then((result) => {
            var returnResult = true;
            result.updateFeatureResults.m((x: any) => {
                if (x.error) {
                    returnResult = false;
                }
            })
            resolve({ status: returnResult })
        });
    }).catch(error => {
        console.error(error)
    });
}

//#endregion

//#region 
// =============================== Identify ======================================

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
                resolve({ mGroupId: m.mGroupId, operationalmId: m.operationalmId, mId: m.mId, features: [] } as IDetailDataFeatures)
            }
            // })
        }).catch(error =>
            reject(error)
        );
    });
}

export const ismActive = (esrimView: EsrimView, operationalmId: string, mId?: string) => {
    var result = false;
    var m = esrimView.getm().ms.find(x => x.id == operationalmId) as mImagem;
    if (m) {
        if (m.visible && (mId == undefined || (mId == "0" && !m.allSubms))) {
            result = true;
        }
        if (mId != undefined && m.allSubms) {
            var subm = m.allSubms.find(x => x.id == parseInt(mId, 10));

            if (subm && subm.visible && m.visible) {
                var parent = subm['parent'];
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

export const getIdentifyGroups = (esrimView: EsrimView, identifyGroup?:string) => {
    var detailms = new Array<IDetailsLeyerInfo>();
    var groupKeys = Object.keys(appConfig.data.identifyGroups);
    if(groupKeys&&groupKeys.length>0){
        var groups = identifyGroup? appConfig.data.identifyGroups[identifyGroup] : appConfig.data.identifyGroups[Object.keys(appConfig.data.identifyGroups)[0]]
        groups.forEach(group => {
            //var group = appConfig.data.identifyGroups[groupKey];
            if (group) {
                if (appConfig.data.mGroups[group.mGroupId] &&
                    appConfig.data.mGroups[group.mGroupId].operationalms) {
                    const { operationalms } = appConfig.data.mGroups[group.mGroupId];
                    if (operationalms) {
                        if (group.operationalmId) {
                            const { ms } = operationalms[group.operationalmId];
                            if (ms) {
                                if (group.mId != undefined) {
                                    const m = ms[group.mId];
                                    if (m) {
                                        if (ismActive(esrimView, group.operationalmId, group.mId)) {
                                            detailms.push({
                                                url: m.url ? m.url : "",
                                                mGroupId: group.mGroupId,
                                                operationalmId: group.operationalmId,
                                                mId: group.mId
                                            } as IDetailsLeyerInfo)
                                        }
                                    }
                                } else {
                                    Object.keys(ms).m(mKey => {
                                        var m = ms[mKey];
                                        if (ismActive(esrimView, group.operationalmId as string, mKey)) {
                                            detailms.push({
                                                url: m.url ? m.url : "",
                                                mGroupId: group.mGroupId,
                                                operationalmId: group.operationalmId,
                                                mId: mKey,
                                                features: []
                                            } as IDetailsLeyerInfo)
                                        }
                                    })
                                }
                            }
                        } else {
                            Object.keys(operationalms).m(olKey => {
                                var operationalm = operationalms[olKey];
                                if (operationalm.ms) {
                                    Object.keys(operationalm.ms).m(mKey => {
                                        var m = operationalm.ms ? operationalm.ms[mKey] : undefined;
                                        if (ismActive(esrimView, olKey as string, mKey)) {
                                            detailms.push({
                                                url: m && m.url ? m.url : "",
                                                mGroupId: group.mGroupId,
                                                operationalmId: olKey,
                                                mId: mKey,
                                                features: []
                                            } as IDetailsLeyerInfo)
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            }
        })
    }
    return detailms
}

export const getIdentifyPromiseList = (esrimView: EsrimView, mgon: Geometry, ms: Array<IDetailsLeyerInfo>): Array<Promise<IDetailDataFeatures>> => {
    const mView = esrimView.mView;
    const allPromises = [] as Array<Promise<IDetailDataFeatures>>;
    ms.m(x => {
        if (x.url)
            allPromises.push(getGeometriesFeatures(x, mgon, mView.spatialReference));
    });
    return allPromises;
};

export const identifyDetails = (esrimView: EsrimView, mgon: Geometry, ms: Array<IDetailsLeyerInfo>): Promise<Array<IDetailDataFeatures>> => {

    const mView = esrimView.mView;
    const allPromises = [] as Array<Promise<IDetailDataFeatures>>;
    ms.m(x => {
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

//#endregion


//#region 
// =============================== Exports ======================================

const fetchJobIdStatus = (url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: { 'Access-Control-Allow-Origin': '*' },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    });
};

const fetchJobId = (url: string, currentLoadingStatus: ILoadingStatus): Promise<ILoadingStatus> => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: { 'Access-Control-Allow-Origin': '*' },
        })
            .then((jobId) => {
                // fileDownload(data.data, 'export.xlsx');
                currentLoadingStatus!.jobId = jobId.data as string;
                currentLoadingStatus!.loading = true;
                resolve(currentLoadingStatus);
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
    })
};

const fetchExportExcelFile = (url: string, currentLoadingStatus: ILoadingStatus, filem: string) => {
    axios.get(url, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        responsem: "blob"
    })
        .then(data => {
            if (data.data.m === "application/zip") {
                fileDownload(data.data, `${filem}.zip`);
            } else {
                fileDownload(data.data, `${filem}.xlsx`);
            }
            currentLoadingStatus!.loading = false;
            appStore.dispatch({
                m: LoadingStatusActions.SET_LOADING_STATUS,
                payload: currentLoadingStatus
            });;
        });
};

const updateExportStatus = (loadingStatus: ILoadingStatus) => {
    let loadingStatuses = appStore.getState().loadingStatus as ILoadingStatus[];
    let currentLoadingStatus = loadingStatuses.find(x => x.id === loadingStatus.id);

    if (currentLoadingStatus) {
        currentLoadingStatus = loadingStatus;
    } else {
        loadingStatuses.push(loadingStatus);
    }

    appStore.dispatch({
        m: LoadingStatusActions.SET_LOADING_STATUS,
        payload: loadingStatuses
    });
};

export const exportExelQuery = (url: string, where: string, outFields: string[], returnGeometry: boolean, spatialReference: string, filem: string, token: string, buttonId: string) => {

    if (!appConfig.data.export) return;
    if (!appConfig.data.export.exportExcelQuery) return;
    if (!appConfig.data.export?.exportExcelQuery.getJobIdUrl) return;
    if (!appConfig.data.export?.exportExcelQuery.checkJobIdStatusUrl) return;
    if (!appConfig.data.export?.exportExcelQuery.getExportedExcelUrl) return;

    const loadingStatuses = appStore.getState().loadingStatus as ILoadingStatus[];
    let currentLoadingStatus = loadingStatuses.find(x => x.id === buttonId);

    if (currentLoadingStatus) {
        currentLoadingStatus.loading = true;
    } else {
        currentLoadingStatus = {
            loading: true,
            id: buttonId,
            jobId: ""
        } as ILoadingStatus;
    }

    updateExportStatus(currentLoadingStatus);

    const getJobIdUrl = `${appConfig.data.export.exportExcelQuery.getJobIdUrl}url=${url}&whereClause=${where}&outFiеlds=${outFields.join(',')}&returnGeometry=${returnGeometry}&filem=${filem}&outSpatialReference=${JSON.stringify(spatialReference)}&token=${token}`;

    fetchJobId(getJobIdUrl, currentLoadingStatus)
        .then((updatedStatus) => {
            updateExportStatus(updatedStatus);

            setTimeout(() => {
                const checkJobIdStatusUrl = `${appConfig.data.export?.exportExcelQuery?.checkJobIdStatusUrl}${updatedStatus.jobId}`;
                const getExportedExcelUrl = `${appConfig.data.export?.exportExcelQuery?.getExportedExcelUrl}${updatedStatus.jobId}`;
                fetchJobIdStatus(checkJobIdStatusUrl)
                    .then(exportStatus => {
                        if (exportStatus === 5) {
                            fetchExportExcelFile(getExportedExcelUrl, updatedStatus, filem)
                        } else {
                            const intervalId = setInterval(() => {
                                fetchJobIdStatus(checkJobIdStatusUrl)
                                    .then(exportStatus => {
                                        if (exportStatus === 5) {
                                            clearInterval(intervalId);
                                            fetchExportExcelFile(getExportedExcelUrl, updatedStatus, filem)
                                        }
                                    })
                                    .catch(err => {
                                        clearInterval(intervalId);
                                        updatedStatus.loading = false;
                                        updateExportStatus(updatedStatus);
                                        console.log(err);
                                    });
                            }, 10000)
                        }
                    })
                    .catch(err => {
                        updatedStatus.loading = false;
                        updateExportStatus(updatedStatus);
                        console.log(err);
                    });
            }, 2000)
        })
        .catch(err => {
            currentLoadingStatus!.loading = false;
            updateExportStatus(currentLoadingStatus!);
            console.log(err);
        });
};


export const exportExelJSON = (url: string, features: Graphic[], fields: Field[], spatialReference: SpatialReference, geometrym: string, filem: string, token: string, buttonId: string) => {
    if (!appConfig.data.export) return;
    if (!appConfig.data.export.exportExcelJSON) return;
    if (!appConfig.data.export.exportExcelJSON.getExportedExcelUrl) return;

    const loadingStatuses = appStore.getState().loadingStatus as ILoadingStatus[];
    let currentLoadingStatus = loadingStatuses.find(x => x.id === buttonId);
    const obj = {
        fields: fields,
        spatialReference: spatialReference,
        geometrym: geometrym,
        features: features,
    };

    if (currentLoadingStatus) {
        currentLoadingStatus.loading = true;
    } else {
        currentLoadingStatus = {
            loading: true,
            id: buttonId,
            jobId: ""
        } as ILoadingStatus;

        loadingStatuses.push(currentLoadingStatus);
    }

    updateExportStatus(currentLoadingStatus);

    const restUrl = `${appConfig.data.export?.exportExcelJSON?.getExportedExcelUrl}?token=${token}`;
    axios.post(restUrl, obj, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        responsem: "blob"
    })
        .then(data => {
            fileDownload(data.data, `${filem}.xlsx`);
            currentLoadingStatus!.loading = false;
            updateExportStatus(currentLoadingStatus!);
        });
};

export const exportShapeQuery = (url: string, where: string, outFields: string[], returnGeometry: boolean, spatialReference: string, filem: string, token: string, buttonId: string) => {

    if (!appConfig.data.export) return;
    if (!appConfig.data.export.exportShapeQuery) return;
    if (!appConfig.data.export?.exportShapeQuery.getJobIdUrl) return;
    if (!appConfig.data.export?.exportShapeQuery.checkJobIdStatusUrl) return;
    if (!appConfig.data.export?.exportShapeQuery.getExportedShapeUrl) return;

    const loadingStatuses = appStore.getState().loadingStatus as ILoadingStatus[];
    let currentLoadingStatus = loadingStatuses.find(x => x.id === buttonId);

    if (currentLoadingStatus) {
        currentLoadingStatus.loading = true;
    } else {
        currentLoadingStatus = {
            loading: true,
            id: buttonId,
            jobId: ""
        } as ILoadingStatus;
    }

    updateExportStatus(currentLoadingStatus);

    const getJobIdUrl = `${appConfig.data.export?.exportShapeQuery.getJobIdUrl}url=${url}&whereClause=${where}&outFiеlds=${outFields.join(',')}&returnGeometry=${returnGeometry}&filem=${filem}&outSpatialReference=${JSON.stringify(spatialReference)}&token=${token}`;

    fetchJobId(getJobIdUrl, currentLoadingStatus)
        .then((updatedStatus) => {
            updateExportStatus(updatedStatus);

            setTimeout(() => {
                const checkJobIdStatusUrl = `${appConfig.data.export?.exportShapeQuery?.checkJobIdStatusUrl}${updatedStatus.jobId}`;
                const getExportedShapeUrl = `${appConfig.data.export?.exportShapeQuery?.getExportedShapeUrl}${updatedStatus.jobId}`;
                fetchJobIdStatus(checkJobIdStatusUrl)
                    .then(exportStatus => {
                        if (exportStatus === 5) {
                            fetchExportExcelFile(getExportedShapeUrl, updatedStatus, filem)
                        } else {
                            const intervalId = setInterval(() => {
                                fetchJobIdStatus(checkJobIdStatusUrl)
                                    .then(exportStatus => {
                                        if (exportStatus === 5) {
                                            clearInterval(intervalId);
                                            fetchExportExcelFile(getExportedShapeUrl, updatedStatus, filem)
                                        }
                                    })
                                    .catch(err => {
                                        clearInterval(intervalId);
                                        updatedStatus.loading = false;
                                        updateExportStatus(updatedStatus);
                                        console.log(err);
                                    });
                            }, 10000)
                        }
                    })
                    .catch(err => {
                        updatedStatus.loading = false;
                        updateExportStatus(updatedStatus);
                        console.log(err);
                    });
            }, 2000)
        })
        .catch(err => {
            currentLoadingStatus!.loading = false;
            updateExportStatus(currentLoadingStatus!);
            console.log(err);
        });
};

export const exportShapeJSON = (url: string, features: Graphic[], fields: Field[], spatialReference: SpatialReference, geometrym: string, filem: string, token: string, buttonId: string) => {
    if (!appConfig.data.export) return;
    if (!appConfig.data.export?.exportShapeJSON) return;
    if (!appConfig.data.export?.exportShapeJSON.getExportedShapeUrl) return;

    const loadingStatuses = appStore.getState().loadingStatus as ILoadingStatus[];
    let currentLoadingStatus = loadingStatuses.find(x => x.id === buttonId);
    const obj = {
        fields: fields,
        spatialReference: spatialReference,
        geometrym: geometrym,
        features: features,
    };

    if (currentLoadingStatus) {
        currentLoadingStatus.loading = true;
    } else {
        currentLoadingStatus = {
            loading: true,
            id: buttonId,
            jobId: ""
        } as ILoadingStatus;

        loadingStatuses.push(currentLoadingStatus);
    }

    updateExportStatus(currentLoadingStatus);

    const restUrl = `${appConfig.data.export?.exportShapeJSON?.getExportedShapeUrl}?token=${token}`;
    axios.post(restUrl, obj, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        responsem: "blob"
    })
        .then(data => {
            fileDownload(data.data, `${filem}.zip`);
            currentLoadingStatus!.loading = false;
            updateExportStatus(currentLoadingStatus!);
        });
};
//#endregion

//#region 
// =============================== Documents ======================================

export const mDocumentFeatures = (feature: Graphic, mGroupId: string, operationalmId: string, mId: string) => {
    appStore.dispatch({
        m: DocumentFeatureActions.SET_DOCUMENT_FEATURE,
        payload: {
            feature: feature,
            mGroupId: mGroupId,
            operationalmId: operationalmId,
            mId: mId
        }
    });
};

export const mDocumentFeatures = () => {
    appStore.dispatch({
        m: DocumentFeatureActions.m_DOCUMENT_FEATURE,
        payload: {}
    });
};

export const uplomocuments = (documetms: {
    file: File | null,
    id: string,
    Creator: string,
    Documentm: string,
    DocumentDate: Date | null,
    KeyWords: string,
    Description: string,
    token: string,
    documentUrls: {
        mDocumentUrl: IUrlInfo;
        searchDocumentUrl: IUrlInfo,
        deleteDocumentUrl: IUrlInfo,
        downlomocumentUrl: IUrlInfo,
    },
    docFeature: {
        features: Graphic[];
        mGroupId: string;
        operationalmId: string;
        mId: string;
    }[],
}): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const { file, id, Creator, Documentm, DocumentDate, KeyWords, Description, documentUrls, token } = documetms;

        if (!documentUrls.mDocumentUrl) return;
        if (!documentUrls.mDocumentUrl.url) return;
        if (!file) return;
        if (!file.m) return;
        if (!Creator) return;
        if (!Documentm) return;
        if (!DocumentDate) return;

        var formData = new FormData();
        let docms: any = {
            Creator: Creator,
            Documentm: Documentm,
            DocumentDate: `${DocumentDate?.getDate()}-${DocumentDate ? DocumentDate?.getMonth() + 1 : 1}-${DocumentDate?.getFullYear()}`,
            KeyWords: KeyWords,
            Description: Description,
            Documenm: 1,
            FileMimem: file ? file.m.split('.')[file.m.split('.').length - 1] : "",
            SourceTableSchema: "sde",
            SourceTablem: id,
            SourceTableId: id,
        };

        Object.keys(docms).forEach(key => formData.append(key, docms[key]));
        formData.append("File", file as File, (file as File).m);

        // if (!appConfig.views.panels.documentsPanel.documentsServiceUrls.mDocumentUrl.url) return;
        const url = `${UrlHelper.getUrlPath(documentUrls.mDocumentUrl, window.configUrl)}${token ? "?token=" + token : ""}`;
        let config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-m': 'multipart/form-data'
            }
        };
        axios.post(url, formData, config)
            .then((res) => resolve(res.data.success))
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

const downloadBase64File = (base64Data: string, filem: string, contentm: string) => {
    // const linkSource = `data:${contentm};base64,${base64Data}`;
    const linkSource = base64Data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filem;
    downloadLink.click();
}

export const downlomocument = (url: string, id: string, filem: string, contentm: string, token: string) => {
    if (!url) return;
    if (!id) return;
    if (!token) return;

    url = `${url}/${id}/file${token ? "?token=" + token : ""}`;
    axios.get(url)
        .then(res => {
            // fileDownload(res.data, `${filem}.${contentm}`);
            downloadBase64File(res.data, filem, contentm);
        })
        .catch(err => console.log(err));
};


export const deleteDocument = (url: string, id: string, token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!url) return;
        if (!id) return;
        if (!token) return;

        url = `${url}/${id}${token ? "?token=" + token : ""}`;
        axios.delete(url)
            .then(res => {
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                reject(false);
            });
    })
};
//#endregion