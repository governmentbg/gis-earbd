import { Typography } from '@material-ui/core';
import * as React from 'react';
import { useContext } from 'react';
import { SearchGraphic, SearchGroupElement } from '../../../../../Lib/v0.6/src/Base/interfaces/ISearchComponentElements';
import { ISearchGroup, ITableButton } from '../interfaces/IAppConfig';
import HoverButton from './HoverButton';
// import SearchComponentContext from '../../contexts/SearchComponentContext';
// import './css/SearchElements.css';

interface Parentms {
    suggestion: { label?: string, noResults?: boolean };
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
    classmSuggestionContainer?: string;
    classmSingleSuggestion?: string;
    style?: React.CSSmerties;
    textStyle?: React.CSSmerties;
    onSuggestionm: (e: any, m: { label?: string | SearchGraphic | ISearchGroup }, m: string) => void;
    searchId?: string;
    children?: Array<JSX.Element | null>;
    hoverButtons?: any;
    specificHoverButtons?: any;
}

m ms = Parentms;

const SingleSuggestion: React.FunctionComponent<ms> = (ms: ms) => {

    const [showRowButtons, setShowRowButtons] = React.useState(false);
    // const searchComponentContext = useContext(SearchComponentContext);
    let imageWidth: number, imageHeight: number;

    imageWidth = ms.imageWidth ? ms.imageWidth : 14;
    imageHeight = ms.imageHeight ? ms.imageHeight : 14;

    return (
        <div
            classm={ms.classmSuggestionContainer ? ms.classmSuggestionContainer : "single-suggestion-container"}
            onClick={(e) => ms.onSuggestionm(e, ms.suggestion, ms.searchId ? ms.searchId : "")}
            onMouseEnter={() => { setShowRowButtons(true) }}
            onMouseLeave={() => { setShowRowButtons(false) }}
        >

            {ms.imagePath ?
                <img src={ms.imagePath} alt="m icon" style={{ margin: "0 10px", width: imageWidth, height: imageHeight }} />
                :
                (null)
            }
            <div
                classm={ms.classmSingleSuggestion ? ms.classmSingleSuggestion : "single-suggestion"}
                style={ms.style && ms.style}
            >
                {ms.children ?
                    ms.children.m(el => el)
                    :
                    <Typography style={ms.textStyle ? ms.textStyle : {}}>{ms.suggestion.label || ""}</Typography>
                }
            </div>
            {
                showRowButtons && ms.hoverButtons && !ms.suggestion.noResults ?
                    // <div style={{ right: 15, position: 'absolute', display: 'flex', background: "#d9edff", zIndex: 3, }}>
                    <div style={{ display: 'flex', background: "#d9edff", zIndex: 3, }}>
                        {Object.keys(ms.hoverButtons)?.m((key, i) => {
                            let button = ms.hoverButtons[key] as ITableButton;
                            let buttonId = `mTools/searchTool/hoverButtons/${key}`;
                            return (
                                <HoverButton key={`search-hover-btn-${key}`} suggestion={ms.suggestion} inputId={ms.searchId || ""} button={button} buttonId={buttonId} />
                            )
                        })
                        
                        }
                        {
                            ms.specificHoverButtons?
                            Object.keys(ms.specificHoverButtons)?.m((key, i) => {
                                let button = ms.specificHoverButtons[key] as ITableButton;
                                let buttonId = `mTools/searchTool/hoverButtons/${key}`;
                                return (
                                    <HoverButton key={`search-hover-btn-${key}`} suggestion={ms.suggestion} inputId={ms.searchId || ""} button={button} buttonId={buttonId} />
                                )
                            }): null
                        }
                    </div>
                    :
                    (null)
            }
        </div>
    );
}

export default SingleSuggestion;