const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;

//register
router.post('/register', async (req,res) => {
    const { email, password } = req.body;
    const error = registerValidation(req.body);
    if (error) return res.status(400).send({ error: error.message });

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    MongoClient.connect(process.env.MONGO, {}, async (error, client) => {
        if (error) {
          console.log('Blad z polaczeniem bazy')
        }
        const db = client.db(process.env.DB_NAME)
        const users = db.collection('users');

        //check if email already in db
        const emailExist = await users.findOne({email});
        if(emailExist) return res.status(400).send({ error: 'Email already exists' });

        //Creating new user
        users.insertOne({
            email,
            password: hashedPassword
        }, (error, result) => {
            if (error) {
                console.log('Blad z dodaniem usera', error)
                res.status(400).send({ error });
            }
            res.redirect(301, `/`);
        })
      })
});


//login
router.post('/login', async (req,res) => {
    const { email, password } = req.body;

    const error = loginValidation(req.body);
    if (error) return res.status(400).send({ error: error.message });

    MongoClient.connect(process.env.MONGO, {}, async (error, client) => {
        if (error) {
          console.log('Blad z polaczeniem bazy')
        }
        const db = client.db(process.env.DB_NAME)
        const users = db.collection('users');

        //checking if email exists
        const user = await users.findOne({email});
        if(!user) return res.status(400).send('Email is incorrect');

        //password validation
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(400).send('Password is incorrect');
        
        //creating and assigning token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        req.session.token = token;
        res.redirect(301, `/`);
      })
});


//adding new post
router.post('/add', async (req,res) => {
    const { title, post } = req.body;

    MongoClient.connect(process.env.MONGO, {}, async (error, client) => {
        if (error) {
          console.log('Blad z polaczeniem bazy')
        }
        const db = client.db(process.env.DB_NAME)
        const posts = db.collection('posts');

        posts.insertOne({
            title,
            post
        })
        res.redirect(301, `/blog`);

      })
});

module.exports = router;