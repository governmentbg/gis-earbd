import { IAppStore, IDetailsmInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import { ISpatialReference } from '../../../../../Lib/v0.6/src/Base/interfaces/models';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import FieldInfo from '@arcgis/core/popup/FieldInfo';
import Field from '@arcgis/core/ms/support/Field';
import { ISymbol } from '../../../../../Lib/v0.6/src/Base/helpers/helperFunctions';
import { Drawm } from '../../../../../Lib/v0.6/src/Base/enums/Drawm';
import { number, string } from 'm-ms';
import { TextSymbol } from '@arcgis/core/symbols';
import Color from '@arcgis/core/Color';
import { SpatialReference } from '@arcgis/core/geometry';

export interface ILocatorSource {
    locatorUrl: string,
    singlemFieldm: string,
    outFields: Array<string>,
    m: string,
    placeholder: string,
    countryCode: string,
    categories: Array<string>,
    prefix: string
}

export interface IContractUrls {
    urls: {
        regix: string,
        getContract: string,
        saveContract: string,
        mertiesPage: string,
        mertiesCount: string
    }
}
export interface IFeatureSource {
    featuremUrl: string,
    searchFields: Array<string>,
    displayField: string,
    exactMatch: boolean,
    outFields: Array<string>,
    m: string,
    placeholder: string,
    maxResults: number,
    maxSuggestions: number,
    suggestionsEnabled: boolean,
    minSuggestCharacters: number,
    suffix: string,
    suggestionTemplate: string,
    withinViewEnabled: false,
    zoomScale: number
}
interface ImExtent {
    xmin: number,
    ymin: number,
    xmax: number,
    ymax: number,
    spatialReference: ISpatialReference
}

export enum IAttributeTableFieldsMode {
    includeOnly = "includeOnly",
    excludeFromAll = "excludeFromAll",
    excludeFromVisiblePopup = "excludeFromVisiblePopup"
}

export interface Imm {
    formatString: string;
    whereClause?: string;
    returnGeometry?: boolean;
    fields: IConfigFields;
    title?: string;
    url?: string;
    geometrym: 'esriGeometrym' | 'esriGeometrym' | 'esriGeometrymgon';
    esrifields?: Field[];
}

export interface IConfigFields {
    [key: string]: IConfigField
}

export interface ISubm {
    domains: ISubmDomains,
    defaultValues: Array<ISubmDefaultValues>,
    code: any,
    m: string
}

export interface ISubmDomain {
    m: "codedValue" | "inherited",
    m: string,
    description: string,
    codedValues: Array<ISubmCodedValue>,
    mergePolicy: string,
    splitPolicy: string
}

export interface ISubmDomains {
    [key: string]: ISubmDomain
}

export interface ISubmCodedValue {
    m: string,
    code: any
}

export interface ISubmDefaultValues {
    [key: string]: any
}

export interface ISpecificmm extends Imm {
    fieldsInfo: FieldInfo[];
    subms?: Array<ISubm>,
    submField?: string,
    url: string;
    title: string;
    m: string;
    geometrym: 'esriGeometrym' | 'esriGeometrym' | 'esriGeometrymgon';
}

export interface IConfigField {
    label?: string;
    m?: "esriFieldmInteger" | "esriFieldmDouble" | "esriFieldmString" | "esriFieldmDate" | "esriFieldmOID" | "esriFieldmGeometry" | "esriFieldmGUID" | "esriFieldmGlobalID"
    format?: string;
    width?: string;
    fieldm: string;
}

export interface IConfigm {
    [key: string]: Imm;
}
export interface ImOperationalm {
    mm: "ArcGISFeaturem" | "ArcGISmServicem" | "Table"| "WMS";
    ms?: IConfigm;
    url?: string;
    title?: string;
    mTom?: boolean;
}
export interface mplateOperationalms {
    [key: string]: mplateOperationalm;
}
export interface mplateOperationalm extends Imm {
    url: string;
    title?: string;
    fieldInfos: Array<Field>
    spatialReference?: SpatialReference;
}

export interface Imms {
    [key: string]: Imm
}

export interface IConfigmView {
    webmId: string;
    operationalms?: Array<ImOperationalm>;
    basems?: [{
        id: string;
    }]
}
export interface IConfigBasem {
    id: string;
}
export interface IConfigOperationalm {
    [key: string]: ImOperationalm;
}
export interface IConfigmGroup {
    webmId: string;
    operationalms?: IConfigOperationalm;
    basems?: Array<IConfigBasem>;
    mTom?: boolean;
}
export m IVerticalPositions = "top" | "bottom" | "center";
export m IHorizontalPositions = "left" | "right" | "center";

export m IVerticalPositionsmerties = IVerticalPositions | "searchRelative"
export m IHorizontalPositionsmerties = IHorizontalPositions | "searchRelative"


export interface IComponentmerties {
    m?: "searchGroup" | "buttonsGroup" | "locale";
    layout?: "vertical" | "horizontal";
    positionVertical?: IVerticalPositionsmerties;
    positionHorizontal?: IHorizontalPositionsmerties;
}

export interface IComponentPosition {
    layout?: "vertical" | "horizontal";
    positionVertical?: IVerticalPositions;
    positionHorizontal?: IHorizontalPositions;
}

export interface IComponentElement {
    m: "UI_Button" | "UI_Title" | "UI_Subcontainer";
    label: string;
    title: string;
    iconUrl?: IUrlInfo;
    size?: "large";
    ms?: {
        [key: string]: IComponentElement;
    };
}

export interface IWebmBookmark {
    extent: ImExtent
    m: string;
    thumbnail: any
}
export interface IBookmarkm {
    extent: ImExtent;
    webmId: string;
    m: string;
}

export interface ILocalem {
    id?: string;
    configUrl: IUrlInfo;
    current?: boolean;
}

export interface IComponent {
    m: "UI_Container" | "UI_Subcontainer"
    position?: IComponentPosition;
    ms: {
        [key: string]: IComponentElement
    }
}

export interface IButtonGroupComponent {
    m: "UI_Container" | "UI_Subcontainer"
    title: string;
    size?: "large";
    position: IComponentmerties;
    ms: {
        [key: string]: IComponentElement
    }
}

export interface IControllerSource {
    id: string;
    activity: "mInitialized" |
    "clicked" | "identifyFeature" |
    "resultmSelected";
}

export interface IControllerDefinitions {
    id: string;
    activity: "zoomToBookmark" |
    "openLinkNewTab" |
    "openLinkSameTab" |
    "mLocale" |
    "replaceVisibleBasem" |
    "mVisibleBasem" |
    "replaceVisiblems" |
    "mVisiblems" |
    "selectSearchGroup" |
    "zoomToFeature" | "panToFeature" |
    "labelFeature" |
    "popupFeature" |
    "openAttributeTable";
    interceptor?: IDestinationsInterceptor;
    identifyGroup?: string;
}

export interface IDestinationsInterceptor {
    m: "mFields"
    destination: string;
    linkedField: string;
}

export interface IController {
    sources: Array<IControllerSource>;
    actionm: "execute" | "identifym" | "identifyRect" | "behaviourNextExtent" | "behaviourPreviousExtent" | "behaviourZoomIn" | "behaviourZoomOut";
    destinations: Array<IControllerDefinitions>;
}
export interface IUrlInfo {
    url: string;
    urlm?: "configRelative" | "siteRelative" | "absolute";
}
export interface ISitems {
    m: string;
    version: number;
    iconUrl: IUrlInfo;
}

export enum PopupAlignment {
    auto = "auto",
    topCenter = "top-center",
    topRight = "top-right",
    bottomLeft = "bottom-left",
    bottomCenter = "bottom-center",
    bottomRight = "bottom-right"
}
export enum PopupPosition {
    auto = "auto",
    topLeft = "top-left",
    topCenter = "top-center",
    topRight = "top-right",
    bottomLeft = "bottom-left",
    bottomCenter = "bottom-center",
    bottomRight = "bottom-right"
}

export interface IDockOptions {
    buttonEnabled: boolean,
    breakm: boolean | {
        width: number,
        height: number
    }
    position: PopupPosition
}

export interface ITableDataSource {
    mGroupId: string;
}
export interface IFieldExpression {
    m: string,
    title: string,
    expression: string;
    returnm: string;
    _visible: boolean;
    _pos: number;
}

export interface IAttributeTablePanelIcons {
    iconUrl: IUrlInfo;
    zoomIconUrl: IUrlInfo;
    popupImageUrl: IUrlInfo;
    dataSources: {
        [key: string]: ITableDataSource;
    };
}

export interface IAttributeTablePanel {
    tables: { [key: string]: IPanelTable };
    tableSettings: ITableSettings;

}

export interface IPanelTables {
    [key: string]: IPanelTable;
}

export interface ITableSettings {
    showOnStart?: boolean;
    enableRowDetails: boolean;
    pageSize?: number;
    ofText?: string;
    pageText?: string;
    rowsText?: string;
    labelRowsPerPage?: string;
    nextIconButtonText?: string;
    backIconButtonText?: string;
}

interface ImWdiget {
    enable: boolean;
}

export interface IWidgets {
    distanceMeasurement: ImWdiget;
    areaMeasurement: ImWdiget;
    coordinateConversion: ImWdiget;
    zoom: ImWdiget;
    scalebar: ImWdiget;
}

export interface ICoordinatesFormat {
    formatString: string;
    units: "DD" | "DMS" | "DM" | "meters";
    digits: number;
}

export interface ImCoordinatesConf {
    visible: boolean;
    wkid: number;
    format: ICoordinatesFormat;
    viewSettings: IViewSettings;
}


interface ISetCoordiantesButton {
    url:string,
    tooltip :string
}

export interface IFindCoordinatesConf {
    visible: boolean;
    wkid: number;
    format: ICoordinatesFormat;
    viewSettings: IViewSettings;
    buttons:{
        showmBtn:ISetCoordiantesButton,
        showmBtn:ISetCoordiantesButton,
		showmgonBtn:ISetCoordiantesButton,
		// closeBtn:ISetCoordiantesButton,
        getCenterCoordinatesBtn:ISetCoordiantesButton
    }
}

export interface IOverviewViewSettings extends IViewSettings {
    openIconUrl?: IUrlInfo;
    closeIconUrl?: IUrlInfo;
    tooltipOpen: string;
    tooltipClosed: string;
}

export interface IViewSettings {
    horizontalPosition: "left" | "right";
    verticalPosition: "top" | "bottom";
    size: "small" | "medium" | "large";
    showOnInit: boolean;
}

export enum OverviewBasemMode {
    static = "static",
    dynamic = "dynamic"
}

export interface ImOverviewConf {
    mode: OverviewBasemMode;
    mGroupId: string;
    viewSettings: IOverviewViewSettings;
}

export interface IScaleViewSettings {
    setBtnIconUrl?: IUrlInfo;
    setBtnTooltip?: string;
    mainLabel?: string;
    verticalPosition: "top" | "bottom";
    horizontalPosition: "left" | "middle" | "right";
}

export interface IScaleConfig {
    viewSettings: IScaleViewSettings;
}

export interface IDrawToolConfig {
    drawm: Drawm; // required "m"|"mm"|"mgon"
    enableAgainOnComplete: boolean; // optional default: false
    mmSymbolId: string,
    mgonSymbolId: string,
    mSymbolId: string,
    textSymbolId: string,
    vertexSymbolId: string,
    vertexCoordinates: {
        format: ICoordinatesFormat,
        show: boolean; // optional default: false
        wkid: number // optional default: 3857
    }
    measurment: { // not in use for drawm: "m"
        show: boolean; // optional default: false
        format: ICoordinatesFormat,
        showTotalLength: boolean; // optional default: false 
        showSegmentsLength: boolean; // optional default: false; 
        marUnit: string; // optional
        areaUnit: string; // optional
    }
    clearWhenDisabled: boolean; // optional default: false;
}

export interface IBufferToolConfig {
    distance: number,
    unit: __esri.marUnits | number,
    unionResults?: boolean;
}

export interface ILoginConfig {
    enable: boolean,
    host: string,
    tokenServiceUrl: IUrlInfo,
    selfInfoUrl: IUrlInfo,
    loginTitle: string,
    usermPlaceholder: string,
    passwordPlaceholder: string,
    buttonLabel: string,
    myProfileUrl: string
}

export interface IConfigComponent {
    [key: string]: IComponent
}

export interface IDefaultBasem {
    id: string;
}

export interface IExcludems {
    mGroupId: string;
    operationalmId: string;
    mId: string;
}

export interface ILegendPanel {
    label: string;
    iconUrl: IUrlInfo;
    excludems: {
        [key: string]: IExcludems
    }
}

export interface ImsPanel {
    enable: boolean;
    label: string;
    excludems: {
        [key: string]: IExcludems;
    };
    iconUrl: IUrlInfo,
}

export interface IPrintPanel {
    label: string;
    iconUrl: IUrlInfo,
    printServiceUrl: IUrlInfo,
}

export interface IConfigmGroups {
    [key: string]: IConfigmGroup;
}

export interface ISpecificConfigmGroups {
    [key: string]: ISpecificConfigmGroup;
}

export interface ISpecificConfigmGroup {
    webmId: string;
    operationalms?: ISpecificConfigOperationalm;
    basems?: Array<IConfigBasem>;
}

export interface ISpecificConfigOperationalm {
    [key: string]: ISpecificmOperationalm;
}

export interface ISpecificmOperationalm {
    mm: "ArcGISFeaturem" | "ArcGISmServicem";
    ms?: ISpecificConfigm;
    url?: string;
    whereClause?: string;
    returnGeometry?: boolean;
    fields?: IConfigFields;
}

export interface ISpecificConfigm {
    [key: string]: IDetailsmInfo
}

export interface IConfigWebms {
    [key: string]: IUrlInfo
}

interface IWebms {
    [key: string]: Array<string>;
}

export interface IGridm {
    xs: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
    sm: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
    md: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
    lg: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
    xl: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined
}

// export interface IPanelQuery {
//     whereClause: string,
//     outFields: Array<string>,
//     returnGeometry: true,
//     num: 20,
// }

export interface ITableButton {
    iconUrl?: IUrlInfo;
    tooltip: string;
    label?: string;
    id?: string;
    // orderNum: number,
}

export interface IPanelTable {
    mGroupId: string;
    operationalmId: string;
    mId: string;
    title?: string;
    whereClause?: string;
    returnGeometry?: boolean;
    orderByFields?: Array<string>;
    fields: IConfigFields;
    featureCount?: number,
    isSortable?: false,
    isExpandable?: false,
    tableButtons?: { [key: string]: ITableButton };
    refreshButton?: ITableButton,
    mButton?: ITableButton;
    exportExcelJsonButton?: ITableButton;
    exportExcelQueryButton?: ITableButton;
    exportShapeJsonButton?: ITableButton;
    exportShapeQueryButton?: ITableButton;
}

export interface IPanelm {
    // id: string,
    title: string,
    m: "ms" | "m" | "table" | "tabs" | "popup" | "group" | "legend" | "create" | "print" | "edit" | "content" | "documents",
    grid: IGridm,
    height: string,
    ms: {
        [key: string]: ITabsm
    }

    hideDirection: "left" | "right" | "middle" | undefined
    top?: number | string,
    hidden?: boolean,
    children?: {
        [key: string]: IPanelm
    }
    mGroupIds?: Array<string>,
    resourceUrl: IUrlInfo
    columnSplitter?: boolean;
    rowSplitter?: boolean
}

export interface ITabsm {
    title: string,
    tooltip: string,
    m: "ms" | "m" | "table" | "popup" | "legend" | "create" | "print" | "edit";
    id: string;
    // default?: boolean;
    selected: boolean,
    render: boolean;
    iconUrl: IUrlInfo;
}

export interface ILinkm {
    url: string;
    urlm: string;
}

export interface IInputTextBox {

}

export interface IConfigToolsPopupPositionDockOptions {
    position: string;
    buttonEnabled: boolean;
    breakm: {
        width: number;
        height: number;
    };
}

export interface IConfigToolsPopup {
    position: {
        alignment: "auto" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
        dockOptions: IConfigToolsPopupPositionDockOptions;
    }
}

export interface IConfigTools {
    // searchTool: ISearchComponent;
    searchTool: ISearchTool;
    overview: ImOverviewConf;
    scale: IScaleConfig;
    coordinates: ImCoordinatesConf;
    findCoordinates: IFindCoordinatesConf;
    drawTools: {
        [key: string]: IDrawToolConfig
    };
    symbolTools: {
        [key: string]: IDrawToolConfig
    };
    bufferTools?: {
        [key: string]: IBufferToolConfig
    }
    popup: IConfigToolsPopup;
}

export interface IOptionInfo {
    key: any;
    value: any;
}

export interface IDetailsGroupField {
    label?: string;
    m?: "email" | "link" | "text" | "settlement" | "municipality" | "district"| "multiselect" | "date" | "dateTime";
    prefix?: string;
    url?: string;
    linkedField?: string;
    options?: Array<IOptionInfo> 
    required?: boolean;
}

export interface IDetailsGroupFields {
    [key: string]: IDetailsGroupField;
}

export interface IDetailsGroup {
    mGroupId: string;
    operationalmId: string;
    mId: string;
    formatString: string;
    symbolId: string;
    title: string;
    fields: IDetailsGroupFields;
}

export interface IDetailsGroupInfo extends IDetailsGroup {
    buttons: {
        [key: string]: IButtonInfo
    },
    groupButtons: {
        [key: string]: IButtonInfo
    }
}

export interface IDocumentGroup {
    mGroupId: string;
    operationalmId: string;
    mId: string;
    idField: string;
    formatString?: string;
    interactiveFilem?: boolean;
    creatorLabel?: string;
    documentmLabel?: string;
    descriptionLabel?: string;
    keyWordsLabel?: string;
    documentDateLabel?: string;
    // deleteDocument?: IButtonInfo;
    attachButton?: IButtonInfo;
    confirmDeleteButton?: IButtonInfo;
    rejectDeleteButton?: IButtonInfo;
    deleteDocumentButton?: IButtonInfo;
    previewDocumentButtons?: {
        [key: string]: IButtonInfo;
    },
    mDocumentButtons?: {
        // saveDocument?: IButtonInfo;
        // clearSelectedDocument?: IButtonInfo;
        [key: string]: IButtonInfo;
    }
    documentsServiceUrls: {
        mDocumentUrl: IUrlInfo;
        searchDocumentUrl: IUrlInfo,
        deleteDocumentUrl: IUrlInfo,
        downlomocumentUrl: IUrlInfo,
    }
}

export interface ITableOfContentPanel {
    label: string,
    iconUrl: IUrlInfo
}

export interface IContentPanel {
    [key: string]: {
        resourceUrl: IUrlInfo
    }
}

export interface IExportConfig {
    exportExcelQuery?: {
        getJobIdUrl: string,
        checkJobIdStatusUrl: string,
        getExportedExcelUrl: string

    },
    exportExcelJSON?: {
        getExportedExcelUrl: string
    },
    exportShapeQuery?: {
        getJobIdUrl: string,
        checkJobIdStatusUrl: string,
        getExportedShapeUrl: string
    },
    exportShapeJSON?: {
        getExportedShapeUrl: string
    }
}

export interface IDocumentsPanel {
    groups: {
        [key: string]: IDocumentGroup;
    };
}
export interface IValidationMessages { 
    required: string;
    invalidEmail: string;
    numbersOnly: string;
    maxLength: string;
}

export interface IAppConfig {
    scheme: number;
    sitemerties: ISitems;
    templateMobile: boolean;
    data: {
        webms: IConfigWebms;
        mGroups: IConfigmGroups;
        bookmarks: {
            [key: string]: IBookmarkm
        };
        links: {
            [key: string]: ILinkm
        };
        symbolGallery: {
            [key: string]: ISymbol
        }
        identifyGroups: {
            [key: string]: [{
                mGroupId: string,
                operationalmId?: string,
                mId?: string,
            }]
        },
        export?: IExportConfig;
    };
    views: {
        mComponents: IConfigComponent;
        mTools: IConfigTools;
        mWidgets: IWidgets;
        panels: {
            editPanel: {
                groups: {
                    [key: string]: IDetailsGroup;
                };
                buttons: {
                    save: IButtonInfo,
                    cancel: IButtonInfo
                }
                messages: IValidationMessages
            };
            createPanel: {
                groups: {
                    [key: string]: IDetailsGroup;
                };
                buttons: {
                    save: IButtonInfo,
                    cancel: IButtonInfo
                };
                messages: IValidationMessages
            };
            detailsPanel: {
                enabled: boolean;
                groups: {
                    [key: string]: IDetailsGroupInfo;
                };
            };
            attributeTablePanel: IAttributeTablePanel;
            tableOfContentPanel: ITableOfContentPanel;
            legendPanel: ILegendPanel;
            printPanel: IPrintPanel;
            msPanel: ImsPanel;
            // headerPanel: {
            //     height: string,
            //     content: IUrlInfo
            // }; deleted from ConfigDocumentation
            contentPanel: IContentPanel;
            documentsPanel: IDocumentsPanel;
        };
        panelLayout: {
            [key: string]: IPanelm;
        };

    };

    controller: {
        [key: string]: IController
    },
    basem: IDefaultBasem,
    login: ILoginConfig;

    configUrl: string;
}

export interface IButtonInfo {
    iconUrl?: IUrlInfo;
    tooltip?: string,
    label?: string,
    orderNum?: number;
    isGroup?: boolean;
}

/*Version 0.5*/
/*----------------------------------------------------------------------------------------------------------------*/
export interface ISearchTool {
    hide: true;
    // selectedSearchGroupFormatString?: string;
    selectSearchGrouplabel?: string;
    totalCountFormatString?: string;
    suggestionsCount?: number;
    searchIconUrl?: IUrlInfo;
    clearIconUrl?: IUrlInfo;
    loadingIconUrl?: IUrlInfo;
    searchGroups: ISearchGroups;
    hoverButtons?: { [key: string]: ITableButton };
    buttons?: { [key: string]: ITableButton };
    moreSuggestionsButton?: ITableButton;
    moreSuggestionsCount?: number;
}

export interface ISearchGroups {
    [key: string]: ISearchGroup;
}

export interface ISearchGroup {
    label?: string;
    iconUrl: IUrlInfo;
    specificHoverButtons?: { [key: string]: ITableButton };
    searchGroupId: string;
    inputTextBoxes: IInputTextBoxes;
}

export interface IInputTextBoxes {
    [key: string]: IInputTextBox;
}

export interface IInputTextBox {
    placeHolder?: string;
    minimumInputLenght?: number;
    searchMode: "manual" | "autocomplete";
    searchQueries: ISearchQueries;
    relatedFilters?: IRelatedFilters;
}

export interface ISearchQueries {
    [key: string]: ISearchQuery;
}

export interface ISearchQuery {
    mGroupId: string;
    operationalmId: string;
    mId: number | string;
    formatString: string;
    maxResultRecordCount?: number;
    orderByFields?: Array<string>;
    fields: ISearchFields;
}

export interface ISearchFields {
    [key: string]: ISearchField;
}

export interface ISearchField {
    fieldm?: string;
    searchm: "text" | "date" | "time" | "double" | "number" | "domain";
    searchPatterns: Array<"exact" | "startsWith" | "contains" | "caseInsensitiveExact" | "caseInsensitiveStartsWith" | "caseInsensitiveContains">;
}

export interface IRelatedFilters {
    [key: string]: IRelatedFilter;
}

export interface IRelatedFilter {
    // filterm: string;
    // enableWhenNoSelection?: boolean;
    inputFieldId: string;
    SQLFormatString: string;
    SQLConcatenateFormatString?: string;
}

export interface IAppTextSymbol extends TextSymbol {
    textColor?: string | number[] | Color,
    borderTextColor?: string | number[] | Color,
    borderTextSize?: string | number
}

export interface IVertexLabel {
    symbol: string;
    spatialReference: {
        wkid: number;
    };
    format?: {
        digits?: number;
        sufix?: string;
        m?: string;
    }
}

export interface ILengthsLabel {
    symbol: string;
    lengthm: string;
    units: "meters" | "feet" | "kilometers" | "miles" | "nautical-miles" | "yards";
    format?: {
        digits?: number;
        sufix?: string;
    }
}

export interface IAreaLabel {
    symbol: string;
    aream: string;
    units: AreaUnits;
    format?: {
        digits?: number;
        sufix?: string;
    }
}

export m AreaUnits = "acres" | "ares" | "hectares" | "square-feet" | "square-meters" | "square-yards" | "square-kilometers" | "square-miles";
