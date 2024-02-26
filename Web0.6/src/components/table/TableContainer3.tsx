import * as React from 'react';
import { connect } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { Column, Row } from 'react-table';
import AttributeTableContainer from '../../../../../Lib/v0.6/src/Base/components/AttributeTable/AttributeTableContainer';
import { ITableData, } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ITableInfo';
import { getTableDataNew, returnDomains, createHeaderColumnsInfo } from '../../../../../Lib/v0.6/src/Base/components/AttributeTable/esri-table';
import Query from '@arcgis/core/tasks/support/Query';
import { ImDispatcher, ICustomPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/interfaces/dispatchers";
import { mDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/dispatchers";
import { customPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/dispatchers";
import { ImView } from '../../../../../Lib/v0.6/src/Base/interfaces/models';
import Field from '@arcgis/core/ms/support/Field';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import { IPanelTable, IAttributeTableFieldsMode, IConfigFields, ISpecificConfigmGroups, ITableSettings } from '../interfaces/IAppConfig';
import { IAppStore, IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import Geometry from '@arcgis/core/geometry/Geometry';
import Featurem from '@arcgis/core/ms/Featurem';
import { SpatialReference } from '@arcgis/core/geometry';
import ILoadingStatus from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/ILoadingStatus';
import DefaultValues from '../../../../../Lib/v0.6/src/Base/DefaultValues';

interface TableConfigms {
    query: Query;
    mId: number | string;
    attributeFieldsMode: IAttributeTableFieldsMode;
    // fields: Array<IConfigField>;
    fields: IConfigFields;
    esrifields: Array<Field>;
    geometrym: string;
    spatialReference: __esri.SpatialReference;
    // formatString: string;
    url: string;
    mGroupId: string;
    operationalmId: string;
    isExpandable: boolean;
    isSortable: boolean;
}

const initTableConfigms: TableConfigms = {
    query: new Query({
        where: "1=1",
        num: 20,
        outFields: ["*"],
        returnGeometry: true
    }),
    mId: -1,
    attributeFieldsMode: IAttributeTableFieldsMode.includeOnly,
    fields: {} as IConfigFields,
    esrifields: new Array<Field>(),
    geometrym: "",
    spatialReference: {} as SpatialReference,
    // formatString: "",
    url: "",
    mGroupId: "",
    operationalmId: "",
    isExpandable: false,
    isSortable: false,
}

interface Ownms {
    mView: ImView;
    configmGroups: ISpecificConfigmGroups;
    userInfo: IUserInfo;
    loadingStatuses: ILoadingStatus[];
}

interface Dispatchms extends ImDispatcher, ICustomPopupDispatcher {
}

interface Parentms {
    tableInfo: IPanelTable;
    tableId: string;
    tableSettings: ITableSettings;
    defaultValues: any;
}

m ms = Parentms & Ownms & Dispatchms;


const TableContainer = (ms: ms) => {

    const [mGroupTablems, setmGroupTablems] = useState({} as TableConfigms);
    const [columns, setColumns] = useState<Array<Column>>([]);
    const [data, setData] = useState<Array<ITableData>>([]);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ms.tableInfo.featureCount || 20);
    const [page, setPage] = useState(0);
    const [hiddenColumns, setHiddenColumns] = useState(new Array<string>());
    const [tableConfigmsState, setTableConfigmsState] = useState(initTableConfigms);
    const [exportsLoadingStatuses, setExportsLoadingStatuses] = useState(ms.loadingStatuses);
    const [dataLoading, setDataLoading] = useState(false);
  

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        constructData();
    }, [rowsPerPage, page, ms.configmGroups, tableConfigmsState]);

    useEffect(() => {
        setExportsLoadingStatuses(ms.loadingStatuses);
    }, [ms.loadingStatuses]);

    const init = () => {
        if (!ms.configmGroups) return;

        const tablems = constructTablems(ms.tableInfo);
        if (!Object.keys(tablems).length) return;
        if (!tablems.esrifields.length) return;
        setTableConfigmsState({ ...tablems });
    }

    const getFeaturesCount = (tablems: TableConfigms, geometry?: Geometry): Promise<number> => {
        return new Promise((resolve, reject) => {
            if (!tablems) return;
            const spatialReference = ActionsController.getmView() ? ActionsController.getmView().mView.spatialReference : new SpatialReference({ wkid: 102100 });
            let countQuery = new Query(
                {
                    where: tablems.query.where,
                    outFields: tablems.query.outFields,
                    returnGeometry: tablems.query.returnGeometry,
                    outSpatialReference: spatialReference
                }
            );
            let m = new Featurem({ url: tablems.url });
            m.queryFeatureCount(countQuery).then(countRes => {
                resolve(countRes);
            })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    };

    const constructData = (geometry?: Geometry) => {
        setDataLoading(true);
       
        if (!tableConfigmsState.url) { setDataLoading(false); return }

        tableConfigmsState.query.start = page * rowsPerPage;
        tableConfigmsState.query.num = rowsPerPage;

        if (geometry) {
            tableConfigmsState.query.geometry = geometry
        } else if (!geometry && tableConfigmsState.query.geometry) {
            Object.keys(tableConfigmsState.query.geometry).forEach(key => tableConfigmsState.query.geometry[key] = undefined);
        }

        getFeaturesCount(tableConfigmsState, geometry).then(countRes => {
            setCount(countRes);
            getTableDataNew(tableConfigmsState.url, tableConfigmsState.query)
                .then(({ result, loading, featuresCount }) => {
                    if (result && loading == "OK") {
                        if (result.fields.length > 0) {
                            let _columns = createHeaderColumnsInfo(ms.tableInfo.title ?? "Таблица", result.fields, tableConfigmsState.isSortable,
                                tableConfigmsState.isExpandable, { ...tableConfigmsState.fields }); //use tablem m, which shoul be set in the Config
                            setColumns(_columns);
                        } else {
                        }
                        if (result.features.length > 0) {
                            var fields = {}
                            result.fields.m((x) => {
                                fields[x.m] = x.alias;
                            })

                            const data = result.features.m(feature => {
                                var feat = returnDomains(feature, tableConfigmsState.esrifields);
                                return {
                                    ...feat.attributes, feature: feature, fields: fields,
                                    esrifields: tableConfigmsState.esrifields,
                                    geometry: feature.geometry, title: ms.tableInfo.title ?? "Таблица",
                                    mGroupId: tableConfigmsState.mGroupId,
                                    operationalmId: tableConfigmsState.operationalmId,
                                    mId: tableConfigmsState.mId,
                                    url: tableConfigmsState.url,
                                    geometrym: tableConfigmsState.geometrym,
                                    spatialReference: tableConfigmsState.spatialReference,
                                }
                            });
                            setData(data);
                            setDataLoading(false);
                        }
                    }
                });
        });
    };

    const renderRowSubComponent = useCallback(
        (row: Row<object>) => {
            const subRowContent = row.original;
            const keys = Object.keys(subRowContent);
            return (
                <div>
                    {JSON.stringify(subRowContent)}
                </div>
            )
        },
        []
    );
    const onmPage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    }

    const onmRowsPerPage = (ev: any) => {
        setRowsPerPage(ev.target.value);
        setPage(0);
    }

    const handleDetailsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: Row) => {
        console.log(row);
        if (event.target["id"].includes("table-row-btn")) return;
        const tableId = `panels/attributeTablePanel/${ms.tableId}`;
        ActionsController.trigger(tableId, [{
            features: [row.original['feature']],
            mGroupId: row.original["mGroupId"],
            operationalmId: row.original["operationalmId"],
            mId: row.original["mId"]
        }]);
    };

    const getTablemsFrommGroup = () => {
        const spatialReference = ActionsController.getmView() ? ActionsController.getmView().mView.spatialReference : new SpatialReference({ wkid: 102100 });
        let resultms = {} as TableConfigms;
        const mGroup = ms.configmGroups[ms.tableInfo.mGroupId];

        if (!mGroup) return;
        const { operationalms } = mGroup;

        if (!operationalms) return;
        if (!operationalms[ms.tableInfo.operationalmId]) return;
        const opl = operationalms[ms.tableInfo.operationalmId];
        if (!opl.ms) return;
        const { ms } = opl;
        if (!ms[ms.tableInfo.mId]) return;
        const m = ms[ms.tableInfo.mId];
        if (!m["url"]) return;
        let url = `${m.url}${ms.userInfo && ms.userInfo.token ? `?token=${ms.userInfo.token}` : ''}`;
        return resultms = {
            query: new Query({
                where: m.whereClause ? m.whereClause : ms.defaultValues.whereClause,
                returnGeometry: m.returnGeometry !== undefined ? m.returnGeometry : ms.defaultValues.returnGeometry,
                outSpatialReference: spatialReference,
                geometry: undefined
            }),
            attributeFieldsMode: IAttributeTableFieldsMode.includeOnly, // This should be discussed and md
            fields: m.fields ? m.fields : {},
            esrifields: m.esrifields && m.esrifields.length ? m.esrifields : [],
            url: url,
            mGroupId: ms.tableInfo.mGroupId,
            operationalmId: ms.tableInfo.operationalmId,
            mId: ms.tableInfo.mId,
            geometrym: m.geometrym,
            spatialReference: m.spatialReference,
            isExpandable: false,
            isSortable: false,
        };
    };

    const getTablemsFromAttributeTablePanel = (mGroupTablems: TableConfigms) => {
        let resultms = {} as TableConfigms;
        if (!mGroupTablems.url) return resultms;
        const spatialReference = ActionsController.getmView() ? ActionsController.getmView().mView.spatialReference : new SpatialReference({ wkid: 102100 });
        resultms = {
            query: new Query({
                where: ms.tableInfo.whereClause ? ms.tableInfo.whereClause : mGroupTablems.query.where ? mGroupTablems.query.where : ms.defaultValues.whereClause,
                outFields: mGroupTablems.query.outFields ? mGroupTablems.query.outFields : ms.defaultValues.outFields,
                num: ms.tableInfo.featureCount ? ms.tableInfo.featureCount : mGroupTablems.query.num ? mGroupTablems.query.num : ms.defaultValues.featureCount,
                returnGeometry: ms.tableInfo.returnGeometry !== undefined ? ms.tableInfo.returnGeometry : mGroupTablems.query.returnGeometry ? mGroupTablems.query.returnGeometry : ms.defaultValues.returnGeometry,
                orderByFields: ms.tableInfo.orderByFields ? ms.tableInfo.orderByFields : mGroupTablems.query.orderByFields ? mGroupTablems.query.orderByFields : ms.defaultValues.orderByFields,
                outSpatialReference: spatialReference,
                geometry: undefined
            }),
            attributeFieldsMode: IAttributeTableFieldsMode.includeOnly, // This should be discussed and md
            fields: ms.tableInfo.fields ? ms.tableInfo.fields : mGroupTablems.fields,
            url: mGroupTablems.url,
            mGroupId: ms.tableInfo.mGroupId,
            operationalmId: ms.tableInfo.operationalmId,
            mId: ms.tableInfo.mId,
            geometrym: mGroupTablems.geometrym,
            esrifields: mGroupTablems.esrifields,
            spatialReference: mGroupTablems.spatialReference,
            isExpandable: ms.tableInfo.isExpandable || DefaultValues.config.views.panels.attributeTablePanel.isExpandable,
            isSortable: ms.tableInfo.isSortable || DefaultValues.config.views.panels.attributeTablePanel.isSortable
        };

        return resultms;
    };

    // const mergeAttributeTablePanelmsAndmgroupms = () => {

    // };

    const constructTablems = (mm: IPanelTable): TableConfigms => {
        let resultms = {} as TableConfigms;
        const mGroupTablems: TableConfigms | undefined = getTablemsFrommGroup();
        if (!mGroupTablems) return resultms;
        resultms = getTablemsFromAttributeTablePanel(mGroupTablems);
        setmGroupTablems(mGroupTablems);

        return resultms;
    };

    const refreshTableHandler = () => {
        constructData();
    };

    const refreshTablemHandler = () => {
        constructData(ActionsController.getmView().getExtent());
    };


    const exportExcelQueryHandler = () => {
        let buttonId = `panels/attributeTablePanel/${ms.tableId}/exportExcelQueryButton`;
        const indexToken = tableConfigmsState.url.indexOf("?token");
        const newUrl = tableConfigmsState.url.substr(0, indexToken);

        const obj = {
            url: newUrl,
            where: tableConfigmsState.query.where ? tableConfigmsState.query.where : '1=1',
            outFields: tableConfigmsState.query.outFields ? tableConfigmsState.query.outFields : ['*'],
            returnGeometry: tableConfigmsState.query.returnGeometry ? tableConfigmsState.query.returnGeometry : true,
            filem: 'ExcelExport',
            spatialReference: tableConfigmsState.spatialReference ? tableConfigmsState.spatialReference : "",
            buttonId: buttonId,
            token: ms.userInfo.token
        };
        ActionsController.trigger(buttonId, obj);
    };

    const exportExcelJsonHandler = () => {
        // setLoadingExport(true);
        let buttonId = `panels/attributeTablePanel/${ms.tableId}/exportExcelJsonButton`;
        const indexToken = tableConfigmsState.url.indexOf("?token");
        const newUrl = tableConfigmsState.url.substr(0, indexToken);

        const obj = {
            url: newUrl,
            fields: tableConfigmsState.esrifields,
            spatialReference: tableConfigmsState.spatialReference,
            geometrym: tableConfigmsState.geometrym,
            features: data.m(x => { return { attributes: x.feature["attributes"], geometry: x.feature["geometry"] } }),
            buttonId: buttonId,
            filem: 'ExcelExport',
            token: ms.userInfo.token,
        };
        ActionsController.trigger(buttonId, obj);
    };

    const exportShapeQueryHandler = () => {
        let buttonId = `panels/attributeTablePanel/${ms.tableId}/exportShapeQueryButton`;
        const indexToken = tableConfigmsState.url.indexOf("?token");
        const newUrl = tableConfigmsState.url.substr(0, indexToken);

        const obj = {
            url: newUrl,
            where: tableConfigmsState.query.where ? tableConfigmsState.query.where : '1=1',
            outFields: tableConfigmsState.query.outFields ? tableConfigmsState.query.outFields : ['*'],
            returnGeometry: tableConfigmsState.query.returnGeometry ? tableConfigmsState.query.returnGeometry : true,
            filem: 'ShapeExport',
            spatialReference: tableConfigmsState.spatialReference ? tableConfigmsState.spatialReference : "",
            buttonId: buttonId,
            token: ms.userInfo.token
        };
        ActionsController.trigger(buttonId, obj);
    };

    const exportShapeJsonHandler = () => {
        // setLoadingExport(true);
        let buttonId = `panels/attributeTablePanel/${ms.tableId}/exportShapeJsonButton`;
        const indexToken = tableConfigmsState.url.indexOf("?token");
        const newUrl = tableConfigmsState.url.substr(0, indexToken);

        const obj = {
            url: newUrl,
            fields: tableConfigmsState.esrifields,
            spatialReference: tableConfigmsState.spatialReference,
            geometrym: tableConfigmsState.geometrym,
            features: data.m(x => { return { attributes: x.feature["attributes"], geometry: x.feature["geometry"] } }),
            buttonId: buttonId,
            filem: 'ShapeExport',
            token: ms.userInfo.token,
        };
        ActionsController.trigger(buttonId, obj);
    };

    const toggleOrderByField = (field: string) => {
        let orderByFieldsTemp = [...tableConfigmsState.query.orderByFields];

        if (orderByFieldsTemp.indexOf(`${field} DESC`) != -1) {
            orderByFieldsTemp = orderByFieldsTemp.filter(x => x != `${field} DESC`);
            orderByFieldsTemp.push(`${field} ASC`);
        } else if (orderByFieldsTemp.indexOf(`${field} ASC`) != -1) {
            orderByFieldsTemp = orderByFieldsTemp.filter(x => x != `${field} ASC`);
        } else {
            orderByFieldsTemp.push(`${field} DESC`);
        }

        let temp = { ...tableConfigmsState };
        temp.query.orderByFields = orderByFieldsTemp;
        setTableConfigmsState(temp);
    };

    return (
        <>
            <AttributeTableContainer
                tableId={ms.tableId}
                dataLoading={dataLoading}
                columns={columns}
                fieldsInfo={[]}
                data={data}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                isSortable={ms.tableInfo.isSortable}
                orderByFields={tableConfigmsState.query.orderByFields}
                toggleOrderByField={toggleOrderByField}
                renderNoDataMessage={() => <>{""}</>}
                hiddenColumns={hiddenColumns}
                renderRowSubComponent={ms.tableInfo.isExpandable ? renderRowSubComponent : undefined}
                onmPage={onmPage}
                onmRowsPerPage={onmRowsPerPage}
                rowClickHandler={handleDetailsClick} //handleRowClick(m)
                containerStyles={{ height: '100%' }}
                // rowButtonComponents={[<ZoomToFeature key={"zoomToFeature"} />, <DetailsOfFeature key={"detailsOfFeature"} />]}
                rowButtonComponents={ms.tableInfo.tableButtons}
                dataResponsiveColumnSize={true}

                ofText={ms.tableSettings.ofText ? ms.tableSettings.ofText : ms.defaultValues.tableSettings.ofText}
                pageText={ms.tableSettings.pageText ? ms.tableSettings.pageText : ms.defaultValues.tableSettings.pageText}
                rowsText={ms.tableSettings.rowsText ? ms.tableSettings.rowsText : ms.defaultValues.tableSettings.rowsText}
                labelRowsPerPage={ms.tableSettings.labelRowsPerPage ? ms.tableSettings.labelRowsPerPage : ms.defaultValues.tableSettings.labelRowsPerPage}
                nextIconButtonText={ms.tableSettings.nextIconButtonText ? ms.tableSettings.nextIconButtonText : ms.defaultValues.tableSettings.nextIconButtonText}
                backIconButtonText={ms.tableSettings.backIconButtonText ? ms.tableSettings.backIconButtonText : ms.defaultValues.tableSettings.backIconButtonText}
                refreshButton={ms.tableInfo.refreshButton}
                mRefreshButton={ms.tableInfo.mButton}
                refreshTable={refreshTableHandler}
                refreshTableExtent={refreshTablemHandler}
                exportExcelJsonButton={ms.tableInfo.exportExcelJsonButton ? { ...ms.tableInfo.exportExcelJsonButton, id: `panels/attributeTablePanel/${ms.tableId}/exportExcelJsonButton` } : ms.tableInfo.exportExcelJsonButton}
                exportExcelQueryButton={ms.tableInfo.exportExcelQueryButton ? { ...ms.tableInfo.exportExcelQueryButton, id: `panels/attributeTablePanel/${ms.tableId}/exportExcelQueryButton` } : ms.tableInfo.exportExcelQueryButton}
                exportShapeJsonButton={ms.tableInfo.exportShapeJsonButton ? { ...ms.tableInfo.exportShapeJsonButton, id: `panels/attributeTablePanel/${ms.tableId}/exportShapeJsonButton` } : ms.tableInfo.exportShapeJsonButton}
                exportShapeQueryButton={ms.tableInfo.exportShapeQueryButton ? { ...ms.tableInfo.exportShapeQueryButton, id: `panels/attributeTablePanel/${ms.tableId}/exportShapeQueryButton` } : ms.tableInfo.exportShapeQueryButton}
                exportsLoadingStatuses={exportsLoadingStatuses}
                // loadingExport={loadingExport}
                exportExcelJsonHandler={exportExcelJsonHandler}
                exportExcelQueryHandler={exportExcelQueryHandler}
                exportShapeJsonHandler={exportShapeJsonHandler}
                exportShapeQueryHandler={exportShapeQueryHandler}
            />

        </>
    )
}
const mStateToms = (state: IAppStore) => {
    return ({
        mView: state.m.mView,
        configmGroups: state.configObject.configmGroups,
        userInfo: state.userInfo,
        loadingStatuses: state.loadingStatus
    })
};
export default connect<Ownms, Dispatchms>((state: IAppStore) => mStateToms(state), {
    ...mDispatcher, ...customPopupDispatcher
})(TableContainer);
