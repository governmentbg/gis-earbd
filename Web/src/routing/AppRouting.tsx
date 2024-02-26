import * as React from 'react';
import { useEffect } from 'react';
import { Router } from '@reach/router';
// import styled from "@emotion/styled";
import { connect } from 'react-redux';
import { stopLoading } from 'ReactTemplate/Base/actions/dispatchers/application'//'../../..//Base/actions/dispatchers/application';
import { IAppStore, IUserInfo, UserInfoStatus } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { ssiUnActivitiesConfig } from '../config/wsi.unConfig'
import UserHelper from '../components/UserHelper'

interface Ownms {
    userInfo: IUserInfo;
}

interface Dispatchers {
    stopLoading: mof stopLoading,
}

interface Parentms {
    location: any;
    children: JSX.Element | JSX.Element[];
    navigate: (path: string) => void;
}

m ms = Ownms & Dispatchers & Parentms;


// const StyledRouter = styled(Router)`
//   flex-grow: 1;
//   display: flex;
//   flex-direction: column;
//   height: 100%;
// `;

const AppRouter = (ms: ms) => {

    // useEffect(() => {
    //     if (ms.userInfo.status === UserInfoStatus.NOT_YET_LOGGEDIN) {
    //         // console.log(UserInfoStatus.NOT_YET_LOGGEDIN)
    //         if (ms.location.pathm !== '/login') {
    //             // console.log(UserInfoStatus.NOT_YET_LOGGEDIN)
    //             ms.navigate('/login');
    //         }
    //     } else if (ms.userInfo.status === UserInfoStatus.UNABLE_TO_LOGIN) {
    //         if (ms.location.pathm !== '/login') {
    //             // console.log(UserInfoStatus.UNABLE_TO_LOGIN)
    //             ms.navigate('/login');
    //         }
    //     }
    // }, [ms.userInfo])
   

    useEffect(() => {
        var loc = ms.location;
        switch (loc.pathm) {
            case window.location.pathm:
                ms.stopLoading();
                break;
            case window.location.pathm + 'main/':
                break;
            case window.location.pathm + 'home/':
                break;
            default:
                break;
        }
    }, [ms.location])
    
    // useEffect(() => {
      
    //         if (ms.userInfo.status === UserInfoStatus.LOGGEDIN) {  // ms.userInfo.status === UserInfoStatus.NOT_YET_LOGGEDIN || 
    //             if (!UserHelper.checkRole(ms.userInfo)) {
    //                 if (ms.location.pathm.indexOf('/login/1') === -1) {
    //                     ms.navigate('/login/1');
    //                     ms.setErrorMessage({ code: 1, message: "Нямате достъп до този сайт!" });
    //                 }
    //             } else {
    //                 if (ms.location.pathm == window.location.pathm) {
    //                     ms.stopLoading();
    //                 }
    //             }
    //         }
    //         else if (ms.userInfo.status === UserInfoStatus.UNABLE_TO_LOGIN) {  // ms.userInfo.status === UserInfoStatus.NOT_YET_LOGGEDIN || 
    //             if (ms.location.pathm.indexOf('login') === -1) {
    //                 ms.navigate('/login');
    //             }
    //         }
      
    // }, [ms.userInfo])

    return (
        <Router classm="app-root">
            {ms.children}
        </Router>
    )
}

var mStateToms = (state: IAppStore) => {
    return {
        userInfo: state.userInfo
    };
};

export default connect<Ownms, Dispatchers>(mStateToms, { stopLoading })(AppRouter);
