const asyncHandler = require( 'express-async-handler' );
const Admin  = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "shh";

// Creating a user

const createAdmin = asyncHandler(async (req, res) => {
    const { email_id, password } = req.body;
    console.log(email_id)
    console.log(password)
    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create a new admin user
    newAdmin = await Admin.create({
        emailId : email_id,
        Password : hashedPassword,
      }); 
    console.log(newAdmin.email_id)
  
    try {
      await newAdmin.save();
      res.status(201).json({ success: true, message: 'Admin user created successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Admin user creation failed' });
    }
  });

  const adminLogin = asyncHandler(async (req, res) => {
    const { email_id, password } = req.body;
    

    let user = await Admin.findOne({ emailId: email_id });

    if (!user) {
        return res.status(400).json({ error: "Please enter valid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);

    if (!passwordMatch) {
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


  


module.exports = {adminLogin, ProfessorLogin, JMLogin, createAdmin};

