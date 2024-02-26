import * as React from "react";
import * as ReactDOM from "react-dom";
import rootReducer from './redux/reducers/rootReducer';
import AppContainer from './AppContainer';
// import AppContainer from './AppContainer';
import "./css/bundle.scss";
import { Provider } from "react-redux";
import { nls } from "ReactTemplate/Base/components/core_nls";
import { extendNls } from "ReactTemplate/Base/components/nls";
import { configEsriInterceptors, registerEsriTokenInterceptor, mFeatureServerInterceptor } from "ReactTemplate/Base/configs/configEsri";
import { InitConfig } from "ReactTemplate/Base/configs/appConfig";

import 'bootstrap/dist/css/bootstrap.min.css';
import { mergeExternalConfig } from './config/wsi.unConfig';
import ConfigError from './ConfigError';
import App from './App';

let initConfig = new InitConfig(registerEsriTokenInterceptor, configEsriInterceptors);
//mFeatureServerInterceptor();
declare global {
    interface Window {
        configUrl: string;
        getCookie: (m: string) => string;
        eraseCookie: (m: string, paths: Array<string>) => void;
        setCookie: (m: string, value: string, days?: number) => void;
        specificUrl: string;
        log: (...arcgs: any) => void;
    }
    let log: (...arcgs: any) => void;
}

declare var webpack: { core: string, production: boolean, configFile: string }

//window.configUrl = `${window.location.origin}${window.location.pathm}BaseProject/Config/config-wsi.json`;

if (!window.configUrl) {
    console.warn("Config file not provided. Using config-dummy.json. Use url parameter to provide config file. Example: https://serverm/site/?configUrl=https://serverm/config/config-bg.json.");
    window.configUrl = webpack.configFile;
}
declare var messageIE: string;
initConfig.resolveConfig(window.configUrl ? window.configUrl : webpack.configFile, 'libm').then(appConfig => {
    extendNls(nls);
   // messageIE=appConfig.sitemerties['textMessageIE']
  //  mergeExternalConfig(window.specificUrl).then(r => {
        ReactDOM
            .render(
                <Provider store={initConfig.configureStore(rootReducer, 'libm', webpack.production)}>
                    <AppContainer />
                </Provider>,
                document.getElementById("app")
            );
    // }).catch(err => {
    //     // console.error("");
    //     ReactDOM.render(<ConfigError />, document.getElementById("app"))
    // }
    // )
    // ReactDOM.render(<Provider store={initConfig.configureStore(rootReducer, 'libm', webpack.production)}><AppContainer /></Provider>, document.getElementById("app"));
}).catch(err => {
    // console.error("");
    var ua = navigator.userAgent;
    var isIE = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    
    ReactDOM.render(<ConfigError isIE={isIE} />, document.getElementById("app"))
});

/////////////////////////////////////////////
// declare var webpack: { core: string, production: boolean, configFile: string }

// // window.configUrl = `${window.location.origin}${window.location.pathm}BaseProject/Config/config-bg.json`;
// window.externalConfig = `${window.location.origin}${window.location.pathm}BaseProject/Config/wsi.un.json`;

// // if(!window.configUrl) {
// // console.warn("Config file not provided. Using config-dummy.json. Use url parameter to provide config file. Example: https://serverm/site/?configUrl=https://serverm/config/config-bg.json.");
// // window.configUrl = webpack.configFile;
// // }

// const dfzmUrl = `${window.location.origin}${window.location.pathm}BaseProject/Config/2config_bg_DFZ.json`;
// const menum = `${window.location.origin}${window.location.pathm}BaseProject/Config/config_bg_activities.json`;
// const fieldInspection = `${window.location.origin}${window.location.pathm}BaseProject/Config/3config_bg_FI.json`;

// let gisAppIds = ['menum'];

// const queryies = [menum].m((mUrl, i) => initConfig.resolveConfig(mUrl, gisAppIds[i]));


// Promise.all(queryies).then(results => {
//     console.log(results)
//     extendNls(nls);

//     mergeExternalConfig(window.externalConfig).then(r => {
//         // initConfig.mergeExternalConfig(window.externalConfig).then(r => {
//         ReactDOM
//             .render(
//                 <Provider store={initConfig.configureStore(rootReducer, 'menum', webpack.production)}>
//                     {/* <AppContainer gisAppId={'menum'} /> */}
//                     <App gisAppId={'menum'} />
//                 </Provider>,
//                 document.getElementById("app")
//             );
//     }).catch(console.error)

// })

////////////////////////////////////////



// initConfig.resolveConfig(window.configUrl, window.externalConfig).then(appConfig => {
//     extendNls(nls);

//     ReactDOM
//     .render(
//         <Provider store={initConfig.configureStore(rootReducer, webpack.production)}>
//             <AppContainer />
//         </Provider>, 
//         document.getElementById("app")
//     );
// });

