import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Button, TextField, Grid, Typography, Alert, CardMedia, Paper  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DateRangeIcon from '@mui/icons-material/DateRange';


import Header from './header';
import Footer from './footer';
import Loading from './loading';
import noImage from '../assets/noimage.jpg'

const ViewFood = (props) => {
    const getParams = useParams();

    const navigate = useNavigate();

    if(props.user._id==""||props.user._id==null) {
        window.location.replace("/");
        process.exit();
    }

    // var food = localStorage.getItem('food');
    const [food, setFood] = useState("");
    useEffect(()=>{
        async function getData() {
            setLoading(true);

            const response = await fetch(`http://localhost:5000/foods/foodinfo/${getParams.id}`);
            const record = await response.json();
            setFood(record[0]);
            setLoading(false);
        }
    
        getData();
    }, [])
    // if(food._id==""||food._id==null) {
    //     navigate("/restaurants");
    // }
    // else {
    //     // food = JSON.parse(food);
    // }
    
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getRecords() {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/comments/list/${food._id}`);
        
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
        
            const records = await response.json();
            setComments(records);
            setLoading(false);
        }
    
        if(food._id!=""&&food._id!=null) getRecords();

        return;
    }, [comments.length, food]);

    const TextBoxes = (props) => {
        return (
            <>
                <Paper elevation={3} sx={{textAlign: "left", padding: 2, border: "1px solid #333", backgroundColor: "#eee"}}>
                    <b>{props.title}:</b> {props.value} 
                </Paper><br/>
            </>
        );
    }
    
    const Comments = () => {

        const Comment = ({comment}) => {
            const d = new Date( comment.createdAt );
            return (
                <>
                    <Paper elevation={3} sx={{textAlign: "left", padding: 2, border: (comment.userId!=null&&comment.userId._id==props.user._id ? "5px solid #333" : "1px solid #333"), backgroundColor: (comment.userId!=null&&comment.userId._id==props.user._id ? "#d7b0b0" : "#fff"), mt: 2, display: "flex", alignItems: "center", fontSize: "14px"}}>
                        <Grid container>
                            <Grid xs={2} item> <AccountCircleIcon sx={{verticalAlign: "middle"}}/> &nbsp; <b>{(comment.userId!=null ? (comment.userId._id==props.user._id ? <span style={{color: "#c70000"}}>YOU</span> : comment.userId.username) : 'Unknown')}</b></Grid>
                            <Grid xs={6} item>
                                {comment.msg} 
                            </Grid>
                            <Grid xs={4} item style={{textAlign: "right"}}>
                                {d!="Invalid Date" ? <><DateRangeIcon sx={{verticalAlign: "middle"}}/> {d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString()}</> : ''}
                            </Grid>
                            {comment.answer!=null&&comment.answer!="" ? <Grid xs={12} item sx={{color: "#c70000", mt: 1}}>
                                <b>Answer:</b> {comment.answer}
                            </Grid> : ''}
                        </Grid>
                    </Paper>
                </>
            );
        }

        return (
            <>
                <Paper elevation={3} sx={{textAlign: "left", padding: 2, border: "1px solid #333", backgroundColor: "#eee"}}>
                    <Typography variant="h6">Comments: </Typography>
                    {comments.map((comment) => {
                        return (
                            <Comment key={comment._id} comment={comment}/>
                        );
                    })}
                    {comments.length==0 ? <Typography variant="h7">No Comments found</Typography> : ''}
                </Paper>
            </>
        );
    }

    const AddComment = () => {
        const handleSubmit = (event) => {
            setLoading(true);
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            
            axios({
                method: 'post',
                url: 'http://localhost:5000/comments/send',
                data: qs.stringify({
                  userId: props.user._id,
                  foodId: food._id,
                  msg: data.get('msg')
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
              })
                .then(function (response) {
                    setErrorMessage();
                    setSuccessMessage("Your comment has sent successfully");
                    setComments([...comments, response.data]);
                    setLoading(false);
                })
                .catch(function (error) {
                    setErrorMessage(error.response.data.error);
                    setSuccessMessage();
                    setLoading(false);
                });
    
          };

        return (
            <>
                <Paper elevation={3} sx={{textAlign: "left", padding: "0px 10px 10px 10px", border: "1px solid #333", backgroundColor: "#eee"}}>                
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="msg"
                        label="Please enter your comment here"
                        name="msg"
                        autoComplete="msg"
                        multiline
                        rows={4}
                        sx={{backgroundColor: "#fff"}}
                        />
                        {errorMessage!=""&&errorMessage!=null ? <Alert severity="error">{errorMessage}</Alert>: ''}
                        {successMessage!=""&&successMessage!=null ? <Alert severity="success">{successMessage}</Alert>: ''}
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 0, mb: 0 }}
                        >
                        COMMENT
                        </Button>
                    </Box>
                </Paper>
            </>
        );
    }

    return (
        <>
            <Container maxWidth={"2000"} style={{paddingBottom: "10px"}}><Box className="container">
            
            <Header user={props.user}/>

            <Box className="pagetitle">
                <Typography variant='h4'>{food.title}</Typography> 
            </Box>
            <Container className="contentcontainer">
                
                <Grid container maxWidth={"lg"} spacing={3} justifyContent="center">
                    <Grid item xs={7}>
                        <CardMedia
                            component="img"
                            sx={{ height: 400, borderRadius: 4, border: "1px solid #333" }}
                            image={food.image!=""&&food.image!=null ? food.image : noImage}
                            alt="random"
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextBoxes title="Title" value={food.title} />
                        <TextBoxes title="Restaurant Name" value={food.ownerId!==undefined ? food.ownerId.username : ''} />
                        <TextBoxes title="Description" value={food.desc} />
                    </Grid>
                    <Grid item xs={8}>
                        <Comments/>
                    </Grid>
                    <Grid item xs={4}>
                        <AddComment/>
                    </Grid>
                </Grid>

            </Container>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default ViewFood;