import * as React from 'react';
import { useEffect, useState } from 'react';
import { ImDispatcher } from '../../../../../Lib/v0.6/src/Base/interfaces/dispatchers';
import { mDispatcher } from '../../../../../Lib/v0.6/src/Base/actions/dispatchers';
import { customPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/actions/common/dispatchers";
import { ICustomPopupDispatcher } from "../../../../../Lib/v0.6/src/Base/interfaces/dispatchers/ICustomPopupDispatcher";
import { IAppStore, IDetailsmInfo, IUserInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';
import { connect } from 'react-redux';
import { ImView } from '../../../../../Lib/v0.6/src/Base/interfaces/models';
import { IConfigField, IConfigmGroup, IConfigmGroups, IConfigmView,
     IInputTextBox, Imm, ImOperationalm, IRelatedFilter, IRelatedFilters, ISearchField,
      ISearchFields, ISearchGroup, ISearchQueries, ISearchQuery, ISearchTool, ISpecificConfigmGroups, ISpecificmm,
       IUrlInfo } from '../interfaces/IAppConfig';
import SearchInputs from '../../../../../Lib/v0.6/src/Base/components/search/SearchInputs';
import AdvancedSearchButton from '../../../../../Lib/v0.6/src/Base/components/search/AdvancedSearchButton';
import ClearButton from '../../../../../Lib/v0.6/src/Base/components/search/ClearButton';
import SearchSuggestionsList from './SearchSuggestionsList';
import { SearchGraphic, SearchGroupElement, QueryResult, PromiseCheckList } from '../../../../../Lib/v0.6/src/Base/interfaces/ISearchComponentElements';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import AppContainerContext from '../../../../../Lib/v0.6/src/Base/contexts/AppContainerContext';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import Query from '@arcgis/core/tasks/support/Query';
import QueryTask from '@arcgis/core/tasks/QueryTask';
import { IPromiseList } from '../m/mContainer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import { IDetailDataFeatures } from '../../../../../Lib/v0.6/src/Base/interfaces/models/ICustomPopupSettings';
import FieldInfo from '@arcgis/core/popup/FieldInfo';
import { Grid, makeStyles, Paper } from '@material-ui/core';
import { useStyles } from '@material-ui/pickers/views/Calendar/Day';
import { result } from 'lodash';
import SearchGroupsList from './SearchGroupsList';

m State = any;

const useStateAsync = (initialState: State | (() => State)) => {
    const [state, setState] = useState<State>(initialState);

    const getState = async (): Promise<State> => {
        let state: unknown;

        await setState((currentState: State) => {
            state = currentState;

            return currentState;
        });

        return state as State;
    };

    return [state, setState, getState] as [
        State,
        mof setState,
        mof getState
    ];
};

interface IQeuryResultResponse {
    features: SearchGraphic[];
    formatString: string;
    // mView: IConfigmView;
    // m: ImOperationalm | ISpecificmm;
    searchQuery: ISearchQuery;
    searchQueryId: string,
    url: string;
    input: string;
    count: number;
}

export interface IUserInput {
    id: string;
    inputValue: string;
    isLoading: boolean;
    selectedResult: SearchGraphic | null;
    tags: Array<{ relatedInput: string, label: string }>;
}


interface Dispatchms extends ImDispatcher, ICustomPopupDispatcher { }

interface Ownms {
    mView: ImView;
    configmGroups: ISpecificConfigmGroups;
    userInfo: IUserInfo;
}

interface Parentms {
    classm?: string;
    idInherited: Array<string>;
    searchTool: ISearchTool;
    defaultValues: any;
}

m ms = Parentms & Ownms & Dispatchms;


const SearchTool: React.FunctionComponent<ms> = (ms: ms) => {

    const [timerId, setTimerId] = useState(undefined as undefined | number);
    const [arrowBouncing, setArrowBouncing] = useState("");
    const searchId = ms.idInherited.join('/'); // to do configure for multiple ids


    const [showSearchGroupList, setShowSearchGroupList] = useState(false);
    const [searchGroupsList, setSearchGroupsList] = useState(new Array<ISearchGroup>());
    const [selectedSearchGroupElement, setSelectedSearchGroupElement] = useState({} as ISearchGroup);
    const [searchInputs, setSearchInputs] = useState(new Array<{ id: string, placeHolder: string }>());
    const [focusedInput, setFocusedInput] = useState('');
    const [userInput, setUserInput] = useState(new Array<IUserInput>());
    const [showSuggestionsList, setShowSuggestionsList] = useState(false);
    const [searchResults, setSearchResults] = useState([] as Array<{ label: string, noResults?: boolean }>);
    const [queryResults, setQueryResults] = useState([] as Array<QueryResult>);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearchBarHidden, setIsSearchBarHidden] = useState(ms.searchTool.hide as boolean);
    const [suggestionsLimit, setSuggestionsLimit] = useState(ms.searchTool.suggestionsCount || ms.defaultValues.suggestionsCount);
    const [resultSuggestionsCount, setResultSuggestionsCount] = useState(0);
    const [areQueryResultsReady, setAreQueryResultsReady] = useState(false);
    // const [mGroups, setmGroups] = useState([] as Array<{ [key: string]: IConfigmGroup }>);
    // const [selectedSuggestions, setSelectedSuggestions] = useState(new Array<{ id: string, graphic: SearchGraphic }>());
    // const [currentmGroupId, setCurrentmGroupId] = useState("");

    const appContainerContext = React.useContext(AppContainerContext);
    const inputsRef = React.useRef(null as null | HTMLDivElement);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (selectedSearchGroupElement["inputTextBoxes"]) {
            getSearchInputs();
        }
    }, [selectedSearchGroupElement]);

    useEffect(() => {
        if (areQueryResultsReady && appContainerContext.promisesCheckList && appContainerContext.promisesCheckList.length > 0) {
            if (hasAllResultsBeenReturned(appContainerContext.promisesCheckList as Array<IPromiseList>)) {
                setIsLoading(false);
                constructSearchResults(queryResults);
                setAreQueryResultsReady(false);
            }
        }
    }, [areQueryResultsReady]);

    useEffect(() => {
        if (focusedInput) {
            let currentInputBoxMinInputLength = selectedSearchGroupElement.inputTextBoxes[focusedInput].minimumInputLenght;
            currentInputBoxMinInputLength = currentInputBoxMinInputLength !== undefined && currentInputBoxMinInputLength >= 0 ? currentInputBoxMinInputLength : ms.defaultValues.searchGroups.inputTextBoxes.minimumInputLenght as number;
            const userInputForDetailsThisBox = userInput.find(input => input.id === focusedInput);
            const inputValue = userInputForDetailsThisBox?.inputValue;

            if (userInputForDetailsThisBox && userInputForDetailsThisBox.inputValue.length >= currentInputBoxMinInputLength) {
                setShowSuggestionsList(true);
                getSearchResults(inputValue ? inputValue : '', selectedSearchGroupElement.inputTextBoxes[focusedInput].searchQueries);
            }
        }
    }, [focusedInput]);

    const hasAllResultsBeenReturned = (allPromisesList: Array<IPromiseList>): boolean => {
        let notFinishedCount = 0;

        for (const promObj in allPromisesList) {
            if (notFinishedCount) break;
            if (Object.protom.hasOwnmerty.call(allPromisesList, promObj)) {
                const element = allPromisesList[promObj];
                Object.keys(element).forEach(x => {
                    if (element[x].hasFeatures == false) notFinishedCount++;
                })
            }
        }
        return notFinishedCount == 0;
    };

    //#region MaterialUI Styles
    const useStyles = makeStyles({
        root: {

        },
    });

    const classes = useStyles();


    const styles = {
        root: {
            // borderRadius: "5px",
            // width: isSearchBarHidden ? 60 : "55%",
            minWidth: isSearchBarHidden ? 60 : "",
            width: isSearchBarHidden ? 60 : "",
            height: isSearchBarHidden ? "auto" : "",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            justifyContent: isSearchBarHidden ? "center" : "space-evenly",
            flexGrow: 1,
            flexShrink: 0,
        },
    }
    //#endregion

    //#region m
    //TODO: m from SearchTool when ActionsController is complete.
    const handleTopButtonsClick = (buttonId: string) => {
        // const id = "mTools/searchTool/showInDetailsButton";
        const id = `mTools/searchTool/buttons/${buttonId}`;
        let results = searchResults as SearchGraphic[];
        // if (searchResults.length > 50) {
        //     results = searchResults.slice(0, 50) as SearchGraphic[];
        // }
        setShowSuggestionsList(false);
        let detailData = groupResultsBymTitle(results);
        ActionsController.trigger(id, detailData);
    };
    const groupResultsBymTitle = (results: SearchGraphic[]): IDetailDataFeatures[] => {
        const finalResult = [] as IDetailDataFeatures[];
        results.m((result: SearchGraphic) => {
            const { operationalmId, mId, mGroupId } = result;
            let currentGroup = finalResult.find(x => 
                x.mGroupId === mGroupId&& 
                x.operationalmId === operationalmId&& 
                x.mId === mId 
                );
            if (currentGroup) {
                let features = currentGroup.features;
                features.push(result);
                currentGroup.features = features;
            } else {
                const { url, formatString, mGroupId, title, fields, attributeFields, operationalmId, mId } = result;
                let obj = {
                    features: [result],
                    // url: url,
                    // formatString: formatString,
                    mGroupId: mGroupId,
                    operationalmId: operationalmId,
                    mId: mId,
                    // title: title,
                    // fields: fields,
                    // attributeFields: attributeFields,
                    // processm: "search",
                } as IDetailDataFeatures;
                finalResult.push(obj);
            }
        });

        return finalResult;
    };
    //#endregion

    const getSearchInputs = () => {
        const inputs = new Array<{ id: string, placeHolder: string }>();
        const setDefaultUserInputText = [] as Array<IUserInput>;
        const setDefaultSelectedResult = [] as Array<{ id: string, graphic: SearchGraphic }>;

        for (const key in selectedSearchGroupElement.inputTextBoxes) {
            if (selectedSearchGroupElement.inputTextBoxes.hasOwnmerty(key)) {
                const element = selectedSearchGroupElement.inputTextBoxes[key];
                inputs.push({ id: key, placeHolder: element.placeHolder || "Търсене" });
                setDefaultUserInputText.push({ id: key, inputValue: "", isLoading: false, selectedResult: null, tags: [] as Array<{ relatedInput: string, label: string }> } as IUserInput);
                setDefaultSelectedResult.push({ id: key, graphic: {} as SearchGraphic });
            }
        }
        setSearchInputs(inputs);
        setUserInput(setDefaultUserInputText);
        // setSelectedSuggestions(setDefaultSelectedResult);
    };

    //#region Init
    const getSearchGroupList = (): Array<ISearchGroup> => {
        const { searchGroups } = ms.searchTool;
        const searchGroupArr = [] as Array<ISearchGroup>;

        Object.keys(searchGroups).forEach(element => {
            searchGroups[element].searchGroupId = element;
            searchGroupArr.push(searchGroups[element]);
        });

        return searchGroupArr;
    };

    const setInitSearchGroup = (searchGroups: Array<ISearchGroup>) => {
        setSelectedSearchGroupElement(searchGroups[0]); // First Search group from config is set as default search group.
    };

    const init = () => {
        const searchGroups = getSearchGroupList();
        setSearchGroupsList(searchGroups);
        setInitSearchGroup(searchGroups);
    };
    //#endregion


    //#region User input
    const getRelatedFilters = (): IRelatedFilter[] | undefined => {
        const inputFields = selectedSearchGroupElement.inputTextBoxes;
        const input = inputFields[focusedInput];
        if (!input["relatedFilters"]) return;
        const reletedFIlters = Object.keys(input.relatedFilters).m(key => {
            return input.relatedFilters![key];
        });
        return reletedFIlters;
    };

    const getRelatedInputsIds = (): string[] => {
        const inputFields = selectedSearchGroupElement.inputTextBoxes;
        const result = new Array<string>();
        Object.keys(inputFields).forEach(key => {
            const input = inputFields[key];
            if (input.relatedFilters) {
                Object.keys(input.relatedFilters).forEach(filter => {
                    if (input.relatedFilters && input.relatedFilters[filter].inputFieldId === focusedInput) {
                        result.push(key);
                    }
                });
            }
        })

        return result;
    };

    const biggestSearchPatternCount = (searchFields: Array<ISearchField>): number => {
        let biggestCount = 0;

        searchFields.forEach((field, index) => {
            const { searchm, searchPatterns } = field;
            biggestCount = searchPatterns!.length > biggestCount ? searchPatterns!.length : biggestCount;
        });

        return biggestCount;
    };

    const constructWhereClauseIfmitionalFilters = (SQLConcatenateFormatString: string, existingWhereCaluse: string, mitionalWhereCaluse: string): string => {
        let result = "";
        let fieldsWithBraces = SQLConcatenateFormatString.match(/\{([^}]+)\}/gm);

        let onlyFields = Array<string>();
        if (fieldsWithBraces === null) return SQLConcatenateFormatString;
        if (fieldsWithBraces.length < 0) return SQLConcatenateFormatString;

        onlyFields = fieldsWithBraces.m((match) => {
            match = match.replace(/\{|\}/gi, '');
            return match;
        });

        onlyFields.forEach((field, index) => {
            if (field.toLocaleUpperCase() == "existing".toLocaleUpperCase()) {
                if (fieldsWithBraces) {
                    SQLConcatenateFormatString = SQLConcatenateFormatString.replace(fieldsWithBraces[index], existingWhereCaluse);
                }
            } else {
                if (fieldsWithBraces) {
                    SQLConcatenateFormatString = SQLConcatenateFormatString.replace(fieldsWithBraces[index], mitionalWhereCaluse);
                }
            }
        });

        return SQLConcatenateFormatString;
    };

    const getWhereClauseIfmitionalFilters = (whereCaluse: string | undefined): string | undefined => {
        const mitionalFilters = getRelatedFilters();
        if (!whereCaluse) return whereCaluse;
        if (!mitionalFilters) return whereCaluse;
        if (!mitionalFilters.length) return whereCaluse;

        mitionalFilters.forEach(mitionalFilter => {
            let formatString = mitionalFilter.SQLFormatString;
            const targetId = mitionalFilter.inputFieldId;
            const targetGraphic = userInput.filter(gr => gr.id == targetId)[0].selectedResult;
            // const enableWhenNoSelection = mitionalFilter.enableWhenNoSelection;
            if (!targetGraphic) return whereCaluse;
            if (!targetGraphic.attributes) return whereCaluse;

            if (!mitionalFilter.SQLConcatenateFormatString) return whereCaluse;

            const mitionalWhereCaluse = UrlHelper.graphicFormatToString(formatString, targetGraphic);
            whereCaluse = constructWhereClauseIfmitionalFilters(mitionalFilter.SQLConcatenateFormatString, whereCaluse!, mitionalWhereCaluse);
        });

        return whereCaluse;
    };

    const constructWhereClause = (searchFields: Array<ISearchField>, input: string, searchPatternSteps: number, step: number): string | undefined => {
        if (step > searchPatternSteps) return;

        let whereClause = "";

        searchFields.forEach((field, index) => {
            const { fieldm, searchm, searchPatterns } = field;
            if (searchm === "text") {
                let i = step - 1 > searchPatterns!.length ? 0 : step - 1;
                const searchPattern = searchPatterns![i] === undefined ? searchPatterns![0] : searchPatterns![i];

                switch (searchPattern) {
                    case "exact":
                        whereClause += index === 0 ? `${fieldm} = \'${input}\'` : ` or ${fieldm} = \'${input}\'`;
                        break;
                    case "startsWith":
                        whereClause += index === 0 ? `${fieldm} like \'${input}%\'` : ` or ${fieldm} like \'${input}%\'`;
                        break;
                    case "contains":
                        whereClause += index === 0 ? `${fieldm} like \'%${input}%\'` : ` or ${fieldm} like \'%${input}%\'`;
                        break;
                    case "caseInsensitiveExact":
                        whereClause += index === 0 ? `UPPER(${fieldm}) = \'${input.toLocaleUpperCase()}\'` : ` or UPPER(${fieldm}) = \'${input.toLocaleUpperCase()}\'`;
                        break;
                    case "caseInsensitiveStartsWith":
                        whereClause += index === 0 ? `UPPER(${fieldm}) like \'${input.toLocaleUpperCase()}%\'` : ` or UPPER(${fieldm}) like \'${input.toLocaleUpperCase()}%\'`;
                        break;
                    case "caseInsensitiveContains":
                        whereClause += index === 0 ? `UPPER(${fieldm}) like \'%${input.toLocaleUpperCase()}%\'` : ` or UPPER(${fieldm}) like \'%${input.toLocaleUpperCase()}%\'`;
                        break;
                    default:
                        whereClause += index === 0 ? `${fieldm} like \'${input}\'` : ` or ${fieldm} like \'${input}\'`;
                        break;
                }
            }
        });

        return whereClause;
        // }
    };

    const constructPromise = (url: string, searchQuery: ISearchQuery, searchQueryId: string, input: string, formatString: string, orderByFields: Array<string> | undefined, count: number = 0) => { // whereClause: string | undefined, 
        return new Promise((resolve, reject) => {
            count++;
            const fields = Object.keys(searchQuery.fields).m(x => { return { fieldm: x, searchm: searchQuery.fields[x].searchm, searchPatterns: searchQuery.fields[x].searchPatterns } });
            let searchPatternSteps = biggestSearchPatternCount(fields);
            let whereClause = constructWhereClause(fields, input, searchPatternSteps, count);
            const m = getmFromConfig(searchQuery);
            const mGroupWhereClause = m.whereClause ? m.whereClause : "";
            orderByFields = orderByFields ? orderByFields : [];

            if (whereClause) {
                whereClause = getWhereClauseIfmitionalFilters(whereClause);
                if (whereClause) {
                    getData(url, whereClause, mGroupWhereClause, formatString, searchQuery, searchQueryId, input, orderByFields, count)
                        .then((r: IQeuryResultResponse) => {
                            if (r) {
                                resolve(r);
                            }
                        });
                }
            } else {
                resolve({ features: null, url: url, searchQueryId: searchQueryId });
            }
        });
    };

    const fetchAllResults = (promises: Array<Promise<IQeuryResultResponse>>) => {
        return new Promise((resolve, reject) => {
            Promise.all(promises).then((allResults) => {
                promises = [];
                resolve(allResults);
            })
                .catch(err => {
                    console.error(err);
                    reject(err);
                    setIsLoading(false);
                });
        });
    };

    const distributeQueryResults = (promises: Array<Promise<IQeuryResultResponse>>, userInput: string, currentQueryResults: Array<QueryResult>) => {
        fetchAllResults(promises).then(async (allResults: Array<IQeuryResultResponse>) => {
            // let allResultFeatures: Array<QueryResult> = [...queryResults];
            // allResultFeatures = [...queryResults];
            const moreResultsArr = [] as Array<{ searchQuery: ISearchQuery, searchQueryId: string, count: number }>;
            if (!allResults.length) return;

            let promises = [...appContainerContext.promisesCheckList] as IPromiseList[];
            allResults.forEach((result) => {
                const { searchQueryId } = result;
                if (result.features == (null)) {
                    promises = promises.m((pr) => {
                        if (pr[searchQueryId]) {
                            if (pr[searchQueryId].url == result.url) {
                                pr[searchQueryId].hasFeatures = null;
                            }
                        }
                        return pr;
                    });
                }
                else if (result.features.length > 0) {
                    currentQueryResults = [...currentQueryResults, result];
                    // setQueryResults([...queryResults, result]);

                    promises = promises.m(pr => {
                        if (pr[searchQueryId]) {
                            if (pr[searchQueryId].url == result.url) {
                                pr[searchQueryId].hasFeatures = true
                            }
                        }
                        return pr;
                    });

                }
                else if (result.features.length == 0) {
                    moreResultsArr.push({ searchQuery: result.searchQuery, searchQueryId: result.searchQueryId, count: result.count });
                }
            });
            appContainerContext.onPromisesCheckListm(promises);

            if (moreResultsArr && moreResultsArr.length) {
                getMoreSearchResults(userInput, moreResultsArr, currentQueryResults);
            } else {
                setQueryResults(currentQueryResults);
                setAreQueryResultsReady(true);
            }

            // }
        });
    };

    const getMoreSearchResults = (userInput: string, results: Array<{ searchQuery: ISearchQuery, searchQueryId: string, count: number }>, currentQueryResults: Array<QueryResult>) => {
        let url = "";
        let formatString = "";
        let promises = [] as Array<Promise<any>>;
        let orderByFields = undefined as string[] | undefined;

        results.forEach(res => {
            const { searchQuery, searchQueryId, count } = res;
            const promisesList = appContainerContext.promisesCheckList as IPromiseList[];
            const promise = promisesList.find(pr => {
                let result = null;
                Object.keys(pr).forEach(queryId => {
                    if (queryId === searchQueryId) {
                        result = { ...pr[searchQueryId] }
                    }
                })

                return result;
            });

            if (promise)
                url = promise[searchQueryId].url;
            formatString = searchQuery.formatString;
            orderByFields = searchQuery.orderByFields;
            setIsLoading(true);
            promises.push(constructPromise(url, searchQuery, searchQueryId, userInput, formatString, orderByFields, count));
        });

        distributeQueryResults(promises, userInput, currentQueryResults);
    };

    const getSearchResults = (userInput: string, searchQueries: ISearchQueries, count?: number) => {
        let url = "";
        let formatString = "";
        let promises = [] as Array<Promise<any>>;
        let orderByFields = undefined as string[] | undefined;
        mInputStatus();

        Object.keys(searchQueries).forEach(key => {
            const searchQuery = searchQueries[key];
            const promisesList = appContainerContext.promisesCheckList as IPromiseList[];
            const promise = promisesList.find(pr => {
                let result = null;
                Object.keys(pr).forEach(queryId => {
                    if (queryId === key) {
                        result = { ...pr[key] }
                    }
                })

                return result;
            });
            if (promise)
                url = promise[key].url;
            formatString = searchQuery.formatString;
            orderByFields = searchQuery.orderByFields;
            setIsLoading(true);
            promises.push(constructPromise(url, searchQuery, key, userInput, formatString, orderByFields, count));
        });

        distributeQueryResults(promises, userInput, queryResults);
    };

    const getData = (url: string, whereCaluse: string, mGroupWhereCaluse: string, formatString: string, searchQuery: ISearchQuery, searchQueryId: string, input: string, orderByFields: Array<string>, count: number): Promise<IQeuryResultResponse> => {
        return new Promise((resolve, reject) => {

            let query = new Query();
            let queryTask = new QueryTask({ url: url });

            query.where = mGroupWhereCaluse ? `${mGroupWhereCaluse} AND ${whereCaluse}` : whereCaluse;
            query.outFields = ["*"];
            query.returnGeometry = true;
            query.orderByFields = orderByFields;
            query.num = searchQuery.maxResultRecordCount || ms.defaultValues.searchGroups.inputTextBoxes.searchQueries.maxResultRecordCount
            query.outSpatialReference = ActionsController.getmView().mView.spatialReference;

            queryTask.execute(query).then(res => {
                resolve({ features: res.features, formatString: formatString, url: url, searchQuery, searchQueryId, input: input, count: count } as IQeuryResultResponse);
            });
        });
    }

    const constructSearchResults = (results: Array<QueryResult>) => {
        // console.log(results);

        let finalSearchResults: Array<SearchGraphic> = [];
        if (results.length > 0) {
            results.forEach((mResult) => {

                let currentSearchResults = mResult.features.m((feature) => formatSearchResult(mResult, feature));
                if (currentSearchResults && currentSearchResults.length) {
                    finalSearchResults = [...finalSearchResults, ...currentSearchResults];
                }
            });

            setSearchResults(finalSearchResults);
            setResultSuggestionsCount(finalSearchResults.length);
        }
        else {
            setSearchResults([{ label: "Не е открит резултат", noResults: true }])
        }

        setQueryResults([]);
        const promises = appContainerContext.promisesCheckList.m((pr) => {
            Object.keys(pr).forEach(key => {
                let element = pr[key];
                element.hasFeatures = false;
            });

            return pr;
        });

        appContainerContext.onPromisesCheckListm(promises);
    };

    const getmFromConfig = (searchQuery: ISearchQuery): ISpecificmm => {
        // let resultm = {} as ImOperationalm | Imm | ISpecificmm;
        let resultm = {} as ISpecificmm;
        const mGroup = ms.configmGroups[searchQuery.mGroupId];

        if (!mGroup) return resultm;

        const { operationalms } = mGroup;
        // const operationalm = operationalms.find(x => x.id === searchQuery.operationalmId);
        if (!operationalms) return resultm;

        const operationalm = operationalms[searchQuery.operationalmId];

        if (!operationalm) return resultm;

        const { ms } = operationalm;

        if (!ms) return resultm;

        const m = ms[searchQuery.mId];

        if (!m) return resultm;
        if (!m["url"]) return resultm;

        resultm = { ...m, fieldsInfo: m.fieldInfos || [] as Array<FieldInfo>, m: m.m || "" };

        return resultm;
    }


    const formatSearchResult = (m: QueryResult, graphic: SearchGraphic, popupTemplate?: PopupTemplate): SearchGraphic => {
        graphic.label = UrlHelper.graphicFormatToString(m.formatString, graphic);
        const { url, formatString } = m;
        const m = getmFromConfig(m.searchQuery);
        graphic.url = url;
        graphic.formatString = formatString;
        graphic.title = m["title"] || m["m"] || "Група";
        graphic.mGroupId = m.searchQuery.mGroupId;
        graphic.operationalmId = m.searchQuery.operationalmId;
        graphic.mId = m.searchQuery.mId;
        // graphic.attributeFields = m.fields;
        // graphic.fields = m.esrifields;
        return graphic;
    };

    const handleMoreSuggestionsClick = (e: any) => {
        const moreSuggestionsCount = ms.searchTool.moreSuggestionsCount || ms.defaultValues.moreSuggestionsCount;
        const features = searchResults.slice(0, moreSuggestionsCount);
        setSuggestionsLimit(moreSuggestionsCount);
        setSearchResults(features);
    };

    const mInputStatus = () => {
        setUserInput(userInput.m(cur => {
            if (cur.id === focusedInput) {
                cur.isLoading = true;
            } else {
                cur.isLoading = false;
            }

            return cur;
        }));
    }
    //#endregion

    //#region Event Handlers 
    const onUserInputHandler = (e: any | undefined) => {
        setSearchResults([]);
        clearTimeout(timerId);
        setSuggestionsLimit(ms.searchTool.suggestionsCount || ms.defaultValues.suggestionsCount);
        const input: string = e ? e.target.value : '';
        const id = e.target.m;
        let tempInput = userInput;
        setUserInput(tempInput.m(searchDetails => {
            if (searchDetails.id == id) {
                searchDetails.inputValue = input;
                searchDetails.selectedResult = null;
            }

            return searchDetails;
        }));

        let inputTimeout: any = null;
        inputTimeout = setTimeout(() => {
            let currentInputBoxMinInputLength = selectedSearchGroupElement.inputTextBoxes[id].minimumInputLenght;
            currentInputBoxMinInputLength = currentInputBoxMinInputLength !== undefined && currentInputBoxMinInputLength >= 0 ? currentInputBoxMinInputLength : ms.defaultValues.searchGroups.inputTextBoxes.minimumInputLenght as number;
            if (input.length >= currentInputBoxMinInputLength) {
                setShowSuggestionsList(true);
            }

            const searchMode = selectedSearchGroupElement.inputTextBoxes[id].searchMode || ms.defaultValues.searchGroups.inputTextBoxes.searchMode;
            let minimumInputLenght = selectedSearchGroupElement.inputTextBoxes[id].minimumInputLenght;
            minimumInputLenght = minimumInputLenght !== undefined && minimumInputLenght >= 0 ? minimumInputLenght : ms.defaultValues.searchGroups.inputTextBoxes.minimumInputLenght as number;
            if (searchMode === "autocomplete") {
                // if (isZeroInput && input == '') {
                //     getSearchResults('', selectedSearchGroupElement.inputTextBoxes[id].searchQueries);
                // }
                if (input.length >= minimumInputLenght) {
                    getSearchResults(input, selectedSearchGroupElement.inputTextBoxes[id].searchQueries);
                }
            }
        }, 1000);

        setTimerId(inputTimeout);
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const id = e.target["m"];
        const searchMode = selectedSearchGroupElement.inputTextBoxes[id].searchMode || ms.defaultValues.searchGroups.inputTextBoxes.searchMode;
        setSuggestionsLimit(ms.searchTool.suggestionsCount || ms.defaultValues.suggestionsCount);
        setShowSuggestionsList(true);
        if (e.key === "Enter" && searchMode === "manual") {
            setSearchResults([]);
            const input = userInput.find(x => x.id === id)?.inputValue;

            if (!input) return;

            getSearchResults(input, selectedSearchGroupElement.inputTextBoxes[id].searchQueries);
        }

        if (e.key === "Escape") {
            setSearchResults([]);
            setShowSuggestionsList(false);
        }
    };

    const onClearBtnHandler = () => {
        setUserInput(userInput.m(cur => {
            if (cur.id == focusedInput) {
                cur.inputValue = '';
                cur.isLoading = false;
                cur.selectedResult = null;
            }
            return cur;
        }));
        setShowSuggestionsList(false);
        setIsLoading(false);
        setSearchResults([]);
        setFocusedInput("");
        let mGraphics = ActionsController.getmView().mView.graphics;
        const graphicsTom = mGraphics.filter(mGraphic => Object.keys(mGraphic.attributes).indexOf('highlightId') !== -1)
        ActionsController.getmView().mView.graphics.mMany(graphicsTom);
    };

    const onAdvancedSearchHandler = (): void => {
        setShowSuggestionsList(false);
        setShowSearchGroupList(!showSearchGroupList);
    };

    const closeSuggestionsListHandler = () => {
        setShowSuggestionsList(false);
    };

    const isSearchGroupElement = (m: Object) => {
        return m.hasOwnmerty('label') && m.hasOwnmerty('inputTextBoxes');
    };

    const isSearchGraphic = (m: Object) => {
        return m.hasOwnmerty('attributes');
    };

    const onSearchGroupElementm = (e: any, m: ISearchGroup) => {
        if (Array.from(e.target.classList).filter((x: string) => x.includes("suggestion-row-button")).length) return;

        setShowSearchGroupList(false);

        if (m.searchGroupId === selectedSearchGroupElement.searchGroupId) return;
        // if (JSON.stringify(m.inputTextBoxes) === JSON.stringify(selectedSearchGroupElement.inputTextBoxes)) return;
        //m.mGroupId != selectedSearchGroupElement.mGroupId
        setSelectedSearchGroupElement(m as ISearchGroup);
        setUserInput(userInput.m(cur => {
            cur.inputValue = '';
            return cur;
        }));
        setShowSuggestionsList(false);
        setFocusedInput("");
        appContainerContext.onPromisesCheckListm([] as IPromiseList[]);
    };

    const onSearchGraphicm = (e: any, m: SearchGraphic, searchId: string) => {
        if (Array.from(e.target.classList).filter((x: string) => x.includes("suggestion-row-button")).length) return;

        const reletedInputs = getRelatedInputsIds();

        setShowSuggestionsList(false);
        setSearchResults([]);
        setUserInput(userInput.m(sug => {
            if (sug.id == searchId) {
                sug.selectedResult = m;
            }
            if (reletedInputs.includes(sug.id)) {
                const tags = [...sug.tags];
                const tag = tags.find(x => x.relatedInput === searchId);
                if (tag && tag.label !== m.label) {
                    tag.label = m.label;
                } else if (!tag) {
                    tags.push({ relatedInput: searchId, label: m.label });
                }
                sug.tags = tags;
            }
            return sug;
        }));
        let detailData = { features: [], tite: "", url: "", formatString: "", mGroupId: "", operationalmId: "", mId: "", title: "", fields: [], attributeFields: [] } as IDetailDataFeatures;
        Object.keys(m).forEach(key => {
            if (Object.keys(detailData).includes(key)) {
                detailData[key] = m[key];
            }
        });
        detailData.features = [m];
        // ms.setDetailData([detailData]);
        const controllerSearchId = `mTools/searchTool/searchGroups/${selectedSearchGroupElement["searchGroupId"]}/inputTextBoxes/${searchId}`;
        ActionsController.trigger(controllerSearchId, [detailData]);

    };

    // const onSuggestionm = (e: any, m: { label: string }, searchId: string) => {
    //     if (!Array.from(e.target.classList).filter((x: string) => x.includes("suggestion-row-button")).length) {
    //         if (isSearchGroupElement(m)) {
    //             // onSearchGroupElementm(m as ISearchGroup);
    //         } else if (isSearchGraphic(m)) {
    //             onSearchGraphicm(e, m as SearchGraphic, searchId);
    //         }
    //     }
    // };


    const getSearchQueriesByInputField = (inputField: string): ISearchQueries => {
        const { inputTextBoxes } = selectedSearchGroupElement as ISearchGroup;
        const currInputField = Object.keys(inputTextBoxes).find(x => x === inputField);
        let searchQueries = {} as ISearchQueries;
        if (!currInputField) return searchQueries;

        searchQueries = inputTextBoxes[currInputField].searchQueries;

        return searchQueries;
    };

    const onFocus = (e: any, id: string) => {
        if (id != focusedInput) {
            setFocusedInput(id);
            setShowSuggestionsList(false);
            const currentSearchQueries = getSearchQueriesByInputField(id);
            // const minimumInputLenght = selectedSearchGroupElement.inputTextBoxes[id].minimumInputLenght || ms.defaultValues.searchGroups.inputTextBoxes.minimumInputLenght;
            // const userInputForDetailsThisBox = userInput.find(x => x.id === id);

            if (currentSearchQueries) {
                appContainerContext.constructPromiseList(currentSearchQueries);
            }
        }
        else {
            if (focusedInput) {
                let currentInputBoxMinInputLength = selectedSearchGroupElement.inputTextBoxes[focusedInput].minimumInputLenght;
                currentInputBoxMinInputLength = currentInputBoxMinInputLength !== undefined && currentInputBoxMinInputLength >= 0 ? currentInputBoxMinInputLength : ms.defaultValues.searchGroups.inputTextBoxes.minimumInputLenght as number;
                const userInputForDetailsThisBox = userInput.find(input => input.id === focusedInput);
                const inputValue = userInputForDetailsThisBox?.inputValue;

                if (userInputForDetailsThisBox && userInputForDetailsThisBox.inputValue.length >= currentInputBoxMinInputLength) {
                    setShowSuggestionsList(true);
                    getSearchResults(inputValue ? inputValue : '', selectedSearchGroupElement.inputTextBoxes[focusedInput].searchQueries);
                }
            }
        }
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // setFocusedInput("");
        // console.log(e.relatedTarget);
        // // console.log(e.currentTarget);
        // // console.log(e.target);
        // if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        //     // Not triggered when swapping focus between children
        //     console.log('focus left self');
        //     setShowSuggestionsList(false);
        // }
    };


    const handleDeleteTag = (inputId: string, relatedInput: string) => {
        setUserInput(userInput.m(x => {
            if (x.id === inputId) {
                let tags = [...x.tags];
                x.tags = tags.filter(tag => tag.relatedInput !== relatedInput);
            }
            if (x.id === relatedInput) {
                x.selectedResult = null;
            }

            return x;
        }));
    }
    //#endregion

    const onHideSearchBarHandler = () => {
        let hidden = !isSearchBarHidden;
        setIsSearchBarHidden(!isSearchBarHidden);
        if (!inputsRef) return;
        if (!inputsRef.current) return;

        if (hidden) {
            mArrowBouncing();
            setShowSuggestionsList(false);
            setShowSearchGroupList(false);
            // inputsRef.current.parentElement!.style.minHeight = `${inputsRef.current.offsetHeight}px`;

            inputsRef.current.style.display = "none";
            // setTimeout(() => {
            //     if (inputsRef && inputsRef.current) {
            //         inputsRef.current.style.display = "none";
            //     }
            // }, 400);

        } else {
            inputsRef.current.style.display = "flex";
            inputsRef.current.style.width = "87%";
            inputsRef.current.parentElement!.style.minHeight = "";
        }
    }

    const mArrowBouncing = () => {
        setArrowBouncing("arrow-bouncing");
    }
    const mArrowBouncing = () => {
        setArrowBouncing("");
    }

    return (
        <div classm={ms.classm || "search-layout layout-left layout-top"} style={{ minWidth: isSearchBarHidden ? "0" : "" }}>
            <Paper onMouseEnter={mArrowBouncing} onMouseLeave={mArrowBouncing} elevation={3} classm="search-bar" style={styles.root} id="searchTool" >
                {/* <div classm="search-bar" style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.3)", justifyContent: isSearchBarHidden ? "center" : "space-evenly" }}> */}
                {isSearchBarHidden ?
                    <SearchIcon />
                    :
                    <AdvancedSearchButton onAdvancedSearchHandler={onAdvancedSearchHandler} />
                }
                {/* <SearchComponentContext.Provider value={{onSuggestionm: onSuggestionm}} > */}
                <div classm="all-inputs-container" ref={inputsRef} style={{ display: isSearchBarHidden ? "none" : "" }} >
                    <SearchInputs
                        searchId={searchId}
                        inputs={searchInputs}
                        userInput={userInput}
                        focusedInputId={focusedInput}
                        isLoading={isLoading}
                        onUserInputHandler={onUserInputHandler}
                        clearButtonHandler={onClearBtnHandler}
                        showSuggestionsList={showSuggestionsList}
                        clearButtonIconUrl={ms.searchTool.clearIconUrl ? UrlHelper.getUrlPath(ms.searchTool.clearIconUrl, window.configUrl) : UrlHelper.getUrlPath(ms.defaultValues.clearIconUrl, window.configUrl)}
                        loadingIconUrl={ms.searchTool.loadingIconUrl ? UrlHelper.getUrlPath(ms.searchTool.loadingIconUrl, window.configUrl) : UrlHelper.getUrlPath(ms.defaultValues.loadingIconUrl, window.configUrl)}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onKeyDownHandler={onKeyDownHandler}
                        handleDeleteTag={handleDeleteTag}
                    />
                </div>
                <div style={{ width: 33, height: "100%", display: "flex", justifyContent: "center", alignms: "center", cursor: "mer" }} onClick={onHideSearchBarHandler}>
                    {isSearchBarHidden ?
                        <KeyboardArrowRightIcon classm={arrowBouncing} />
                        :
                        <KeyboardArrowLeftIcon />

                    }
                </div>
                {/* </div> */}
            </Paper>
            {showSearchGroupList ?
                <SearchGroupsList
                    suggestions={searchGroupsList}
                    searchIconUrl={ms.searchTool.searchIconUrl || ms.defaultValues.searchIconUrl}
                    clearIconUrl={ms.searchTool.clearIconUrl || ms.defaultValues.clearIconUrl}
                    selectSearchGrouplabel={ms.searchTool.selectSearchGrouplabel || ms.defaultValues.selectSearchGrouplabel}
                    onSuggestionm={onSearchGroupElementm}
                    clearButtonHandler={onAdvancedSearchHandler}
                />
                :
                (null)
            }
            {
                showSuggestionsList && !showSearchGroupList ?
                    <SearchSuggestionsList
                        searchId={focusedInput}
                        suggestions={searchResults}
                        onSuggestionm={onSearchGraphicm}
                        suggestionsCount={suggestionsLimit}
                        totalCount={!searchResults.length || (searchResults.length === 1 && searchResults[0]["noResults"]) ? 0 : searchResults.length < resultSuggestionsCount ? resultSuggestionsCount : searchResults.length}
                        showSuggestionsList={showSuggestionsList}
                        isLoading={isLoading}
                        totalCountFormatString={ms.searchTool.totalCountFormatString || ms.defaultValues.totalCountFormatString}
                        moreSuggestionsClickHandler={handleMoreSuggestionsClick}
                        moreSuggestionsButton={ms.searchTool.moreSuggestionsButton}
                        topButtonsClickHandler={handleTopButtonsClick}
                        hoverButtons={ms.searchTool.hoverButtons}
                        specificHoverButtons={selectedSearchGroupElement.specificHoverButtons}
                        searchGroupId={selectedSearchGroupElement.searchGroupId}
                        buttons={ms.searchTool.buttons}
                        clearButtonIconUrl={ms.searchTool.clearIconUrl ? UrlHelper.getUrlPath(ms.searchTool.clearIconUrl, window.configUrl) : UrlHelper.getUrlPath(ms.defaultValues.clearIconUrl, window.configUrl)}
                        clearButtonHandler={closeSuggestionsListHandler}
                        defaultValues={ms.defaultValues}
                    />
                    :
                    (null)
            }
        </div>
    );
}


const mStateToms = (state: IAppStore) => {
    return ({
        mView: state.m.mView,
        configmGroups: state.configObject.configmGroups,
        userInfo: state.userInfo
    })
};

export default connect<Ownms, Dispatchms>(mStateToms, { ...mDispatcher, ...customPopupDispatcher })(SearchTool);