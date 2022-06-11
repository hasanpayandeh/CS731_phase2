import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Button, Grid, Typography, Card, CardActions, CardContent, Paper, CardMedia } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Header from './header';
import Footer from './footer';
import Loading from './loading';

const ViewRestaurant = (props) => {
    const navigate = useNavigate();

    if(props.user._id==""||props.user._id==null) {
        window.location.replace("/");
        process.exit();
    }

    var owner = localStorage.getItem('owner');
    if(owner==""||owner==null) {
        navigate("/restaurants");
    }
    else {
        owner = JSON.parse(owner);
    }
    
    const [cards, setCards] = useState([]);
    const [checkUserVoted, setCheckUserVoted] = useState(0);
    const [loading, setLoading] = useState(false);

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            setLoading(true);
            // const response = await fetch(`http://localhost:5000/foods/list/${owner._id}`);
            // const records = await response.json();

            const response = await fetch(`http://localhost:5000/votes/list/${owner._id}/${props.user._id}`);
            const records = await response.json();
            setCards(records);
            // console.log(records);
            setLoading(false);
        }
    
        getRecords();
    
        return;
    }, [cards.length, checkUserVoted]);

    const viewButton = (food) => {
        var foodnew = food;
        foodnew.ownerName= owner.name;
        localStorage.setItem('food', JSON.stringify(foodnew));
        navigate("/viewfood");
    }


    const CardCreator = (props2) => {
        const submitVote = (foodId, vote) => {

            axios({
                method: 'post',
                url: 'http://localhost:5000/votes/add',
                data: qs.stringify({
                    userId: props.user._id,
                    foodId: foodId,
                    vote: vote
                }),
                headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            .then(function (response) {
                setCheckUserVoted(!checkUserVoted);
            })
            .catch(function (error) {
                console.log("submitVote error");
            });
        }

        const UpVote = ({foodId, userVote}) => {
            return (
                <>
                    <KeyboardArrowUpIcon className={"upvotebutton "+(userVote==1 ? "active" : "")} onClick={() => submitVote(foodId, 1)}/>
                </>
            );
        }

        const DownVote = ({foodId, userVote}) => {
            return (
                <>
                    <KeyboardArrowDownIcon className={"downvotebutton "+(userVote==-1 ? "active" : "")} onClick={() => submitVote(foodId, -1)}/>
                </>
            );
        }

        const Votes = ({card}) => {
            return (
                <>
                    <Grid item>
                        <Paper sx={{height: 83, paddingTop: "17px", width: 50, lineHeight: "40px"}}>
                            <UpVote foodId={card._id} userVote={card.userVote}/>
                            <br/>
                            <DownVote foodId={card._id} userVote={card.userVote}/>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper sx={{height: 80, paddingTop: "20px", width: 50, lineHeight: "15px"}}>
                            <Typography color="green" fontWeight="bold">{card.upvotes}</Typography>
                            <br/>
                            <Typography color="red" fontWeight="bold">{card.downvotes}</Typography>
                        </Paper>
                    </Grid>
                </>
            );
        }

        return (
            <Grid item key={props2.card} xs={12}>
                <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'row', backgroundColor: '#eee', boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.3)' }}
                >
                    <CardContent sx={{ flexGrow: 1}}>
                        <Grid container spacing={1}>
                            <Votes card={props2.card}/>
                            <Grid item>
                                <Paper sx={{height: 85, paddingTop: "15px", width: 80}}>
                                    Rank:
                                    <Typography variant="h3">{props2.sortnumber}</Typography>
                                </Paper>
                            </Grid>
                            {props2.card.image!=""&&props2.card.image!=null ?
                                <Grid item>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 100, width: 130, borderRadius: 1, border: "1px solid #333" }}
                                        image={props2.card.image}
                                        alt="random"
                                        />
                                </Grid>
                             : ''}
                            <Grid item>
                                <Typography variant="h5" component="h2" sx={{paddingTop: "32px", paddingLeft: "10px"}}>
                                {props2.card.title}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Button fullWidth variant="contained" onClick={() => viewButton(props2.card)} sx={{height: "100%"}}>View</Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }

    return (
        <>
            <Container maxWidth={"2000"} style={{paddingBottom: "10px"}}><Box className="container">
            
            <Header user={props.user}/>

            <Box className="pagetitle">
                <Typography variant='h4'>{owner.name}'s RESTAURANT FOOD LIST</Typography>
            </Box>
            <Box className="contentcontainer">
                
                <Container sx={{ py: 8 }} maxWidth="lg">
                {/* End hero unit */}
                <Grid container spacing={4}>
                    {cards.map((card, index) => {
                        return (
                            <CardCreator card={card} sortnumber={index+1}/>
                        );
                    })}
                </Grid>
                {cards.length==0 ? <Typography variant="h4">No food found</Typography> : ''}
                </Container>

            </Box>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default ViewRestaurant;