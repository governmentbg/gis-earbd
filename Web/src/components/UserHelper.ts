import * as React from 'react';
import Graphic from 'esri/Graphic';
import Field from 'esri/ms/support/Field'
import { IAppStore, IUserInfo, UserInfoStatus } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import { ssiUnActivitiesConfig } from '../config/wsi.unConfig'

export default class UserHelper {
    public static checkRole = (user:IUserInfo) => {
        var access=false;
        if(user) {
            var userRoles = user.groups;
            if(userRoles&&userRoles.length>0) {
                var role = ssiUnActivitiesConfig.specificData.roles.roles.find((x:any)=>userRoles.find(y=>y==x));
                if(role){
                    access=true
                }
            }
        }
        return access;
    }
    public static canViewDocuments = (user:IUserInfo) => {
        var access=false;
        if(user) {
            var userRoles = user.groups;
            if(userRoles&&userRoles.length>0) {
                var role = ssiUnActivitiesConfig.specificData.roles.preview.find((x:any)=>userRoles.find(y=>y==x));
                if(role){
                    access=true
                }
            }
        }
        return access;
    }
    public static canUplomocumnets = (user:IUserInfo) => {
        var access=false;
        if(user) {
            var userRoles = user.groups;
            if(userRoles&&userRoles.length>0) {
                var role = ssiUnActivitiesConfig.specificData.roles.upload.find((x:any)=>userRoles.find(y=>y==x));
                if(role){
                    access=true
                }
            }
        }
        return access;
    }
    public static canDeleteDocumnets = (user:IUserInfo) => {
        var access=false;
        if(user) {
            var userRoles = user.groups;
            if(userRoles&&userRoles.length>0) {
                var role = ssiUnActivitiesConfig.specificData.roles.delete.find((x:any)=>userRoles.find(y=>y==x));
                if(role){
                    access=true
                }
            }
        }
        return access;
    }
    public static canEdit = (user:IUserInfo) => {
        var access=false;
        if(user) {
            var userRoles = user.groups;
            if(userRoles&&userRoles.length>0) {
                var role = ssiUnActivitiesConfig.specificData.roles.edit.find((x:any)=>userRoles.find(y=>y==x));
                if(role){
                    access=true
                }
            }
        }
        return access;
    }

    public static getWebSiteRole = () => {
        var result = undefined
        if(ssiUnActivitiesConfig.specificData&&ssiUnActivitiesConfig.specificData.roles&&ssiUnActivitiesConfig.specificData.roles) {
            result = ssiUnActivitiesConfig.specificData.roles.roles[0];
        }
        return result;
    }
}