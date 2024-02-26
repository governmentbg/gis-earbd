import { IBufferToolConfig, IUrlInfo } from '../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import {
    createFeature,
    validateFeatures,
    editFeature,
    buffer
} from '../../../../Lib/v0.6/src/ActionsController/Actions';
import EventsManager from '../../../../Lib/v0.6/src/ActionsController/EventsManager';
import {IDetailData} from '../../../../Lib/v0.6/src/ActionsController/ActionsController';
import DestinationActivityms from '../../../../Lib/v0.6/src/ActionsController/DestinationActivityms';
import ActionsController from '../../../../Lib/v0.6/src/ActionsController/ActionsController';
import Graphic from '@arcgis/core/Graphic';
import axios from 'axios';
import UrlHelper from '../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
interface IBufferData {
    destinationId: string;
    payload: Array<IDetailData>;
}

class CustomActions {
    private static instance: CustomActions;
    private constructor() {
        EventsManager.on("mBuffer", (data : IBufferData) => {
           // console.log(data)
            if(data && data.payload && data.payload.length>0 && data.payload[0].features){
                let feature = data.payload[0].features[0];
                if(feature.geometry){
                    if(feature.geometry.m == 'm' || feature.geometry.m == "mm") {
                        let  bufferToolConfig = {} as IBufferToolConfig;
                        bufferToolConfig.distance = 1;
                        bufferToolConfig.unit = "meters";
                        bufferToolConfig.unionResults = false;
                        buffer( data.payload[0].features as Graphic[], bufferToolConfig)
                            .then(result => {
                                if (Array.isArray(result)) {
                                    console.log(result);
                                    data.payload[0].features = result;
                                    ActionsController.trigger(data.destinationId, data.payload );
                                }
                            });
                    } else {
                        ActionsController.trigger(data.destinationId, data.payload);
                    }
                } else {
                    ActionsController.trigger(data.destinationId, data.payload);
                }
            }
           
        })
        EventsManager.on("uploadCustomDocument", (data : any) => {
            CustomActions.uplomocuments(data.payload)
                .then((res) => {
                    if (res) {
                        ActionsController.trigger('uploadSuccess', data.payload.docFeature);
                        EventsManager.emit('clearDocumentSelection');
                    } else {
                        ActionsController.trigger('uploadFailure');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    ActionsController.trigger('uploadFailure');
                });
         })
         EventsManager.on("createOpinionAndNumber", (data : any) => {
            if (data.payload && (data.payload as Array<IDetailData>).length > 0) {
                const details = (data.payload as Array<IDetailData>)[0];
                if (details && details.features && details.features.length > 0) {
                    details.features.forEach((x) => {
                        if (
                            validateFeatures(
                                details.mGroupId,
                                details.operationalmId,
                                details.mId,
                                x as Graphic,
                            )
                        ) {
                            createFeature(
                                details.mGroupId,
                                details.operationalmId,
                                details.mId,
                                x as Graphic,
                            ).then((result: any) => {
                                if (result.m) {
                                    result.m.attributes['opinionsnumber'] = CustomActions.generateId(result.m.attributes['objectId']);
                                    editFeature( details.mGroupId, details.operationalmId, details.mId, result.m).then((resultEdit: any) => {
                                        if (resultEdit.m) {
                                            details.features = [resultEdit.m];
                                            ActionsController.trigger('createSuccess', [details]);
                                        }
                                    })
                                } else ActionsController.trigger('createFailure', [details]);
                            });
                        }
                    });
                }
            }
         })
         EventsManager.on("customMarkmerty", (data:any)=>{
            var mPreviewData = [] as Array<IDetailData>;
            if (data.payload) {
                mPreviewData = data.payload;
                const mPreviewGroupId = data.destinationId;
                let detailsWithSameGroup = undefined;
                if (ActionsController.detailFeatures)
                    detailsWithSameGroup = ActionsController.detailFeatures.find((x) => x.groupId == data.destinationId);
                mPreviewData[0].groupId = mPreviewGroupId;
                mPreviewData[0].mGroupId = mPreviewGroupId;
                if (detailsWithSameGroup && detailsWithSameGroup.features) {
                    const featToCompare = mPreviewData[0].features[0];
                    const findFeature = detailsWithSameGroup.features.find(
                        (x) => x.attributes['objectid'] == featToCompare.attributes['objectid'],
                    );
                    if (!findFeature) {
                        mPreviewData[0].features = [
                            ...detailsWithSameGroup.features,
                            ...mPreviewData[0].features,
                        ];
                    } else {
                        mPreviewData[0].features = [...detailsWithSameGroup.features];
                    }
                }

                ActionsController.detailFeatures = mPreviewData;
                EventsManager.emit(DestinationActivityms.PREVIEW_FEATURE);
            }
         })
    }
    static generateId = (objectId: number)=>{
        var date = new Date();
        var result =  `${date.getFullYear()}_${date.getMonth()+1}_${date.getDate()}_${objectId}`
        return result;
    }

    static getInstance(): CustomActions {
        if (!CustomActions.instance) { 
            CustomActions.instance = new CustomActions();
        }
        return CustomActions.instance;
    }
    static uplomocuments = (documetms: {
        file: File | null;
        id: string;
        entityKey: string;
        document_creator: string;
        document_m: string;
        document_date: Date | null;
        key_words: string;
        description: string;
        token: string;
        documentUrls: {
            mDocumentUrl: IUrlInfo;
            searchDocumentUrl: IUrlInfo;
            deleteDocumentUrl: IUrlInfo;
            downlomocumentUrl: IUrlInfo;
        };
        docFeature: {
            features: Graphic[];
            mGroupId: string;
            operationalmId: string;
            mId: string;
        }[];
    }): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const {
                file,
                id,
                entityKey,
                document_creator,
                document_m,
                document_date,
                key_words,
                description,
                documentUrls,
                token,
            } = documetms;
    
            if (!documentUrls.mDocumentUrl) return;
            if (!documentUrls.mDocumentUrl.url) return;
            if (!file) return;
            if (!file.m) return;
            if (!document_creator) return;
            if (!document_m) return;
            if (!document_date) return;
    
            const formData = new FormData();
            const docms: any = {
                Creator: document_creator,
                Documentm: document_m,
                DocumentDate : `${document_date?.getFullYear()}-${document_date ? document_date?.getMonth() + 1 : 1
                    }-${document_date?.getDate()}`,
                KeyWords: key_words,
                Description: description,
                Documenm : 1,
                FileMimem: file ? file.m.split('.')[file.m.split('.').length - 1] : '',
                SourceTableSchema : 'sde',
                SourceTablem : id,
                SourceTableId: id,
            };
    
            Object.keys(docms).forEach((key) => formData.append(key, docms[key]));
            formData.append('File', file as File, (file as File).m);
    
            // if (!appConfig.views.panels.documentsPanel.documentsServiceUrls.mDocumentUrl.url) return;
            const url = `${UrlHelper.getUrlPath(documentUrls.mDocumentUrl, window.configUrl)}${token ? '?token=' + token : ''
                }`;
            const config = {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'content-m': 'multipart/form-data',
                },
            };
            axios
                .post(url, formData, config)
                .then((res) => resolve(res.data.success))
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    };
}

export default CustomActions;