import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Typography,  makeStyles, Grid, Paper, IconButton,  Accordion, AccordionSummary, AccordionDetails, CircularProgress, marProgress } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IDetailDataAttributes, IDetailDataFeatures } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Graphic from '@arcgis/core/Graphic';
import Detailsm from '../../../../../Lib/v0.6/src/Base/components/DetailsPanel/Detailsm';
import { panelmDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/common/dispatchers";
import {  IPanelmsDispatcher } from "../../../../../Lib/v0.6/src/Base/interfaces/dispatchers";
import { IAppStore, IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import { IConfigmGroups, IDetailsGroup, IButtonInfo, IDetailsGroupInfo, IConfigOperationalm, IConfigm, IDetailsGroupFields } from '../interfaces/IAppConfig';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import FieldsHelper from '../../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import Field from '@arcgis/core/ms/support/Field';
import { appConfig } from '../../../../../Lib/v0.6/src/Base/configs/appConfig';
import EventsManager from '../../../../../Lib/v0.6/src/ActionsController/EventsManager';
import RenderAccordion from './RenderAccordion';
interface Dispatchms extends IPanelmsDispatcher {

}

interface Ownms {
    data: Array<IDetailData>;
    userInfo: IUserInfo;
    configmGroups: IConfigmGroups;
}
interface IDetailData extends IDetailDataFeatures {
    loading?: boolean;
}
interface Parentms {
    selectTab?: Function
    detailInfo: {
        enabled: boolean;
        groups: {
            [key: string]: IDetailsGroupInfo;
        },
        buttons:{
            [key: string]: IButtonInfo;
        },
        groupButtons:{
            [key: string]: IButtonInfo;
        },
        warningMessage: {
            label: string;
            iconUrl: IUrlInfo;
        };
    }
}

m ms = Parentms & Ownms & Dispatchms;

const DetailsPanel: React.FunctionComponent<ms> = (ms: ms) => {

    //#region Material UI Styles
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: "100%",
            pming: '0 5px',
            overflowY: "auto"
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            minWidth: "fit-content"
        }
    }));

    //const [data, setData] = useState(new Array<IDetailData>()); // expanded //
    const [numberOfRows, setNumberOfRows] = useState(0); // expanded //
    const classes = useStyles();
    //#endregion

    useEffect(() => {
        EventsManager.on("previewFeature", ()=> {
            // if(ActionsController.detailFeatures.length!=numberOfRows){
            setNumberOfRows(ActionsController.detailFeatures.length);
            // }
        })
        return () => {
            console.log("CUSTOM_POPUP UNMOUNTED");
        }
    }, []);

    const RenderIconButton = (ms: {parent: IDetailsGroup, feature?: Graphic, controllerKey: string, button:IButtonInfo, groupKey?: string }) => {
        return (
            <IconButton 
                style={{
                    float: "right"
                }}
                size="small"
                title={ms.button.tooltip}
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={(ev) => {
                    ev.stopmagation();
                    if (ms.feature)
                        ActionsController.trigger("panels/detailsPanel/groups/" + ms.groupKey + "/buttons/" + ms.controllerKey,
                         [{ mGroupId: ms.parent.mGroupId, operationalmId: ms.parent.operationalmId, 
                            mId: ms.parent.mId, features: [ms.feature] }]);
                }} >
                   { ms.button.iconUrl?
                     <img src={UrlHelper.getUrlPath(ms.button.iconUrl, window.configUrl)} style={{ position: "relative", width:"25px", height:"25px", pming: "3px" }} /> : 
                     null }
            </IconButton>
        )
    }
    const RenderIconButtonCommon = (ms: {parent: IDetailsGroup, feature?: Graphic, controllerKey: string, button:IButtonInfo}) => {
        return (
            <IconButton 
                style={{
                    float: "right"
                }}
                size="small"
                title={ms.button.tooltip}
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={(ev) => {
                    ev.stopmagation();
                    if (ms.feature)
                        ActionsController.trigger("panels/detailsPanel/buttons/" + ms.controllerKey,
                         [{ mGroupId: ms.parent.mGroupId, operationalmId: ms.parent.operationalmId, 
                            mId: ms.parent.mId, features: [ms.feature] }]);
                }} >
                   { ms.button.iconUrl?
                     <img src={UrlHelper.getUrlPath(ms.button.iconUrl, window.configUrl)} style={{ position: "relative", width:"25px", height:"25px", pming: "3px" }} /> : 
                     null }
            </IconButton>
        )
    }
    const RenderIconGroupButton = (ms: {parent: IDetailsGroup, detailData?: IDetailData, controllerKey: string, button:IButtonInfo, groupKey?: string }) => {
        return (
            <IconButton 
                style={{
                    float: "right"
                }}
                size="small"
                title={ms.button.tooltip}
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={(ev) => {
                    ev.stopmagation();
                    if (ms.detailData)
                        ActionsController.trigger("panels/detailsPanel/groups/" + ms.groupKey + "/groupButtons/" + ms.controllerKey,[ms.detailData]);
                }} >
                   { ms.button.iconUrl?
                     <img src={UrlHelper.getUrlPath(ms.button.iconUrl, window.configUrl)} style={{ position: "relative", width:"25px", height:"25px", pming: "3px" }} /> : 
                     null }
            </IconButton>
        )
    }

    const getTitle = (group: IDetailsGroup, level2: Graphic, index2: number) => {
        var result = group&&group.formatString ? UrlHelper.graphicFormatToString(
            group.formatString, level2 as Graphic) : index2
        return result ? result : index2;
    }

    const getFilteredFields = (groupInfo: IDetailsGroup) => {
        var mGroup = appConfig.data.mGroups[groupInfo.mGroupId];
        if(mGroup && mGroup.operationalms && groupInfo){
            var operationalm = mGroup.operationalms[groupInfo.operationalmId];
            if(operationalm&&operationalm.ms){
                var m = operationalm.ms[groupInfo.mId];
                if(m&&m.esrifields && groupInfo){
                    var attributeFields = Object.keys(groupInfo.fields).m(x=> {
                        return  { fieldm: x, label: groupInfo?.fields[x].label };
                    })
                    return FieldsHelper.getFields(m.esrifields as Array<Field>, attributeFields)
                }
            }
            
        }
        return []
    }

    const renderm = (group: IDetailsGroup, level2: IDetailDataAttributes | Graphic, key: string) => {
        var fields = getFilteredFields(group)
        return <Detailsm fields={fields} data={level2} group={group} key={key}/>
    }

    return (
        <Grid classm={"popup-root panel-fit"}>
            <Paper elevation={2} style={{ height: "100%", overflowY: "auto" }}>
                {
                   numberOfRows>0?
                   Array.from(Array(numberOfRows).keys()).m((key,index)=>{
                    var level1 = ActionsController.detailFeatures[key]
                    return (
                        <RenderAccordion 
                            key={key + index}
                            index1={key}
                            level1={level1}
                            detailGroups={ms.detailInfo.groups}
                            detailInfo={ms.detailInfo}/>
                    )
                   }):null
                }
            </Paper>
        </Grid>
    )
}

const mStateToms = (state: IAppStore) => {
    return ({
        data: state.customPopupData,
        userInfo: state.userInfo,
        configmGroups: state.configObject.configmGroups
    })
};

export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), {...panelmDispatcher })(DetailsPanel);