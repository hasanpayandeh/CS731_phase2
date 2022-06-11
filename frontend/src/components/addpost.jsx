import {useState} from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, TextField, Typography, Alert} from '@mui/material';
import FileBase64 from 'react-file-base64';

import Header from './header';
import Footer from './footer';
import Loading from './loading';

const AddPost = (props) => {
    if(props.user._id==""||props.user._id==null||props.user.signuptype!="owner") {
        window.location.replace("/");
        process.exit();
    }

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
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
            url: 'http://localhost:5000/foods/add',
            data: qs.stringify({
              title: data.get('title'),
              desc: data.get('desc'),
              image: imageFile,
            ownerId: props.user._id
            }),
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          })
            .then(function (response) {
                setErrorMessage();
                setSuccessMessage("Your post has sent successfully");
                setLoading(false);
            })
            .catch(function (error) {
                setErrorMessage(error.response.data.error);
                setSuccessMessage();
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

            <Box className="pagetitle">
                <Typography variant='h4'>ADD POST (FOOD)</Typography>
            </Box>
            <Box className="contentcontainer">
                <Container component="main" maxWidth="xs">
                    <Box >
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoComplete="title"
                        />
                        <TextField
                        margin="normal"
                        fullWidth
                        id="desc"
                        label="Description"
                        name="desc"
                        autoComplete="desc"
                        multiline
                        rows={6}
                        />
                        {/* <Box className="uploadimagebox">
                            <FileBase64
                            multiple={ false }
                            onDone={ ({base64}) => setImageFile(base64) } />
                        </Box> */}
                        <Box className="uploadimagebox" textAlign={"left"}>
                            <label htmlFor="contained-button-file">
                                <input accept="image/*" style={{display: "none"}} id="contained-button-file" multiple type="file" onChange={(e) => {uploadImage(e); setImageFileName(document.getElementById("contained-button-file").value)}} />
                                <Button variant="contained" component="span">
                                Select Image
                                </Button> 
                                <span style={{fontSize: "10px"}}> 
                                    &nbsp; {imageFileName=="" ? "No image selected" : (<span style={{color: "#c70000"}}>{imageFileName.split("\\")[imageFileName.split("\\").length - 1]}</span>)}
                                </span>
                            </label>
                        </Box>
                        {errorMessage!=""&&errorMessage!=null ? <><br/><Alert severity="error">{errorMessage}</Alert></> : ''}
                        {successMessage!=""&&successMessage!=null ? <><br/><Alert severity="success">{successMessage}</Alert></>: ''}
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        >
                        SUBMIT
                        </Button>
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

export default AddPost;