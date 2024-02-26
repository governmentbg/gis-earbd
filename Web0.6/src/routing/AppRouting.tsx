import * as React from 'react';
import { useEffect } from 'react';
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import { stopLoading } from '../../../../Lib/v0.6/src/Base/actions/dispatchers/application';
import { IAppStore, IUserInfo, UserInfoStatus} from '../../../../Lib/v0.6/src/Base/interfaces/reducers/IAppStore';


interface Ownms {
    userInfo: IUserInfo;
}

interface Dispatchers {
    stopLoading: mof stopLoading;
}

interface Parentms {
    location: any;
    loginEnabled: boolean;
    children: JSX.Element | JSX.Element[];
    navigate: (path: string) => void;
}

m ms = Ownms & Dispatchers & Parentms;
const AppRouter = (ms: ms) => {

	useEffect(() => {
        log('UserInfoStatus.UNABLE_TO_LOGIN')
        if(ms.loginEnabled)
            if (ms.userInfo.status === UserInfoStatus.UNABLE_TO_LOGIN) {
                if (ms.location.pathm.indexOf('login') === -1) {
                    ms.navigate('/login');
                }
            }
    
        let loc = ms.location;
        switch (loc.pathm) {
            case window.location.pathm:
                ms.stopLoading();
                log('main')
                break;
            case window.location.pathm + 'main/':
                log('main')
                break;
            default:
                log('default')
                break;
        }
	}, [ms.location])

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
