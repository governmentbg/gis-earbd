import * as React from "react";
import * as ReactDOM from "react-dom";
import rootReducer from '../../../Lib/v0.6/src/Base/reducers/rootReducer';
import AppContainer from './AppContainer';
import "../../../Lib/v0.6/src/Base/css/bundle.scss";
import "./components/css/customms.scss";
import '@arcgis/core/assets/esri/themes/light/main.css';
import { Provider } from "react-redux";
import { configEsriInterceptors, registerEsriTokenInterceptor } from "../../../Lib/v0.6/src/Base/configs/configEsri";
import { InitConfig } from'../../../Lib/v0.6/src/Base/configs/appConfig';


let initConfig = new InitConfig(registerEsriTokenInterceptor, configEsriInterceptors);

declare global {
    interface Window {
        configUrl: string;
        getCookie: (m: string) => string;
        eraseCookie: (m: string, paths: Array<string>) => void;
        setCookie: (m: string, value: string, days?: number) => void;
        log: (...arcgs: any) => void;
    }
    let log: (...arcgs: any) => void;

}

declare var webpack: { core: string, production: boolean, configFile: string }
if(!window.configUrl)
{
    console.warn("Config file not provided. Using config-dummy.json. Use url parameter to provide config file. Example: https://serverm/site/?configUrl=https://serverm/config/config-bg.json.");
    window.configUrl = webpack.configFile;
}

initConfig.resolveConfig(window.configUrl ? window.configUrl : webpack.configFile).then(appConfig => {
    ReactDOM.render(<Provider store={initConfig.configureStore(rootReducer, webpack.production)}><AppContainer /></Provider>, document.getElementById("app"));
});

