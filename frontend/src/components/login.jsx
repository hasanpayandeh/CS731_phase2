import {useState} from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Typography, Alert } from '@mui/material';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';


import Header from '../components/header';
import Footer from '../components/footer';
import Loading from './loading';

const Login = (props) => {
    if(props.user._id!=""&&props.user._id!=null) {
        window.location.replace("/");
        process.exit();
    }
    
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        axios({
            method: 'post',
            url: 'http://localhost:5000/users/login',
            data: qs.stringify({
              username: data.get('username'),
              password: data.get('password')
            }),
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          })
            .then(function (response) {
                setErrorMessage();
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.replace("/");
                setLoading(false);
            })
            .catch(function (error) {
                setErrorMessage(error.response.data.error);
                setLoading(false);
            });

      };

    return (
        <>
            <Container maxWidth={"2000"} style={{paddingBottom: "10px"}}><Box className="container">
            
            <Header user={props.user}/>

            <Box className="contentcontainer">
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                    sx={{
                        marginTop: 8,
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LoginTwoToneIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        LOGIN
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Email Address or Username"
                        name="username"
                        autoComplete="username"
                        />
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        />
                        {errorMessage!=""&&errorMessage!=null ? <Alert severity="error">{errorMessage}</Alert>: ''}
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        LOGIN
                        </Button>
                        <Grid container>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                            {"Don't have an account? SIGN UP"}
                            </Link>
                        </Grid>
                        </Grid>
                    </Box>
                    </Box>
                </Container>
            </Box>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default Login;