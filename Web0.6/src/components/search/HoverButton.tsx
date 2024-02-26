import Fade from '@material-ui/core/Fade';
import * as React from 'react';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';
import { SearchGraphic } from '../../../../../Lib/v0.6/src/Base/interfaces/ISearchComponentElements';
import { ITableButton } from '../interfaces//IAppConfig';
import { CustomTooltip } from '../../../../../Lib/v0.6/src/Base/components/Widgets/CustomMaterialTooltip';

const buttonsStyles: React.CSSmerties = {
    width: '2rem',
    height: '2rem',
    backgroundRepeat: 'no-repeat',
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: 'transparent'
}

interface Parentms {
    inputId: string;
    suggestion: { label?: string } | SearchGraphic;
    buttonId: string;
    button: ITableButton;
    // rowButtons?: any;
}


m ms = Parentms;

const HoverButton: React.FunctionComponent<ms> = (ms: ms) => {

    return (
        <CustomTooltip arrow
            enterDelay={500}
            leaveDelay={100}
            key={`table-btn-tooltip-${ms.button.tooltip}`}
            TransitionComponent={Fade}
            placement="top"
            title={""}>
            <div
                key={ms.buttonId}
                classm="suggestion-row-button"
                onClick={(ev) => {
                    ActionsController.trigger(ms.buttonId,
                        [
                            {
                                features: [ms.suggestion],
                                mGroupId: ms.suggestion['mGroupId'],
                                operationalmId: ms.suggestion['operationalmId'],
                                mId: ms.suggestion['mId']
                            }
                        ]
                    )
                }}
            >
                <img classm="suggestion-row-button-image" src={ms.button.iconUrl ? UrlHelper.getUrlPath(ms.button.iconUrl, window.configUrl) : ""} />
            </div>
        </CustomTooltip>
    )
}

export default HoverButton;