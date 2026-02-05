const express = require('express');
const path = require('path');
const userRoutes = require("./routes/user.route.js");
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);


module.exports = app; 
