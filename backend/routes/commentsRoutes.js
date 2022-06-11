// Handling requests related to Comments colletion

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Comments = require("../model/commentsModel");
const Users = require("../model/usersModel");
const Foods = require("../model/foodsModel");


router.get('/list/:foodId', asyncHandler(async (req, res) => {
    var comments = await Comments.find({foodId: req.params.foodId}).populate({path:'userId', select:['username']});
    res.status(200).json(comments);
}));

router.post('/send', asyncHandler(async (req, res) => {
    const {userId, foodId, msg} = req.body;
    var err=0;

    if(!userId) {
        res.status(400).json({"error": "userId is required"});
        err=1;
    } else if(!foodId) {
        res.status(400).json({"error": "foodId is required"});
        err=1;
    } else if(!msg) {
        res.status(400).json({"error": "Plesae type a message"});
        err=1;
    } else if(msg.length<=8) {
        res.status(400).json({"error": "Message length should be more than 8 characters"});
        err=1;
    }

    var user = await Users.findOne({_id: userId});
    var food = await Foods.findOne({_id: foodId});
    var pastmsg = await Comments.findOne({foodId: foodId, userId: userId});

    if(!user) {
        res.status(400).json({"error": "userId is incorrect"});
    } else if(!food) {
        res.status(400).json({"error": "foodId is incorrect"});
    }else if(pastmsg) {
        res.status(400).json({"error": "You have already sent a comment!"});
    } else if(err==0) {
        const sendComment = await Comments.create({
            userId: userId,
            foodId: foodId,
            msg: msg
        });

        res.status(201).json(sendComment.populate({path:'userId', select:['username']}));
    }
}));

router.get('/ownerlist/:ownerId', asyncHandler(async (req, res) => {
    var foodslist2 = await Foods.find({ownerId: req.params.ownerId})
    var foodslist = Array();
    for(var i=0; i<foodslist2.length; i++) {
        foodslist.push(foodslist2[i]._id);
    }
    var comments = await Comments.find({foodId: {$in: foodslist}}).populate({path:'userId', select:['username']}).populate({path:'foodId', select:['title']});
    res.status(200).json(comments);
}));

module.exports = router
