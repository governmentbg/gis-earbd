import { appConfig } from 'ReactTemplate/Base/configs/appConfig';
import { IAppConfig } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { ISpecificConfig } from '../interfaces/ISpecificConfig'
import axios from 'axios';


export interface WsiUnActivitiesConfig extends IAppConfig {
    // Registers: any,
    // adminDataUrl: string;
    // downloadUrl: string;
    // inspireUrl: string;
    // isErsa: string;
    specificData:ISpecificConfig,
}

export let ssiUnActivitiesConfig = {} as WsiUnActivitiesConfig;


export const mergeExternalConfig = (externalConfig: any) => {
    return new Promise((resolve, reject) => {
        axios.get(externalConfig).then(res => {
            ssiUnActivitiesConfig = { ...appConfig['libm'], specificData: {...res.data} };
            resolve(appConfig);
        }).catch(err => {
            console.error(err);
            reject(err);
        })
    })
}
