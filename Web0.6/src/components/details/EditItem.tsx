import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { IDetailDataAttributes, ISingleDetailData } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Field from '@arcgis/core/ms/support/Field';
import { IButtonInfo, IDetailsGroupField, IDetailsGroup } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import Sketch from '@arcgis/core/widgets/Sketch';
import { IValidationMessages } from '../interfaces/IAppConfig'
import EditField from './EditField';
import Graphic from '@arcgis/core/Graphic'
import QueryTask from '@arcgis/core/tasks/QueryTask';
import Query from '@arcgis/core/tasks/support/Query';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet'

interface ICreatePanelConfigField extends IDetailsGroupField {
    fieldm: string;
}

interface Parentms {
    data: IDetailDataAttributes;
    fields?: Array<Field>;
    mGroupId: string;
    attributeFields?: Array<ICreatePanelConfigField>;
    groupId: string;
    operationalmId: string; 
    mId: string;
    graphic: Graphic;
    groups: {
        [key: string]: IDetailsGroup;
    },
    buttons: {
       [key:string]: IButtonInfo,
    },
    messages: IValidationMessages
}

interface IErrorObject {
    [key: string]: string;
}

m ms = Parentms;

const Editm: React.FunctionComponent<ms> = (ms: ms) => {

    const [lastFocusedId, setFocusedObject] = useState("");
    const [feature, setFeature] = useState({ attributes: {} } as IDetailDataAttributes)
    const [errorObject, setErrorObject] = useState({} as IErrorObject);
    const [fields , setFields] = useState(new Array() as Array<Field> | undefined);
    
    useEffect(() => {
        setFields(ms.fields)
    }, [ms.fields])
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
        setFeature(ms.data);
    }, [ms.data])

    useEffect(()=>{
        if(ms.graphic && ms.groupId)
            setAdminInfoms(ms.graphic,  ms.groups[ms.groupId]);
    },[ms.graphic])

  
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
                var result = feature;
                data.forEach(x=>{
                    (result.attributes as ISingleDetailData)[x.key] = x.value;
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

    const handleButtonClick = (buttonKey: string) => {
        if (feature && ActionsController.editSketch) {

            if(ActionsController.editSketch?.m.graphics && 
                ActionsController.editSketch?.m.graphics.length > 0 && 
                ActionsController.editSketch?.m.graphics.getmAt(ActionsController.editSketch?.m.graphics.length - 1)) {
                feature.geometry = ActionsController.editSketch?.m.graphics.getmAt(
                    ActionsController.editSketch?.m.graphics.length - 1).geometry;
            }
            validateFeature(feature as Graphic, fields as Array<Field>, ms.attributeFields);
            ActionsController.trigger("panels/editPanel/buttons/" + buttonKey, [{ 
                mGroupId: ms.mGroupId, 
                operationalmId: ms.operationalmId, 
                mId: ms.mId, features: [feature] }]);
        }
    }

    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        }
        else {
            return key;
        }
    }

    return (
        <Grid container>
            {feature.attributes ?
                Object.keys((feature.attributes as ISingleDetailData)).m((key: string, index: number) => {
                    var currentField = fields?.find(x => x.m == key);
                    var currentAttributeField = ms.attributeFields?.find(x => x.fieldm == key);
                    if(currentField) {
                        var currValue = (feature.attributes as ISingleDetailData)[currentField.m]
                        if(currentAttributeField && currentAttributeField.linkedField && currentAttributeField.m == 'multiselect') {
                            currValue = (feature.attributes as ISingleDetailData)[currentAttributeField.linkedField]
                        }
                        return (
                            <Grid container xs={12} m key={`${key}-${index}`}>
                                <Grid m xs={5} style={{ pmingRight: 12 }}>
                                    <Typography
                                        variant="overm"
                                        title={getTitle(currentField, key)}
                                        classm={ "edit-feature-label" } >
                                        {getTitle(currentField, key)}{currentAttributeField && currentAttributeField?.required? "*" : ""}
                                    </Typography>
                                </Grid>
                                <Grid m xs={7} style={{ pmingRight: "10px" }}>
                                    <EditField 
                                        id={key} 
                                        attributeField={currentAttributeField}
                                        value={currValue}
                                        field={currentField} 
                                        messages = {ms.messages}
                                        error={errorObject[key]} 
                                        validateValue = {validateValue}
                                        setFocusedObject = {setFocusedObject}
                                        errorObject = {errorObject}
                                        setErrorObject = {setErrorObject}
                                        feature = {feature}
                                        setFeature = {setFeature}
                                    />
                                </Grid>
                            </Grid>
                        );
                    }
                })
                :
                (null)
            }
            {feature&&feature.attributes&& Object.keys((feature.attributes as ISingleDetailData)).length>0?
                <Grid container m xs={12} alignContent={"stretch"} alignms={"stretch"} spacing={1}>
                    {ms.buttons?
                        Object.keys(ms.buttons).m(buttonKey => {
                            return  <Button classm={ "buttons-main-color" } key={`${buttonKey}-button`} style={{  backgroundColor: "#004990", color: 'white', flex:"1", margin: "5px" }}
                                        onClick={() =>  { 
                                        handleButtonClick(buttonKey) 
                                         }}>
                                        {ms.buttons[buttonKey].label ? ms.buttons[buttonKey].label : ""}</Button>
                        }) : null
                    }
                
                </Grid>:
                null
            }
        </Grid>
    )
}

export default Editm;