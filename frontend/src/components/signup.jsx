import {useState} from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Button, CssBaseline, TextField, FormControl, Link, Grid, Typography, Alert, Select, MenuItem, InputLabel } from '@mui/material';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import FileBase64 from 'react-file-base64';

import Header from './header';
import Footer from './footer';
import Loading from './loading';

const Signup = (props) => {
    if(props.user._id!=""&&props.user._id!=null) {
        window.location.replace("/");
        process.exit();
    }

    const [errorMessage, setErrorMessage] = useState("");
    const [signupType, setSignupType] = useState("customer");
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState("");
    const [imageFileName, setImageFileName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        axios({
            method: 'post',
            url: 'http://localhost:5000/users/signup',
            data: qs.stringify({
              signuptype: data.get('signuptype'),
              username: data.get('username'),
              password: data.get('password'),
              repassword: data.get('repassword'),
              email: data.get('email'),
              name: data.get('name'),
              image: imageFile
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

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setImageFile(base64);
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
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
                        <PersonAddAltTwoToneIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        SIGN UP
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">SIGNUP Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={signupType}
                            label="Signup Type"
                            color="secondary"
                            name="signuptype"
                            onChange={() => {setSignupType(signupType=="customer" ? "owner" : "customer")}}
                            >
                                <MenuItem value={"customer"}>Customer</MenuItem>
                                <MenuItem value={"owner"}>Restaurant Owner</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
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
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="repassword"
                        label="Confirm Password"
                        type="password"
                        id="repassword"
                        autoComplete="current-repassword"
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label={signupType=="customer" ? "Name" : "Restaurant Name"}
                        name="name"
                        autoComplete="name"
                        />
                        <Box className="uploadimagebox" textAlign={"left"}>
                            <label htmlFor="contained-button-file">
                                {signupType=="customer" ? "Avatar Image" : "Restaurant Image"}: &nbsp;
                                <input accept="image/*" style={{display: "none"}} id="contained-button-file" multiple type="file" onChange={(e) => {uploadImage(e); setImageFileName(document.getElementById("contained-button-file").value)}} />
                                <Button variant="contained" component="span">
                                Select
                                </Button> 
                                <span style={{fontSize: "10px"}}> 
                                    &nbsp; {imageFileName=="" ? "No image selected" : (<span style={{color: "#c70000"}}>{imageFileName.split("\\")[imageFileName.split("\\").length - 1]}</span>)}
                                </span>
                            </label>
                        </Box>
                        {errorMessage!=""&&errorMessage!=null ? <><br/><Alert severity="error">{errorMessage}</Alert></> : ''}
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        SIGN UP
                        </Button>
                        <Grid container>
                        <Grid item>
                            <Link href="/login" variant="body2">
                            {"Already have an account? LOGIN"}
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

export default Signup;