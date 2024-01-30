import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from "react";
import supabase from "../../supabaseClient"
import { useNavigate } from "react-router-dom";

export function Navbar(){
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function signOut(){
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  }

  function logout(){
    signOut()
    navigate("/")
  }

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Avatar
            alt="My App"
            src="https://images8.alphacoders.com/133/1337140.png"
            onClick={()=>navigate("/create_or_join")}
            sx={{ mr: 2 }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
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
              <Typography textAlign="center" onClick={logout}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};