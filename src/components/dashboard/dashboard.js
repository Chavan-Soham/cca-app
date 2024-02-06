import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./dashNavbar";
import supabase from "../../supabaseClient"
import { useEffect, useState } from "react";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import AnnouncementsIcon from '@mui/icons-material/Announcement';
import PostsIcon from '@mui/icons-material/Description';
import AssignmentsIcon from '@mui/icons-material/Assignment';
import TodosIcon from '@mui/icons-material/Checklist';
import AboutIcon from '@mui/icons-material/Info';


export function ClassDashboard() {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState();

    const handleDrawerClick = (drawerString) => {
        setDrawerData(drawerString)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerOptions = [
        { text: 'People', icon: <PeopleIcon />, onClick: () => handleDrawerClick('People') },
        { text: 'Announcements', icon: <AnnouncementsIcon />, onClick: () => handleDrawerClick('Announcements') },
        { text: 'Posts', icon: <PostsIcon />, onClick: () => handleDrawerClick('Posts') },
        { text: 'Assignments', icon: <AssignmentsIcon />, onClick: () => handleDrawerClick('Assignments') },
        { text: 'Todos', icon: <TodosIcon />, onClick: () => handleDrawerClick('Todos') },
        { text: 'About', icon: <AboutIcon />, onClick: () => handleDrawerClick('About') },
    ];
    
    const [class_id, setClassId] = useState()
    const [getClassName, setClassName] = useState()
    const location = useLocation()

    function displayDrawerData(){
        switch (drawerData) {
            case 'People':
                return <h1>People</h1>
            case 'Announcements':
                return <h1>Announcement</h1>
            default:
                break;
        }
    }

    function className(){
        const getClassName = location.state.clickedClass;
        return(
            <div>
                <div>{getClassName}</div>
            </div>
        );
    }

    function navbar() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {className()}
                        </Typography>

                        {/* Profile Button */}
                        <Tooltip title="Account settings">
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClick}
                                sx={{ mr: 2 }}
                            >
                                <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
                            </IconButton>
                        </Tooltip>

                        {/* Profile Menu */}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>
                                <Typography textAlign="center">Update Profile Pic</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                >
                    <List>
                        {drawerOptions.map((item, index) => (
                            <ListItem button key={item.text} onClick={() => { item.onClick(); toggleDrawer(); }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
        );
    }

    return (
        <div>
            {navbar()}
            {/* {className()} */}
            <div id="functionality">
                {displayDrawerData()}
            </div>
        </div>
    );
}