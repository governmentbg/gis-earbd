import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';

// import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
// import Menum from '@material-ui/core/Menum';
// import Menu from '@material-ui/core/Menu';
import AnnouncementTwoToneIcon from '@material-ui/icons/AnnouncementTwoTone';
// import Tooltip from '@material-ui/core/Tooltip';

import { IAppStore, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';

import { Link } from '@reach/router';
import { Divider, IconButton, ListmText, Menu, Menum, Tooltip, Menums, MenuList, Button, makeStyles } from '@material-ui/core';
import { signOut } from 'ReactTemplate/Base/actions/dispatchers/userInfo';
import LinkMUI from "@material-ui/core/Link";


interface Ownms {
    userInfo: IUserInfo
}

interface Dispatchms {
    signOut: () => void;
}

interface Parentms {
    myProfileUrl: string;
}

m ms = Parentms & Ownms & Dispatchms;

const UserMenu = (ms: ms) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const useStyles = makeStyles((theme) => ({
        menum: {
            display: "flex",
            position: "relative",
            textAlign: "left",
            alignms: "center",
            justifyContent: "flex-start",
            textDecoration: "none",
        }
    }));

    const classes = useStyles();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogIn = () => {

    }

    const userSignOut = () => {
        handleClose();
        ms.signOut();
        // window.location.reload();
    }

    const menumStyles = {
        display: "flex",
        pming: 16,
        position: "relative",
        textAlign: "left",
        alignms: "center",
        justifyContent: "flex-start",
        textDecoration: "none",
    } as React.CSSmerties;

    return (
        <div>
            <IconButton
            style={{outm:"none", color:"#6d6565"}}
                title="Профил"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                elevation={1}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={open}
                onClose={handleClose}
            >
                {
                    ms.userInfo && ms.userInfo.userm
                        ?
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Menum
                                style={{
                                    display: "flex",
                                    pming: 8,
                                    position: "relative",
                                    textAlign: "left",
                                    alignms: "center",
                                    justifyContent: "flex-start",
                                    textDecoration: "none",
                                }}
                                onClick={handleClose}>
                                {`Потребител: ${ms.userInfo.userm}`}
                            </Menum>
                            <Divider />
                            <Menum
                                style={{
                                    display: "flex",
                                    pming: 8,
                                    position: "relative",
                                    textAlign: "left",
                                    alignms: "center",
                                    justifyContent: "flex-start",
                                    textDecoration: "none",
                                }}
                                onClick={handleClose}>
                                <>
                                    <a
                                        target="_blank"
                                        href={ms.myProfileUrl}
                                        style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}>
                                        {"Моят профил"}
                                    </a>
                                </>
                            </Menum>
                            <Menum
                                style={{
                                    display: "flex",
                                    pming: 8,
                                    position: "relative",
                                    textAlign: "left",
                                    alignms: "center",
                                    justifyContent: "flex-start",
                                    textDecoration: "none",
                                }}
                                onClick={() => userSignOut()}>
                                <Link style={{ width: '100%', height: '100%', textDecoration: 'none' }} to="/">
                                    <span style={{ color: 'black' }}>{"Изход"}</span>
                                </Link>
                            </Menum>
                        </div>
                        :
                        <Menum style={{ width: 100, textAlign: 'center', pming: 0 }} onClick={handleClose}>
                            <Link style={{ width: '100%', height: '100%', textDecoration: 'none' }} to="/login">
                                <span style={{ color: 'black' }}>{"Вход"}</span>
                            </Link>
                        </Menum>
                }
            </Menu>
        </div>
    );
}

const mStateToms = (state: IAppStore) => ({
    userInfo: state.userInfo
});

export default connect<Ownms, Dispatchms>(mStateToms, { signOut })(UserMenu);
