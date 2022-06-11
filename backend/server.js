/**
 *  FileName: server.js (Server-Side)
 *  Author: MohammadHasan Payandeh <mpu236@uregina.ca>
 *  Course: CS731
 *  Version: 1.0
*/

const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser')

connectDB();

const app = express();

// fixing NetworkError
var cors = require("cors");
app.use(cors());

// changing upload limit
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// definition of diferrent routes
app.use('/users', require('./routes/usersRoutes'));
app.use('/foods', require('./routes/foodsRoutes'));
app.use('/comments', require('./routes/commentsRoutes'));
app.use('/votes', require('./routes/votesRoutes'));

app.listen(port, () => console.log(`server started on port ${port}`))