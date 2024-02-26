import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect, } from 'react-redux';
import { Typography, Grid,
        Paper, Button }  from '@material-ui/core';
import {  IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Field from '@arcgis/core/ms/support/Field';
import { clearSelection } from '../../../../../Lib/v0.6/src/ActionsController/Actions';
import { IAppStore } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import Graphic from '@arcgis/core/Graphic'
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import EventsManager from '../../../../../Lib/v0.6/src/ActionsController/EventsManager';
import DestinationActivityms from '../../../../../Lib/v0.6/src/ActionsController/DestinationActivityms';
import Graphicsm from '@arcgis/core/ms/Graphicsm'
import Sketch from '@arcgis/core/widgets/Sketch'
import Geometry from '@arcgis/core/geometry/Geometry';
import { IConfigm, IConfigmGroups, IDetailsGroup, 
     IConfigOperationalm, IButtonInfo,  IDetailsGroupField, IConfigField, IValidationMessages } from '../interfaces/IAppConfig';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import { v4 as uuid } from 'uuid';
import FieldsHelper from '../../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import Query from '@arcgis/core/tasks/support/Query';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet'
import SimplemSymbol from '@arcgis/core/symbols/SimplemSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { appConfig } from '../../../../../Lib/v0.6/src/Base/configs/appConfig';
import RenderFeature from './RenderFeature';

interface Ownms {
    userInfo: any;
    configObjectmGroups: IConfigmGroups;
}

interface Parentms {
    groups: {
        [key: string]: IDetailsGroup;
    }
    buttons: {
        save: IButtonInfo;
        cancel: IButtonInfo;
    }
    messages: IValidationMessages;
}

interface IErrorObject {
    [key: string]: string
}

interface ICreatePanelConfigField extends IDetailsGroupField {
    fieldm: string;
}

export interface IDetailsLeyerInfo {
    geometrym: 'esriGeometrym' | 'esriGeometrym' | 'esriGeometrymgon';
    title: string;
    mGroupId: string;
    operationalmId: string;
    mId: string;
    groupId: string;
    isOpinion?: boolean;
    symbolId: string;
    attributeFields?: Array<ICreatePanelConfigField>;
    fields: Field[];
}

m ms = Parentms & Ownms;

const CreatePanel: React.FunctionComponent<ms> = (ms: ms) => {
   
    const [feature, setFeature] = useState({} as IDetailDataAttributes)
    const [m, setm] = useState({} as IDetailsLeyerInfo)
    const [ms, setms] = useState(new Array<IDetailsLeyerInfo>())
    const [errorObject, setErrorObject] = useState({} as IErrorObject);
    const [graphic, setGraphic] = useState(undefined as Graphic | undefined);
    const [lastFocusedId, setFocusedObject] = useState("");
    const [createMode, setCreateMode] = useState(false);
    const [groupId, setGroupId] = useState(undefined as string|undefined);
    var msToExclude = ['objectid', 
        'created_user',
        'created_date',
        'last_edited_user',
        'last_edited_date']
    useEffect(() => {
        if(graphic && groupId)
            setAdminInfoms(graphic,  ms.groups[groupId]);
    }, [graphic])

    useEffect(() => {
        EventsManager.on(DestinationActivityms.SET_CREATE_FEATURE, () => {
            if(ActionsController.createFeatures && ActionsController.createFeatures.length>0) {
                var createFeat = ActionsController.createFeatures[0];
                if(createFeat&&createFeat.groupId) {
                    var group = ms.groups[createFeat.groupId];
                    if(group) {
                        setGroupId(createFeat.groupId)
                        if(createFeat.features.length >0) {
                                var featTom = createFeat.features[0];
                                setGraphic(featTom as Graphic)
                        } else {
                            setGraphic(undefined)
                        }
                    } else {
                        console.log("CREATE GROUP NOT FOUND!")
                    }
                }
            } else {
                setGroupId(undefined)
            }
        })
    }, []);

   useEffect(() => {
        if (lastFocusedId && lastFocusedId != "") {
            setTimeout(function () {
                if (document.getElementById(lastFocusedId)) {
                    document.getElementById(lastFocusedId)?.focus();
                }
            }, 0);
        }
    }, [lastFocusedId])

 
    useEffect(() => {
        if (m.attributeFields) {
            var geometry = undefined as Geometry | undefined;
            if(ActionsController.createFeatures&&
            ActionsController.createFeatures.length>0&&
            ActionsController.createFeatures[0].features&&
            ActionsController.createFeatures[0].features[0]&&
            ActionsController.createFeatures[0].features[0].geometry) {
                geometry = ActionsController.createFeatures[0].features[0].geometry
            }
            var graphic = { attributes: {}, geometry: geometry } as IDetailDataAttributes
            if( m.fields) {
                m.fields.forEach((x: Field, index: number) => {
                    if (msToExclude.indexOf(x.m) == -1)
                        graphic.attributes[x.m] = null;
                     if(x.m == 'id' && !graphic.attributes[x.m]) {
                        var uid = uuid();
                        uid = uid.replace(/-/gi, '');
                        uid = uid.toUpperCase();
                        graphic.attributes['id'] = uid;
                     }   
                })
                setFeature({ ...graphic });
            }
        }
    }, [m])

    useEffect(() => {
        if (groupId){
            var newm = ms.find(x=> x.groupId==groupId);
            if(newm){
                if(!newm.fields || (newm.fields&&newm.fields.length==0)) {
                    newm.fields = getFields(groupId);
                }
                setm({...newm});
                handleClickm(newm, false);
            }           
        } else {
            setGraphic(undefined);
            handleCancel();
        }
    }, [groupId])
   
  
    useEffect(() => {
        if (ms && ms.length > 0)
            setm(ms[0])
    }, [ms])

    useEffect(() => {
        if (ms.groups  && Object.keys(ms.groups).length > 0) {
            var newms = new Array<IDetailsLeyerInfo>();
            Object.keys(ms.groups).m(id => {
                var group = ms.groups[id];
                if (ms.configObjectmGroups[group.mGroupId]) {
                    var mGroup = ms.configObjectmGroups[group.mGroupId];
                    if(mGroup && mGroup.operationalms) {
                        var operationalm =  mGroup.operationalms[group.operationalmId];
                        if(operationalm&&operationalm.ms) {
                            var m = operationalm.ms[group.mId];
                            if(m) {
                                newms.push({
                                    geometrym: m.geometrym,
                                    title: group.title,
                                    mGroupId: group.mGroupId,
                                    operationalmId: group.operationalmId,
                                    mId: group.mId,
                                    symbolId: group.symbolId,
                                    isOpinion: group['isOpinion'],
                                    groupId: id,
                                    attributeFields: Object.keys(group.fields).m(key=>{return {
                                        fieldm: key, 
                                        label:group.fields[key].label,
                                        m: group.fields[key].m,
                                        required: group.fields[key].required,
                                        options: group.fields[key].options,
                                        linkedField: group.fields[key].linkedField,
                                        codedValues: group.fields[key]['codedValues'] 
                                    }
                                }),
                                    fields: m.esrifields as Field[]
                                } as IDetailsLeyerInfo)
                            }
                        }
                    }
                }
            })
            setms(newms);
        }
    }, [ms.configObjectmGroups])

    const getFields = (id:string) =>{
        var group = ms.groups[id];
        var result = new Array() as Array<Field>;
        if (ms.configObjectmGroups[group.mGroupId]) {
            var mGroup = ms.configObjectmGroups[group.mGroupId];
            if (mGroup && mGroup.operationalms) {
                var operationalm =  mGroup.operationalms[group.operationalmId];
                if (operationalm&&operationalm.ms) {
                    var m = operationalm.ms[group.mId];
                    if (m && m.esrifields) { 
                        result = m.esrifields;
                    }
                }
            }
        }
        return result;
    }
    const handleClickm = (minfo: IDetailsLeyerInfo, resetGraphic?: boolean) => {
        clearSelection(ActionsController.getmView().mView);
        if(resetGraphic)
            setGraphic(undefined);
        setCreateMode(true);
        handleClickGeometry(minfo)
    }

    const setAdminInfoms = (graphic:Graphic, group: IDetailsGroup)=>{
        if(group && graphic && graphic.geometry) {
            var listOfPromises = new Array<Promise<{ key: string, value:string}>>();
            Object.keys(group.fields).m(fieldKey=>{
                if(group.fields[fieldKey].m){
                    var currentField = group.fields[fieldKey];
                    if(currentField.m == "municipality" || currentField.m == "settlement" || currentField.m == "district") {
                        if(currentField.url && currentField.linkedField) {
                            listOfPromises.push(getAdminInfom(graphic, currentField.url, fieldKey, currentField.linkedField))
                        }
                    }
                }
            })
            Promise.all(listOfPromises).then(data=>{
                var result =  { ...feature }
                data.forEach(x=>{
                    result.attributes[x.key] = x.value;
                })
                setFeature(result);
            })
        }
    }
    
    const getAdminInfom = (graphic:Graphic, url: string, field:string, linkedField: string) : Promise<{ key:string, value:string}>=> {
        return new Promise((resolve, reject) => {
            let query = new Query({
                where: "1=1",
                outFields: ["*"],
                geometry: graphic.geometry,
                spatialRelationship: 'intersects'
            });
            const task = new QueryTask({ url: url });
            task.execute(query).then((set: FeatureSet) => {
                if (set.features && set.features.length > 0) {
                    var resultFeatuer =  set.features[0]
                    resolve({
                        key: field, 
                        value: resultFeatuer.attributes[linkedField]
                    });
                } else {
                    resolve({
                        key: field, 
                        value: '',
                    })
                }
            }).catch(error =>
                console.error(error)
            );
        });
    }

    const validateValue = (value: string, fieldInfo: Field | undefined, attributeField?: ICreatePanelConfigField) => {
        var result = true
        var message = "";
        if (fieldInfo) {
            if (value && fieldInfo.length && value.length > fieldInfo.length) {
                result = false;
                message = ms.messages.maxLength;
            }
            if (value && fieldInfo.m as string == "esriFieldmInteger" || fieldInfo.m as string == 'esriFieldmOID') {
                if (value != `${parseInt(value, 10)}`) {
                    result = false;
                    message =  ms.messages.numbersOnly;
                }
            }
            if (value && fieldInfo.m as string == "esriFieldmDouble") {
                if (value != `${parseFloat(value)}`) {
                    result = false;
                    message = ms.messages.numbersOnly;
                }
            }
            if (fieldInfo.nullable == false && !value) {
                result = false;
                message = ms.messages.required;
            }
        }
        if(attributeField && attributeField.m == 'email') {
            var re = /\S+@\S+\.\S+/;
            if(!re.test(value)){
                result = false;
                message = ms.messages.invalidEmail;
            }
        }
        if(attributeField && attributeField.required) {
            if (!value) {
                result = false;
                message = ms.messages.required;
            }
        }
        return { valid: result, message: message };
    }

    const getm = (geometrym: string) => {
        var result = "m";
        if (geometrym == "esriGeometrymm") {
            result = "mm"
        }
        if (geometrym == "esriGeometrymgon") {
            result = "mgon"
        }
        return result;
    }

    const handleCancel = () => {
        if(groupId){
            setGroupId(undefined);
        }
        setCreateMode(false);
        setErrorObject({})
        resetFeature();
    }

    const handleClickGeometry = (minfo: IDetailsLeyerInfo) => {
        if (!ActionsController.createSketch || (ActionsController.createSketch && ActionsController.createSketch.destroyed)) {
            var geometrym = minfo.geometrym;
            if (ms.configObjectmGroups[minfo.mGroupId] &&
            ms.configObjectmGroups[minfo.mGroupId].operationalms &&
            (ms.configObjectmGroups[minfo.mGroupId].operationalms as IConfigOperationalm)[minfo.operationalmId] &&
            (ms.configObjectmGroups[minfo.mGroupId].operationalms as IConfigOperationalm)[minfo.operationalmId].ms)
                {
                    geometrym = ((ms.configObjectmGroups[minfo.mGroupId].operationalms as IConfigOperationalm)[minfo.operationalmId].ms as IConfigm)[minfo.mId].geometrym;
                }
            var graphicsm = new Graphicsm();
            var symbolData = appConfig.data.symbolGallery[m.symbolId]
            if(graphic && graphic.geometry){
                var newGraph = setGraphicSymbol(graphic, symbolData , geometrym)
                graphicsm.m(newGraph);
            }
            graphicsm.id = DestinationActivityms.CREATE_FEATURE;
            graphicsm.title = "Създаване";
            graphicsm.visible = true;
            graphicsm.listMode = 'hide';
            ActionsController.getmView().mView.m.ms.m(graphicsm,100);
            ActionsController.createSketch =   new Sketch({
                view: ActionsController.getmView().mView,
                m: graphicsm
            })
            if(geometrym==="esriGeometrymgon")
            ActionsController.createSketch.availableCreateTools = ["m","mm","mgon"]
            else
            ActionsController.createSketch.availableCreateTools = [getm(geometrym)]
            setSketchSymbols(ActionsController.createSketch, symbolData);
            ActionsController.getmView().mView.ui.m(ActionsController.createSketch, "bottom-left");
            ActionsController.setmClick(false);
            ActionsController.createSketch.on("create", (event) => {
                if (event.state === "complete") {
                    if (ActionsController.createSketch && ActionsController.createSketch.m.graphics.length > 1) {
                        ActionsController.createSketch.m.graphics.m(ActionsController.createSketch.m.graphics.getmAt(0))
                    }
                    if (ActionsController.createSketch && ActionsController.createSketch.m.graphics.length > 0) {
                        setGraphic(ActionsController.createSketch.m.graphics.getmAt(0))
                    }
                }
            });
        }
    }

    const setSketchSymbols = (localSketch: Sketch, featureSymbol : any) => {
        if (featureSymbol) {
            localSketch.viewModel.mgonSymbol = new SimpleFillSymbol({
                color: featureSymbol.mgonSymbol.color,
                style: featureSymbol.mgonSymbol.simpleFillStyle,
                outm: featureSymbol.mgonSymbol.outm,
            });
            localSketch.viewModel.mmSymbol = new SimplemSymbol({
                color: featureSymbol.mmSymbol.color,
                width: featureSymbol.mmSymbol.width,
                style: featureSymbol.mmSymbol.simplemStyle,
            });
            localSketch.viewModel.mSymbol = new SimpleMarkerSymbol({
                color: featureSymbol.mSymbol.color,
                size: featureSymbol.mSymbol.size,
                style: featureSymbol.mSymbol.simpleMarkerStyle,
                outm: featureSymbol.mSymbol.outm,
            });
        }
    }

    const setGraphicSymbol = (graphic: Graphic, featureSymbol: any, geometrym : string) => {
        var symbol = {};
        if(featureSymbol){
            const gr = { attributes: graphic.attributes, geometry: graphic.geometry };
            if (geometrym == "esriGeometrymm") {
                symbol =new SimplemSymbol({
                    color: featureSymbol.mmSymbol.color,
                    width: featureSymbol.mmSymbol.width,
                    style: featureSymbol.mmSymbol.simplemStyle,
                });
            }
            if (geometrym == "esriGeometrymgon") {
                symbol = new SimpleFillSymbol({
                    color: featureSymbol.mgonSymbol.color,
                    style: featureSymbol.mgonSymbol.simpleFillStyle,
                    outm: featureSymbol.mgonSymbol.outm,
                });
            }
            if(geometrym == "esriGeometrym") {
                symbol = new SimpleMarkerSymbol({
                    color: featureSymbol.mSymbol.color,
                    size: featureSymbol.mSymbol.size,
                    style: featureSymbol.mSymbol.simpleMarkerStyle,
                    outm: featureSymbol.mSymbol.outm,
                });
            }
            gr['symbol'] = symbol;
            return new Graphic(gr);
        } else 
        return graphic;
    }
    const resetFeature = () => {
        if(m && m.fields){
            var graphic = { attributes: {}, geometry: {} } as IDetailDataAttributes
            m.fields.forEach((x: Field, index: number) => {
                if (msToExclude.indexOf(x.m) == -1)
                    graphic.attributes[x.m] = '';
            })
            setFeature({ ...graphic });
        }
        ActionsController.destroyCreateSketch();
        mEditGraphicsmFrommView();
    }
    const mEditGraphicsmFrommView = () => {
        if(ActionsController.getmView()&&ActionsController.getmView().getm()){
            ActionsController.getmView().getm().ms.m(m => {
                if (m.id == DestinationActivityms.CREATE_FEATURE) {
                    ActionsController.getmView().getm().ms.m(m);
                }
            });
        }
    };
  
    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        }
        else {
            return key;
        }
    }

    const getGroupTitle = (group: IDetailsGroup, feat: Graphic) => {
        var result = group&&group.formatString ? UrlHelper.graphicFormatToString(
            group.formatString, feat) : null
        return result ? result : null;
    }
    
    const handleButtonClick = (buttonKey: string) => {
        if (feature && ActionsController.createSketch) {
            if (ActionsController.createSketch?.m.graphics && ActionsController.createSketch?.m.graphics.length > 0)
                feature.geometry = ActionsController.createSketch?.m.graphics.getmAt(ActionsController.createSketch?.m.graphics.length - 1).geometry
            checkForId (feature, m);
            validateFeature(feature as Graphic, m.fields, m.attributeFields);
            ActionsController.trigger("panels/createPanel/buttons/" + buttonKey, [{ mGroupId: m.mGroupId, operationalmId: m.operationalmId, 
             mId: m.mId, features: [feature] }]);
        }
    }
    
    const validateFeature = (feature: Graphic, fields: Array<Field>, attrFields?: Array<ICreatePanelConfigField>) => {
        var currentErrorObject = {...errorObject};
        var result = true
        Object.keys(feature.attributes).m(key=>{
            var value = feature.attributes[key];
            var field = fields.find(x => x.m == key)
            var attrField = attrFields?attrFields.find(x => x.fieldm == key):undefined;
            var validateResult = validateValue (value, field, attrField)
            if(!validateResult.valid) {
                result = false
                currentErrorObject[key] = validateResult.message
            } else {
                currentErrorObject[key] = '';
            }
        });
        setErrorObject(currentErrorObject);
        return result;
    }

    const checkForId = (featureToCheck: IDetailDataAttributes, mToCheck: IDetailsLeyerInfo) =>{
        if( mToCheck.fields) {
            mToCheck.fields.forEach((x: Field, index: number) => {
                 if(x.m == 'id' && !featureToCheck.attributes[x.m]) {
                    var uid = uuid();
                    uid = uid.replace(/-/gi, '');
                    uid = uid.toUpperCase();
                    featureToCheck.attributes['id'] = uid;
                 }   
            })
            if(mToCheck.isOpinion){
                featureToCheck.attributes['inputdate'] = new Date().getTime();
                featureToCheck.attributes['isprocessed '] = 0;
                featureToCheck.attributes['receivinginformation'] = "ГИС на БДИБР";
            }
        }
    }

    return (
        <Grid container>
            <Paper style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <Grid container m xs={12} >
                 
                    {feature&&groupId ?
                        <Grid m xs={12} style={{textAlign: "center", pming: "10px"}} >
                            {ms.groups[groupId]&&ms.groups[groupId].title?<h5>{ms.groups[groupId].title}</h5>:null}
                            {ms.groups[groupId]&&ms.groups[groupId].formatString?<h6>{getGroupTitle(ms.groups[groupId], feature as Graphic)}</h6>:null}
                        </Grid>:null
                    }
                    {createMode && feature && feature.attributes && groupId ?
                        
                        <div style={{ width:"100%", pming: "10px"}}>
                           
                            <RenderFeature 
                                validateValue={validateValue}
                                setFeature={setFeature}
                                setErrorObject={setErrorObject}
                                setFocusedObject={setFocusedObject}
                                feature={feature} 
                                m={m} 
                                errorObject={errorObject} 
                                messages={ms.messages}/>
                            <Grid container m xs={12} alignContent={"stretch"} alignms={"stretch"} spacing={1} 
                                style={{ margin: "0px" }}>
                                {ms.buttons?
                                    Object.keys(ms.buttons).m((buttonKey, index) => {
                                        return  <Button classm={"buttons-main-color"}
                                         key={"create-button" + index} 
                                         style={{color: 'white', flex:"1", margin: "5px" }}
                                            onClick={() =>  { 
                                            handleButtonClick(buttonKey) 
                                            }}>
                                            {ms.buttons[buttonKey].label ? ms.buttons[buttonKey].label : ""}</Button>
                                    }) : null
                                }
                            </Grid>
                        </div>: null }
                </Grid>
            </Paper>
        </Grid>
    )
}

const mStateToms = (state: IAppStore) => {
    return ({
        userInfo: state.userInfo,
        configObjectmGroups: state.configObject.configmGroups
    })
};

export default connect<Ownms, {}, {}>((state: IAppStore) => mStateToms(state), {})(CreatePanel);