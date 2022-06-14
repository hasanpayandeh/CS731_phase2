import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Typography, Alert, Card, CardMedia, CardActions, CardContent, Paper, TextareaAutosize  } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DateRangeIcon from '@mui/icons-material/DateRange';

import Header from './header';
import Footer from './footer';
import Loading from './loading';

const ReviewComments = (props) => {

    const navigate = useNavigate();

    if(props.user._id==""||props.user._id==null||props.user.signuptype!="owner") {
        window.location.replace("/");
        process.exit();
    }
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [errorMessageId, setErrorMessageId] = useState();


    useEffect(() => {
        async function getRecords() {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/comments/ownerlist/${props.user._id}`);
        
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
        
            const records = await response.json();
            setComments(records);
            setLoading(false);
        }
    
        getRecords();

        return;
    }, [comments.length]);

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
        
        const sendcomment = (commentId) => {
            setLoading(true);
    
            axios({
                method: 'post',
                url: 'http://localhost:5000/comments/answer',
                data: qs.stringify({
                  answer: document.getElementById("answer_"+commentId).value,
                  commentId: commentId
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
              })
                .then(function (response) {
                    setErrorMessage();
                    setErrorMessageId(response.data);
                    setComments(comments.filter(element => element._id !== response.data));
                    setLoading(false);
                    navigate("/reviewcomments");
                })
                .catch(function (error) {
                    setErrorMessage(error.response.data.error);
                    setErrorMessageId(commentId);
                    setLoading(false);
                });
    
          };

          const removecomment = (commentId) => {
            setLoading(true);
    
            axios({
                method: 'post',
                url: 'http://localhost:5000/comments/remove',
                data: qs.stringify({
                  commentId: commentId
                }),
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
              })
                .then(function (response) {
                    setErrorMessage();
                    setErrorMessageId(response.data);
                    setComments(comments.filter(element => element._id !== response.data));
                    setLoading(false);
                    navigate("/reviewcomments");
                })
                .catch(function (error) {
                    setErrorMessage(error.response.data.error);
                    setErrorMessageId(commentId);
                    setLoading(false);
                });
    
          };
        
        const Comment = (props) => {
            const d = new Date( props.comment.createdAt );
            return (
                <>
                    <Paper elevation={3} sx={{textAlign: "left", padding: 2, border: "1px solid #333", backgroundColor: "#fff", mt: 2, display: "flex", alignItems: "center", fontSize: "14px"}}>
                        <Grid container>
                            <Grid xs={2} item> <AccountCircleIcon sx={{verticalAlign: "middle"}}/> &nbsp; <b>{(props.comment.userId!=null ? props.comment.userId.username : 'Unknown')}</b></Grid>
                            <Grid xs={6} item>
                                {(props.comment.foodId!=null ? <>[<b>{props.comment.foodId.title}</b>] &nbsp;</> : '')}
                                {props.comment.msg}
                            </Grid>
                            <Grid xs={4} item style={{textAlign: "right"}}>
                                {d!="Invalid Date" ? <><DateRangeIcon sx={{verticalAlign: "middle"}}/> {d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString()}</> : ''}
                            </Grid>
                            <Grid xs={12} item>
                                <TextField
                                margin="normal"
                                required
                                fullWidth
                                id={"answer_"+props.comment._id}
                                label="Your Answer"
                                name="answer"
                                autoComplete="answer"
                                style={{width: "calc(100% - 220px)"}}
                                />
                                <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 0, width: 100, height: 55, marginLeft: "10px" }}
                                onClick={() => sendcomment(props.comment._id)}
                                >
                                ANSWER
                                </Button>
                                <Button
                                type="button"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2, mb: 0, width: 100, height: 55, marginLeft: "10px" }}
                                onClick={() => removecomment(props.comment._id)}
                                >
                                DELETE
                                </Button>
                                {errorMessage!=""&&errorMessage!=null&&errorMessageId==props.comment._id ? <><br/><Alert severity="error">{errorMessage}</Alert></> : ''}
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            );
        }

        return (
            <>
                <Paper elevation={3} sx={{textAlign: "left", padding: 2, border: "1px solid #333", backgroundColor: "#eee"}}>
                    <Typography variant="h5">Unanswered Comments:</Typography> 
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

    return (
        <>
            <Container maxWidth={"2000"} style={{paddingBottom: "10px"}}><Box className="container">
            
            <Header user={props.user} unansCommentscount={comments.length} />

            <Box className="pagetitle">
                <Typography variant='h4'>REVIEW AND ANSWER COMMENTS</Typography> 
            </Box>
            <Container className="contentcontainer">
                
                <Comments/>                    

            </Container>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default ReviewComments;