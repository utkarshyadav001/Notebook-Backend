const express = require("express");
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require("express-validator")
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const jwt_SECRET = 'MYNOTEBOOKISBESTUTKARSHYADAV';

let Success = false;
// 1.  Create a user using:  POST  "/api/auth/createuser". no login required
router.post('/createuser', [ 
    body('name', "Enter a valid name").isLength({min: 3}),
    body('email', "Enter a valid Email").isEmail(),
        body('password', "Password must be atleast 5 characters").isLength({min: 5})
    ], async (req, res)=>{
    // If there are errors. return Bad request and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({Success, errors: errors.array() });
    }

    try {
    //  check whether the user with this same email exists already
    let user = await User.findOne({email: req.body.email});
    Success = false;
    if(user){
        return res.status(400).json({Success, error: "Sorry a user with this email already exists"})
    }


    const genSalt = bcryptjs.genSaltSync(10);
    const  hashPass = bcryptjs.hashSync(req.body.password, genSalt);

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPass,
    })


    const data =  {
        user: {
            id: user.id
        }
    }

    const authToken = jwt.sign(data, jwt_SECRET);
    console.log(authToken);
    
    // .then(user => res.json(user) )
    // .catch(err => {console.log(err) 
    // res.json({error: 'Please enter a unique value for email', msg: })})

    // res.json(user)
    Success = true;
    res.json({Success, authToken})
       
} catch (error) {
    Success = false;
        console.error(error);
        res.status(500).send(Success, "Some error occured");
}
});




//2.   Create a user login :  POST  "/api/auth/login". no login required
router.post('/login', [ 
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Please Enter your password ").exists(),
    ], async (req, res)=>{

    let Success = false;
    
    // If there are errors. return Bad request and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({Success ,errors: errors.array() });
    }

    const {email, password} = req.body

    try {
    //  check whether the user with this same email exists already
    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({Success, error: "Please try to login with correct credentials"});
    }


    const passwordCompare = bcryptjs.compareSync(password, user.password)
    if(!passwordCompare){
        return res.status(400).json({Success, error: "Please try to login with correct credentials"});
    }

    const data =  {
        user: {
            id: user.id
        }
    }

    const authToken = jwt.sign(data, jwt_SECRET);
    Success = true;
    res.json({Success, authToken});
       
} catch (error) {
        Success = false;
        console.error(error);
        res.status(500).send(Success, "Some error occured");
}
});


//3.  Get logged in user Details using :  POST  "/api/auth/getuser".  login required
router.post('/getuser', fetchuser,  async (req, res)=>{

try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send({user});
} catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
}
});


module.exports = router;