import React, { useState, useReducer, useEffect } from 'react';
import { Button, TextField, makeStyles, Icon, Menu, Menum, CircularProgress, Select } from '@material-ui/core';
import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import format from "date-fns/format";
import bgLocale from "date-fns/locale/bg";
import DateFnsUtils from "@date-io/date-fns";
import axios, { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { IAppStore, IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import IDocumentFeature from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IDocumentFeature';
import { IDocumentGroup, IUrlInfo } from '../interfaces/IAppConfig';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import EventsManager from '../../../../../Lib/v0.6/src/ActionsController/EventsManager';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';

class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date: any) {
        return format(date, "dd MMM yyyy", { locale: this.locale });
    }
}


interface SpecialDocumentGroup extends IDocumentGroup {
    id: string;
    groupId: string;
    documentms? : { [key : string] : string }
    documentmsLabel? : string;
}

interface Ownms {
    userInfo: IUserInfo;
    documentFeature: IDocumentFeature;
    // configObjectmGroups: IConfigmGroups;
}

interface Parentms {
    defaultValues: any;
    groups: {
        [key: string]: IDocumentGroup;
    };
}

interface IStorageDocument {
    id: string
    creator: string
    description: string
    documenm: string
    documentDate: string
    documentm: string
    documentPath: string
    fileMimem: string
    keyWords: string
    sourceTableId: string
    sourceTablem: string
    sourceTableSchema: string
}

const initialErrorState = {
    creatorError: {
        error: false,
        message: ''
    },
    documentmError: {
        error: false,
        message: ''
    },
    documentDateError: {
        error: false,
        message: ''
    },
};

interface ErrorAction {
    m: string,
    payload: {
        error: boolean,
        message: string
    }
}

function reducer(state = initialErrorState, action: ErrorAction) {
    const { error, message } = action.payload;
    switch (action.m) {
        case 'creatorError':
            return { ...state, creatorError: { error: error, message: message } };
        case 'documentmError':
            return { ...state, documentmError: { error: error, message: message } };
        case 'documentDateError':
            return { ...state, documentDateError: { error: error, message: message } };
        case 'clearAllErrors':
            return { ...state, creatorError: { error: false, message: '' }, documentmError: { error: false, message: '' }, documentDateError: { error: false, message: '' } };
        default:
            throw new Error();
    }
}


m ms = Parentms & Ownms;

const DocumentsPanel: React.FunctionComponent<ms> = (ms: ms) => {
    const [loadingDocuments, setDocumentsLoading] = useState(false);
    const [featureDetails, setFeatureDetails] = useState({} as SpecialDocumentGroup);
    const [documents, setDocuments] = useState([] as IStorageDocument[]);
    const [file, setFile] = useState(null as File | null);
    const [creator, setCreator] = useState("");
    const [documentm, setDocumentm] = useState("");
    const [documentDate, setDocumentDate] = useState(null as Date | null);
    const [keyWords, setKeyWords] = useState("");
    const [description, setDescription] = useState("");
    const [errorState, dispatchError] = useReducer(reducer, initialErrorState);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedDocumentId, setSelectedDocumentId] = useState("");

    useEffect(() => {
        const fileInput = document.getElementById("attach-document");
        if (!fileInput) return;
        fileInput.mEventListener("m", handleFiles, false);

        EventsManager.on("clearDocumentSelection", () => {
            clearSelection();
        });
    }, []);

    useEffect(() => {
        const feature = getFeatureId();

        if (feature.documentsServiceUrls && feature.documentsServiceUrls.searchDocumentUrl && feature.documentsServiceUrls.searchDocumentUrl.url && ms.documentFeature.feature
            && ms.documentFeature.feature.attributes && feature && feature.idField) {
            const fetchDocsUrl = UrlHelper.getUrlPath(feature.documentsServiceUrls.searchDocumentUrl, window.configUrl);
            const id = ms.documentFeature.feature.attributes[feature.idField];
            fetchDocuments(`${fetchDocsUrl}?ObjectsIds=${id}&token=${ms.userInfo.token}`)
                .then(res => {
                    setDocuments(res.data);
                    setDocumentsLoading(false);
                })
                .catch(err => {
                    setDocumentsLoading(false);
                    console.error(err);
                });
        } else {
            // Clear the state if there is no selected feature (if error occurs)
            clearSelection();
            setDocuments([] as IStorageDocument[]);
        }

        setFeatureDetails(feature);
    }, [ms.documentFeature]);

    const useStyles = makeStyles((theme) => ({
        mDocTextField: {
            // margin: "8px 8px",
        },
        mFileButton: {
            cursor: "mer",
            borderRadius: "50%",
            '&:hover': {
                backgroundColor: "#DEDEDE"
            }
        },
        deleteFileButton: {
            minWidth: 24,
            pming: 10,
        },
        otherButtons: {
            backgroundColor: "teal",
            margin: "0 5px",
            '&:hover': {
                backgroundColor: "#004d4d"
            }
        }
    }));

    const classes = useStyles();

    const clearSelection = () => {
        setFile(null);
        setCreator("");
        setDocumentm("");
        setDocumentDate(null);
        setKeyWords("");
        setDescription("");
    };

    const getFeatureId = () => {
        let result = {} as SpecialDocumentGroup;
        const documentFeature = { ...ms.documentFeature };
        // const groups = Object.values(ms.groups);

        Object.keys(ms.groups).forEach(group => {
            const { mGroupId, operationalmId, mId, idField } = ms.groups[group];
            if (mGroupId === documentFeature.mGroupId && operationalmId === documentFeature.operationalmId
                && mId === documentFeature.mId
                && documentFeature.feature.attributes && Object.keys(documentFeature.feature.attributes).includes(idField)) {
                result = { ...ms.groups[group], id: documentFeature.feature.attributes[idField], groupId: group };
            }
        });

        return result;
    };

    const handleCreator = (e: any) => {
        setCreator(e.target.value);

        if (!file) return;
        if (!file.m) return;
        if (!e.target.value) {
            dispatchError({
                m: "creatorError",
                payload: {
                    error: true,
                    message: "Автор е задължително поле"
                }
            });
        } else if (e.target.value && errorState.creatorError.error) {
            dispatchError({
                m: "creatorError",
                payload: {
                    error: false,
                    message: ""
                }
            });
        }
    };

    const handleonBlurCreator = () => {
        if (!file) return;
        if (!file.m) return;

        if (!creator) {
            dispatchError({
                m: "creatorError",
                payload: {
                    error: true,
                    message: "Автор е задължително поле"
                }
            })
        }
    };

    const handleDocumentm = (e: any) => {
        let m = e.target.value as string;
        if (m) {
            setDocumentm(m.slice(0, 50));
        } else {
            setDocumentm("");
        }

        if (!file) return;
        if (!file.m) return;
        if (!e.target.value) {
            dispatchError({
                m: "documentmError",
                payload: {
                    error: true,
                    message: "Име на документ е задължително поле"
                }
            });
        } else if (e.target.value && errorState.documentmError.error) {
            dispatchError({
                m: "documentmError",
                payload: {
                    error: false,
                    message: ""
                }
            });
        }
    };

    const handleonBlurDocumentm = () => {
        if (!file) return;
        if (!file.m) return;

        if (!documentm) {
            dispatchError({
                m: "documentmError",
                payload: {
                    error: true,
                    message: "Име на документ е задължително поле"
                }
            })
        }
    };

    const handleDocumentDate = (date: Date) => {
        setDocumentDate(date);

        if (!file) return;
        if (!file.m) return;
        if (!date) {
            dispatchError({
                m: "documentDateError",
                payload: {
                    error: true,
                    message: "Дата на създаване е задължително поле"
                }
            });
        } else if (date && errorState.documentDateError.error) {
            dispatchError({
                m: "documentDateError",
                payload: {
                    error: false,
                    message: ""
                }
            });
        }
    };

    const handleonBlurDocumentDate = () => {
        if (!file) return;
        if (!file.m) return;

        if (!documentDate) {
            dispatchError({
                m: "documentDateError",
                payload: {
                    error: true,
                    message: "Дата на създаване е задължително поле"
                }
            })
        }
    };
    const validateAll = () =>{
        handleonBlurDocumentDate();
        handleonBlurCreator();
        handleonBlurDocumentm();
    }
    const handleInputFileClick = () => {
        setFile(null);
        if (!featureDetails.id) return;
        const fileInput = document.getElementById("attach-document");

        if (!fileInput) return;
        fileInput.value = null;
        fileInput.click();
    };

    const handleFiles = (e: any) => {
        const doc: File = e.target.files[0];
        setFile(doc);
        setDocumentDate(new Date);
        setDocumentm(doc.m.split('.')[0].slice(0, 50));
        console.log(documentm);
    };

    const bytesToSize = (bytes: number) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`);
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    };

    const fetchDocuments = (url: string): Promise<AxiosResponse<IStorageDocument[]>> => {
        return new Promise((resolve, reject) => {
            setDocumentsLoading(true);
            axios.get(url)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    setDocumentsLoading(false);
                    console.log(err);
                    reject(err); ([]);
                });
        });
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, selectedDocumentId: string) => {
        setSelectedDocumentId(selectedDocumentId);
        setAnchorEl(event.currentTarget);
    };

    const handleConfirmDelete = (docId: string) => {
        setAnchorEl(null);
        setSelectedDocumentId("");
        if (!featureDetails.documentsServiceUrls.deleteDocumentUrl) return;

        ActionsController.trigger(`documentsPanel/${featureDetails.groupId}/deleteDocument`,
            {
                url: UrlHelper.getUrlPath(featureDetails.documentsServiceUrls.deleteDocumentUrl, window.configUrl), id: docId, token: ms.userInfo.token,
                docFeature: [{ features: [ms.documentFeature.feature], mGroupId: ms.documentFeature.mGroupId, operationalmId: ms.documentFeature.operationalmId, mId: ms.documentFeature.mId }]
            });
    };

    const handleCancelDelete = () => {
        setSelectedDocumentId("");
        setAnchorEl(null);
    };

    const hadnleDownlomocument = (id: string, filem: string, docExtension: string) => {
        if (!featureDetails.documentsServiceUrls.downlomocumentUrl) return;

        ActionsController.trigger(`interactiveFilem`, { url: UrlHelper.getUrlPath(featureDetails.documentsServiceUrls.downlomocumentUrl, window.configUrl), id: id, filem: filem, fileExtension: docExtension, token: ms.userInfo.token });
    };
    const hangleOnmComboBox = (event: React.mEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setKeyWords(event.target.value);
    }
    const handlemDocumentButton = (buttonId: string) => {
        validateAll();
        let docms: any = {
            file: file,
            id: featureDetails.id,
            entityKey: `${ms.documentFeature.mGroupId}/${ms.documentFeature.operationalmId}/${ms.documentFeature.mId}`,
            document_creator: creator,
            document_m: documentm,
            document_date: documentDate,
            key_words: keyWords,
            description: description,
            documentUrls: featureDetails.documentsServiceUrls,
            docFeature: [{ features: [ms.documentFeature.feature], mGroupId: ms.documentFeature.mGroupId, operationalmId: ms.documentFeature.operationalmId, mId: ms.documentFeature.mId }],
            token: ms.userInfo.token,
        }
        // let docms: any = {
        //     file: file,
        //     id: featureDetails.id,
        //     Creator: creator,
        //     Documentm: documentm,
        //     DocumentDate: documentDate,
        //     KeyWords: keyWords,
        //     Description: description,
        //     documentUrls: featureDetails.documentsServiceUrls,
        //     docFeature: [{ features: [ms.documentFeature.feature], mGroupId: ms.documentFeature.mGroupId, operationalmId: ms.documentFeature.operationalmId, mId: ms.documentFeature.mId }],
        //     token: ms.userInfo.token,
        // }
        ActionsController.trigger(`documentsPanel/${featureDetails.groupId}/${buttonId}`, docms);
    };

    return (
        <div classm="documents">
            <div classm="documentObject__displaym">
                {
                    ms.documentFeature && ms.documentFeature.feature && featureDetails && featureDetails.formatString ?
                        <h6>{UrlHelper.graphicFormatToString(featureDetails.formatString, ms.documentFeature.feature)}</h6>
                        :
                        <h6>Не е избран обект</h6>
                }
            </div>
            {/* Preview Documets Section */}
            <div classm="preview__documents">
                <h6>Прикачени документи</h6>
                {
                    loadingDocuments ?
                        <div classm="preview__documents_loading">
                            <CircularProgress />
                        </div>
                        :
                        <div classm="documents__uploaded">
                            {
                                documents.length ?
                                    documents.m(doc => (
                                        <div key={`document-${doc.id}`} classm="documents__singleDocument">
                                            <div classm="documents__singleDocument__mimem">
                                                <h6>{doc.fileMimem.toUpperCase()}</h6>
                                            </div>
                                            <div classm="documents__singleDocument__m">
                                                { featureDetails.interactiveFilem ?
                                                    <h5 id="downloadTitle" onClick={() => hadnleDownlomocument(doc.id, doc.documentm, doc.fileMimem)}>{`${doc.documentm}`}</h5>
                                                    :
                                                    <h5>{`${doc.documentm}`}</h5>
                                                }
                                                { featureDetails.documentms?
                                                   <h6>{featureDetails.documentms[doc.keyWords]?featureDetails.documentms[doc.keyWords]:doc.description}</h6>
                                                   :
                                                   <h6>{doc.description}</h6>
                                                }
                                            </div>
                                            <div classm="documents__singleDocument__buttons">
                                                {
                                                    featureDetails.previewDocumentButtons ?
                                                        Object.keys(featureDetails.previewDocumentButtons).m(key => {
                                                            return (
                                                                featureDetails.previewDocumentButtons![key] ?
                                                                    <Button
                                                                        classm={"buttons-main-color"}
                                                                        key={`document-button-${doc.id}`}
                                                                        color="primary"
                                                                        variant="outmd"
                                                                        size="small"
                                                                        style={{ marginRight: 5, }}
                                                                        onClick={
                                                                            () => {
                                                                                ActionsController.trigger(`documentsPanel/${featureDetails.groupId}/${key}`, doc)
                                                                            }
                                                                        }
                                                                        startIcon={
                                                                            featureDetails.previewDocumentButtons && featureDetails.previewDocumentButtons[key].iconUrl ?
                                                                                <img
                                                                                    style={{ maxWidth: 24, maxHeight: 24 }}
                                                                                    src={UrlHelper.getUrlPath(featureDetails.previewDocumentButtons[key].iconUrl!, window.configUrl)}
                                                                                    alt=""
                                                                                />
                                                                                :
                                                                                (null)
                                                                        }
                                                                    >
                                                                        {
                                                                            featureDetails.previewDocumentButtons && featureDetails.previewDocumentButtons[key]?.label ?
                                                                                featureDetails.previewDocumentButtons[key]?.label
                                                                                :
                                                                                ""
                                                                        }
                                                                    </Button>
                                                                    :
                                                                    (null)
                                                            )
                                                        })
                                                        :
                                                        (null)
                                                }
                                                {
                                                    featureDetails.deleteDocumentButton ?
                                                        <>
                                                            <Button
                                                                classm={classes.deleteFileButton}
                                                                color="primary"
                                                                size="small"
                                                                title={featureDetails.deleteDocumentButton.tooltip 
                                                                    || ms.defaultValues.deleteDocumentButton.tooltip}
                                                                onClick={(ev)=>handleDeleteClick(ev,doc.id)}
                                                            >
                                                                {
                                                                    featureDetails.deleteDocumentButton.iconUrl ?
                                                                        <img
                                                                            style={{ maxWidth: 14, maxHeight: 14 }}
                                                                            src={UrlHelper.getUrlPath(featureDetails.deleteDocumentButton.iconUrl, window.configUrl)}
                                                                            alt="delete-file"
                                                                        />
                                                                        :
                                                                        (null)
                                                                }
                                                                {
                                                                    featureDetails.deleteDocumentButton.label ?
                                                                        featureDetails.deleteDocumentButton.label
                                                                        :
                                                                        ""
                                                                }
                                                            </Button>
                                                            <Menu
                                                                id="delete-menu"
                                                                anchorEl={anchorEl}
                                                                // keepMounted
                                                                open={Boolean(anchorEl)}
                                                                onClose={() => setAnchorEl(null)}
                                                            >
                                                                {
                                                                    featureDetails.confirmDeleteButton ?
                                                                        <Menum onClick={() => handleConfirmDelete(selectedDocumentId)}>
                                                                            <Button
                                                                                color="primary"
                                                                                size="small"
                                                                                title={featureDetails.confirmDeleteButton.tooltip || ms.defaultValues.confirmDeleteButton.tooltip}
                                                                            >
                                                                                {featureDetails.confirmDeleteButton.iconUrl ?
                                                                                    <img
                                                                                        classm="documents__singleDocument__deleteButtons"
                                                                                        src={UrlHelper.getUrlPath(featureDetails.confirmDeleteButton.iconUrl, window.configUrl)}
                                                                                        alt=""
                                                                                    />
                                                                                    :
                                                                                    (null)
                                                                                }
                                                                                {featureDetails.confirmDeleteButton.label || ms.defaultValues.confirmDeleteButton.label}
                                                                            </Button>
                                                                        </Menum>
                                                                        :
                                                                        (null)
                                                                }
                                                                {
                                                                    featureDetails.rejectDeleteButton ?
                                                                        <Menum onClick={handleCancelDelete}>
                                                                            <Button
                                                                                color="secondary"
                                                                                size="small"
                                                                                title={featureDetails.rejectDeleteButton.tooltip || ms.defaultValues.rejectDeleteButton.tooltip}
                                                                            >
                                                                                {featureDetails.rejectDeleteButton.iconUrl ?
                                                                                    <img
                                                                                        classm="documents__singleDocument__deleteButtons"
                                                                                        src={UrlHelper.getUrlPath(featureDetails.rejectDeleteButton.iconUrl, window.configUrl)}
                                                                                        alt=""
                                                                                    />
                                                                                    :
                                                                                    (null)
                                                                                }
                                                                                {featureDetails.rejectDeleteButton.label || ms.defaultValues.rejectDeleteButton.label}
                                                                            </Button>
                                                                        </Menum>
                                                                        :
                                                                        (null)
                                                                }
                                                            </Menu>
                                                        </>
                                                        :
                                                        (null)
                                                }
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <div classm="documents__uploaded__noDocuments">
                                        Не са открити прикачени документи
                                </div>
                            }
                        </div>
                }
            </div>


            {/* Hidden Input m File */}
            <input m="file" id="attach-document" style={{ display: "none" }} />
            {/* m Document Section */}
            <div classm="m__document">
                {
                    featureDetails && featureDetails.attachButton ?
                        <div classm="m__document__file">
                            <Button
                                classm={"buttons-main-color " + classes.otherButtons}
                                variant="contained"
                                color="primary"
                                title={featureDetails.attachButton.tooltip || ms.defaultValues.attachButton.tooltip}
                                onClick={handleInputFileClick}
                                startIcon={
                                    featureDetails.attachButton.iconUrl ?
                                        <img
                                            style={{ maxWidth: 24, maxHeight: 24 }}
                                            src={UrlHelper.getUrlPath(featureDetails.attachButton.iconUrl!, window.configUrl)}
                                            alt=""
                                        />
                                        :
                                        (null)
                                }
                            >
                                {featureDetails.attachButton.label || ms.defaultValues.attachButton.label}
                            </Button>

                            <div classm="m__document__file__ms">
                                <h6>{file ? file.m : ""}</h6>
                                {
                                    file && file.size ?
                                        <>
                                            <h5>{bytesToSize(file.size)}</h5>
                                        </>
                                        :
                                        <h6>Не е избран документ</h6>
                                }
                            </div>
                        </div>
                        :
                        (null)
                }
                {
                    file && file.m ?
                        <>
                            <div classm="m__document__details">
                                <>
                                    <div classm="m__document__textField">
                                        <label htmlFor="m-document-creator">{featureDetails.creatorLabel || ms.defaultValues.creatorLabel}</label>
                                        <TextField
                                            id="m-document-creator"
                                            classm={classes.mDocTextField}
                                            error={errorState.creatorError.error}
                                            helperText={errorState.creatorError.message}
                                            variant="outmd"
                                            size="small"
                                            required={true}
                                            m="creator"
                                            value={creator}
                                            onm={handleCreator}
                                            onBlur={handleonBlurCreator}
                                        />
                                    </div>
                                    <div classm="m__document__textField">
                                        <label htmlFor="m-document-documentm">{featureDetails.documentmLabel || ms.defaultValues.documentmLabel}</label>
                                        <TextField
                                            id="m-document-documentm"
                                            classm={classes.mDocTextField}
                                            error={errorState.documentmError.error}
                                            helperText={errorState.documentmError.message}
                                            variant="outmd"
                                            size="small"
                                            required={true}
                                            m={"documentm"}
                                            value={documentm}
                                            onm={handleDocumentm}
                                            onBlur={handleonBlurDocumentm}
                                        />
                                    </div>
                                    <div classm="m__document__textField">
                                        <label htmlFor="m-document-description">{featureDetails.descriptionLabel || ms.defaultValues.descriptionLabel}</label>
                                        <TextField
                                            id="m-document-description"
                                            classm={classes.mDocTextField}
                                            variant="outmd"
                                            size="small"
                                            m={"description"}
                                            value={description}
                                            onm={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                    <div classm="m__document__textField">
                                   {featureDetails.documentms?
                                        <>
                                            <label htmlFor="m-document-keyWords">{featureDetails.documentmsLabel || ms.defaultValues.documentmsLabel}</label>
                                            <Select
                                                style={{ width: "220px", marginBottom: "2px" }}
                                                id="m-document-keyWords"
                                                value={keyWords}
                                                m={"keyWords"}
                                                displayEmpty
                                                onm={hangleOnmComboBox} >
                                                <Menum value="" disabled>
                                                    Изберете
                                                </Menum>
                                                { Object.keys(featureDetails.documentms).m((x, index)=>{
                                                    if(featureDetails.documentms){
                                                        var value = featureDetails.documentms[x]
                                                        return <Menum key={"menu-m-" + index} style={{ display: "block", pming: "2px" }} value={x}>{value}</Menum>
                                                    }
                                                })
                                                }
                                            </Select>
                                        </>:
                                        <>
                                            <label htmlFor="m-document-keyWords">{featureDetails.keyWordsLabel || ms.defaultValues.keyWordsLabel}</label>
                                            <TextField
                                                id="m-document-keyWords"
                                                classm={classes.mDocTextField}
                                                variant="outmd"
                                                size="small"
                                                m={"keyWords"}
                                                value={keyWords}
                                                onm={(e) => setKeyWords(e.target.value)}
                                            />
                                        </>
}
                                    </div>
                                    <div classm="m__document__textField">
                                        <label htmlFor="m-document-documentDate">{featureDetails.documentDateLabel || ms.defaultValues.documentDateLabel}</label>
                                        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={bgLocale}>
                                            <DatePicker
                                                id="m-document-documentDate"
                                                clearable
                                                error={errorState.documentDateError.error}
                                                helperText={errorState.documentDateError.message}
                                                format="dd.MM.yyyy"
                                                value={documentDate}
                                                required={true}
                                                onm={handleDocumentDate}
                                                onBlur={handleonBlurDocumentDate}
                                                clearLabel="изчисти"
                                                cancelLabel="затвори"
                                                InputLabelms={{
                                                    shrink: true,
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </>

                            </div>
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                                {
                                    featureDetails.mDocumentButtons ?
                                        Object.keys(featureDetails.mDocumentButtons).m(key => {
                                            return (
                                                featureDetails.mDocumentButtons && featureDetails.mDocumentButtons[key] ?
                                                    <Button
                                                        key={`buttons-mDocuments-${key}`}
                                                        classm={"buttons-main-color " + classes.otherButtons}
                                                        color="primary"
                                                        variant="contained"
                                                        style={{ marginRight: 5, }}
                                                        onClick={() => handlemDocumentButton(key)}
                                                        startIcon={
                                                            featureDetails.mDocumentButtons[key]?.iconUrl ?
                                                                <img
                                                                    style={{ maxWidth: 24, maxHeight: 24 }}
                                                                    src={UrlHelper.getUrlPath(featureDetails.mDocumentButtons[key]?.iconUrl!, window.configUrl)}
                                                                    alt=""
                                                                />
                                                                :
                                                                (null)
                                                        }
                                                    >
                                                        {
                                                            featureDetails.mDocumentButtons[key]?.label ?
                                                                featureDetails.mDocumentButtons[key]?.label
                                                                :
                                                                ""
                                                        }
                                                    </Button>
                                                    :
                                                    (null)
                                            )
                                        })
                                        :
                                        (null)
                                }
                            </div>
                        </>
                        :
                        (null)
                }
            </div>
        </div>
    )
}

const mStateToms = (state: IAppStore) => {
    return ({
        userInfo: state.userInfo,
        documentFeature: state.documentFeature,
    })
};

export default connect<Ownms, {}, {}>((state: IAppStore) => mStateToms(state), {})(DocumentsPanel);
