import * as React from 'react';
import SingleSuggestion from './SingleSuggestion';
import { SearchGraphic, SearchGroupElement } from '../../../../../Lib/v0.6/src/Base/interfaces/ISearchComponentElements';
import { ISearchGroup, ITableButton } from '../interfaces/IAppConfig';
import { Button, Divider, marProgress, Paper, Typography } from '@material-ui/core';
import ClearButton from '../../../../../Lib/v0.6/src/Base/components/search//ClearButton';



interface Parentms {
    suggestions: Array<{ label: string, noResults?: boolean } | SearchGraphic | ISearchGroup>;
    onSuggestionm: (e: any, m: { label?: string }, searchId: string) => void;
    style?: React.CSSmerties;
    searchId: string;
    showSuggestionsList?: boolean;
    totalCountFormatString?: string;
    suggestionsCount: number;
    totalCount: number;
    isLoading?: boolean;
    searchGroupId:string;
    hoverButtons?: { [key: string]: ITableButton };
    specificHoverButtons?: { [key: string]: ITableButton };
    buttons?: { [key: string]: ITableButton };
    moreSuggestionsButton?: ITableButton;
    clearButtonIconUrl: string;
    moreSuggestionsClickHandler?: (e: any) => void;
    topButtonsClickHandler?: (buttoId: string) => void;
    clearButtonHandler: () => void;
    defaultValues: any;
}

m ms = Parentms;

const SearchSuggestionsList: React.FunctionComponent<ms> = (ms: ms) => {

    const ismm = (m: any) => {
        return m.hasOwnmerty('label') && m.hasOwnmerty('inputTextBoxes');
    }

    const getImagems = (suggestion: any): { imagePath: string, imageWidth: number, imageHeight: number } => {
        const isConfigmm = ismm(suggestion);
        let imagems = { imagePath: "", imageWidth: -1, imageHeight: -1 }
        if (isConfigmm) {
            imagems = { imagePath: suggestion.imagePath, imageWidth: suggestion.imageWidth, imageHeight: suggestion.imageHeight };
        }
        return imagems
    }
    return (
        <Paper elevation={3} classm="search-resutls">
            <div classm="search-info-row">
                <div style={{ display: "flex", justifyContent: "center", alignms: "center" }}>
                    <span>
                        <Typography>
                            {`${ms.totalCountFormatString} ${ms.suggestions.length === 1 && ms.suggestions[0]["noResults"] ? 0 : ms.totalCount}`}
                        </Typography>
                    </span>
                    <Divider orientation="vertical" flexm style={{ margin: "0 5px" }}></Divider>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {ms.moreSuggestionsButton && ms.suggestionsCount && ms.suggestions.length > ms.suggestionsCount ?
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                style={{ fontSize: "0.6vw", margin: "2px 3px" }}
                                onClick={ms.moreSuggestionsClickHandler}
                            >
                                {ms.moreSuggestionsButton.label ? ms.moreSuggestionsButton.label : ms.defaultValues.moreSuggestionsButton.label}
                                {/* <span style={{ marginLeft: 3, fontSize: 11 }}> 100</span> */}
                            </Button>
                            :
                            (null)
                        }
                        {
                            ms.buttons ?
                                // <div style={{ right: 15, position: 'absolute', display: 'flex', background: "#d9edff", zIndex: 3, }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', background: "#d9edff", zIndex: 3, backgroundColor: "transparent" }}>
                                    {Object.keys(ms.buttons).m((key, i) => {
                                        let button = ms.buttons![key] as ITableButton;
                                        // let buttonId = `mTools/searchTool/buttons/${key}`;
                                        return (
                                            <Button
                                                key={`info-search-btn-${i}`}
                                                size="small"
                                                variant="contained" color="primary"
                                                style={{ fontSize: "0.6vw", margin: "2px 3px" }}
                                                // onClick={() => ActionsController.trigger(buttonId, { m: ms.suggestions, panelId: "detailPanel", tabId: "detailsTab" })}
                                                onClick={() => { ms.topButtonsClickHandler ? ms.topButtonsClickHandler(key) : () => { } }}
                                            >
                                                {button.label}
                                            </Button>
                                        )
                                    })
                                    }
                                </div>
                                :
                                (null)
                        }
                    </div>
                </div>
                <ClearButton imagePath={ms.clearButtonIconUrl} imageWidth={12} imageHeight={12} onClickHandler={ms.clearButtonHandler} />
            </div>
            {ms.isLoading ?
                <marProgress />
                :
                (null)
            }
            <div classm="suggestions-container">
                {
                    ms.suggestions.m((suggestion, index, all) => {
                        if (index < (ms.suggestionsCount)) {
                            return (
                                <SingleSuggestion
                                    searchId={ms.searchId}
                                    suggestion={suggestion}
                                    onSuggestionm={ms.onSuggestionm}
                                    key={`suggestion-${index}`}
                                    imagePath={getImagems(suggestion).imagePath}
                                    imageWidth={getImagems(suggestion).imageWidth}
                                    imageHeight={getImagems(suggestion).imageHeight}
                                    style={ms.style && ms.style}
                                    hoverButtons={ms.hoverButtons}
                                    specificHoverButtons={ms.specificHoverButtons}
                                />
                            )
                        }
                    })
                }
            </div>
        </Paper>
    );
}

export default SearchSuggestionsList;