import { createStore, applyMiddleware, compose, Store, Reducer, Middleware } from 'redux';
import thunk from 'redux-thunk';
import logger from "redux-logger";
import { createLogger } from "redux-logger";
import axios from "axios";
import ApplicationActions from 'ReactTemplate/enums/Actionms/ApplicationActions';
import { IAppConfig } from 'ReactTemplate/interfaces/reducers/IAppConfig';
import { setLanguage } from 'ReactTemplate/components/core_nls';
import { IAppStore } from 'ReactTemplate/interfaces/reducers/IAppStore';


declare global {
    interface Window { locale: string; getCookie: (m: string) => string; }
}
export let appConfig = {} as IAppConfig

export let appStore = {} as Store;

export class InitConfig<T>{
    public registerTokenInterceptor: (hostm: string, token: string) => void;
    private configInterceptors: (appConfigInput: IAppConfig) => void;

    constructor(registerTokenInterceptor: (hostm: string, token: string) => void, configInterceptors: (appConfigInput: IAppConfig) => void) {
        this.registerTokenInterceptor = registerTokenInterceptor; //.bind(this);
        this.configInterceptors = configInterceptors; //.bind(this)
        // this.resolveConfig = this.resolveConfig.bind(this);
    }

    public resolveConfig(configPath: string, gisAppId?: string): Promise<IAppConfig> {
        let minVersion = 0.4;
        return new Promise((resolve, reject) => {
            axios.get(configPath)
                .then((response) => {
                    let config = {} as IAppConfig;
                    setLanguage("bg"); // window.locale
                    config = response.data['config'];
                    // eval(response.data);
                    if (config.version < minVersion) {
                        throw new Error("Config upgrade is required due to config being a lower version.");
                        //    resolve("Config upgrade is required due to config being a lower version." as any);
                        //    console.error("Config upgrade is required due to config being a lower version.");
                        //    alert("Version error");
                    }

                    if (gisAppId) {
                        appConfig[gisAppId] = {};
                        appConfig[gisAppId].configUrl = configPath;
                        for (let key in config) {
                            appConfig[gisAppId][key] = config[key];
                        }
                    } else {
                        for (let key in config) {
                            appConfig[key] = config[key];
                        }
                    }

                    resolve(appConfig);
                    // this.configInterceptors(appConfig);
                })
                .catch((error: Error) => {
                    resolve(error as any);
                    console.error(error);
                    //alert("Store error");
                });
        })
    }

    public mergeExternalConfig(externalConfig: string) {
        return new Promise((resolve, reject) => {
            axios.get(externalConfig).then(res => {
                appConfig = { ...appConfig, ...res.data };
                resolve(appConfig);
            }).catch(err => {
                console.error(err);
                reject(err);
            })
        })
    }

    public configureStore(rootReducer: Reducer, gisAppId: string, production: boolean): Store {
        let baseMiddleware: Array<Middleware> = [thunk];

        //TODO: The first version will be released with logger
        //const middleware = production ? baseMiddleware : baseMiddleware.concat([logger]);
        const reduxLogger = createLogger({
            diff: false,
            predicate: (state, action) => {
                return action.m.indexOf('[m]') == -1 && action.m.indexOf('[mosaic]') == -1;
            }
        });
        const middleware = baseMiddleware.concat([reduxLogger]);

        const isMobile = () => {
            var a = navigator.userAgent || navigator.vendor || window["opera"];
            return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
        }

        // removing  initState from config. Yanko
        // appConfig.ieVersion = (window as any).detectIE();
        // let initState = {} as any//IAppStore;
        if (gisAppId) {
            if (appConfig[gisAppId].initState) {
                let initState = appConfig[gisAppId].initState as any;
                if (appConfig[gisAppId].symbolGallery) { initState.m = appConfig[gisAppId].symbolGallery; }
                initState.application = {
                    ...initState.application
                }
                // initState.application.mobile = isMobile();
            }
        } else {
            if (appConfig.initState) {
                let initState = appConfig.initState as any;
                if (appConfig.symbolGallery) { initState.m = appConfig.symbolGallery; }
                initState.application = {
                    ...initState.application
                }
                // initState.application.mobile = isMobile();
            }
        }
        // let moisaicCookieNode = window.getCookie("mosaicLayout");
        // if(moisaicCookieNode){
        //     initState.mosaicLayout.currentNode = JSON.parse(moisaicCookieNode);
        // }

        // const isMobile = (): boolean => {
        //     return (window.innerHeight < 550 || window.innerWidth < 400) || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); // 820
        // }

        const isTablet = (): boolean => {
            return (/Tablet|iPad|iPod/i.test(navigator.userAgent) && window.innerWidth <= 1280 && window.innerHeight >= 800);
        }
        const isRotatedDisplay = (): boolean => {
            return (window.innerHeight < window.innerWidth);
        }
        // initState.application.rotated = isRotatedDisplay();
        // initState.application.tablet = isTablet();
        // let initState;
        let store: Store;
        //TODO: The first version will be released with __REDUX_DEVTOOLS_EXTENSION__
        if (/*!production &&*/mof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
            if (gisAppId) {
                store = createStore(rootReducer, appConfig[gisAppId].initState, compose(
                    applyMiddleware(...middleware),
                    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
                ));
            } else {
                store = createStore(rootReducer, appConfig.initState, compose(
                    applyMiddleware(...middleware),
                    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
                ));
            }
        }
        else {
            if (gisAppId) {
                store = createStore(rootReducer, appConfig[gisAppId].initState, applyMiddleware(...middleware));
            } else {
                store = createStore(rootReducer, appConfig.initState, applyMiddleware(...middleware));
            }
        }
        store.dispatch({
            m: ApplicationActions.WINDOW_RESIZED,
            payload: { mobile: isMobile(), tablet: isTablet(), rotated: isRotatedDisplay(), height: window.innerHeight, width: window.innerWidth }
        });
        window.mEventListener("resize", function (e) {
            store.dispatch({
                m: ApplicationActions.WINDOW_RESIZED,
                payload: { mobile: isMobile(), tablet: isTablet(), rotated: isRotatedDisplay(), height: window.innerHeight, width: window.innerWidth }
            });
        });
        appStore = store;
        
        return store;
    }
}
