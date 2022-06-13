import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Container, Box, AppBar, Toolbar, IconButton, Typography, Button, Tooltip } from '@mui/material';
import DeckTwoToneIcon from '@mui/icons-material/DeckTwoTone';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

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
                    <Typography>Welcome {props.user.username}</Typography> &nbsp; &nbsp;
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

    const [unansweredCommentsCount, setUnansweredCommentsCount] = useState(0);
    useEffect(() => {
        async function commentscounter() {
            const response = await fetch(`http://localhost:5000/comments/unansweredcommentscount/${props.user._id}`);
        
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
        
            const res = await response.json();
            setUnansweredCommentsCount(res);
        }
    
        if(props.user._id!=null&&props.user._id!="") commentscounter();

        return;
    }, []);

    const UnansweredCommentsNotification = () => {
        
        return (
            <Tooltip title="Unanswered Comments">
            <Box component={Link} to={"/reviewcomments"} style={{color: "white"}}>
                <ChatBubbleTwoToneIcon style={{fontSize: 53, marginTop: "10px"}}/>
                <Box style={{position: "absolute", top: 20, marginLeft: "20px", fontWeight: "bold"}}>{props.unansCommentscount!=null ? props.unansCommentscount : unansweredCommentsCount}</Box>
            </Box>
            </Tooltip>
        );
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                    <Toolbar>
                        <Logo/>
                        <Menus/>
                        {props.user._id!=null&&props.user._id!=""&&props.user.signuptype=="owner" ? <UnansweredCommentsNotification/> : ''}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Header;