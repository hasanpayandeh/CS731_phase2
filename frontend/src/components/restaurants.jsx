import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { Container, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Typography, Alert, Card, CardMedia, CardActions, CardContent } from '@mui/material';

import Header from './header';
import Footer from './footer';
import Loading from './loading';
import noImage from '../assets/noimage.jpg';

const Restaurants = (props) => {
    if(props.user._id==""||props.user._id==null) {
        window.location.replace("/");
        process.exit();
    }

    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/users/ownerslist`);
        
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
        
            const records = await response.json();
            setCards(records);
            setLoading(false);
        }
    
        getRecords();
    
        return;
    }, [cards.length]);

    const viewButton = (owner) => {
        localStorage.setItem('owner', JSON.stringify(owner));
        navigate("/viewrestaurant");
    }

    const CardCreator = (props) => {
        return (
            <Grid item key={props.card} xs={12} sm={6} md={4}>
                <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#eee', boxShadow: '0px 0px 5px 2px rgba(0,0,0,0.3)' }}
                >
                    <CardMedia
                        component="img"
                        sx={{ height: 300 }}
                        image={props.card.image!=""&&props.card.image!=null ? props.card.image : noImage}
                        alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1, paddingBottom: "5px" }}>
                        <Typography variant="h5" component="h2">
                        {props.card.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button fullWidth variant="contained" onClick={() => viewButton(props.card)}>View</Button>
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
                <Typography variant='h4'>RESTAURANTS LIST</Typography>
            </Box>
            <Box className="contentcontainer">
               
            <Container sx={{ py: 8 }} maxWidth="lg">
            {/* End hero unit */}
            <Grid container spacing={4}>
                {cards.map((card) => (
                    <CardCreator card={card}/>
                ))}
            </Grid>
            </Container>

            </Box>

            <Footer/>

            </Box></Container>

            <Loading open={loading}/>
        </>
    )
}

export default Restaurants;