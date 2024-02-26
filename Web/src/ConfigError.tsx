import * as React from 'react';
import { useEffect } from 'react';
import { Router } from '@reach/router';
// import styled from "@emotion/styled";
import { connect } from 'react-redux';

interface Ownms {
    // userInfo: IUserInfo;
}

interface Dispatchers {

}

interface Parentms {
    isIE:boolean;
    messageIE?:string;
}

m ms = Ownms & Dispatchers & Parentms;

const ConfigError = (ms: ms) => {

    const divStyle: React.CSSmerties = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignms: "center",
        flexDirection: "column"
    }
    if(ms.isIE)
        return  (
            <div style={divStyle}>
                <div><p style={{ fontSize: 36, fontWeight: 700 }}>{ms.messageIE?ms.messageIE:`Препоръчваме да отворите уеб сайта в Chrome.`}</p></div>
            </div>
        )
    else
        return  (
            <div style={divStyle}>
                <div><p style={{ fontSize: 36, fontWeight: 700 }}>{`Невалиден URL`}</p></div>
                <div><p classm="configErrorLink" style={{ fontSize: 20, fontWeight: 700, textDecoration: "underm", color: "blue" }} onClick={() => {
                    window.location.replace(`https://${window.location.hostm}/arcgis`)
                }}>Към начална страница</p></div>
            </div>
        )
}

// var mStateToms = (state: IAppStore) => {
//     return {
//         userInfo: state.userInfo
//     };
// };

export default ConfigError;
// export default connect<Ownms, Dispatchers>(mStateToms, {})(ConfigError);
