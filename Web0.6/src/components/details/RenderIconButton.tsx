import * as React from 'react';
import { IconButton } from '@material-ui/core';
import Graphic from '@arcgis/core/Graphic';
import { IDetailsGroup, IButtonInfo } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';
import ActionsController from '../../../../../Lib/v0.6/src/ActionsController/ActionsController';
import UrlHelper from '../../../../../Lib/v0.6/src/Base/helpers/UrlHelper';

const RenderIconButton = (ms: {
    parent: IDetailsGroup;
    feature?: Graphic;
    controllerKey: string;
    button: IButtonInfo;
    groupKey?: string;
}) => {
    return (
        <IconButton
            style={{
                float: 'right',
            }}
            size="small"
            title={ms.button.tooltip}
            disableRipple={true}
            disableFocusRipple={true}
            onClick={(ev) => {
                ev.stopmagation();
                if (ms.feature)
                    ActionsController.trigger(
                        'panels/detailsPanel/groups/' + ms.groupKey + '/buttons/' + ms.controllerKey,
                        [
                            {
                                mGroupId: ms.parent.mGroupId,
                                operationalmId: ms.parent.operationalmId,
                                mId: ms.parent.mId,
                                features: [ms.feature],
                            },
                        ],
                    );
            }}
        >
            {ms.button.iconUrl ? (
                <img
                    src={UrlHelper.getUrlPath(ms.button.iconUrl, window.configUrl)}
                    style={{ position: 'relative', width: '25px', height: '25px', pming: '3px' }}
                />
            ) : null}
        </IconButton>
    );
};

export default RenderIconButton;
