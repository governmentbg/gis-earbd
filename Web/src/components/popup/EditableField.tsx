import * as React from 'react';
import { useState, useEffect } from 'react';
import Field from 'esri/ms/support/Field';
import { ISingleDetailData, IDetailDataAttributes, IDetailDataFeatures } from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import { ISubm, ISubmCodedValue, ISubmDefaultValues, ISubmDomain, ISubmDomains } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { Typography, ExpansionPanelDetails, makeStyles, Grid, Paper, Toolbar, Select, Menum,
    Button, Accordion, AccordionSummary, AccordionDetails, Card, TextField, TextareaAutosize } from '@material-ui/core';
import LocalizedDatePicker from '../create/LocalizedDatePicker';
import { IErrorObject } from './CustomPopupView';


interface ms { 
    id: string, 
    value: any, 
    localFeature:IDetailDataAttributes, 
    field: Field | undefined, 
    error: boolean, 
    subm: ISubm | undefined, 
    codedValues?: any,
    errorObject: IErrorObject,
    updateErrorObject: (errObj: IErrorObject) => void
    updateFeature: (f: IDetailDataAttributes) => void
}

const RenderEditField =(ms: ms) => {

    const [localValue, setLocalValue] = useState( '' as string | number | undefined | Date);

    const [id, setId] = useState('' as string | undefined);

    const [field, setField] = useState(undefined as Field|undefined);
    const [localFeature, setLocalFeature] = useState({attributes:{}} as IDetailDataAttributes);

    const [error, setError] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
        setLocalFeature(ms.localFeature);
    },[ms.localFeature])
    useEffect(() => 
    {
        setField(ms.field);
    }, [ms.field])
    useEffect(() => 
    {
        if(error!=undefined){
            setError(ms.error)
        }
    }, [ms.error])
    useEffect(() => 
    {
        setLocalValue(ms.value);
    }, [ms.value])

    useEffect(() => 
    {
        setId(ms.id);
    }, [ms.id])

    const validateValue = (value: string,  fieldInfo : Field | undefined) =>
    {
        var result = true
        if(fieldInfo)
        {
            if(value&&fieldInfo.length && value.length > fieldInfo.length) 
            {
                result = false;
                setErrorMessage("Max lenght: " + fieldInfo.length)
            }
            if(value&&fieldInfo.m as string == "esriFieldmInteger" || fieldInfo.m as string == 'esriFieldmOID') 
            {
                if(value != `${parseInt(value,10)}`)
                {
                    result = false;
                    setErrorMessage("Numbers only");
                }
            }
            if(value&&fieldInfo.m as string == "esriFieldmDouble") 
            {
                if(value != `${parseFloat(value)}`)
                {
                    result = false;
                    setErrorMessage("Numbers only");
                }
            }
            if(fieldInfo.nullable==false&&!value) {
                result = false;
                setErrorMessage("Required");
            }
        } 
        return result;
    } 

    const hangleOnm = (event:React.mEvent<HTMLTextAreaElement|HTMLInputElement>, fieldInfo : Field | undefined, errorObject : any) => 
    {
       setLocalValue(event.target.value);
       var result = validateValue(event.target.value, fieldInfo);
       setError(!result)
    }

    const hangleOnmComboBox = (event:React.mEvent<HTMLTextAreaElement|HTMLInputElement>) => 
    {
        setLocalValue(parseInt(event.target.value));
        if(parseInt(event.target.value)!=-1)
            handleOnBlur(parseInt(event.target.value), field, ms.errorObject)
        else
            handleOnBlur(null, field, ms.errorObject)
    }

    const handleOnBlur = (newValue:any, fieldInfo : Field | undefined, errorObject : any) => {
        if(fieldInfo && fieldInfo.m) {
             ms.updateErrorObject({...errorObject, [fieldInfo?.m]: error})
        }
        if(id)
        ms.updateFeature({...localFeature,attributes:{ ...localFeature.attributes, [id] : newValue}})
    }
    
    const localizedActDateOnmHandler = (date: Date) => {
        if(id){
            setLocalValue(date);
            ms.updateFeature({...localFeature , attributes:{ ...localFeature.attributes, [id] : date?date.getTime():date}})
        }
            
    };

    const getEditField = (field:Field|undefined, sub?:ISubm, codedValues?:any) => {
        var result = <TextareaAutosize value={localValue ? localValue as string : ''}
            onm={(event)=>{ hangleOnm(event, field, ms.errorObject ) }} 
            rowsMin={1}
            rowsMax={10}
            style={error? {borderColor: "red", width:"100%", minHeight:"25px", maxWidth:"100%"} : {width:"100%", minHeight:"25px", maxWidth:"100%"}}
            onBlur={()=>{ handleOnBlur(localValue,field,ms.errorObject) }}/>
        // if(field?.length>200) {
        //     result = <TextField  value={ localValue }
        //     onm={(event)=>{ hangleOnm(event, field, errorObject ) }} 
        //     multim
        //     rows={3}
        //     error={error}
        //     label={error? "Error" : ""}
        //     helperText={error? errorMessage : ""}
        //     style={{width:"100%"}}
        //     Inputms={error?{style:{color:'red'}}:{}}
        //     onBlur={()=>{ handleOnBlur(localValue,field,errorObject) }}>{ localValue }</TextField>;
        // }
        if(field?.domain&&field?.domain['codedValues']){
            result = <Select
                style={{width:"100%", marginBottom:"2px"}}
                id={"comboBox-" + field?.m}
                value={localValue||localValue==0?localValue:-1}
                defaultValue={-1}
                onm={hangleOnmComboBox} >
                <Menum style={{display:"block", pming:"2px"}} value={-1}>Изберете</Menum>
                {field?.domain['codedValues'].m((m:any, index:number)=>{
                        return (<Menum key={"menu-m-"+index} style={{display:"block", pming:"2px"}} value={m.code}>{m.m}</Menum>)
            })}
            </Select>
        }
        if(field?.m as string == "esriFieldmDate" || field?.m=="date") {
            result= <LocalizedDatePicker
                fullwidth={true}
                inputVariant={"standard"}
                inputStyle={{ style: { fontSize: "13px", color: "black", fontWeight: 700 } }}
                datemd={localizedActDateOnmHandler}
                value={localValue ? new Date(localValue) : null}
                size={"small"} />
        }
        if(sub&&field&&sub.domains&&sub.domains[field.m]){
            if(sub.domains[field.m].m == "codedValue"&&sub.domains[field.m].codedValues) {
                result = <Select
                    style={{width:"100%", marginBottom:"2px"}}
                    id={"comboBox-" + field?.m}
                    value={localValue||localValue==0?localValue:-1}
                    defaultValue={-1}
                    onm={hangleOnmComboBox} >
                    <Menum style={{display:"block", pming:"2px"}} value={-1}>Изберете</Menum>
                    {sub.domains[field.m].codedValues.m((m:any, index:number)=>{
                        return (<Menum key={"menu-m-"+index} style={{display:"block", pming:"2px"}} value={m.code}>{m.m}</Menum>)
                    })}
                </Select>
            }
        }
        if(codedValues){
            result = <Select
            style={{width:"100%"}}
            id={"comboBox-" + field?.m}
            value={localValue?localValue:-1}
            defaultValue={-1}
            onm={hangleOnmComboBox} >
            <Menum style={{display:"block", pming:"2px"}} value={-1}>Изберете</Menum>
            {codedValues.m((m:any,index:number)=>{
                return (<Menum key={"menu-m-"+index} style={{display:"block", pming:"2px"}} value={m.code}>{m.m}</Menum>)
            })}
        </Select>
        }
        return result;
    }
    return getEditField(field, ms.subm, ms.codedValues)
        
}

export default RenderEditField;