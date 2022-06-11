// Handling requests related to Foods colletion

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Foods = require("../model/foodsModel");
const Users = require("../model/usersModel");

router.post('/add', asyncHandler(async (req, res) => {
    const {title, desc, ownerId, image} = req.body;
    var err=0;

    if(!title) {
        res.status(400).json({"error": "Title is required"});
        err=1;
    } else if(title.length<=6) {
        res.status(400).json({"error": "Title length should be more than 6 characters"});
        err=1;
    } else if(!ownerId) {
        res.status(400).json({"error": "ownerId is required"});
        err=1;
    }

    const ownerExists = await Users.findOne({_id: ownerId, signuptype: "owner"});
    const foodExists = await Foods.findOne({ownerId: ownerId, title: title});

    if(!ownerExists) {
        res.status(400).json({"error": "Owner does not exists or you are not an owner"});
    } else if(foodExists) {
        res.status(400).json({"error": "You added a same post before"});
    } else if(err==0) {
        const food = await Foods.create({
            title: title,
            desc: desc,
            ownerId: ownerId,
            image: image
        });

        if(food) {
            res.status(201).json({
                "_id": food._id,
                "ownerId": food.ownerId,
                "title": food.title,
                "desc": food.desc,
                "image": food.image
            });
        } else {
            res.status(400).json({"error": "There is a problem with your add post request"});
        }
        
    }
}));

module.exports = router