import * as React from 'react';
import { useEffect, useState } from 'react';
import { Fade } from '@material-ui/core';
import { CustomTooltip } from '../../../../../Lib/v0.6/src/Base/components/Widgets/CustomMaterialTooltip';
import { IPanelm, IAppConfig } from '../../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppConfig';

const DIRECTIONRIGHT = 'right';
const DIRECTIONLEFT = 'left';
const DIRECTIONMIDDLE = 'middle';

const TabButtons = (ms: { click: Function; icon: any; index: string; m: IPanelm; groupIndex?: string, appConfig: IAppConfig }) => {
    const styleButton = {
        absoluteLeftHide: {
            position: 'absolute',
            top: '15px',
            border: 0,
            right: '-16px',
            height: '50px',
            width: '16px',
            color: '#fff',
            outm: 'none',
            borderRadius: '0px 5px 5px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
            pming: 0,
            margin: 0,
        },
        absoluteLeftShow: {
            position: 'absolute',
            top: ms.m.top ? ms.m.top : '15px',
            border: 0,
            height: '50px',
            width: '16px',
            color: '#fff',
            outm: 'none',
            borderRadius: '0px 5px 5px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
            pming: 0,
            margin: 0,
        },
        absoluteRightHide: {
            position: 'absolute',
            top: '15px',
            border: 0,
            left: '-16px',
            height: '50px',
            width: '16px',
            color: '#fff',
            outm: 'none',
            borderRadius: '5px 5px 0px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
            pming: 0,
            margin: 0,
        },
        absoluteRightShow: {
            position: 'absolute',
            border: 0,
            top: ms.m.top ? ms.m.top : '15px',
            right: 0,
            height: '50px',
            width: '16px',
            color: '#fff',
            outm: 'none',
            borderRadius: '5px 5px 0px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
            pming: 0,
            margin: 0,
        },
        absoluteMidShow: {
            position: 'absolute',
            bottom: 0,
            border: 0,
            left: 'calc(50% - 25px)',
            height: '16px',
            width: '50px',
            color: '#fff',
            outm: 'none',
            borderRadius: '5px 5px 0px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
        },
        absoluteMidHide: {
            position: 'absolute',
            top: '-16px',
            border: 0,
            left: 'calc(50% - 25px)',
            height: '16px',
            width: '50px',
            color: '#fff',
            outm: 'none',
            borderRadius: '5px 5px 0px 0px',
            zIndex: 99998,
            boxShadow: '0 -1px 3px 1px #00000038',
        },
        default: {
            height: '25px',
            border: 0,
            // background: "white",
            backgroundColor: '#004990',
            color: '#fff',
            outm: 'none',
        },
    };

    const [currentStyle, setCurrentStyle] = useState({});

    useEffect(() => {
        let _currentStyle = styleButton.default;
        switch (ms.m.hideDirection) {
            case DIRECTIONMIDDLE:
                _currentStyle = ms.m.hidden ? styleButton.absoluteMidShow : styleButton.absoluteMidHide;
                break;
            case DIRECTIONRIGHT:
                _currentStyle = ms.m.hidden ? styleButton.absoluteRightShow : styleButton.absoluteRightHide;
                break;
            case DIRECTIONLEFT:
                _currentStyle = ms.m.hidden ? styleButton.absoluteLeftShow : styleButton.absoluteLeftHide;
                break;
        }
        setCurrentStyle(_currentStyle);
    }, [ms.m.hidden]);

    return (
        <CustomTooltip
            onClick={(e) => ms.click(e, ms.index, ms.groupIndex)}
            // key={ms.button.key}
            arrow
            enterDelay={500}
            leaveDelay={100}
            TransitionComponent={Fade}
            placement={'right'}
            title={ms.m.hidden ? 
                (ms.appConfig.sitemerties['showLabel']? ms.appConfig.sitemerties['showLabel'] : 'Показване') :
                (ms.appConfig.sitemerties['hideLabel']?  ms.appConfig.sitemerties['hideLabel'] : 'Скриване')}
            data-testid="button-group-el"
        >
            <button
                // title={ms.m.hidden ? 'Показване' : 'Скриване'}
                classm={'panel-hover-button-color'}
                style={currentStyle}
                // onClick={(e) => ms.click(e, ms.index, ms.groupIndex)}
            >
                {ms.icon}
            </button>
        </CustomTooltip>
    );
};

export default TabButtons;
