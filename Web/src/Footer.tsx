import * as React from 'react';
import { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import UserMenu from './UserMenu';

// import '../src/css/header.css'


interface ms {
    title: string;
}

const Footer = (ms: ms) => {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
         
            appBar: {
                maxHeight: 50,
                bottom:0,
            },
            toolBar: {
                maxHeight: 50
            },
            menuButton: {
                marginRight: theme.spacing(2),
            },
            title: {
                fontSize: '14px',
                color: 'black',
                marginLeft: '10%',
                marginRight: '10%',
                width: '80%'
            },
        }),
    );
    const classes = useStyles();

    return (
        <div id='application-footer' style={{  flexGrow: 1,
            height: 50,
            margin: "2px"}}>
            <AppBar position="static" classm={classes.appBar} style={{ backgroundColor: 'white' }}>
                <Toolbar classm={classes.toolBar} style={{ maxHeight: 50, minHeight: 50 }}>
                    <Typography  classm={classes.title}>
                        {ms.title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Footer;
