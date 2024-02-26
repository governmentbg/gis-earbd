import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect, Dispatchm, useDispatch } from 'react-redux';
import {
    Typography, ExpansionPanelDetails, makeStyles, Grid, Paper, Toolbar, Select, Menum,
    Button, Accordion, AccordionSummary, AccordionDetails, Tooltip, Card, TextField
} from '@material-ui/core';
import { ISingleDetailData, IDetailDataAttributes, IDetailDataFeatures } from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import { bool, number } from 'm-ms';
import Field from 'esri/ms/support/Field';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { IAppStore, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { IConfigmGroups, IConfigmGroup, IConfigField, ImOperationalm, ISpecificmm, ISubm, ISubmCodedValue, ISubmDefaultValues, ISubmDomain, ISubmDomains } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import Query from 'esri/tasks/support/Query';
import QueryTask from 'esri/tasks/QueryTask';
import FeatureSet from 'esri/tasks/support/FeatureSet';
import Graphic from 'esri/Graphic';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import UrlHelper from 'ReactTemplate/Base/helpers/UrlHelper'
import CustomPopupView from './CustomPopupView';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ZoomInRoundedIcon from '@material-ui/icons/ZoomIn';
import RowOnHoverButton from 'ReactTemplate/Base/components/AttributeTable/RowOnHoverButton';
import { clearSelection, zoomToFeature } from 'ReactTemplate/Base/../ActionsController/Actions';
import Activityms from 'ReactTemplate/Base/../ActionsController/Activityms';
import ActionsController from 'ReactTemplate/Base/../ActionsController/ActionsController';
import EditIcon from '@material-ui/icons/Edit';
import mIcon from '@material-ui/icons/m';
import { ssiUnActivitiesConfig } from '../../config/wsi.unConfig';
import { IOperationalmOptions } from '../../interfaces/ISpecificConfig';
import { IEditFeatureSettings } from 'ReactTemplate/Base/interfaces/reducers/IEditFeature';
import { editFeatureDispatcher, panelmDispatcher } from "ReactTemplate/Base/actions/common/dispatchers";
import { IEditFeatureDispatcher, IPanelmsDispatcher } from 'ReactTemplate/Base/interfaces/dispatchers';
import DocumentDetails from './DocumentDetails';
import { zoomToGraphic } from 'ReactTemplate/Base/helpers/helperFunctions';
import FieldsHelper from 'ReactTemplate/Base/helpers/FieldsHelper';
import SpatialReference from 'esri/geometry/SpatialReference'
import format from "date-fns/format";
import Geometry from 'esri/geometry/Geometry'
import mm from 'esri/geometry/mm'
import UserHelper from '../UserHelper';

interface Dispatchms extends IEditFeatureDispatcher, IPanelmsDispatcher {

}

interface Ownms {
    userInfo: IUserInfo,
}
interface ISpecificmGroup extends IConfigmGroup {
    specific: IOperationalmOptions
}
interface Parentms {
    data: IDetailDataAttributes;
    fields?: Array<Field>;
    editCallback: Function;
    mGroupId: string;
    submFieldm: string | undefined,
    subms: Array<ISubm> | undefined,
    // parentGraphic?: Graphic;
    setSelectedTab: (id: string) => void;
}

interface IErrorObject {
    [key: string]: boolean
}

interface ISpecificmmDetails extends ImOperationalm {
    specific: IOperationalmOptions
}
interface ISpecificmmInner extends ISpecificmm {
    specific: IOperationalmOptions
}

interface ISpecificDataFeatures extends IDetailDataFeatures {
    editable: boolean,
    upload: boolean,
    create?: boolean,
    linkField: string,
    geometrym: string,
}

m ms = Parentms & Ownms & Dispatchms;

const Detailsmmerty: React.FunctionComponent<ms> = (ms: ms) => {

    const [feature, setFeature] = useState({ attributes: {} } as IDetailDataAttributes)
    const [selectedmGroup, setSelectedmGroup] = useState(undefined as IConfigmGroup | undefined);
    const [currentData, setCurrentData] = useState(undefined as ISpecificDataFeatures | undefined)

    useEffect(() => {
        setFeature(ms.data);
    }, [ms.data])

    const handleSave = () => {
        ms.editCallback(true, feature, ms.url);
    }

    const handleCancel = () => {
        setFeature(ms.data);
        ms.editCallback(false);
    }

    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        }
        else {
            return key;
        }
    }
    const isValid = (errorObject: any) => {
        var result = true;
        Object.keys(errorObject).forEach((x: string) => {
            if (errorObject[x] != undefined && errorObject[x]) {
                result = false
            }

        });
        return result;
    }


    const ZoomToFeature = (ms: { feature?: Graphic }) => {
        return (
            <RowOnHoverButton style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                pming: 0
            }}
                clickHandler={(feature) => {
                    if (ms.feature)
                        handleZoomClick(ms.feature);
                }}
                icon={<ZoomInRoundedIcon style={{ height: '100%' }} />} />
        )
    }
    const handleZoomClick = (feature: Graphic, onlyZoom?: boolean) => {
        if (feature) {
            zoomToGraphic(feature, ActionsController.getmView());
        }
    }

    const handleEditCallback = (edited: boolean, feature: Graphic | IDetailDataAttributes, parentIndex: number, featureIndex: number) => {
        if (edited) {
            // const { parentIndex, featureIndex } = otherms;
            let newData: ISpecificDataFeatures = { ...currentData } as ISpecificDataFeatures;
            newData.features[featureIndex] = { ...feature as Graphic }
        }
        ms.mEditedFeature();
        ms.setSelectedTab("detailsTab");
        ms.hideTab("editTab");
        handleZoomClick(feature as Graphic);
    }
    const handleCreateCallback = (edited: boolean, feature: Graphic | IDetailDataAttributes, parentIndex: number, featureIndex: number) => {
        if (edited) {

            let newData: ISpecificDataFeatures = { ...currentData } as ISpecificDataFeatures;
            newData.features.push({ ...feature as Graphic });

            ms.mEditedFeature();
        }
        ms.setSelectedTab("detailsTab");
        ms.hideTab("editTab");
        handleZoomClick(feature as Graphic);
    }
    const handleEditButtonClick = (parent: ISpecificDataFeatures, feature: Graphic, featureIndex: number, subms: Array<ISubm> | undefined, submFieldm: string | undefined) => {
        //todo
        const editedFeatureSettings = {
            feature: feature,
            fields: parent.fields,
            attributeFields: parent.attributeFields,
            subms: subms,
            submFieldm: submFieldm,
            title: parent.title,
            url: parent.url,
            featureIndex: featureIndex,
            editCallback: handleEditCallback
        } as IEditFeatureSettings;
        ms.showTab("editTab");
        ms.setSelectedTab("editTab");
        clearSelection(ActionsController.getmView().mView);
        handleZoomClick(feature, true);
        ms.setEditedFeature(editedFeatureSettings);

    }

    const EditFeature = (ms: { parent: ISpecificDataFeatures, feature: Graphic, featureIndex: number, subms: Array<ISubm> | undefined, submFieldm: string | undefined }) => {
        return (
            <RowOnHoverButton style={{
                position: 'absolute',
                right: 26,
                top: 0,
                bottom: 0,
                pming: 0
            }}
                clickHandler={() => {
                    handleEditButtonClick(ms.parent, ms.feature, ms.featureIndex, ms.subms, ms.submFieldm);
                }}
                icon={<EditIcon style={{ height: '100%' }} />} />
        )
    }
    const handleCreateButtonClick = (parent: ISpecificDataFeatures, feature: Graphic, subms: Array<ISubm> | undefined, submFieldm: string | undefined) => {
        const editedFeatureSettings = {
            feature: feature,
            fields: parent.fields,
            subms: subms,
            create: true,
            geometrym: parent.geometrym,
            submFieldm: submFieldm,
            attributeFields: parent.attributeFields,
            title: parent.title,
            url: parent.url,
            parentmGroupId: parent.mGroupId,
            parentGeometry: ms.data.geometry,
            editCallback: handleCreateCallback
        } as IEditFeatureSettings;
        log(editedFeatureSettings);
        ms.setEditedFeature(editedFeatureSettings);
        clearSelection(ActionsController.getmView().mView);
        // handleZoomClick(feature);
        ms.showTab("editTab");
        ms.setSelectedTab("editTab");
    }

    const queryOperationalm = (id: string, operationalm: ISpecificmmDetails | ISpecificmmInner, geometry?: Geometry): Promise<ISpecificDataFeatures> => {
        var url = operationalm.url;
        return new Promise((resolve, reject) => {
            const spatialReference = ActionsController.getmView() ? ActionsController.getmView().mView.spatialReference : new SpatialReference({ wkid: 102100 });
            let query;
            if (operationalm.specific.intersects && geometry) {
                query = new Query({
                    where: '1=1',
                    outFields: ["*"],
                    outSpatialReference: spatialReference,
                    spatialRelationship: 'intersects',
                    geometry: geometry,
                    returnGeometry: true
                });
            } else {
                query = new Query({
                    where: operationalm.specific.linkField ? `${operationalm.specific.linkField} = '${id}'` : `PARCELID = '${id}'`,
                    outFields: ["*"],
                    outSpatialReference: spatialReference,
                    returnGeometry: true
                });
            }
            const task = new QueryTask({ url: url });
            task.execute(query).then((set: FeatureSet) => {

                if (set.features && set.features.length > 0) {
                    var newFeatures = set.features.m((x: any) => {
                        x.fields = operationalm.esrifields;
                        x.attributeFields = operationalm.fields;
                        x.formatString = operationalm.formatString;
                        x.url = url;
                        x.mGroupId = operationalm.specific.id;
                        x.editable = operationalm.specific.editable;
                        x.upload = operationalm.specific.upload;
                        x.geometrym = set.geometrym;
                        return x;
                    })
                    if (newFeatures.length > 0) {
                        var result = {
                            title: operationalm.title as string,
                            features: newFeatures as Array<Graphic>,
                            fields: operationalm.esrifields as Array<Field>,
                            formatString: operationalm.formatString as string,
                            attributeFields: operationalm.fields,
                            url: url as string,
                            mGroupId: operationalm.specific.id,
                            editable: operationalm.specific.editable,
                            upload: operationalm.specific.upload,
                            create: operationalm.specific.create,
                            linkField: operationalm.specific.linkField,
                            geometrym: set.geometrym
                        }
                        resolve(result);
                    }
                }
                resolve({
                    title: operationalm.title as string,
                    features: new Array<Graphic>(),
                    fields: operationalm.esrifields as Array<Field>,
                    formatString: operationalm.formatString as string,
                    url: operationalm.url as string,
                    attributeFields: operationalm.fields,
                    mGroupId: operationalm.specific.id,
                    editable: operationalm.specific.editable,
                    upload: operationalm.specific.upload,
                    create: operationalm.specific.create,
                    linkField: operationalm.specific.linkField,
                    geometrym: set.geometrym
                });
                //
            }).catch((error) => {
                console.log("error")
            });
        });
    }
 
    const getValueFromField = (value: any, field: Field, subm: ISubm | undefined, submFieldm: string | undefined, codedValues?:any) => {
        var result = value;
        try {
            if (field.domain && value != null && field.domain['codedValues']) {
                var codeValue = field.domain['codedValues'].find((x: any) => x.code == value)
                if (codeValue) {
                    result = codeValue.m
                }
            }
            if (field.m as string == "esriFieldmDate" || field.m == "date") {
                if (value)
                    result = format(new Date(value), "dd.MM.yyyy");
            }
            if (subm && subm.domains && subm.domains[field.m]) {
                if (subm.domains[field.m].m == "codedValue") {
                    var cv = subm.domains[field.m].codedValues.find((x: any) => x.code == value)
                    if (cv) {
                        result = cv.m;
                    }
                }
            }
            if (field.m == submFieldm && subm) {
                result = subm.m;
            }
        }
        catch (error) {
            console.log(error)
        }
        //"esriFieldmDate"
        return result;
    }

    return (
        <Grid container style={{ overflow: "hidden" }}>
            <div style={{ width: "100%" }}>
                <Paper variant="outmd" classm={"paper-details"}>
                    <span classm={"title-paper"} >Характеристики</span>
                    {Object.keys(feature.attributes).m((key: string, index: number) => {
                        var currentField = ms.fields?.find(x => x.m == key);
                        if (currentField) {
                            var subm = undefined;
                            if (ms.subms && ms.submFieldm)
                                subm = ms.subms.find(x => x.code == feature.attributes[ms.submFieldm as string])
                            return (
                                <Grid container m key={`${key}-${index}`}>
                                    <Grid container key={`${key}-${index}`}>
                                        <Grid classm={"text-style"} m xs={6} style={{ pmingRight: 12 }}>
                                            <Typography
                                                variant="overm"
                                                title={getTitle(currentField, key)}>
                                                {getTitle(currentField, key)}
                                            </Typography>
                                        </Grid>
                                        <Grid classm={"text-style"} m xs={6}>
                                            <Typography
                                                variant="overm" title={`${getValueFromField(feature.attributes[key], currentField, subm, ms.submFieldm)}`} >
                                                {getValueFromField(feature.attributes[key], currentField, subm, ms.submFieldm)} </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        }
                    })}
                </Paper>
                <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                    <span classm={"title-paper"} >Документи</span>
                    <DocumentDetails
                        id={feature.attributes['ID']}
                      />
                </Paper>
            </div>
        </Grid>
    )

}
const mStateToms = (state: IAppStore) => {
    return ({
        userInfo: state.userInfo
    });
};

// export default CustomPopup;
export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), { ...editFeatureDispatcher, ...panelmDispatcher })(Detailsmmerty);