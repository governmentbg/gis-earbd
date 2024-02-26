import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { IPanelm } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { useEffect, useState } from 'react';


const PANELSHOW = 'panel show'
const PANELHIDE = 'panel hide'
const DIRECTIONRIGHT = "right"
const DIRECTIONLEFT = "left"
const DIRECTIONMIDDLE = "middle"

const TabButtons = (ms: { click: Function, icon: any, index: number, m: IPanelm, groupIndex?: number }) => {
    var styleButton = {
        absoluteLeftHide: {
            position: "absolute",
            top: "15px",
            border:0,
            right: "-16px",
            height: "50px",
            width: "16px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "0px 5px 5px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038",
            pming:0,
            margin:0
        },
        absoluteLeftShow: {
            position: "absolute",
            top: ms.m.top? ms.m.top : "115px",
            border:0,
            height: "50px",
            width: "16px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "0px 5px 5px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038",
            pming:0,
            margin:0
        },
        absoluteRightHide: {
            position: "absolute",
            top: "15px",
            border:0,
            left: "-16px",
            height: "50px",
            width: "16px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "5px 5px 0px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038",
            pming:0,
            margin:0
        },
        absoluteRightShow: {
            position: "absolute",
            border:0,
            top: ms.m.top? ms.m.top : "15px",
            right: 0,
            height: "50px",
            width: "16px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "5px 5px 0px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038",
            pming:0,
            margin:0
        },
        absoluteMidShow: {
            position: "absolute",
            bottom: 0,
            border:0,
            left:  "calc(50% - 25px)",
            height: "16px",
            width: "50px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "5px 5px 0px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038"
        },
        absoluteMidHide: {
            position: "absolute",
            top: "-16px",
            border:0,
            left: "calc(50% - 25px)",
            height: "16px",
            width: "50px",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none",
            borderRadius: "5px 5px 0px 0px",
            borderColor: "#69b7fa",
            zIndex: 99999,
            boxShadow: "0 -1px 3px 1px #00000038"
        },
        default: {
            height: "25px",
            border: 0,
            // background: "white",
            backgroundColor: "#69b7fa",
            color: "#fff",
            outm: "none"
        }
    }

    const [currentStyle, setCurrentStyle] = useState({});

    useEffect(() => {
        var _currentStyle = styleButton.default;
		switch(ms.m.hideDirection) {
			case DIRECTIONMIDDLE: 
                _currentStyle = ms.m.hidden? styleButton.absoluteMidShow : styleButton.absoluteMidHide;
			    break;
			case DIRECTIONRIGHT:
				_currentStyle = ms.m.hidden? styleButton.absoluteRightShow : styleButton.absoluteRightHide;
			    break;
			case DIRECTIONLEFT: 
                _currentStyle = ms.m.hidden? styleButton.absoluteLeftShow : styleButton.absoluteLeftHide;
			    break;
        }
        setCurrentStyle(_currentStyle);
    }, [ms.m.hidden])

    return (
        <button
            title={ms.m.hidden ? "Показване" : "Скриване"}
            style={currentStyle} onClick={(e) => ms.click(e, ms.index, ms.groupIndex)}>{ms.icon}
        </button>
    );
}

export default TabButtons;
