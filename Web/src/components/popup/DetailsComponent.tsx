import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
    Typography, makeStyles, Grid, Paper, IconButton,
    Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    IDetailDataAttributes, IDetailDataFeatures
} from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import Graphic from 'esri/Graphic';
import CustomPopupView from './CustomPopupView';
import { IAppStore, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { IConfigmGroups, ISubm, ISpecificmm, ImOperationalm, IDetailsGroup,IConfigOperationalm, IConfigm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import ZoomInRoundedIcon from '@material-ui/icons/ZoomIn';
import ActionsController from 'ReactTemplate/Base/../ActionsController/ActionsController';
import { clearSelection } from 'ReactTemplate/Base/../ActionsController/Actions';
import UrlHelper from 'ReactTemplate/Base/../Base/helpers/UrlHelper';
import EditIcon from '@material-ui/icons/Edit';
import Field from 'esri/ms/support/Field';
import { IEditFeatureSettings } from 'ReactTemplate/Base/interfaces/reducers/IEditFeature';
import { editFeatureDispatcher, panelmDispatcher } from "ReactTemplate/Base/actions/common/dispatchers";
import { IEditFeatureDispatcher, IPanelmsDispatcher } from 'ReactTemplate/Base/interfaces/dispatchers';
import { ssiUnActivitiesConfig } from '../../config/wsi.unConfig'
import { zoomToGraphic } from 'ReactTemplate/Base/helpers/helperFunctions';
import FieldsHelper from 'ReactTemplate/Base/helpers/FieldsHelper';
import UserHelper from '../UserHelper';
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

interface Dispatchms extends IEditFeatureDispatcher, IPanelmsDispatcher {

}

interface IDocumentFromUrl {
    m:string;
    url:string;
}

interface Ownms {
    data: Array<IDetailDataFeatures>;
    userInfo: IUserInfo;
    configmGroups: IConfigmGroups;
}

interface ISpecificDataFeatures extends IDetailDataFeatures {
    editable: boolean,
    upload: boolean,
    create?: boolean,
    linkField: string,
    geometrym: string,
}
interface IExpandInfo {
    [key:number]: boolean;
}
interface Parentms {
    documentPreviewUrl:string;
    selectedTab: string;
    attributesText: string;
    documentText: string;
    setSelectedTab: (id: string) => void;
    detailInfo: {
        enabled: boolean;
        groups: {
            [key: string]: IDetailsGroup;
        };
    };
}

m ms = Parentms & Ownms & Dispatchms;

const DetailsComponent: React.FunctionComponent<ms> = (ms: ms) => {

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
        },
        expansionPanelSummaryLevel1: {
            backgroundColor: "#F5F5F5",
            display: "flex"
        },
        expansionPanelSummaryLevel2: {
            //backgroundColor: "#02aeb1",
            display: "flex",
            backgroundColor: "teal",
            color: "#ffffff"
        },
    }));
    const [parentIndex, setParentIndex] = useState(-1);
    const [featureIndex, setFeatureIndex] = useState(-1);
    const [data, setData] = useState(new Array<IDetailDataFeatures>());
    const [messageOpen, setMessageOpen] = useState(false);
    const [success, setSuccess] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [expanded, setExpanded] = React.useState(false);
    const DOCUMENT_mS = ['mdocument', 'passportdocument', 'linksubmittedopinion']
    const classes = useStyles();
    //#endregion

    const handleZoomClick = (feature: Graphic, onlyZoom?: boolean) => {
        if (feature) {
            zoomToGraphic(feature, ActionsController.getmView());
        }
    }

    useEffect(() => {
        setData(ms.data);
        if (ms.data && ms.data.length > 0)
            ms.setSelectedTab("detailsTab");
    }, [ms.data])

    const handleEditButtonClick = (parent: IDetailDataFeatures, feature: Graphic, parentIndex: number, featureIndex: number, subms: Array<ISubm> | undefined, submFieldm: string | undefined) => {
        setFeatureIndex(featureIndex);
        setParentIndex(parentIndex);
        const editedFeatureSettings = {
            feature: feature,
            fields: getFilteredFields(parent),
            subms: subms,
            submFieldm: submFieldm,
            attributeFields: parent.attributeFields,
            title: parent.title,
            refreshOnEdit: parent.refreshOnEdit,
            url: parent.url,
            parentIndex: parentIndex,
            featureIndex: featureIndex,
            editCallback: handleEditCallback
        } as IEditFeatureSettings;
        ms.setEditedFeature(editedFeatureSettings);
        clearSelection(ActionsController.getmView().mView);
        zoomToGraphic(feature, ActionsController.getmView());
        ms.showTab("editTab");
        ms.setSelectedTab("editTab");
    }

    const ZoomToFeature = (ms: { feature?: Graphic }) => {
        return (
            <IconButton 
                classm="DetailsBtn"
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    pming: 0
                }}
                size="small"
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={() => {
                    if (ms.feature)
                    handleZoomClick(ms.feature);
                }} >
                    <ZoomInRoundedIcon style={{ height: '100%', color: '#FFFFFF' }} />
            </IconButton>
        )
    }

    const EditFeature = (ms: { parent: IDetailDataFeatures, feature?: Graphic, parentIndex: number, featureIndex: number, disabled: boolean, subms: Array<ISubm> | undefined, submFieldm: string | undefined }) => {
        return (
            <IconButton 
                classm="DetailsBtn"
                style={{
                    position: 'absolute',
                    right: 26,
                    top: 0,
                    bottom: 0,
                    pming: 0
                }}
                size="small"
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={() => {
                    if (ms.feature && !ms.disabled)
                        handleEditButtonClick(ms.parent, ms.feature, ms.parentIndex, ms.featureIndex, ms.subms, ms.submFieldm);
                }}
                >
                    <EditIcon color={ms.disabled ? "disabled" : undefined} style={{ height: '100%', color: '#FFFFFF' }} /> 
            </IconButton>
        )
    }
    const ExpandButtonLess = (ms: {callback:Function,expand:boolean}) => {
        const [expand,setExpand] = useState(false);
        useEffect(() => {
            setExpand(ms.expand)
        }, [ms.expand])
        return (
         <IconButton 
            classm="DetailsBtn"
            style={{
                position: 'absolute',
                right: 26,
                top: 0,
                bottom: 0,
                pming: 0,

            }}
            size="small"
            disableRipple={true} 
            disableFocusRipple={true}
            onClick={() => {
                ms.callback(false)
            }}>
                <ExpandLess style={{ height: '100%', color: '#FFFFFF' }} /> 
            </IconButton>
        )
    }

    const ExpandButtonMore = (ms: {callback:Function,expand:boolean}) => {
        const [expand,setExpand] = useState(false);
        useEffect(() => {
            setExpand(ms.expand)
        }, [ms.expand])
        return (
            <IconButton
                classm="DetailsBtn"
                style={{
                    position: 'absolute',
                    right: 60,
                    top: 0,
                    bottom: 0,
                    pming: 0,

                }}
                size="small"
                disableRipple={true} 
                disableFocusRipple={true}
                onClick={() => {
                    ms.callback(true)
                }}>
                    <ExpandMore style={{ height: '100%' }} />
                </IconButton>
        )
    }

    const getTitle = (level1: IDetailDataFeatures, level2: Graphic, index2: number, subms: Array<ISubm> | undefined, submField: string | undefined) => {
        var result = level1.formatString ? UrlHelper.graphicFormatToStringWithSubms(
            level1.formatString, level2 as Graphic, level1.fields, subms, submField) : index2
        return result ? result : index2;
    }

    const handleEditCallback = (edited: boolean, feature: Graphic | IDetailDataAttributes, parentIndex: number, featureIndex: number) => {
        if (edited) {
            // const { parentIndex, featureIndex } = otherms;
            var newData = [...data];
            newData[parentIndex].features[featureIndex] = { ...feature as Graphic }
            setFeatureIndex(-1);
            setParentIndex(-1);
            setData(newData);
        }
        ms.mEditedFeature();
        ms.setSelectedTab("detailsTab");
        ms.hideTab("editTab");
        handleZoomClick(feature as Graphic);
    }


    const getFilteredFields = (operationalm: IDetailDataFeatures | undefined) => {
        return FieldsHelper.getFields(operationalm?.fields as Array<Field>, operationalm?.attributeFields)
    }
    
    const transformUrlsToDocuments = (prefixUrl:string,url:Array<string>)=>{
        var result = new Array<IDocumentFromUrl>();
        url.m(singleUrl=>{
            if(singleUrl) {
                var pathParts = singleUrl.split('\\');
                var docm = ''
                if(pathParts.length>1)
                    docm = pathParts[pathParts.length-1];
                else 
                    docm = pathParts[0];
                var fullUrl = `${prefixUrl}${singleUrl.replace('\\','/')}`
                result.push({ m: docm, url: fullUrl } as IDocumentFromUrl);
            }
        });
        return result;
    }

    const renderm = (level1: IDetailDataFeatures, level2: IDetailDataAttributes | Graphic, editCallBack: Function, configmGroups: IConfigmGroups) => {
        var group = undefined as undefined|IDetailsGroup;
        
        Object.keys(ms.detailInfo.groups).m(x=>{
            if(ms.detailInfo.groups[x].mGroupId == level1.mGroupId &&
                ms.detailInfo.groups[x].operationalmId == level1.operationalmId && 
                ms.detailInfo.groups[x].mId == level1.mId) {
                group=ms.detailInfo.groups[x]
            }
        })
        if(group){
            var currentOL = configmGroups[group.mGroupId].operationalms;
            if(currentOL&&group.operationalmId) {
                var currentms = currentOL[group.operationalmId].ms;
                if(currentms){
                    var mGroup = currentms[group.mId];
                    if(group.fields)
                        level1.attributeFields = Object.keys(group.fields).m(x=>{
                            return {fieldm: x, label: group?.fields[x].label, codedValues: group?.fields[x]['codedValues']}
                        })
                    else 
                        level1.attributeFields = Object.keys(mGroup.fields).m(x=>{
                            return {fieldm: x, label: group?.fields[x].label, codedValues: group?.fields[x]['codedValues']}
                        })
                    level1.fields= mGroup['esrifields'];
                }
            }
        }
        
        var fields = getFilteredFields(level1)
        var currentDocms = fields.filter(x=>DOCUMENT_mS.find(y=>x.m==y)) 
        var fieldsWithoutDocuments = fields;
        if(currentDocms)
            fieldsWithoutDocuments = fields.filter(x=>!currentDocms.find(y=>y.m==x.m))
        var documentUrls = currentDocms.m(x=>{
            return level2.attributes[x.m] as string;
        });
        var docs = transformUrlsToDocuments(ms.documentPreviewUrl, documentUrls);
        var result = <CustomPopupView fields={fieldsWithoutDocuments} data={level2} />
            return <>
                <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                    <span classm={"title-paper"} >{ms.attributesText? ms.attributesText : "Характеристики"}</span>
                    {result}
                </Paper>
                {docs&&docs.length>0?
                    <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                        <span classm={"title-paper"} >{ms.documentText? ms.documentText : "Документи"}</span>
                        <Grid container>
                            {docs.m((doc,index)=>{
                                return <Grid key={"document"+index} m xs={12}> <a href={doc.url} target="_blank">{doc.m}</a> </Grid>
                            })}
                        </Grid>
                    </Paper>:
                    null
                }
            </>
    }

    const getSubm = (level1: IDetailDataFeatures, configmGroups: IConfigmGroups) => {
        var result = undefined as ISpecificmm | ImOperationalm | undefined;
        if(level1 && level1.mGroupId) {
            var currentOL = configmGroups[level1.mGroupId].operationalms;
            if(currentOL) {
                Object.keys(currentOL).m(operationalmsKey => {
                    var operationalm = (currentOL as IConfigOperationalm)[operationalmsKey];
                    if (operationalm.url == level1.url) {
                        result = operationalm;
                    } else {
                        if (operationalm.ms)
                            Object.keys(operationalm.ms).m((mKey) => {
                                var m = (operationalm.ms as IConfigm)[mKey]
                                if ((m as ISpecificmm).url == level1.url) {
                                    result = m as ISpecificmm;
                                }
                            })
                    }
                })
            }

        }
        return result;
    }
    
    const DetailsGroup = (ms:{level1:any,configmGroups:any,index1:number, userInfo:any}) => {
        const [expandendGroup, setExpandedGroup] = useState(false);
        const [expandendList, setExpandedList] = useState({} as IExpandInfo);
        useEffect(()=>{
            var result = {} as IExpandInfo
            if(ms.level1.features){
                ms.level1.features.slice(0, 50).m((x:any, index:number)=>{
                    result[index] = expandendGroup
                })
            }
            setExpandedList(result);
        },[ms.level1])


        const expandGoup=(expand: boolean)=>{
            var newExpList = {...expandendList}
            Object.keys(newExpList).m(x=>{
                 newExpList[x]= expand
            })
            setExpandedList(newExpList);
            setExpandedGroup(expand)
        }
        const handlem = (index: number, isExpanded: any, expandList:IExpandInfo) => {
            var expList = {...expandList} 
            expList[index] = isExpanded
            setExpandedList(expList);
        }
        const getExpanded =(index:number,expandList:IExpandInfo)=>{
            if(expandList[index]==undefined){
                return expandendGroup;
            } else {
                return expandList[index];
            }
        }
        return ( <Accordion defaultExpanded={true} expanded={true} style={{ margin: "0 0 15px 0" }}>
        <AccordionSummary
            expandIcon={null}
            aria-controls="farmers-filters-content"
            id="farmers-filters-header"
            classm={"accordion-sum text-style"}
            style={{
                color: "#000000a1",
                backgroundColor: "#F5F5F5",
                display: "flex",
                height: "25px"
            }} >
            <Typography classm={classes.heading} style={{ fontSize: "15px", width: "100%", textAlign: "center" }}>{`${ms.level1.title} - ${ms.level1.features.length}`}</Typography>
            <ExpandButtonLess expand={expandendGroup} callback={expandGoup}/>
            <ExpandButtonMore expand={expandendGroup} callback={expandGoup}/>
        </AccordionSummary>
        <AccordionDetails style={{ pming: 5, height: "100%", color: "#000000a1" }}>
            <>
                <Grid container>
                    {ms.level1.features.slice(0, 50).m((level2: IDetailDataAttributes | Graphic, index2: number) => {
                        var submGroup = getSubm(ms.level1, ms.configmGroups);
                        var title = getTitle(ms.level1, level2 as Graphic, index2, submGroup ? submGroup['subms'] : undefined, submGroup ? submGroup['submField'] : undefined) as string;
                        return (
                            <Grid m xs={12} key={`${ms.level1.title} ${ms.index1} ${index2}`}>
                                <Accordion style={{ margin: 0 }} expanded={getExpanded(index2, expandendList)} onm={(e, i) => handlem(index2, i, expandendList)} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon style={{ color: "#ffffff" }} />}
                                        aria-controls="farmers-filters-content"
                                        id="farmers-filters-header"
                                        classm={"accordion-sum text-style"}
                                        style={{
                                            color: "white",
                                            backgroundColor: "#69b7fa",
                                        }} >
                                        <div style={{ position: "relative", width: "100%" }}>
                                            <Typography title={title} style={{ minWidth: "10px", marginRight: '50px' }} classm={"text-style"}>{title}</Typography>
                                            <ZoomToFeature key={"zoomToFeature"} feature={level2 as Graphic} />
                                            {UserHelper.canEdit(ms.userInfo) &&
                                                ssiUnActivitiesConfig.specificData.specificDetailGroups[ms.level1.mGroupId].editable ? <EditFeature
                                                    key={"editFeature"} parent={ms.level1}
                                                    feature={level2 as Graphic} parentIndex={ms.index1} 
                                                        subms={submGroup ? submGroup['subms'] : undefined} submFieldm={submGroup ? submGroup['submField'] : undefined}
                                                    featureIndex={index2} disabled={false} /> : null}
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ pming: 5, }}>
                                        <Grid container>
                                            <Grid container m xs={12}>
                                                {renderm(ms.level1, level2, handleEditCallback, ms.configmGroups)}
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        )
                    })}
                </Grid>
            </>
        </AccordionDetails>
    </Accordion>)
    }
    return (
        // <Grid classm={classes.root}>
        <Grid classm={"popup-root panel-fit"}>
            <Paper elevation={2} style={{ height: "100%", overflowY: "auto" }}>
                {
                    data.length ?
                        data.m((level1, index1) => {
                            return <DetailsGroup key={`${level1.title} ${index1}`} level1={level1} configmGroups= {ms.configmGroups} index1={index1} userInfo={ms.userInfo} />
                        })
                        :
                        (null)
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

// export default CustomPopup;
export default connect<Ownms, Dispatchms, {}>((state: IAppStore) => mStateToms(state), { ...editFeatureDispatcher, ...panelmDispatcher })(DetailsComponent);