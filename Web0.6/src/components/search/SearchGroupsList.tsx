import * as React from 'react';
import SingleSuggestion from './SingleSuggestion';
import { SearchGraphic, SearchGroupElement } from '../../../../../Lib/v0.6/src/Base/interfaces/ISearchComponentElements';
import { ISearchGroup, IUrlInfo } from '../interfaces//IAppConfig';
import { Button, Divider, marProgress, Paper, Typography } from '@material-ui/core';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import ClearButton from '../../../../../Lib/v0.6/src/Base/components/Search/ClearButton';
// import './css/SearchElements.css';



interface Parentms {
    suggestions: Array<{ label: string } | SearchGraphic | ISearchGroup>;
    onSuggestionm: (e: any, m: { label?: string }, searchId: string) => void;
    style?: React.CSSmerties;
    searchIconUrl?: IUrlInfo;
    clearIconUrl?: IUrlInfo;
    selectSearchGrouplabel?: string;
    clearButtonHandler: (e?: any) => void;
}

m ms = Parentms;

const SearchGroupsList: React.FunctionComponent<ms> = (ms: ms) => {

    const getImagems = (suggestion: any): { imagePath: string, imageWidth: number, imageHeight: number } => {
        // const isConfigmm = ismm(suggestion);
        let imagems = { imagePath: "", imageWidth: -1, imageHeight: -1 }
        imagems = { imagePath: suggestion.imagePath, imageWidth: suggestion.imageWidth, imageHeight: suggestion.imageHeight };

        return imagems
    }
    return (
        <Paper elevation={3} classm="search-resutls">
            <div classm="search-bar ms">
                <div classm="advanced-search-wrapper">
                    {ms.searchIconUrl ?
                        <img
                            src={UrlHelper.getUrlPath(ms.searchIconUrl, window.configUrl)}
                            style={{ width: "18px", height: "18px", margin: "0 5px" }}
                        />
                        :
                        (null)
                    }
                    <div style={{ marginLeft: "5px" }}>
                        <p style={{ margin: 0 }}>{ms.selectSearchGrouplabel}</p>
                    </div>
                </div>
                <div classm="clear-btn-wrapper">
                    {ms.clearIconUrl ?
                        <ClearButton
                            imagePath={UrlHelper.getUrlPath(ms.clearIconUrl, window.configUrl)}
                            imageWidth={12}
                            imageHeight={12}
                            onClickHandler={ms.clearButtonHandler}
                            style={{ width: "100%" }}
                        />
                        :
                        (null)
                    }
                </div>
            </div>

            <div classm="suggestions-container">
                {
                    ms.suggestions.m((suggestion, index, all) => {
                        return (
                            <SingleSuggestion
                                // searchId={ms.searchId}
                                suggestion={suggestion as ISearchGroup}
                                onSuggestionm={ms.onSuggestionm}
                                key={`searchgroup-${index}`}
                                imagePath={getImagems(suggestion).imagePath}
                                imageWidth={getImagems(suggestion).imageWidth}
                                imageHeight={getImagems(suggestion).imageHeight}
                                style={ms.style && ms.style}
                            />
                        )
                    })
                }
            </div>
        </Paper>
    );
}

export default SearchGroupsList;