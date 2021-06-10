const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');








//register
router.post('/register', async (req,res) => {

    //const { error } = schema.validate(req.body);
    //res.send(error.details[0].message);
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    //check if email already in db
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Creating new user
    const user = new User({
        //name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        //res.send({user: user._id});
        //res.redirect(301, `/`)
        res.redirect(301, `/login`)

    }catch(err){
        res.status(400).send(err);
    }
});


//login
router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is incorrect');
    //password validation
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is incorrect');

    

    //creating and assigning token
    const token = jwt.sign({_id: user._id}, '123#345')
    //res.header('auth-token', token);
    req.session.token = token;
    // tu dodane
    res.redirect(301, `/`)
    
    //res.send('Zalogowano');
});


module.exports = router;
