import { useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import DeckTwoToneIcon from '@mui/icons-material/DeckTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const Header = (props) => {
    const Logo = () => {
        return (
            <>
                <RestaurantIcon/> &nbsp; &nbsp;
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Food Social Media
                </Typography>
            </>
        )
    }
    
    const Menus = () => {
        
        if(props.user._id!=""&&props.user._id!=null) {
            return (
                <>
                    <AccountCircleIcon/> &nbsp; 
                    <Typography>Welcome {props.user.username},</Typography> &nbsp; &nbsp;
                    {props.user.signuptype=="owner" ? <><Button color="tertiary" variant="outlined" component={Link} to={"/manage"} startIcon={<FactCheckIcon/>}>MANAGE MY RESTAURANT</Button> &nbsp;</> : ''}
                    <Button color="tertiary" variant="outlined" component={Link} to={"/restaurants"} startIcon={<StorefrontTwoToneIcon/>}>RESTAURANTS LIST</Button> &nbsp;
                    <Button color="tertiary" variant="outlined" component={Link} to={"/logout"} startIcon={<LogoutTwoToneIcon/>}>LOGOUT</Button> &nbsp;
                </>
            )
        }
        else {
            return (
                <>
                    <Button color="tertiary" variant="outlined" component={Link} to={"/signup"} startIcon={<PersonAddAltTwoToneIcon/>}>SIGN UP</Button> &nbsp;
                    <Button color="tertiary" variant="outlined" component={Link} to={"/login"} startIcon={<LoginTwoToneIcon/>}>LOGIN</Button> &nbsp;
                </>
            )
        }
        
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                    <Toolbar>
                        <Logo/>
                        <Menus/>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Header;