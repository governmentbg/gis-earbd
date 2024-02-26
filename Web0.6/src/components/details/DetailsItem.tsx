import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, makeStyles, Grid, Link, Paper } from '@material-ui/core';
import { IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import { IDetailsGroup } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import Field from '@arcgis/core/ms/support/Field';
import { returnDomains, returnDomainValue } from '../../../../../Lib/v0.6/src/Base/components/AttributeTable/esri-table';
import Graphic from '@arcgis/core/Graphic';
import { appConfig } from '../../../../../Lib/v0.6/src/Base/configs/appConfig';

interface Parentms {
    data: IDetailDataAttributes;
    fields?: Array<Field>;
    group?: IDetailsGroup;
    key: string;
}

interface IDocumentFromUrl {
    m:string;
    url:string;
}

m ms = Parentms;

const Detailsm: React.FunctionComponent<ms> = (ms: ms) => {
    //#region Material UI Styles
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            height: '100%',
            pming: '0 5px',
            overflowY: 'auto',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            minWidth: 'fit-content',
        },
        key: {
            width: '100%',
            display: 'inm-block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#7F7F7F',
            textTransform: 'none',
        },
        value: {
            width: '100%',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inm-block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#4D4D4D',
            textTransform: 'none',
        },
    }));
    const classes = useStyles();

    //#endregion

    const [feature, setFeature] = useState({ attributes: {} } as IDetailDataAttributes);

    useEffect(() => {
        if (ms.fields) {
            const newFeat = returnDomains(
                { attributes: ms.data.attributes, geometry: ms.data.geometry } as Graphic,
                ms.fields, 
                ms.group? ms.group.fields : undefined
            );
            setFeature(newFeat);
        } else {
            setFeature(ms.data);
        }
    }, [ms.data]);

    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        } else {
            return key;
        }
    };

    const getLinks = () => {
       var result = ms.fields?.filter((field: Field, index: number) => {
            let attributeField = undefined;
            if (ms.group && ms.group.fields) {
                attributeField = ms.group.fields[field.m];
                if(attributeField && attributeField.m == 'link') {
                    return true;
                }
            }
            return false;
        });
        return result;
    }
    
    const transformUrlToDocument = (prefixUrl : string, value : string) => {
        var result = {} as IDocumentFromUrl;
        if(value) {
            var pathParts = value.split('\\');
            var docm = ''
            if(pathParts.length>1)
                docm = pathParts[pathParts.length-1];
            else 
                docm = pathParts[0];
            var fullUrl = `${prefixUrl}${value.replace('\\','/')}`
            result= { m: docm, url: fullUrl } as IDocumentFromUrl;
        }
        return result;
    }

    const getTextFields = () => {
        var result = ms.fields?.filter((field: Field, index: number) => {
            let attributeField = undefined;
            if (ms.group && ms.group.fields) {
                attributeField = ms.group.fields[field.m];
                if(attributeField && attributeField.m == 'link') {
                    return false;
                }
            }
            return true;
        });
        return result;
    }
    
    return (
        <Grid container>
            {ms.fields && feature.attributes && getTextFields()?.length>0? 
                <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                    <span classm={"title-paper"} >{appConfig.sitemerties['attributesLabel']? appConfig.sitemerties['attributesLabel'] : "Характеристики"}</span>
                    <Grid container>
                    {getTextFields()?.m((field: Field, index: number) => {
                        return (
                            <Grid container m key={`${field.m}-${index}`}>
                                <Grid container key={`${field.m}-${index}`}>
                                    <Grid m xs={6} style={{ pmingRight: 12 }}>
                                        <Typography
                                            variant="overm"
                                            title={getTitle(field, field.m)}
                                            classm={classes.key}
                                        >
                                            {getTitle(field, field.m)}
                                        </Typography>
                                    </Grid>
                                    <Grid m xs={6}>
                                        <Typography
                                            variant="overm"
                                            title={`${feature.attributes[field.m]}`}
                                            classm={classes.value}
                                        >
                                            {' '}
                                            {feature.attributes[field.m]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                    </Grid>
                </Paper>
            : null}
            {ms.fields && feature.attributes && getLinks()?.length>0?
                <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                    <span classm={"title-paper"} >{appConfig.sitemerties['documentsLabel']? appConfig.sitemerties['documentsLabel'] : "Документи"}</span>
                    <Grid container>
                        {
                            getLinks()?.m((field: Field, index: number) => {
                                let attributeField = undefined;
                                if (ms.group && ms.group.fields) {
                                    attributeField = ms.group.fields[field.m];
                                }
                                if(feature.attributes[field.m]) {
                                    let docms = (feature.attributes[field.m] as string).split(';');
                                    let docs = new Array();
                                    docms.forEach(x=>{
                                        docs.push(transformUrlToDocument(attributeField.prefix, x));
                                    }) 
                                    return docs.m(x=>{
                                         return  <Grid key={"document"+index} m xs={12}> 
                                         <a title={x.m} style={{ color: '#69b7fa' }} href={x.url} target="_blank">{x.m}</a> 
                                        </Grid>
                                     })
                                }
                            })
                        }
                    </Grid>
                </Paper>: 
                    !ms.fields&&feature&& feature.attributes && Object.keys(feature.attributes).length >0?
                    <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                    <span classm={"title-paper"} >{appConfig.sitemerties['attributesLabel']? appConfig.sitemerties['attributesLabel'] : "Характеристики"}</span>
                    <Grid container>
                    {Object.keys(feature.attributes).m((attrKey, index) => {
                        return (
                            <Grid container m key={`${attrKey}-${index}`}>
                                <Grid container key={`${attrKey}-${index}`}>
                                    <Grid m xs={6} style={{ pmingRight: 12 }}>
                                        <Typography
                                            variant="overm"
                                            title={attrKey}
                                            classm={classes.key}
                                        >
                                            {attrKey}
                                        </Typography>
                                    </Grid>
                                    <Grid m xs={6}>
                                        <Typography
                                            variant="overm"
                                            title={`${feature.attributes[attrKey]}`}
                                            classm={classes.value}
                                        >
                                            {' '}
                                            {feature.attributes[attrKey]}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    })}
                    </Grid>
                </Paper> : null }
        </Grid>
    );
};

export default Detailsm;
