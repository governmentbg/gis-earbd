import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect, Dispatchm, useDispatch } from 'react-redux';
import {
    Typography, ExpansionPanelDetails, makeStyles, Menum, Grid,
    Paper, Select, IconButton, Toolbar, InputBase, Button, Accordion, AccordionSummary, TextareaAutosize, AccordionDetails, Card, TextField
}
    from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { ISingleDetailData, IDetailDataAttributes, IDetailDataFeatures }
    from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import { number } from 'm-ms';
import Field from 'esri/ms/support/Field';
import { IAppStore, IDetailsLeyerInfo, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import Graphic from 'esri/Graphic'
import { IFieldInfo } from '@esri/arcgis-rest-common-ms';
import Activityms from 'ReactTemplate/Base/../ActionsController/Activityms';
import ActionsController
    from 'ReactTemplate/Base/../ActionsController/ActionsController';
import { clearSelection, zoomToFeature } from 'ReactTemplate/Base/../ActionsController/Actions';
import Editor from "esri/widgets/Editor";
import Graphicsm from 'esri/ms/Graphicsm'
import Sketch from 'esri/widgets/Sketch'
import SketchCreateEvent from 'esri/widgets/Sketch'
import RowOnHoverButton
    from 'ReactTemplate/Base/components/AttributeTable/RowOnHoverButton';
import RoomIcon from '@material-ui/icons/Room';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { IConfigmGroup, IConfigmView, ISpecificmm, IConfigm, IConfigmGroups, ISubm, IDetailsGroup, IConfigOperationalm, IConfigField, IButtonInfo}
    from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { zoomToGraphic } from 'ReactTemplate/Base/helpers/helperFunctions';
import axios from 'axios'
import { ImDispatcher, ICustomPopupDispatcher } from "ReactTemplate/Base/interfaces/dispatchers";
import { mDispatcher } from "ReactTemplate/Base/actions/dispatchers";
import { customPopupDispatcher } from "ReactTemplate/Base//actions/dispatchers";
import { v4 as uuid } from 'uuid';
import FieldsHelper from "ReactTemplate/Base/helpers/FieldsHelper";
import SimplemSymbol from 'esri/symbols/SimplemSymbol';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import LocalizedDatePicker from '../create/LocalizedDatePicker'
import mIcon from '@material-ui/icons/m';
import ClearIcon from '@material-ui/icons/Clear';
import UserHelper from '../UserHelper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Featurem from 'esri/ms/Featurem';
import DocumentDetails from '../popup/DocumentDetails';
import SpatialReference from 'esri/geometry/SpatialReference';
import Query from 'esri/tasks/support/Query';
import QueryTask from 'esri/tasks/QueryTask';
import FeatureSet from 'esri/tasks/support/FeatureSet'
import Geometry from 'esri/geometry/Geometry'


interface Ownms {
    userInfo: IUserInfo;
    configObjectmGroups: IConfigmGroups;
}
 
interface Parentms {
    // mGroup:ImGroupConfig;
    //mId: Array<string> | undefined;
    settlementUrl: string; 
    municipalityUrl: string;
    districtUrl: string;
    active?:boolean;
    helpText?:string;
    attributesText?: string;
    documentText?: string;
    okDocumentText?:string;
    cancelDocumentText?:string;
    mDocumentText?:string;
    deleteDocumentText?:string;
    dialogDocumentText?:string;
    selectText?:string;
    buttons: {
        save: IButtonInfo,
        cancel:IButtonInfo
    }
    groups: {
        [key: string]: IDetailsGroup;
    }
}
interface Dispatchms extends ImDispatcher, ICustomPopupDispatcher {
}

interface IKeyValue {
    key: string;
    value: string;
}
 
interface IErrorObject {
    [key: string]: boolean
}

m ms = Parentms & Ownms & Dispatchms;

const CreateFeature: React.FunctionComponent<ms> = (ms: ms) => {

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
        title: {
            width: '100%',
            display: "inm-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "Arial, Helvetica, sans-serif",
            color: "#000000",
            textTransform: "none",
            fontSize:"15px",
            textAlign:"center"
        },
        value: {
            width: '100%',
            fontWeight: 700,
            display: "inm-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontFamily: "Arial Black, Gadget, sans-serif",
            color: "#4D4D4D",
            textTransform: "none",
        }
    }));

    const [feature, setFeature] = useState({} as IDetailDataAttributes)
    const [m, setm] = useState({} as IDetailsLeyerInfo)
    const [files, setFiles] = useState(new Array<File>())
    const [selectedIndex, setSelectedIndex] = useState(0 as number);
    const [ms, setms] = useState(new Array<IDetailsLeyerInfo>())
    const [sketch, setSketch] = useState(undefined as Sketch | undefined);
    const [messageOpen, setMessageOpen] = useState(false);
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [errorMessageText, setErrorMessageText] = useState("");
    const [success, setSuccess] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [createMode, setCreateMode] = useState(false);
    const [errorObject, setErrorObject] = useState({} as IErrorObject);
    const [graphic, setGraphic] = useState(undefined as Graphic | undefined);
    const [lastFocusedId, setFocusedObject] = useState("");

    var msToExclude = ['objectid', 'created_user',
        'created_date',
        'last_edited_user',
        'last_edited_date']

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
        if(graphic)
            setAdminInfoms(graphic);
    }, [graphic])

    useEffect(() => {
        if (sketch && !sketch.destroyed) {
            ActionsController.getmView().mView.ui.m(sketch, "bottom-left");
            ActionsController.setmClick(false);
            sketch.on("create", (event) => {
                log('start sketch')
                if (event.state === "complete") {
                    if (sketch.m.graphics.length > 1) {
                        sketch.m.graphics.m(sketch.m.graphics.getmAt(0))
                    }
                    if (sketch.m.graphics.length > 0) {
                        setGraphic(sketch.m.graphics.getmAt(0))
                    }
                }
            });
        } else {
            if (sketch && sketch.destroyed) {
                ActionsController.getmView().mView.ui.m(sketch)
            }
        }
    }, [sketch])

    useEffect(() => {
        if (m.fields) {
            var graphic = { attributes: {}, geometry: undefined } as IDetailDataAttributes
            m.fields.forEach((x: Field, index: number) => {
                if (msToExclude.indexOf(x.m) == -1)
                    graphic.attributes[x.m] = null;
            })
            setFeature({ ...graphic });

        }
    }, [m])

    useEffect(() => {
        if (ms && ms.length > 0) {
            setSelectedIndex(0);
            setm(ms[0])
        }
    }, [ms])

    useEffect(() => {
        if (ms.groups && Object.keys(ms.groups).length > 0) {
            var newms = new Array<IDetailsLeyerInfo>();
            Object.keys(ms.groups).m(id => {
                var group = ms.groups[id];
                if (ms.configObjectmGroups[group.mGroupId]) {
                    var operationalms = ms.configObjectmGroups[group.mGroupId].operationalms;
                    if(operationalms){
                        Object.keys(operationalms).m(olKey => {
                            var operationalm =  (operationalms as IConfigOperationalm)[olKey];
                            var ms = operationalm.ms;
                            if(ms){
                                Object.keys(ms).m(mKey=>{
                                    var m = (ms as IConfigm)[mKey];
                                        newms.push({
                                            url: m.url,
                                            formatString: group.formatString,
                                            geometrym: m['geometrym'],
                                            attributeFields: Object.keys(group.fields).m(key=>{
                                                return { fieldm: key, 
                                                        options: group.fields[key]['options'], 
                                                        label: group.fields[key].label, 
                                                        required: group.fields[key]['required'],
                                                        codedValues: group.fields[key]['codedValues']
                                                    }}),
                                            attributeFieldsMode: m['attributeFieldsMode'],
                                            mGroupId: group.mGroupId,
                                            operationalmId: group.operationalmId,
                                            mId: group.mId,
                                            title: group.title,
                                            fields: m['esrifields'] ,
                                        } as IDetailsLeyerInfo)
                                  })
                            }
                        })
                    }
                }
            })
            setms(newms);
        }
    }, [ms.configObjectmGroups])

    const classes = useStyles();
    const CreateButton = (ms: { m?: IDetailsLeyerInfo }) => {
        return (
            <IconButton 
                style={{
                    position: 'absolute',
                    right: 35,
                    top: 0,
                    marginTop: '12px'
                }}
                size="small"
                disableRipple={true} 
                disableFocusRipple={true}
                title={"Създаване"}
                onClick={() => {
                    if (ms.m)
                        handleClickm(ms.m);
                }} >
                    <mIcon style={{ height: '30px', color: "#69b7fa", cursor: "mer" }} />
            </IconButton>
        )
    }

    const ClearButton = () => {
        return (
            <IconButton 
                style={{
                    position: 'absolute',
                    right: 35,
                    top: 0,
                    marginTop: '12px'
                }}
                size="small"
                disableRipple={true} 
                disableFocusRipple={true}
                title={"Създаване"}
                onClick={() => {
                    handleCancel();
                }} >
                    <ClearIcon style={{ height: '30px', color: "#69b7fa", cursor: "mer" }} />
            </IconButton>
        )
    }
    //https://ibbdr1081.gisinv.bg/arcgis/rest/services/APSFR/AnnoLandcover/mServer/5
    //https://ibbdr1081.gisinv.bg/arcgis/rest/services/APSFR/AnnoLandcover/mServer/6
    //https://ibbdr1081.gisinv.bg/arcgis/rest/services/APSFR/AnnoLandcover/mServer/7

    const setAdminInfoms = (graphic:Graphic)=>{
        getAdminInfom(graphic, ms.settlementUrl,'m').then(settlement=>{
            getAdminInfom(graphic, ms.municipalityUrl,'m').then(municipality=>{
                getAdminInfom(graphic, ms.districtUrl,'m').then(district=>{
                   var result =  { ...feature }
                   result.attributes['settlement'] = settlement;
                   result.attributes['municipality'] = municipality;
                   result.attributes['district'] = district;
                   setFeature(result);
                });
            });
        })  
    }

    const getAdminInfom = (graphic:Graphic, url: string, field:string) => {
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
                    resolve(resultFeatuer.attributes[field]);
                } else {
                    resolve('')
                }
            }).catch(error =>
                console.error(error)
            );
        });
    }

    const RenderEditField = (ms: { id: string, value: any, field: Field | undefined, error: boolean, subm: ISubm | undefined, options?: Array<IKeyValue>,
            required?: boolean, linkedField?: Field,   codedValues?: any, selectLabel:string }) => {

        const [localValue, setLocalValue] = useState('' as string | number | undefined);

        const [id, setId] = useState('' as string | undefined);

        const [field, setField] = useState(undefined as Field | undefined);

        const [error, setError] = useState(false);

        const [errorMessage, setErrorMessage] = useState('');


        useEffect(() => {
            setField(ms.field);
        }, [ms.field])
        useEffect(() => {
            if (error != undefined) {
                setError(ms.error)
            }
        }, [ms.error])
        useEffect(() => {
            setLocalValue(ms.value);
        }, [ms.value])

        useEffect(() => {
            setId(ms.id);
        }, [ms.id])

        const validateValue = (value: string, fieldInfo: Field | undefined) => {
            var result = true
            if (fieldInfo) {
                if (value && fieldInfo.length && value.length > fieldInfo.length) {
                    result = false;
                    setErrorMessage("Max lenght: " + fieldInfo.length)
                }
                if (value && fieldInfo.m as string == "esriFieldmInteger" || fieldInfo.m as string == 'esriFieldmOID') {
                    if (value != `${parseInt(value, 10)}`) {
                        result = false;
                        setErrorMessage("Numbers only")
                    }
                }
                if (value && fieldInfo.m as string == "esriFieldmDouble") {
                    if (value != `${parseFloat(value)}`) {
                        result = false;
                        setErrorMessage("Numbers only");
                    }
                }
                if ((fieldInfo.nullable == false && !value)||(ms.required&&!value)) {
                    result = false;
                    setErrorMessage("Required");
                }
            }
            return result;
        }

        const hangleOnm = (event: React.mEvent<HTMLTextAreaElement | HTMLInputElement>, fieldInfo: Field | undefined, errorObject: any) => {
            setLocalValue(event.target.value);
            var result = validateValue(event.target.value, fieldInfo);
            if(fieldInfo?.m=="email"){
                result = validateEmail(event.target.value)
            }
            setError(!result)
        }
        const hangleOnmComboBox = (event: React.mEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setLocalValue(parseInt(event.target.value));
            handleOnBlur(parseInt(event.target.value), field, errorObject)
        }
        const handleOnBlur = (newValue: any, fieldInfo: Field | undefined, errorObject: any) => {

            if (fieldInfo && fieldInfo.m) {
                setErrorObject({ ...errorObject, [fieldInfo?.m]: error })
            }
            if (id)
                setFeature({ ...feature, attributes: { ...feature.attributes, [id]: newValue } })
        };

        const localizedActDateOnmHandler = (date: Date) => {
            if (id)
                setFeature({ ...feature, attributes: { ...feature.attributes, [id]: date ? date.getTime() : date } })
        };

        const getAutocompleteValue = (localVal:string|number|undefined, localOptions?: Array<IKeyValue>)=> {
            if(localVal&&localOptions){
                var selectedOption = localOptions.find(x=>x.key == localVal);
                if(selectedOption){
                    return selectedOption;
                }
            }
            return { key:"", value: localVal }  as IKeyValue;
        };

        const validateEmail = (email:string) =>
        {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        const getEditField = (field: Field | undefined, sub?: ISubm, codedValues?: any) => {
            var result = <TextareaAutosize value={localValue ? localValue : ''}
                key={id}
                  id={id}
                onm={(event) => { hangleOnm(event, field, errorObject) }}
                rowsMin={1}
                rowsMax={10}
                required={ms.required? ms.required: false}
                style={error ? { borderColor: "red", width: "100%", minHeight: "25px", maxWidth: "100%" } : { width: "100%", minHeight: "25px", maxWidth: "100%" }}
                onBlur={(e) => {
                    {
                        handleOnBlur(localValue, field, errorObject);
                        if (e.relatedTarget)
                            setFocusedObject(e.relatedTarget["id"]);
                    }
                }} />
            if ((field?.domain && field?.domain['codedValues'])|| codedValues ) {
                result = <Select
                    style={{ width: "100%", marginBottom: "2px" }}
                    id={"comboBox-" + field?.m}
                    value={localValue || localValue == 0 ? localValue : -1}
                    defaultValue={-1}
                    onm={hangleOnmComboBox} >
                    <Menum style={{ display: "block", pming: "2px" }} value={-1}>{ms.selectLabel}</Menum>
                    {codedValues?
                     codedValues.m((m: any, index: number) => {
                        return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                    }):
                    field?.domain['codedValues'].m((m: any, index: number) => {
                        return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                    })}
                </Select>
            }
            if (field?.m as string == "esriFieldmDate" || field?.m == "date") {
                result = <LocalizedDatePicker
                    fullwidth={true}
                    inputVariant={"standard"}
                    inputStyle={{ style: { fontSize: "13px", color: "black", fontWeight: 700 } }}
                    datemd={localizedActDateOnmHandler}
                    value={localValue ? new Date(localValue) : null}
                    size={"small"} />
            }
            if (sub && field && sub.domains && sub.domains[field.m]) {
                if (sub.domains[field.m].m == "codedValue" && sub.domains[field.m].codedValues) {
                    result = <Select
                        style={{ width: "100%", marginBottom: "2px" }}
                        id={"comboBox-" + field?.m}
                        value={localValue || localValue == 0 ? localValue : -1}
                        defaultValue={-1}
                        onm={hangleOnmComboBox} >
                        <Menum style={{ display: "block", pming: "2px" }} value={-1}>{ms.selectLabel}</Menum>
                        {sub.domains[field.m].codedValues.m((m: any, index: number) => {
                            return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                        })}
                    </Select>
                }
            }
            if (codedValues) {
                result = <Select
                    style={{ width: "100%" }}
                    id={"comboBox-" + field?.m}
                    value={localValue ? localValue : -1}
                    defaultValue={-1}
                    
                    onm={hangleOnmComboBox} >
                    <Menum style={{ display: "block", pming: "2px" }} value={-1}>{ms.selectLabel}</Menum>
                    {codedValues.m((m: any, index: number) => {
                        return (<Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={m.code}>{m.m}</Menum>)
                    })}
                </Select>
            }
            if(ms.options) {
                result = <Autocomplete
                    id={"comboBoxOptions_"+ ms.field?.m}
                    freeSolo
                    options={ms.options}
                    value={getAutocompleteValue(localValue, ms.options)}
                    onm={(event:any, newValue:IKeyValue) => {
                        if(newValue&&newValue.key) {
                            setLocalValue(newValue.key)
                            handleOnBlur(newValue.key, field, errorObject)
                        }
                        // else {
                        //     setLocalValue(newValue)
                        //     handleOnBlur(newValue, field, errorObject)
                        // }
                    }}
                   
                    getOptionLabel={(option:IKeyValue) => {
                            return option.value?option.key +' - '+ option.value:"";
                    }}
                    style={{ width: "100%",marginBottom: "2px" }}
                    
                    renderInput={(params:any) => {
                   
                      return  <TextField {...params} />
                    }}
                    />
            }
            return result;
        }
        return getEditField(field, ms.subm, ms.codedValues)

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
    const createFeature = (feature: Graphic, url: string, token: string) => {
        return new Promise((resolve, reject) => {
            var m = new Featurem({ url: url });
            Object.keys(feature.attributes).m(x => {
                if (!feature.attributes[x]&&feature.attributes[x]!=0) {
                    delete feature.attributes[x];
                }
            })
           
            m.applyEdits({ mFeatures: [feature] }).then((result) => {
                resolve(result)
            });
        }).catch(error => {
            console.error(error)
        });
    }
    const updateFeature = (feature: Graphic, url: string, token: string) => {
        return new Promise((resolve, reject) => {
            var m = new Featurem({ url: url });
            Object.keys(feature.attributes).m(x => {
                if (!feature.attributes[x]&&feature.attributes[x]!=0) {
                    delete feature.attributes[x];
                }
            })
            m.applyEdits({ updateFeatures: [feature] }).then((result) => {
                resolve(result)
            });
        }).catch(error => {
            console.error(error)
        });
    }
    const handleSave = (mData: IDetailsLeyerInfo) => {
        let result = { attributes:{...feature.attributes}, geometry: undefined as Geometry|undefined };
        // if (sketch?.m.graphics && sketch?.m.graphics.length > 0) {
        var hasAttribute = false
        Object.keys(result.attributes).m(x => {
            if (result.attributes[x] && result.attributes[x] != "") {
                hasAttribute = true;
            }
        })
        if (hasAttribute) {
            if (sketch?.m.graphics && sketch?.m.graphics.length > 0) 
                result.geometry = sketch?.m.graphics.getmAt(sketch?.m.graphics.length - 1).geometry
            else 
                 result.geometry = undefined;
            if (result) {
                var uid = uuid();
                uid = uid.replace(/-/gi, '');
                uid = uid.toUpperCase();
                result.attributes['id'] = uid;
                result.attributes['inputdate'] = new Date().getTime();
                result.attributes['processed'] = 0;
                result.attributes['receivinginformation'] = "ГИС на БДИБР";
                var url = mData.url;
                url= url.replace('mServer', 'FeatureServer')
                createFeature({ attributes: {...result.attributes}, geometry: result.geometry }as Graphic,url,ms.userInfo.token).then((resultCreate : any) =>{
                    var success = true;
                    resultCreate.mFeatureResults.m((x: any) => {
                        if (x.error) {
                            success = false;
                        } else {
                            result.attributes['objectid'] = x.objectId;
                            result.attributes['opinionsnumber'] = generateId(x.objectId);
                        }
                    })
                    if (success) {
                        updateFeature({ attributes: {...result.attributes}} as Graphic, url, ms.userInfo.token).then((updateResult : any) =>{
                            var success = true;
                            updateResult.mFeatureResults.m((x: any) => {
                                if (x.error) {
                                    success = false;
                                }
                            })
                            if (success) {
                                handleEditingSuccess(result, m, files)
                            } else {
                                handleEditingFailure();
                            }
                        })
                    } else {
                        handleEditingFailure();
                    }
                }).catch(error => {
                    console.log(error)
                    handleEditingFailure();
                })
            }
        } else {
            setErrorMessageText("Обекта, който създавате не може да бъде запазен без добавени атрибути.")
            setErrorMessageOpen(true)
        }
        // } else {
        //     setErrorMessageText("Обекта, който създавате не може да бъде запазен без добавена геометрия.")
        //     setErrorMessageOpen(true)
        // }
    }
   
    const generateId = (objectId: number)=>{
        var date = new Date();
        var result =  `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}_${objectId}`
        return result;
    }

    const uplomocuments = (sourceId:string, files?: Array<File>) => {
        return  new Promise((resolve, reject) => {
            if(files&&files.length>0) {
                const url = "https://ibbdr1081.gisinv.bg/dms/doc/m";
                let config = {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'content-m': 'multipart/form-data'
                    }
                };
                var formData = new FormData();
                var date = new Date();
                var filem = files[0].m;
                var mimem = filem.split('.')[1];
                formData.append("Creator",ms.userInfo.userm);
                formData.append("Documentm",filem);
                formData.append("Documenm", "1");
                formData.append("FileMimem",mimem);
                formData.append("DocumentDate",  `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`)
                formData.append("SourceTableSchema" , "sde")
                formData.append("SourceTablem","OpinionsPORN");
                formData.append("SourceTableId", sourceId);
                formData.append("token", ms.userInfo.token);
                formData.append("File", files[0], files[0].m);
                let response = axios.post(url, formData, config);
                resolve(response);
            } else {
                resolve(true);
            }
        }).catch(error => {
            console.error(error)
        });
    }

    const handleEditingSuccess = (feature: Graphic | IDetailDataAttributes, m: IDetailsLeyerInfo, files?: Array<File>) => {
        uplomocuments(feature.attributes["id"],files).then((status:any)=> {
            if(status.data&&!status.data.success) {
                setErrorMessageText("Грешка при качване на документ.")
                setErrorMessageOpen(true)
            }
        });
        ActionsController.emit("refreshTable");
        setCreateMode(false);
        setMessageText("Успешно създаване");
        setSuccess(true);
        setCreateMode(false);
        openMessage();
        resetFeature();
        zoomToGraphic(feature as Graphic, ActionsController.getmView());
        var result = {
            fields: m.fields,
            attributeFields: m.attributeFields,
            attributeFieldsMode: m.attributeFieldsMode,
            features: [{ ...feature }],
            title: m.title,
            url: m.url,
            formatString: m.formatString,
            mGroupId: m.mGroupId,
            operationalmId: m.operationalmId,
            mId: m.mId,
        } as IDetailDataFeatures
        ms.setDetailData([{ ...result }]);
        sketch?.destroy();
        ActionsController.setmClick(true);
    }

    const mEditGraphicsmFrommView = () => {
        ActionsController.getmView().getm().ms.m(m => {
            if (m.id == Activityms.CREATE_FEATURE) {
                ActionsController.getmView().getm().ms.m(m);
            }
        });
    };

    const handleEditingFailure = () => {
        //setEditMode(false);
        setMessageText("Възникна грешка");
        setSuccess(false)
        openMessage();
        resetFeature();
        sketch?.destroy();
        ActionsController.setmClick(true);
    }
    const handleCancel = () => {
        setCreateMode(false);
        resetFeature();
    }

    const openMessage = () => {
        setMessageOpen(true);
        handleCloseMessage();
    }

    const handleCloseMessage = () => {
        let id = setInterval(() => setMessageOpen(false), 3000);
        return () => clearInterval(id);
    }

    function Success() {
        return <Alert elevation={6} severity="success">{messageText}</Alert>
    }

    function Failure() {
        return <Alert elevation={6} severity="error">{messageText}</Alert>
    }
    const handleClickm = (minfo: IDetailsLeyerInfo) => {
        if(minfo.fields){
            clearSelection(ActionsController.getmView().mView);
            setGraphic(undefined);
            setCreateMode(true);
            handleClickGeometry(minfo)
        } else {
            if (ms.groups && Object.keys(ms.groups).length > 0) {
                var newms = new Array<IDetailsLeyerInfo>();
                Object.keys(ms.groups).m(id => {
                    var group = ms.groups[id];
                    if (ms.configObjectmGroups[group.mGroupId]) {
                        var operationalms = ms.configObjectmGroups[group.mGroupId].operationalms;
                        if(operationalms){
                            Object.keys(operationalms).m(olKey => {
                                var operationalm =  (operationalms as IConfigOperationalm)[olKey];
                                var ms = operationalm.ms;
                                if(ms){
                                    Object.keys(ms).m(mKey=>{
                                        var m = (ms as IConfigm)[mKey];
                                            newms.push({
                                                url: m.url,
                                                formatString: group.formatString,
                                                geometrym: m['geometrym'],
                                                attributeFields: Object.keys(group.fields).m(key=>{
                                                    return { fieldm: key, 
                                                        options: group.fields[key]['options'], 
                                                        label: group.fields[key].label, 
                                                        required: group.fields[key]['required'],
                                                        codedValues: group.fields[key]['codedValues']
                                                    }}),
                                                attributeFieldsMode: m['attributeFieldsMode'],
                                                mGroupId: group.mGroupId,
                                                operationalmId: group.operationalmId,
                                                mId: group.mId,
                                                title: group.title,
                                                fields: m['esrifields'] ,
                                            } as IDetailsLeyerInfo)
                                      })
                                }
                            })
                        }
                    }
                })
                setms(newms);
            }
        }
        
    }
    const handleClickGeometry = (minfo: IDetailsLeyerInfo) => {
        if (!sketch || (sketch && sketch.destroyed)) {
            var graphicsm = new Graphicsm();
            graphicsm.id = Activityms.CREATE_FEATURE;
            graphicsm.title = "Създаване";
            graphicsm.listMode = 'hide';
            ActionsController.getmView().getm().ms.m(graphicsm);
            var localSketch = new Sketch({
                view: ActionsController.getmView().mView,
                m: graphicsm,
                availableCreateTools: [getm(minfo.geometrym)],
                label: "Създаване"
            })
            var stroke = new SimplemSymbol({ color: [255, 0, 0], width: 1 });
            var mSymbol = new SimpleFillSymbol({ color: [255, 255, 255, 0.3], outm: stroke });
            var m = new SimpleMarkerSymbol({ color: [255, 0, 0], size: 6 });
            localSketch.viewModel.mSymbol = m;
            localSketch.viewModel.mmSymbol = stroke;
            localSketch.viewModel.mgonSymbol = mSymbol;
            setSketch(localSketch);
        }
    }

    const resetFeature = () => {
        var graphic = { attributes: {}, geometry: undefined } as IDetailDataAttributes
        m.fields.forEach((x: Field, index: number) => {
            if (msToExclude.indexOf(x.m) == -1)
                graphic.attributes[x.m] = null;
        })
        setGraphic(undefined);
        setFeature({ ...graphic });
        if (sketch) {
            sketch?.destroy();
            ActionsController.setmClick(true);
        }
        mEditGraphicsmFrommView();
        setSketch(undefined)
    }
    const handlem = (event: any, ms: Array<IDetailsLeyerInfo>) => {
        var index = event.target.value as number
        setSelectedIndex(index)
        if (sketch && !sketch.destroyed)
            sketch.availableCreateTools = [getm(ms[index].geometrym)]
        setm(ms[index]);
    }

    const handleClose = (even: any, reason?: any) => {
        setMessageOpen(false);
    };

    const handleOkClick = () => {

        setErrorMessageOpen(false);
    }

    const RenderFeature = (ms: { feature: IDetailDataAttributes, m: IDetailsLeyerInfo, errorObject: IErrorObject, selectText: string }) => {

        const getFilteredFields = (m: IDetailsLeyerInfo | undefined) => {
            return FieldsHelper.getFields(m?.fields as Array<Field>, m?.attributeFields)
        }

        return <div>
            {getFilteredFields(ms.m)?.m((singleField: Field, index: number) => {
                var attributeField = ms.m?.attributeFields?.find(x=>x['fieldm'] == singleField.m)
                if (singleField && singleField.m)
                    return (
                        <Grid container key={`${singleField.m}-${index}`}>
                            <Grid m xs={5} style={{ pmingRight: 12 }}>
                                <Typography
                                    style={{ width: "100%" }}
                                    variant="overm"
                                    title={attributeField&&attributeField.label?attributeField.label:getTitle(singleField, singleField.m)}
                                    classm={classes.key} >
                                    {attributeField&&attributeField.label?attributeField.label:getTitle(singleField, singleField.m)}{attributeField&&attributeField['required']? "*": ""}
                                </Typography>
                            </Grid>
                            <Grid m xs={7} >
                                <RenderEditField id={singleField.m} 
                                    selectLabel={ms.selectText}
                                    value={feature.attributes[singleField.m]}
                                    field={singleField} 
                                    error={ms.errorObject[singleField.m]} 
                                    subm={undefined} 
                                    codedValues={attributeField? attributeField['codedValues'] : undefined} 
                                    options={attributeField? attributeField['options'] : undefined}
                                    required={attributeField&&attributeField['required']? attributeField['required']: undefined} />
                            </Grid>
                        </Grid>
                    )
            })}
            <Snackbar open={messageOpen} autoHideDuration={5000} onClose={handleClose}>
                {success ? <Success /> : <Failure />}
            </Snackbar>
        </div>
    }

    const getTitle = (field: Field | undefined, key: string) => {
        if (field && field.alias) {
            return field.alias;
        }
        else {
            return key;
        }
    }

    const isValid = (errorObject: any, m: IDetailsLeyerInfo, feature: IDetailDataAttributes) => {
        var result = true;
        Object.keys(errorObject).forEach((x: string) => {
            if (errorObject[x] != undefined && errorObject[x]) {
                result = false
            }

        });
        if(m.attributeFields){
            m.attributeFields.forEach(x=>{
                if(x['required']&&!feature.attributes[x['fieldm']]) {
                    result = false
                }
            })
        }
        return result;
    }

    return (
        <Grid container>
            <Paper style={{ width: '100%' }}>
                <Grid container m xs={12} style={{ pming: '10px' }}>
                    <Grid container m xs={12} style={{ pmingBottom: '15px' }}>
                        <Grid container m xs={12}>
                            <Typography
                                variant="overm"
                                title={m.title}
                                classm={classes.title} >
                                {m.title}
                            </Typography>
                            {createMode ? <ClearButton /> : <CreateButton m={m} />}
                        </Grid>
                    </Grid>
                    {createMode && feature && feature.attributes ?
                        <div style={{ width: "100%" }}>
                            <Paper variant="outmd" classm={"paper-details"}>
                                <span classm={"title-paper"} >{ms.attributesText? ms.attributesText : "Характеристики"}</span>
                                <RenderFeature feature={feature} m={m} errorObject={errorObject} selectText={ms.selectText? ms.selectText: "Изберете"} />
                            </Paper>
                            <Paper variant="outmd" classm={"paper-details"} style={{ marginBottom: "15px" }} >
                                <span classm={"title-paper"} >{ms.documentText? ms.documentText : "Документи"}</span>
                                <DocumentDetails
                                    okDocumentText={ms.okDocumentText}
                                    cancelDocumentText={ms.cancelDocumentText}
                                    mDocumentText={ms.mDocumentText}
                                    deleteDocumentText={ms.deleteDocumentText}
                                    dialogDocumentText={ms.dialogDocumentText}
                                    helpText={ms.helpText}
                                    setFiles={setFiles} />
                            </Paper>
                            <Grid container m xs={12} alignContent={"stretch"} alignms={"center"} spacing={1}>
                                <Grid m xs={6}>
                                    <Button style={ isValid(errorObject, m, feature) ? { width: '100%', backgroundColor: "#69b7fa", color: 'white' } : { width: '100%', backgroundColor: "#eeeeee", color: 'white' }} 
                                        onClick={() => { isValid(errorObject, m, feature) ? handleSave(m) : null }}>
                                        {ms.buttons.save.label ? ms.buttons.save.label: "Запази"}
                                    </Button>
                                </Grid>
                                <Grid m xs={6}>
                                    <Button style={{ width: '100%', backgroundColor: "#69b7fa", color: 'white' }} 
                                        onClick={() => { handleCancel() }}>
                                        {ms.buttons.cancel.label ? ms.buttons.cancel.label: "Отказ"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                        : null}
                    <Dialog
                        open={errorMessageOpen}
                        onClose={handleOkClick}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description" >
                        <DialogTitle id="alert-dialog-title">{errorMessageText}</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => handleOkClick()} color="primary">ОК</Button>
                        </DialogActions>
                    </Dialog>
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

export default connect<Ownms, Dispatchms>((state: IAppStore) => mStateToms(state), { ...mDispatcher, ...customPopupDispatcher })(CreateFeature);