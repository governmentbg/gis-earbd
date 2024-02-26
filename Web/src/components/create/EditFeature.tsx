import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect, Dispatchm, useDispatch } from 'react-redux';
import { Typography, ExpansionPanelDetails, makeStyles, Grid, Paper, Select, Toolbar, InputBase, Button, Accordion, AccordionSummary, AccordionDetails, Card, TextField } from '@material-ui/core';
import { ISingleDetailData, IDetailDataAttributes, IDetailDataFeatures } from 'ReactTemplate/Base/interfaces/models/ICustomPopupSettings';
import { number } from 'm-ms';
import Field from 'esri/ms/support/Field';
import { IAppStore, IDetailsLeyerInfo, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import Graphic from 'esri/Graphic';
import { IFieldInfo } from '@esri/arcgis-rest-common-ms';
import Activityms from 'ReactTemplate/Base/../ActionsController/Activityms';
import ActionsController
    from 'ReactTemplate/Base/../ActionsController/ActionsController';
import Editor from "esri/widgets/Editor";
import Graphicsm from 'esri/ms/Graphicsm'
import Sketch from 'esri/widgets/Sketch'
import SketchCreateEvent from 'esri/widgets/Sketch'
import RowOnHoverButton from 'ReactTemplate/Base/components/AttributeTable/RowOnHoverButton';
import RoomIcon from '@material-ui/icons/Room';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { IConfigmGroup, IConfigmView, ISpecificmm, IConfigmGroups } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import CustomPopupView from '../popup/CustomPopupView';
import { IEditFeatureSettings } from 'ReactTemplate/Base/interfaces/reducers/IEditFeature';
import FieldsHelper from 'ReactTemplate/Base/helpers/FieldsHelper'
import axios from 'axios';
import { ssiUnActivitiesConfig } from '../../config/wsi.unConfig';
import { DotDensityRenderer } from 'esri/renderers';
import { v4 as uuid } from 'uuid';
import SimplemSymbol from 'esri/symbols/SimplemSymbol';
import SimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import { Geometry, m } from 'esri/geometry';
import { zoomToGraphic } from 'ReactTemplate/Base/helpers/helperFunctions';
import UserHelper from '../UserHelper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Ownms {
    userInfo: any;
    configObjectmGroups: IConfigmGroups;
    isWebFullymLoaded: boolean;
    editedFeature: IEditFeatureSettings;
}

interface Parentms {
    // feature: Graphic;
    // fields: Field[];
    // url: string;
}


m ms = Parentms & Ownms;

const Editm: React.FunctionComponent<ms> = (ms: ms) => {

    const [sketch, setSketch] = useState(undefined as Sketch | undefined);
    const [messageOpen, setMessageOpen] = useState(false);
    const [success, setSuccess] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [errorMessageOpen, setErrorMessageOpen] = useState(false);
    const [errorMessageText, setErrorMessageText] = useState("");
    // const [feature, setFeature] = useState(ms.editedFeature.feature);

    useEffect(() => {
        if (ms.editedFeature.url) {
            mEditGraphicsmFrommView();
            createSketchTool();
        }
    }, [ms.editedFeature]);

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
            color: "#7F7F7F",
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
            color: "#4D4D4D",
            textTransform: "none",
        }
    }));
    const BootstrapInput = withStyles((theme) => ({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #ced4da',
            fontSize: 16,
            pming: '10px 26px 10px 12px',
            transition: theme.transitions.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
        },
    }))(InputBase);

    const mEditGraphicsmFrommView = () => {
        ActionsController.getmView().getm().ms.m(m => {
            if (m.id == Activityms.EDIT_FEATURE) {
                ActionsController.getmView().getm().ms.m(m);
            }
        });
    };

    const handleZoomClick = (feature: Graphic) => {
        if (feature && feature.geometry) {
            zoomToGraphic(feature, ActionsController.getmView(), true);
        }
    }

    const handleOkClick = () => {
    
        setErrorMessageOpen(false);
    }

    const createSketchTool = () => {
        let graphicsm = new Graphicsm();
        if (ms.editedFeature && ms.editedFeature.feature && ms.editedFeature.feature.geometry)
            graphicsm.m(ms.editedFeature.create ? getCreateGraphic(ms.editedFeature.geometrym, ms.editedFeature.feature) : getEditGraphic(ms.editedFeature.geometrym, ms.editedFeature.feature));
        graphicsm.id = Activityms.EDIT_FEATURE;
        graphicsm.title = "Редакция";
        ActionsController.getmView().getm().ms.m(graphicsm);
        // ActionsController.getmView().mView.graphics.mAll();
        // ActionsController.getmView().mView.graphics.m(ms.editedFeature.feature);
        const currSketch = new Sketch({
            view: ActionsController.getmView().mView,
            m: graphicsm,
            label: "Редакция",
            availableCreateTools: [ms.editedFeature.feature.geometry && ms.editedFeature.feature.geometry.m ? ms.editedFeature.feature.geometry.m : getGeometrym(ms.editedFeature.geometrym ? ms.editedFeature.geometrym : "")]
        });
        sketch?.destroy();
        ActionsController.getmView().mView.ui.m(currSketch, "bottom-left");
        ActionsController.setmClick(false);
        // currSketch.on("create", (event) => {
        //     if (event.state === "complete") {
        //         if (currSketch.m.graphics.length > 1) {
        //             currSketch.m.graphics.m(currSketch.m.graphics[0])
        //         }
        //     }
        // });
        setSketch(currSketch);
    };

    const getGeometrym = (value: string) => {
        let result = value;
        if (result) {
            if (value == "esriGeometrymm") {
                result = "mm"
            }
            if (value == "esriGeometrymgon") {
                result = "mgon"
            }
            if (value == "esriGeometrym") {
                result = "m"
            }
        }
        return result;
    };

    const getGeometrySymbols = () => {
        let stroke = new SimplemSymbol({ color: [128, 128, 128, 0.5], width: 0.5 });
        let mSymbol = new SimpleMarkerSymbol({ color: [0, 255, 255, 0.8], size: 12, outm: stroke }); //[0, 255, 255, 0.8]
        let mSymbol = new SimpleFillSymbol({ color: [0, 255, 255, 0.8], outm: stroke });

        return { mSymbol: mSymbol, stroke: stroke, mSymbol: mSymbol };
    };

    const getCreateGraphic = (value: string | undefined, feature: Graphic) => {
        // let stroke = new SimplemSymbol({ color: [128, 128, 128, 0.5], width: 0.5 });
        // let mSymbol = new SimpleMarkerSymbol({ color: [0, 255, 255, 0.8], size: 12, outm: stroke }); //[0, 255, 255, 0.8]
        // let mSymbol = new SimpleFillSymbol({ color: [0, 255, 255, 0.8], outm: stroke });
        let { mSymbol, stroke, mSymbol } = getGeometrySymbols();
        let result = new Graphic({ symbol: mSymbol });


        if (ms.editedFeature.parentGeometry && ms.editedFeature.parentGeometry.m === "mgon" && feature.geometry && (feature.geometry.m === "m" || ms.editedFeature.geometrym === "m")) {
            let deviationHeight = 0;
            let deviationWidth = 0;
            let parentmgonHeight = ms.editedFeature.parentGeometry.extent.height;
            let parentmgonWidth = ms.editedFeature.parentGeometry.extent.width;
            let parentmgonCenter = ms.editedFeature.parentGeometry.centroid;
            switch (ms.editedFeature.parentmGroupId) {
                case "WSI_ADMOutputData": {
                    deviationHeight = parentmgonHeight * 0.1;
                    // deviationWidth = 0.5;
                    break;
                }
                case "WSI_ADMStatement": {
                    deviationHeight = parentmgonHeight * 0.1;
                    deviationWidth = parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_ADMLetterDAG": {
                    deviationWidth = parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_JoiningContract": {
                    deviationHeight -= parentmgonHeight * 0.1;
                    deviationWidth = parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_PreContract": {
                    deviationHeight -= parentmgonHeight * 0.1;
                    break;
                }
                case "WSI_OtherContract": {
                    deviationHeight -= parentmgonHeight * 0.1;
                    deviationWidth -= parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_CoordinateSO": {
                    deviationWidth -= parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_CoordinateReconstructSO": {
                    deviationHeight = parentmgonHeight * 0.1;
                    deviationWidth -= parentmgonWidth * 0.1;
                    break;
                }
                case "WSI_UnregulatedJoining": {
                    deviationHeight = parentmgonHeight * 0.2;
                    break;
                }
                case "WSI_UnregulatedInspection": {
                    deviationHeight = parentmgonHeight * 0.2;
                    deviationWidth = parentmgonWidth * 0.2;
                    break;
                }
                default: {
                    break;
                }
            }

            let mGeometry = feature.geometry as m;
            mGeometry.x = parentmgonCenter.x + deviationWidth;
            mGeometry.y = parentmgonCenter.y + deviationHeight;
            feature.geometry = mGeometry;
            result.geometry = new m({
                x: parentmgonCenter.x + deviationWidth,
                y: parentmgonCenter.y + deviationHeight,
                spatialReference: ActionsController.getmView().mView.spatialReference
            });
        }


        handleZoomClick(result);
        return result;
    };

    const getEditGraphic = (value: string | undefined, feature: Graphic) => {
        // var stroke = new SimplemSymbol({ color: [255, 0, 0], width: 1 });
        // var mSymbol = new SimpleFillSymbol({ color: [255, 255, 255, 0.3], outm: stroke });
        // var mSymbol = new SimpleMarkerSymbol({ color: [255, 0, 0], size: 6 });
        let { mSymbol, stroke, mSymbol } = getGeometrySymbols();
        var result = new Graphic({ geometry: feature.geometry, symbol: mSymbol })

        return new Graphic({
            geometry: feature.geometry,
            symbol: (feature.geometry.m == "mgon" || value == "esriGeometrymgon") ? mSymbol :
                (feature.geometry.m == "mm" || value == "esriGeometrymm") ? stroke : mSymbol
        });

        // var result = new Graphic({geometry:feature.geometry, symbol:m})
        // //new Graphic(geometry?, symbol?, attributes?)
        // if(value=="esriGeometrymm") {
        //     result = new Graphic({geometry:feature.geometry, symbol:stroke})
        //     //new Graphic(geometry?, symbol?, attributes?)
        // }
        // if(value=="esriGeometrymgon") {
        //     result =  new Graphic({geometry:feature.geometry, symbol:mSymbol})
        //     //new Graphic(geometry?, symbol?, attributes?)
        // }
        // return result;
    }

    const handleEditCallback = (edited: boolean, feature?: Graphic | IDetailDataAttributes, mUrl?: string) => {
        if (edited && feature) {
            if (ms.editedFeature.create) {
                var postUrl = ssiUnActivitiesConfig.specificData.urls.create;
                var featToSave = { attributes: {...feature.attributes}, geometry: {} } as IDetailDataAttributes;
                var uid = uuid();
                uid = uid.replace(/-/gi, '');
                uid = uid.toUpperCase();
                featToSave.attributes['ID'] = uid;
                var fieldsToFilter = ["wsi_created_user", "wsi_last_edited_user", "created_user", "created_date", "last_edited_user", "last_edited_date"];
                Object.keys(featToSave.attributes).m(x => {
                    if (!featToSave.attributes[x]) {
                        delete featToSave.attributes[x];
                    }
                    if (fieldsToFilter.indexOf(x) != -1) {
                        delete featToSave.attributes[x];
                    }
                })
                if ((sketch as Sketch).m.graphics.length > 0 && sketch?.m.graphics.getmAt(sketch?.m.graphics.length - 1).geometry) {
                    featToSave.geometry = sketch?.m.graphics.getmAt(sketch?.m.graphics.length - 1).geometry;
                    var postData = {
                        featuremUrl: mUrl,
                        token: ms.userInfo.token,
                        webSite: UserHelper.getWebSiteRole(),
                        features: JSON.stringify([featToSave]) 
                    }
                    var config = {
                        headers: {
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                    axios.post(postUrl, postData, config).then(postResult => {
                        var success = true;
                        postResult.data.mResults.m((x: any) => {
                            if (x.error) {
                                success = false;
                            }
                        })
                    if (success) {
                        handleEditingSuccess(feature)
                    } else {
                        handleEditingFailure()
                    }
                        
                    }).catch(error => {
                        console.log(error)
                        handleEditingFailure();

                    })
                } else {
                    setErrorMessageText("Обекта, който създавате не може да бъде запазен без добавена геометрия.")
                    setErrorMessageOpen(true)
                }
            } else {
                if(sketch&&sketch?.m.graphics.length>0&&sketch?.m.graphics.getmAt(sketch?.m.graphics.length - 1).geometry) {
                    feature.geometry = sketch?.m.graphics.getmAt(sketch?.m.graphics.length - 1).geometry;
                    var featToSaveEdit = { attributes: {}, geometry: {} }
                    featToSaveEdit.attributes = { ...feature.attributes };
                    featToSaveEdit.geometry = feature.geometry;
                    var postUrl = ssiUnActivitiesConfig.specificData.urls.edit;
                    var fieldsToFilter = ["wsi_created_user", "wsi_last_edited_user", "created_user", "created_date", "last_edited_user", "last_edited_date"];
                    Object.keys(featToSaveEdit.attributes).m(x => {
                        // if(!featToSaveEdit.attributes[x]){
                        //    delete featToSaveEdit.attributes[x];
                        // }
                        if (fieldsToFilter.indexOf(x) != -1) {
                            delete featToSaveEdit.attributes[x];
                        }
                    })
                    var postData = {
                        featuremUrl: mUrl,
                        token: ms.userInfo.token,
                        webSite: UserHelper.getWebSiteRole(),
                        features:  JSON.stringify([featToSaveEdit]) 
                    }
                    axios.post(postUrl, postData).then(postResult => {
                        var success = true;
                        postResult.data.updateResults.m((x: any) => {
                            if (x.error) {
                                success = false;
                            }
                        })
                        if (success) {
                            handleEditingSuccess(feature)
                        } else {
                            handleEditingFailure()
                        }
                    }).catch(error => {
                        console.log(error)
                        handleEditingFailure();
                    })
                } else {
                    setErrorMessageText("Обекта, който редактирате не може да остане без геометрия")
                    setErrorMessageOpen(true)
                }
            }
        } else {
            ActionsController.setmClick(true);
            sketch?.destroy();
            mEditGraphicsmFrommView();
            ms.editedFeature.editCallback(false, feature);

        }
    }

    const handleEditingSuccess = (feature: Graphic | IDetailDataAttributes, message?: string) => {
        ActionsController.setmClick(true);
        sketch?.destroy();

        mEditGraphicsmFrommView();
        ms.editedFeature.editCallback(true, feature, ms.editedFeature.parentIndex, ms.editedFeature.featureIndex);
        setMessageText("Успешна редакция");
        setSuccess(true)
        openMessage();
        if (ms.editedFeature.refreshOnEdit) {
            ActionsController.emit("refreshTable");
        }
    }

    const handleEditingFailure = (message?: string) => {
        setMessageText("Възникна грешка");
        setSuccess(false)
        openMessage();
    }

    const openMessage = () => {
        setMessageOpen(true);
        handleCloseMessage();
    }

    const handleCloseMessage = () => {
        let id = setInterval(() => setMessageOpen(false), 3000);
        return () => clearInterval(id);
    }

    const handleClose = (even: any, reason?: any) => {
        setMessageOpen(false);
    };

    function Success() {
        return <Alert elevation={6} severity="success">{messageText}</Alert>
    }

    function Failure() {
        return <Alert elevation={6} severity="error">{messageText}</Alert>
    }

    const classes = useStyles();
    const getFilteredFields = (editedFeature: IEditFeatureSettings | undefined) => {
        return FieldsHelper.getEditFields(editedFeature?.fields as Array<Field>, editedFeature?.attributeFields);
    }
    return (
        <React.Fragment>
            <Grid container style={{ position: "absolute" }}>
                <Paper style={{ width: '100%', pmingBottom: "20px", pmingLeft: "8px" }}>
                    {ms.editedFeature.title ? <Typography classm={"text-style"} title={ms.editedFeature.title} style={{
                        color: "#000000a1",
                        textAlign: "center",
                        pmingBottom: "15px"
                    }} >
                        {ms.editedFeature.title}</Typography> : null}
                    <CustomPopupView fields={getFilteredFields(ms.editedFeature)} submFieldm={ms.editedFeature.submFieldm} subms={ms.editedFeature.subms} data={{ attributes: ms.editedFeature.feature.attributes }} editCallback={handleEditCallback} url={ms.editedFeature.url} editMode={true} />
                </Paper>
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
            <Snackbar open={messageOpen} autoHideDuration={5000} onClose={handleClose}>
                {success ? <Success /> : <Failure />}
            </Snackbar>
        </React.Fragment>
    )
}

const mStateToms = (state: IAppStore) => {
    return ({
        userInfo: state.userInfo,
        configObjectmGroups: state.configObject.configmGroups,
        isWebFullymLoaded: state.webms.isWebFullymLoaded,
        editedFeature: state.editedFeature,
    })
};

export default connect<Ownms, {}, {}>((state: IAppStore) => mStateToms(state), {})(Editm);