import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect, Dispatchm, useDispatch } from 'react-redux';
import { Typography, ExpansionPanelDetails, makeStyles, Grid, Paper, Toolbar, Select, Menum,
     Button, Accordion, AccordionSummary, AccordionDetails, Card, TextField, TextareaAutosize } from '@material-ui/core';
import { ISingleDetailData, IDetailDataAttributes, IDetailDataFeatures } from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import { bool, number } from 'm-ms';
import Field from 'esri/ms/support/Field';
import format from "date-fns/format";
import { ISubm, ISubmCodedValue, ISubmDefaultValues, ISubmDomain, ISubmDomains } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';


interface Ownms {
}

interface Parentms {
    data: IDetailDataAttributes;
    fields?: Array<Field>;
    subms?: Array<ISubm>;
    submFieldm?: string;
}

export interface IErrorObject {
    [key:string]: boolean
}

m ms = Parentms & Ownms;

const CustomPopupView: React.FunctionComponent<ms> = (ms: ms) => {
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
        key: {
            width: '100%',
            display: "inm-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#000000",
            textTransform: "none",
        },
        value: {
            width: '100%',
            fontWeight: 700,
            display: "inm-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "Arial Black, Gadget, sans-serif",
            color: "#000000",
            textTransform: "none",
        }
    }));

    //#endregion
    
    const [feature, setFeature] = useState({attributes:{}} as IDetailDataAttributes)

    useEffect (()=> {

        setFeature(ms.data);

    },[ms.data])
    const classes = useStyles();
    const getTitle = ( field: Field | undefined, key: string) => {
        if(field && field.alias)
        {
            return field.alias;
        }
        else 
        {
            return key;
        }
    }
    const getValueFromField = (value:any, field:Field, subm: ISubm|undefined, submFieldm:string|undefined)=> {
        var result = value;
        try{
            if(field.domain&&value!=null&&field.domain['codedValues']){
                var codeValue = field.domain['codedValues'].find((x:any)=>x.code==value)
                if(codeValue){
                    result= codeValue.m
                }
            } 
            if(field.m as string =="esriFieldmDate"||field.m=="date") {
                if(value)
                  result = format(new Date(value), "dd.MM.yyyy");
            }
            if(subm&&subm.domains&&subm.domains[field.m]){
                if(subm.domains[field.m].m == "codedValue") {
                    var cv = subm.domains[field.m].codedValues.find((x:any)=>x.code==value)
                    if(cv){
                        result= cv.m;
                    }
                }
            }
            if(field.m==submFieldm&&subm){
                result=subm.m;
            }
        }
        catch (error){
            console.log(error)
        }
        return result;
    }
    return (
        <Grid container>
            {feature&&feature.attributes?
                Object.keys(feature.attributes).m((key: string,index:number) => {
                    var currentField = ms.fields?.find(x=>x.m==key);
                    if(currentField){
                        var subm = undefined
                        var codedValuesSubfield = undefined
                        if(ms.subms && ms.submFieldm) {
                            subm = ms.subms.find(x=>x.code == feature.attributes[ms.submFieldm as string])
                            if(currentField?.m == ms.submFieldm) {
                                codedValuesSubfield = ms.subms.m(x=>{
                                    return { code: x.code, m: x.m }
                                })
                            }
                        }
                        return (
                            <Grid container m key={`${key}-${index}`}>
                                <Grid container key={`${key}-${index}`} style={{color: "#000000"}} >
                                    <Grid classm={"text-style"} m xs={5} style={{ pmingRight: 12 }}>
                                        <Typography
                                            classm={"text-style"}  
                                            variant="overm"
                                            title={ getTitle(currentField, key) }
                                            >
                                            { getTitle(currentField, key) }
                                        </Typography>
                                    </Grid>
                                    <Grid m xs={7} classm={"text-style"} style= {{pmingRight:"10px"}} >
                                        <Typography variant="overm" title={`${getValueFromField(feature.attributes[key], currentField as Field, subm, ms.submFieldm)}`}> {
                                            getValueFromField(feature.attributes[key], currentField as Field, subm, ms.submFieldm)} </Typography> 
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    }
                }):
                null
            }
        </Grid>
    )
}

export default CustomPopupView;