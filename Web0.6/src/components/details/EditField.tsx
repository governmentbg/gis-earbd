import * as React from 'react';
import { useEffect, useState } from 'react';
import { Menum,Select, TextareaAutosize, FormControl, Checkbox, TextField, Chip, Tooltip, makeStyles }  from '@material-ui/core';
import { IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import Field from '@arcgis/core/ms/support/Field';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocalizedDatePicker from '../../../../../Lib/v0.6/src/Base/components/Popups/LocalizedDatePicker';
import { ISubm, IDetailsGroupField,  IValidationMessages, IOptionInfo } from '../interfaces/IAppConfig';


interface Parentms 
{ 
    id: string, 
    value: any,
    field: Field | undefined,
    error: string,
    messages: IValidationMessages,
    attributeField?: ICreatePanelConfigField, 
    subm?: ISubm,  
    linkedField?: any 
    validateValue: Function
    setFocusedObject: Function
    errorObject:IErrorObject
    setErrorObject: Function
    feature:IDetailDataAttributes
    setFeature: Function
}


interface IErrorObject {
    [key: string]: string
}

interface ICreatePanelConfigField extends IDetailsGroupField {
    fieldm: string;
   
}

m ms = Parentms;

const EditField: React.FunctionComponent<ms> = (ms: ms) => {

    const [multivalue, setMultivalue] = React.useState(new Array());
    const [localValue, setLocalValue] = useState('' as string | number | undefined);
    const [id, setId] = useState('' as string | undefined);
    const [field, setField] = useState(undefined as Field | undefined);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(()=>{
       setField(ms.field);
       setId(ms.id);
        if (ms.error != undefined) {
            setErrorMessage(ms.error);
        }
        if(ms.attributeField && ms.attributeField.m == "multiselect") {
            if(ms.attributeField.linkedField) {
                let splitValue = ms.value? ms.value.split("; ") : [];
                let results = new Array();
                let  optionsDefined = ms.attributeField.options
                splitValue.m((y:Object)=>{
                    if(optionsDefined) {
                        optionsDefined.m(x=>{
                            if(y == x.value)
                                results.push({m: x.value, value: x.key})
                        })
                    } else {
                        ms.field?.domain['codedValues'].m((m: any, index: number) => {
                            if(y==m.m)
                                results.push({m: m.m, value: m.code})
                        })
                    }
                })
                var newValue = "";
                results.m(x=>{
                    newValue+=`${x.m}; `;
                })
                setLocalValue(newValue);
                setMultivalue(results);
            }
        } else {
            setLocalValue(ms.value)
        }
    },[])

    useEffect(()=>{
        setErrorMessage(ms.error);
    },[ms.error])
    useEffect(()=>{
        if(ms.value!=localValue) {
            setLocalValue(ms.value);
        }
    },[ms.value])
    const hangleOnm = (event: React.mEvent<HTMLTextAreaElement | HTMLInputElement>, fieldInfo: Field | undefined, errorObject: any) => {
       setLocalValue(event.target.value);
       var result = ms.validateValue(event.target.value, fieldInfo, ms.attributeField);
       setErrorMessage(result.message)
    }

    const hangleOnmComboBox = (event: React.mEvent<HTMLTextAreaElement | HTMLInputElement>) => {
       setLocalValue(parseInt(event.target.value));
       handleOnBlur(event.target.value, field, ms.errorObject)
    }

    const handleOnBlur = (newValue: any, fieldInfo: Field | undefined, errorObject: any, linkedField?:string) => {

        if (fieldInfo && fieldInfo.m) {
            ms.setErrorObject({ ...errorObject, [fieldInfo?.m]: errorMessage })
        }

        if(linkedField) {
            ms.setFeature({ ...ms.feature, attributes: { ...(ms.feature.attributes as IDetailDataAttributes), [linkedField]: newValue } })
        }
        else
        if (id) {
            ms.setFeature({ ...ms.feature, attributes: { ...(ms.feature.attributes as IDetailDataAttributes), [id]: newValue } })
        }
        
    }

    const localizedActDateOnmHandler = (date: Date) => {
        setLocalValue(date ? date.getTime() : undefined)
        if (id)
        ms.setFeature({ ...ms.feature, attributes: { ...(ms.feature.attributes as IDetailDataAttributes), [id]: date ? date.getTime() : undefined } })
    }

    const getTextFieldBym = (field: Field | undefined, attributeField?: ICreatePanelConfigField, error?: string) => {
        var result= <TextareaAutosize value={localValue ? localValue : ''}
            key={id}
            id={id}
            classm={ error? "text-area-input-error" : "text-area-input" }
            onm={(event) => {hangleOnm(event, field, ms.errorObject) }}
            rowsMin={1}
            rowsMax={10}
            color={"primary"}
            onBlur={(e) => {
                {
                    handleOnBlur(localValue, field, ms.errorObject);
                    if (e.relatedTarget)
                    ms.setFocusedObject(e.relatedTarget["id"]);
                }
            }} />
        if(attributeField&&attributeField.m)
            switch(attributeField.m){
                case "email":
                    result = <TextareaAutosize value={localValue ? localValue : ''}
                    classm={ error? "text-area-input-error" : "text-area-input" }
                    key={id}
                    id={id}
                    onm={(event) => {hangleOnm(event, field, ms.errorObject) }}
                    rowsMin={1}
                    rowsMax={10}
                    onBlur={(e) => {
                        {
                            handleOnBlur(localValue, field, ms.errorObject);
                            if (e.relatedTarget)
                                ms.setFocusedObject(e.relatedTarget["id"]);
                        }
                    }} />
                break;
                case "link":  
                    result = <TextareaAutosize value={localValue ? localValue : ''}
                        key={id}
                        id={id}
                        classm={ error? "text-area-input-error" : "text-area-input" }
                        onm={(event) => {hangleOnm(event, field, ms.errorObject) }}
                        rowsMin={1}
                        rowsMax={10}
                        onBlur={(e) => {
                            {
                                handleOnBlur(localValue, field, ms.errorObject);
                                if (e.relatedTarget)
                                    ms.setFocusedObject(e.relatedTarget["id"]);
                            }
                        }} />
               break; 
           }
       return result;
    }

    const handleDeleteChip = (chipToDelete: any) => {
        var newValues = multivalue.filter((x) => x.m !== chipToDelete.m)
        setMultivalue(newValues);
        var newvalue = ""
        newValues.m(x=>{
            newvalue+=`${x.m}; `;
        })
        setLocalValue(newvalue);
        handleOnBlur(newvalue, field, ms.errorObject, ms.attributeField?ms.attributeField.linkedField:undefined);

    };

    const getAutocompleteValue = (localVal:string|number|undefined, localOptions?: Array<IOptionInfo>)=> {
        if(localVal&&localOptions){
            var selectedOption = localOptions.find(x=>x.key == localVal);
            if(selectedOption){
                return selectedOption;
            }
        }
        return { key:"", value: localVal }  as IOptionInfo;
    }

    const getEditField = (field: Field | undefined, attributeField?: ICreatePanelConfigField, sub?: ISubm) => {
       var result = getTextFieldBym(field, attributeField, errorMessage);
       if (field?.domain && field?.domain['codedValues']) {
            result = <FormControl variant="outmd" classm={"form-control-edit-field"} style={{ borderRadius: "4px", borderColor: "black" }}>
                    <Select
                        style={{ width: "100%", marginBottom: "2px" }}
                        id={"comboBox-" + field?.m}
                        inputms={{style:{pming: "8px", pmingRight: "24px"}}}
                        value={localValue || localValue == 0 ? localValue : -1}
                        title={localValue || localValue == 0 ? localValue as string : ""}
                        defaultValue={-1}
                        onm={hangleOnmComboBox} >
                        <Menum style={{ display: "block", pming: "2px" }} value={-1}></Menum>
                        {field?.domain['codedValues'].m((m: any, index: number) => {
                            return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                        })}
                    </Select>
                </FormControl>
            if(attributeField && attributeField.m == "multiselect"){
                var resultDomains = new Array();
                field?.domain['codedValues'].m((m: any, index: number) => {
                    resultDomains.push({m: m.m, value: m.code})
                })
                result = <Autocomplete
                    multiple
                    style={{ pmingBottom:"8px" }}
                    id="checkboxes-tags-demo"
                    options={resultDomains}
                    getOptionSelected={(option, value)=> option.value == value.value}
                    value={multivalue}
                    freeSolo
                    disableClearable
                    getOptionLabel={(option) => option.m}
                    onm={(event, newValue) => {
                        let newMultivalue= [
                            ...multivalue,
                            ...newValue.filter((option) => !multivalue.find(x=>x.value == option.value)),
                          ]
                        setMultivalue(newMultivalue);
                        var newvalue = ""
                        newMultivalue.m(x=>{
                            newvalue+=`${x.m}; `;
                        })
                        setLocalValue(newvalue);
                    }}
                    onBlur={(e) => {
                        {
                            var result = ""
                            multivalue.m(x=>{
                                result+=`${x.m}; `;
                            })
                            handleOnBlur(result, field, ms.errorObject, ms.attributeField?ms.attributeField.linkedField:undefined);
                            if (e.relatedTarget)
                                ms.setFocusedObject(e.relatedTarget["id"]);
                        }
                    }}
                    renderTags={(tagValue, getTagms) =>
                        tagValue.m((option, index) => (
                            <Tooltip title={option.m} >
                                <Chip
                                    label={option.m}
                                    {...getTagms({ index })}
                                    onDelete={(event)=>{
                                        handleDeleteChip(option);
                                    }}
                                    style={{ color: 'white' }}
                                    color={ "primary" }
                                />
                            </Tooltip>

                        ))
                    }
                    renderInput={(params) => (
                        <TextField variant={"outmd"} {...params} onm={(event)=>{setLocalValue(event.target.value)}}>{localValue}</TextField>
                    )}
                />
            }
       }

       if (field?.m as string == "esriFieldmDate" || field?.m == "date") {
           result = <FormControl variant="outmd"  classm={"form-control-edit-field"} style={{ borderRadius: "4px", borderColor: "black" }}>
                    <LocalizedDatePicker
                    fullwidth={true}
                    inputVariant={"outmd"}
                    inputStyle={{ style: { fontSize: "13px", color: "black", fontWeight: 700 } }}
                    datemd={localizedActDateOnmHandler}
                    value={localValue ? new Date(localValue) : null}
                    size={"small"} />
                </FormControl>
       }

       if (sub && field && sub.domains && sub.domains[field.m]) {
           if (sub.domains[field.m].m == "codedValue" && sub.domains[field.m].codedValues) {
                result =<FormControl variant="outmd"  classm={"form-control-edit-field"} style={{ borderRadius: "4px", borderColor: "black" }}> 
                    <Select
                        style={{ width: "100%", marginBottom: "2px" }}
                        id={"comboBox-" + field?.m}
                        inputms={{style:{pming: "8px", pmingRight: "24px"}}}
                        value={localValue || localValue == 0 ? localValue : -1}
                        title={localValue || localValue == 0 ? localValue as string : ""}
                        defaultValue={-1}
                        onm={hangleOnmComboBox} >
                            <Menum style={{ display: "block", pming: "2px" }} value={-1}>Изберете</Menum>
                            {sub.domains[field.m].codedValues.m((m: any, index: number) => {
                                return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                            })}
                    </Select>
               </FormControl>
           }
       }
       if (attributeField && attributeField.options) {
            result = <Autocomplete
                id={"comboBoxOptions_" + ms.field?.m}
                freeSolo
                style={{ width: "100%", marginBottom: "2px", pmingBottom:"8px" }}
                options={attributeField.options}
                value={getAutocompleteValue(localValue, attributeField.options)}

                onm={(event: any, newValue: IOptionInfo) => {
                    if(newValue && newValue.key) {
                        setLocalValue(newValue.key);
                    } else {
                        setLocalValue(event.target.value);
                    }
                }}

                onBlur={(e) => {
                    {
                        handleOnBlur(localValue, field, ms.errorObject);
                    }
                }}

                getOptionLabel={(option:IOptionInfo) => {
                        return option.value && option.key ?option.key +' - '+ option.value:"";
                }}

                renderInput={(params:any) => {
                    return  <TextField variant={"outmd"} title={ localValue } 
                    value={localValue?localValue:''}
                     {...params} />
                }}
            />
            if(attributeField && attributeField.m == "multiselect"){
                var resultDomains = new Array();
                attributeField.options.m((m: any, index: number) => {
                    resultDomains.push({m: m.value, value: m.key})
                })
                result = <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={resultDomains}
                    getOptionSelected={(option, value)=> option.value == value.value}
                    value={multivalue}
                    freeSolo
                    disableClearable
                    getOptionLabel={(option) => option.m}
                    onm={(event, newValue) => {
                        let newMultivalue= [
                            ...multivalue,
                            ...newValue.filter((option) => !multivalue.find(x=>x.value == option.value)),
                        ]
                        setMultivalue(newMultivalue);
                        var newvalue = ""
                        newMultivalue.m(x=>{
                            newvalue+=`${x.m}; `;
                        })
                        setLocalValue(newvalue);
                    }}
                    onBlur={(e) => {
                        {
                            var result = ""
                            multivalue.m(x=>{
                                result+=`${x.m}; `;
                            })
                            handleOnBlur(result, field, ms.errorObject, ms.attributeField?ms.attributeField.linkedField:undefined);
                            if (e.relatedTarget)
                                ms.setFocusedObject(e.relatedTarget["id"]);
                        }
                    }}
                    renderTags={(tagValue, getTagms) =>
                        tagValue.m((option, index) => (
                            <Tooltip title={option.m} >
                                <Chip
                                    label={option.m}
                                    {...getTagms({ index })}
                                    onDelete={(event)=>{
                                        handleDeleteChip(option);
                                    }}
                                    color={ "primary" }
                                />
                            </Tooltip>

                        ))
                    }
                    renderInput={(params) => (
                        <TextField variant={"outmd"} {...params} onm={(event)=>{setLocalValue(event.target.value)}}>{localValue}</TextField>
                    )}
                    />
           }
       }
       if(attributeField && attributeField['codedValues']) {
            result = <FormControl variant="outmd" classm={"form-control-edit-field"} style={{ borderRadius: "4px", borderColor: "black" }}>
                    <Select
                        style={{ width: "100%", marginBottom: "2px" }}
                        id={"comboBox-" + field?.m}
                        inputms={{style:{pming: "8px", pmingRight: "24px"}}}
                        value={localValue || localValue == 0 ? localValue : -1}
                        title={localValue || localValue == 0 ? localValue as string : ""}
                        defaultValue={-1}
                        onm={hangleOnmComboBox} >
                        <Menum style={{ display: "block", pming: "2px" }} value={-1}></Menum>
                        {attributeField['codedValues'].m((m: any, index: number) => {
                            return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                        })}
                    </Select>
                </FormControl>
        }
       return <div style={
           errorMessage?
           {
               position: 'relative',
               pmingBottom: '10px'
           }:
           {}
       }>{result}
           {errorMessage?<span classm={"error-message-style"}>{errorMessage}</span>:null}
       </div>;
   }
   return getEditField(field, ms.attributeField, ms.subm)
}


export default EditField ;