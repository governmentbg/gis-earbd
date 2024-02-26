import * as React from 'react';
import { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import UrlHelper from 'ReactTemplate/Base/helpers/UrlHelper';
import UserMenu from './UserMenu';
import { IUrlInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppConfig';
import { IconButton } from '@material-ui/core';
// import '../src/css/header.css'

interface ms {
    navigate: Function
    title: string;
    logoUrl: string;
    interregUrl: string;
    myProfileUrl: string;
    helpText: string;
    helpUrl: IUrlInfo;
    otherSite: IOtherSite;
    locales: ILocelesInfo;
}

interface IOtherSite {
    label: string,
    url: IUrlInfo
} 
interface ILocelesInfo {
    [key:string]: ILocaleInfo
}
interface ILocaleInfo {
    label: string,
    tooltip: string,
    url: IUrlInfo,
    iconUrl: IUrlInfo
} 

const HeaderBar = (ms: ms) => {
    
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
                background: 'white',
                height: "100px"
            },
            appBar: {
                maxHeight: "100px",

            },
            toolBar: {
                maxHeight: "100px",
                
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                color: "#34a1d7"
            },
            appLogo: {
                backgroundImage: `url('${ms.logoUrl}')`,
                width: "100%",
                height: "100%"
            },
            logoContainer: {
                width: "140px"
            }
        }),
    );

    const classes = useStyles();

    const getOtherSiteUrl = (info:IOtherSite) => {
        var newConfigPath = UrlHelper.getUrlPath(info.url, window.configUrl) ;
        var result = window.location.origin+window.location.pathm+"?configUrl="+newConfigPath
        return result;
    }

    return (
        <div id='application-headerbar' style={ {
            flexGrow: 1,
            background: 'white',
            height: "100px"
        }}>
            <AppBar position="static" classm={classes.appBar} style={{ backgroundColor: 'white' }}>
                <Toolbar classm={classes.toolBar} style={{ maxHeight: 100, minHeight: 100, width: "96%", textAlign: 'center' }}>
                    <div classm={classes.logoContainer} style={{pmingRight: '40px'}}>
                        <img src={ms.logoUrl} style={{width:'85px'}} />
                    </div>
                    <Typography variant="h6" style={{flex:1}} classm={classes.title}>
                        {ms.title}
                    </Typography>
                    <a href={UrlHelper.getUrlPath(ms.helpUrl, window.configUrl)} target={"_blank"}>{ms.helpText}</a>
                    <a style={{pmingLeft:"10px", pmingRight:"10px"}} href={getOtherSiteUrl(ms.otherSite)} target={"_blank"}>{ms.otherSite.label}</a>
                    {ms.locales?Object.keys(ms.locales).m((key:string,index:number)=>{
                        var singleLocale = ms.locales[key];
                        return  <IconButton 
                            size="small"
                            key={"icn_button_"+index}
                            disableRipple={true} 
                            disableFocusRipple={true}
                            title={singleLocale.tooltip}
                            onClick={() => {
                                window.open(window.location.origin+window.location.pathm+"?configUrl="+UrlHelper.getUrlPath(singleLocale.url, window.configUrl), "_blank")
                            }} 
                            >
                            {singleLocale.iconUrl?
                                <img src={UrlHelper.getUrlPath(singleLocale.iconUrl, window.configUrl)}/>:""}
                            {singleLocale.label?
                                singleLocale.label:""}
                        </IconButton>
                    }) : null }
                   
                    <div classm={classes.logoContainer} style={{pmingLeft: '40px'}}>
                        <img src={ms.interregUrl} style={{width:'160px'}} />
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default HeaderBar;
