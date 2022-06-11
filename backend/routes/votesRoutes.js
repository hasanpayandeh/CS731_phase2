// Handling requests related to Votes colletion

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Votes = require("../model/votesModel");
const Users = require("../model/usersModel");
const Foods = require("../model/foodsModel");


router.get('/list/:ownerId/:userId', asyncHandler(async (req, res) => {
    var results2 = Array();

    await Foods.find({ownerId: req.params.ownerId}).then(foods2 => {
        foods2.map( food => {
            results2.push({ "_id": food._id, "ownerId": food.ownerId, "title": food.title, "desc": food.desc, "image": food.image, "upvotes": 0, "downvotes": 0, "sumvotes": 0, "userVote": 0});
        })
    })

    var upvotes = await Votes.aggregate([
        { $match: { vote: 1 } },
        { $group: { _id: "$foodId", upvotes: { $sum: "$vote" } } }
    ]);

    var downvotes = await Votes.aggregate([
        { $match: { vote: -1 } },
        { $group: { _id: "$foodId", downvotes: { $sum: "$vote" } } }
    ]);

    var sumvotes = await Votes.aggregate([
        { $group: { _id: "$foodId", sumvotes: { $sum: "$vote" } } }
    ]);

    var userVoted = await Votes.find({userId: req.params.userId});

    for (var i=0 ; i < results2.length ; i++){
        for (var j=0 ; j < upvotes.length ; j++)
        {
            if (upvotes[j]["_id"]+"" == results2[i]._id+"") {
                results2[i].upvotes =upvotes[j]["upvotes"];
            }
        }

        for (var j=0 ; j < downvotes.length ; j++)
        {
            if (downvotes[j]["_id"]+"" == results2[i]._id+"") {
                results2[i].downvotes =downvotes[j]["downvotes"];
            }
        }

        for (var j=0 ; j < sumvotes.length ; j++)
        {
            if (sumvotes[j]["_id"]+"" == results2[i]._id+"") {
                results2[i].sumvotes =sumvotes[j]["sumvotes"];
            }
        }

        for (var j=0 ; j < sumvotes.length ; j++)
        {
            if (sumvotes[j]["_id"]+"" == results2[i]._id+"") {
                results2[i].sumvotes =sumvotes[j]["sumvotes"];
            }
        }
        for (var j=0 ; j < userVoted.length ; j++)
        {
            if ( (userVoted[j]["foodId"]+"" == results2[i]._id+"") ) {
                results2[i].userVote = userVoted[j]["vote"];
            }
            
        }
    }
    
    results2.sort((a,b) => (a.sumvotes > b.sumvotes) ? -1 : ((b.sumvotes > a.sumvotes) ? 1 : 0));

    res.status(200).json(results2);
}));

router.post('/add', asyncHandler(async (req, res) => {
    const {userId, foodId, vote} = req.body;
    var err=0;

    if(!userId) {
        res.status(400).json({"error": "userId is required"});
        err=1;
    } else if(!foodId) {
        res.status(400).json({"error": "foodId is required"});
        err=1;
    } else if(vote!=1&&vote!=-1) {
        res.status(400).json({"error": "vote is required"});
        err=1;
    }

    var user = await Users.findOne({_id: userId});
    var food = await Foods.findOne({_id: foodId});
    var pastvotesame = await Votes.findOne({foodId: foodId, userId: userId, vote: vote});
    var pastvote = await Votes.findOne({foodId: foodId, userId: userId});

    if(!user) {
        res.status(400).json({"error": "userId is incorrect"});
    } else if(!food) {
        res.status(400).json({"error": "foodId is incorrect"});
    } else if(err==0) {

        // remove previous vote
        if(pastvotesame) {
            var theVote = pastvote;
            await theVote.remove();
        } 
        // update previous vote
        else if(pastvote) {
            var theVote = await Votes.findByIdAndUpdate(pastvote._id,{vote: vote});
        } 
        // create new vote
        else {
            var theVote = await Votes.create({
                userId: userId,
                foodId: foodId,
                vote: vote
            });
        }

        res.status(201).json(theVote);
    }
}));

module.exports = router