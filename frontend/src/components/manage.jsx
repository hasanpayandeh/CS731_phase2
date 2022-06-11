import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Paper, Link, Grid, Typography, Alert, Card, CardMedia, CardActions, CardContent } from '@mui/material';

import Header from './header';
import Footer from './footer';
import Loading from './loading';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';

const Manage = (props) => {
    if(props.user._id==""||props.user._id==null||props.user.signuptype!="owner") {
        window.location.replace("/");
        process.exit();
    }

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const ManageButtons = ({title, icon, link, ownerId}) => {
        
        function linkNavigate() {
            if(link=="/viewrestaurant") {
                setLoading(true);
                axios({
                    method: 'get',
                    url: 'http://localhost:5000/users/ownerinfo/'+props.user._id,
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                  })
                    .then(function (response) {
                        localStorage.setItem('owner', JSON.stringify(response.data[0]));
                        navigate(link)
                        setLoading(false);
                    })
                    .catch(function (error) {
                        
                        setLoading(false);
                    });
            } else {
                navigate(link)
            }
        }

        return (
            <>
                <Grid item>
                    <Button onClick={() => linkNavigate()} size="large" startIcon={icon} variant="contained" sx={{height: 140}}>
                        {title}
                    </Button>
                </Grid>
            </>
        );
    }

    return (
        <>
            <Container maxWidth={"2000"} style={{paddingBottom: "10px"}}><Box className="container">
            
            <Header user={props.user}/>

            <Box className="pagetitle">
                <Typography variant='h4'>MANAGE MY RESTAURANT</Typography>
            </Box>
            <Box className="contentcontainer">
               
                <Typography variant="h4">Welcome {props.user.name},</Typography><br/>

                <Grid container style={{justifyContent: "center"}} spacing={2}>
                    <ManageButtons title="Add Post (Food)" icon={(<AddCircleOutlineIcon/>)} link="/addpost"/>
                    <ManageButtons title="Food ranking" icon={(<BarChartIcon/>)} link="/viewrestaurant"/>
                    <ManageButtons title="Review Comments" icon={(<QuestionAnswerIcon/>)} link="/reviewcomments"/>
                    <ManageButtons title="LOGOUT" icon={(<LogoutTwoToneIcon/>)} link="/logout"/>
                </Grid>

            </Box>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default Manage;