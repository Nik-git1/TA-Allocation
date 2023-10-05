const asyncHandler = require( 'express-async-handler' );
const {Admin, Professor , JM } = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "shh";

// Creating a user

const adminLogin = asyncHandler (async(req,res) =>{
    const { email_id, password } = req.body;
    let user = await Admin.findOne({ email_id }); 
    if (!user) {
        return res.status(400).json({ error: "Please enter valid credentials" });
    }
    if (password !== user.password) {
        return res.status(400).json({ success: false, error: "Please enter valid credentials" });
    }
    const data = {
        user: {
          id: user.id,
        },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    const success = true;

    res.json({ success, authtoken });

});

const JMLogin = asyncHandler (async(req,res) =>{
    const { email_id, password } = req.body;
    let user = await JM.findOne({ email_id }); 
    if (!user) {
        return res.status(400).json({ error: "Please enter valid credentials" });
    }
    if (password !== user.password) {
        return res.status(400).json({ success: false, error: "Please enter valid credentials" });
    }
    const data = {
        user: {
          id: user.id,
        },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    const success = true;

    res.json({ success, authtoken });

});

const ProfessorLogin = asyncHandler (async(req,res) =>{
    const { email_id, password } = req.body;
    let user = await Professor.findOne({ email_id }); 
    if (!user) {
        return res.status(400).json({ error: "Please enter valid credentials" });
    }
    if (password !== user.password) {
        return res.status(400).json({ success: false, error: "Please enter valid credentials" });
    }
    const data = {
        user: {
          id: user.id,
        },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    const success = true;

    res.json({ success, authtoken });

});


  


module.exports = {adminLogin, ProfessorLogin, JMLogin};

