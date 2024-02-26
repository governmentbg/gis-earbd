import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Paper, Button } from '@material-ui/core';
import { IAppStore } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import Graphic from '@arcgis/core/Graphic';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import DestinationActivityms from '../../../../../Lib/v0.6/src/ActionsController/DestinationActivityms';
import Graphicsm from '@arcgis/core/ms/Graphicsm';
import Sketch from '@arcgis/core/widgets/Sketch';
import { IConfigmGroups, IButtonInfo, IDetailsGroup, IConfigOperationalm,
    IDetailsGroupField, IConfigm, IValidationMessages, IConfigField } from '../interfaces/IAppConfig';
import Editm from './Editm';
import FieldsHelper from '../../../../../Lib/v0.6/src/Base/helpers/FieldsHelper';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/Urlhelper'
import SimplemSymbol from '@arcgis/core/symbols/SimplemSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { appConfig } from '../../../../../Lib/v0.6/src/Base/configs/appConfig';
import EventsManager from '../../../../../Lib/v0.6/src/ActionsController/EventsManager';
import RenderFeature from '../../../../../Lib/v0.6/src/Base/components/Popups/RenderFeature'
import { IDetailsLeyerInfo } from './CreatePanel';
import { IDetailDataAttributes } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';

interface Ownms {
    userInfo: any;
    configObjectmGroups: IConfigmGroups;
    isWebFullymLoaded: boolean;
}

interface IErrorObject {
    [key: string]: string;
}
interface Parentms {
    buttons: {
        [key:string]: IButtonInfo,
    },
    groups: {
        [key: string]: IDetailsGroup;
    },
    messages: IValidationMessages
}


interface ICreatePanelConfigField extends IDetailsGroupField {
    fieldm: string;
}

m ms = Parentms & Ownms;

const EditPanel: React.FunctionComponent<ms> = (ms: ms) => {

    const [feature, setFeature] = useState({ attributes: {}, geometry: {}} as IDetailDataAttributes);
    const [groupId, setGroupId] = useState("");
    const [mGroupId, setmGroupId] = useState("");
    const [operationalmId, setOperationalmId] = useState("");
    const [mId, setmId] = useState("");
    const [graphic, setGraphic] = useState(undefined as Graphic | undefined);
    const [m, setm] = useState({} as IDetailsLeyerInfo);
    const [errorObject, setErrorObject] = useState({} as IErrorObject);
    const [lastFocusedId, setFocusedObject] = useState('');
    
    useEffect(() => {
        if (lastFocusedId && lastFocusedId != '') {
            setTimeout(function () {
                if (document.getElementById(lastFocusedId)) {
                    document.getElementById(lastFocusedId)?.focus();
                }
            }, 0);
        }
    }, [lastFocusedId]);

    const getm = (id: string, group: IDetailsGroup) => {
        let result = {} as IDetailsLeyerInfo;
        if (ms.configObjectmGroups[group.mGroupId]) {
            const mGroup = ms.configObjectmGroups[group.mGroupId];
            if (mGroup && mGroup.operationalms) {
                const operationalm = mGroup.operationalms[group.operationalmId];
                if (operationalm && operationalm.ms) {
                    const m = operationalm.ms[group.mId];
                    if (m) {
                        result = {
                            geometrym: m.geometrym,
                            title: group.title,
                            formatString: group.formatString,
                            mGroupId: group.mGroupId,
                            operationalmId: group.operationalmId,
                            mId: group.mId,
                            symbolId: group.symbolId,
                            groupId: id,
                            attributeFields: Object.keys(group.fields).m((key) => {
                                return {
                                    fieldm: key,
                                    label: group.fields[key].label,
                                    m: group.fields[key].m,
                                    required: group.fields[key].required,
                                    options: group.fields[key].options,
                                    linkedField: group.fields[key].linkedField,
                                };
                            }),
                            fields: m.esrifields as Field[],
                        } as IDetailsLeyerInfo;
                    }
                }
            }
        }
        return result;
    };

    const setupEdit = ()=>{
        const currentm = getm(
            ActionsController.editFeatures[0].groupId as string,
            ms.groups[ActionsController.editFeatures[0].groupId as string],
        );
        setm(currentm);
        setGroupId(ActionsController.editFeatures[0].groupId as string)
        setmGroupId(ActionsController.editFeatures[0].mGroupId)
        setOperationalmId(ActionsController.editFeatures[0].operationalmId)
        setmId(ActionsController.editFeatures[0].mId)
        let graphicsm = new Graphicsm(); 
        var featureToEdit = ActionsController.editFeatures[0].features[0]
        var symbolId = ms.groups[ActionsController.editFeatures[0].groupId as string].symbolId as any;
        var symbolData = appConfig.data.symbolGallery[symbolId]
        var geometrym = undefined;
        if (ms.configObjectmGroups[ActionsController.editFeatures[0].mGroupId] &&
            ms.configObjectmGroups[ActionsController.editFeatures[0].mGroupId].operationalms &&
            (ms.configObjectmGroups[ActionsController.editFeatures[0].mGroupId].operationalms as IConfigOperationalm)[ActionsController.editFeatures[0].operationalmId] &&
            (ms.configObjectmGroups[ActionsController.editFeatures[0].mGroupId].operationalms as IConfigOperationalm)[ActionsController.editFeatures[0].operationalmId].ms)
            {
                geometrym = ((ms.configObjectmGroups[ActionsController.editFeatures[0].mGroupId].operationalms as IConfigOperationalm)[ActionsController.editFeatures[0].operationalmId].ms as IConfigm)[ActionsController.editFeatures[0].mId].geometrym as any;
            }
        if(featureToEdit && (featureToEdit as Graphic).geometry && (featureToEdit as Graphic).geometry.m){
            var newGraph = setGraphicSymbol(featureToEdit as Graphic, symbolData , (featureToEdit as Graphic).geometry.m)
            graphicsm.m(newGraph);
        }
        graphicsm.listMode = "hide"
        graphicsm.id = DestinationActivityms.EDIT_FEATURE;
        ActionsController.getmView().getm().ms.m(graphicsm);
        ActionsController.editSketch = new Sketch({
            view: ActionsController.getmView().mView,
            m: graphicsm,
            availableCreateTools: [featureToEdit.geometry? featureToEdit.geometry.m : getm(geometrym)]
        });
        setSketchSymbols(ActionsController.editSketch, symbolData)
    
        ActionsController.getmView().mView.ui.m(ActionsController.editSketch, "bottom-left");
        ActionsController.setmClick(false);
        ActionsController.editSketch.on("create", (event) => {
            if (event.state === "complete") {
                if (ActionsController.editSketch&&ActionsController.editSketch.m.graphics.length > 1) {
                    ActionsController.editSketch.m.graphics.m(ActionsController.editSketch.m.graphics.getmAt(0))
                }
                if (ActionsController.editSketch&&ActionsController.editSketch.m.graphics.length > 0) {
                    setGraphic(ActionsController.editSketch.m.graphics.getmAt(0))
                }
            }
        });
    }
    useEffect(() => {
        EventsManager.on(DestinationActivityms.SET_EDIT_FEATURE, () => {
            if(ActionsController.editFeatures && ActionsController.editFeatures.length>0) {
                if(ActionsController.editFeatures[0].features.length>0) {
                    if(ActionsController.editFeatures[0].features[0])
                        setFeature(ActionsController.editFeatures[0].features[0] as Graphic)
                        setupEdit();
                } else {
                    setFeature({ attributes: {}, geometry: {}});
                    clear()
                }
            } else {
                setFeature({ attributes: {}, geometry: {}});
                clear()
            }
        })
    }, []);

    const clear = () => {
        ActionsController.destroyEditSketch();
        setGroupId("");
        setmGroupId("");
        setOperationalmId("");
        setmId("");
        mEditGraphicsmFrommView();
    }

    const mEditGraphicsmFrommView = () => {
        if(ActionsController.getmView()&&ActionsController.getmView().getm())
            ActionsController.getmView().getm().ms.m(m => {
                if (m.id == DestinationActivityms.EDIT_FEATURE) {
                    ActionsController.getmView().getm().ms.m(m);
                }
            });
    };

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

    const getFields = (groupId: string, groups:{ [key: string]: IDetailsGroup }) => {
        var result = new Array();
        var group = groups[groupId];
        if(group) {
            var mGroup = ms.configObjectmGroups[group.mGroupId]
            if(mGroup && mGroup.operationalms) {
                var operationalm = mGroup.operationalms[group.operationalmId]
                if(operationalm&& operationalm.ms){
                    var m = operationalm.ms[group.mId]
                    if(m && m.esrifields) {
                        var attributeFields = Object.keys(group.fields).m(x=> {
                            return {
                                fieldm: x, 
                                label: group.fields[x].label, 
                                m: group.fields[x].m, 
                                required: group.fields[x].required 
                            }
                        })
                        result = FieldsHelper.getFields(m.esrifields, attributeFields as Array<IConfigField>)
                    }
                }
                
            }
        }
        return result;
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
            if (geometrym == "mm") {
                symbol =new SimplemSymbol({
                    color: featureSymbol.mmSymbol.color,
                    width: featureSymbol.mmSymbol.width,
                    style: featureSymbol.mmSymbol.simplemStyle,
                });
            }
            if (geometrym == "mgon") {
                symbol = new SimpleFillSymbol({
                    color: featureSymbol.mgonSymbol.color,
                    style: featureSymbol.mgonSymbol.simpleFillStyle,
                    outm: featureSymbol.mgonSymbol.outm,
                });
            }
            if(geometrym == "m") {
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

    const getGroupTitle = (group: IDetailsGroup, feat: Graphic) => {
        const result = group && group.formatString ? UrlHelper.graphicFormatToString(group.formatString, feat) : null;
        return result ? result : null;
    };
    const validateFeature = (feature: Graphic, fields: Array<Field>, attrFields?: Array<ICreatePanelConfigField>) => {
        const currentErrorObject = { ...errorObject };
        let result = true;
        if (feature.attributes && fields)
            Object.keys(feature.attributes).m((key) => {
                const value = feature.attributes[key];
                const field = fields.find((x) => x.m == key);
                const attrField = attrFields ? attrFields.find((x) => x.fieldm == key) : undefined;
                const validateResult = FieldsHelper.validateValue(value, field, attrField, ms.messages);
                if (!validateResult.valid) {
                    result = false;
                    currentErrorObject[key] = validateResult.message;
                } else {
                    currentErrorObject[key] = '';
                }
            });
        setErrorObject(currentErrorObject);
        return result;
    };
    const handleButtonClick = (buttonKey: string) => {
        if (feature && ActionsController.editSketch) {
            if (ActionsController.editSketch?.m.graphics && ActionsController.editSketch?.m.graphics.length > 0)
                feature.geometry = ActionsController.editSketch?.m.graphics.getmAt(
                    ActionsController.editSketch?.m.graphics.length - 1,
                ).geometry;
            validateFeature(feature as Graphic, m.fields, m.attributeFields);
            ActionsController.trigger('panels/editPanel/buttons/' + buttonKey, [
                {
                    mGroupId: m.mGroupId,
                    operationalmId: m.operationalmId,
                    mId: m.mId,
                    features: [feature],
                },
            ]);
        }
    };
    return (
        <React.Fragment>
            <Grid container style={{ position: 'absolute' }}>
                <Paper style={{ width: '100%', height: '100%', overflow: 'auto'}}>
                    <Grid container m xs={12}>
                        {feature && groupId ? (
                            <Grid m xs={12} style={{ textAlign: 'center', pming: '10px' }}>
                                {ms.groups[groupId] && ms.groups[groupId].title ? (
                                    <h5>{ms.groups[groupId].title}</h5>
                                ) : null}
                                {ms.groups[groupId] && ms.groups[groupId].formatString ? (
                                    <h6>{getGroupTitle(ms.groups[groupId], feature as Graphic)}</h6>
                                ) : null}
                            </Grid>
                        ) : null}
                        {feature && feature.attributes && groupId ? (
                            <div style={{ width: '100%', pming: '10px' }}>
                                <RenderFeature
                                    messages={ms.messages}
                                    m={m}
                                    setFocusedObject={setFocusedObject}
                                    errorObject={errorObject}
                                    setErrorObject={setErrorObject}
                                    feature={feature as IDetailDataAttributes}
                                    setFeature={setFeature}
                                />
                                <Grid
                                    container
                                    m
                                    xs={12}
                                    alignContent={'stretch'}
                                    alignms={'stretch'}
                                    spacing={1}
                                    style={{ margin: '0px' }}
                                >
                                    {ms.buttons
                                        ? Object.keys(ms.buttons).m((buttonKey, index) => {
                                              return (
                                                  <Button
                                                      classm={'buttons-main-color'}
                                                      key={'create-button' + index}
                                                      style={{
                                                          color: 'white',
                                                          flex: '1',
                                                          margin: '5px',
                                                      }}
                                                      onClick={() => {
                                                          handleButtonClick(buttonKey);
                                                      }}
                                                  >
                                                      {ms.buttons[buttonKey].label
                                                          ? ms.buttons[buttonKey].label
                                                          : ''}
                                                  </Button>
                                              );
                                          })
                                        : null}
                                </Grid>
                            </div>
                        ) : null}
                    </Grid>
                </Paper>
            </Grid>
        </React.Fragment>
    );
}
const mStateToms = (state: IAppStore) => {
    return ({
        userInfo: state.userInfo,
        configObjectmGroups: state.configObject.configmGroups,
        isWebFullymLoaded: state.webms.isWebFullymLoaded,
    })
};

export default connect<Ownms, {}, {}>((state: IAppStore) => mStateToms(state), {})(EditPanel);