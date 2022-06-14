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
    var pastmsg = await Comments.findOne({foodId: foodId, userId: userId, msg: msg});

    if(!user) {
        res.status(400).json({"error": "userId is incorrect"});
    } else if(!food) {
        res.status(400).json({"error": "foodId is incorrect"});
    }else if(pastmsg) {
        res.status(400).json({"error": "You have already sent a similar comment!"});
    } else if(err==0) {
        const sendComment = await Comments.create({
            userId: userId,
            foodId: foodId,
            msg: msg
        });

        res.status(200).json(sendComment.populate({path:'userId', select:['username']}));
    }
}));

router.get('/ownerlist/:ownerId', asyncHandler(async (req, res) => {
    var foodslist2 = await Foods.find({ownerId: req.params.ownerId})
    var foodslist = Array();
    for(var i=0; i<foodslist2.length; i++) {
        foodslist.push(foodslist2[i]._id);
    }
    var comments = await Comments.find({foodId: {$in: foodslist}, answer: {$in: (null, "")}}).populate({path:'userId', select:['username']}).populate({path:'foodId', select:['title']});
    res.status(200).json(comments);
}));

router.post('/answer', asyncHandler(async (req, res) => {
    const {commentId, answer} = req.body;
    var err=0;

    if(!commentId) {
        res.status(400).json({"error": "commentId is required"});
        err=1;
    }  else if(!answer) {
        res.status(400).json({"error": "Plesae type an answer"});
        err=1;
    } else if(answer.length<=8) {
        res.status(400).json({"error": "Answer length should be more than 8 characters"});
        err=1;
    }

    var comment = await Comments.findOne({_id: commentId});

    if(!comment) {
        res.status(400).json({"error": "commentId is incorrect"});
    } else if(err==0) {

        var theCommentId = await Comments.findByIdAndUpdate(comment._id,{answer: answer});

        res.status(200).json(theCommentId._id);
    }
}));

router.post('/remove', asyncHandler(async (req, res) => {
    const {commentId} = req.body;
    var err=0;

    if(!commentId) {
        res.status(400).json({"error": "commentId is required"});
        err=1;
    } 

    var comment = await Comments.findOne({_id: commentId});

    if(!comment) {
        res.status(400).json({"error": "commentId is incorrect"});
    } else if(err==0) {

        var theCommentId = comment;
            await comment.remove();

        res.status(200).json(theCommentId._id);
    }
}));

router.get('/unansweredcommentscount/:ownerId', asyncHandler(async (req, res) => {
    var foodslist2 = await Foods.find({ownerId: req.params.ownerId})
    var foodslist = Array();
    for(var i=0; i<foodslist2.length; i++) {
        foodslist.push(foodslist2[i]._id);
    }
    var comments = await Comments.find({foodId: {$in: foodslist}, answer: {$in: (null, "")}});
    res.status(200).json(comments.length);
}));

module.exports = router
