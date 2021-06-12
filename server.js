//const http = require('http');
const express = require('express');
const app = express();
const session = require('express-session');
const Post = require('./model/Post');

const mongoose = require('mongoose');


//importuje routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


const dotenv = require('dotenv');  
dotenv.config();                      
   


//Static files
app.use(express.json());
app.use(express.static('public'));
app.use(session({secret: '123#345'}));
// app.use('/css',express.static(__dirname + 'public/css'));
// app.use('/img',express.static(__dirname + 'public/img'));
// app.use('/js',express.static(__dirname + 'public/js'));

//Set views

app.set('views', './views');
app.set('view engine', 'ejs');



const checkSignIn = (req, res, next) => {
    if(req.session.token){
        next();     //If session exists, proceed to page
    } else {
        res.redirect(301, `/login`)
        //var err = new Error("Not logged in!");
        //next(err);  //Error, trying to access unauthorized page!
    }
}

//======================================= DB connection ========================================================================

mongoose.connect(process.env.MONGO, 
    { useNewUrlParser: true }, 
    () => console.log('Baza polaczona'));

//======================================= GET Routes ========================================================================


//Default
app.get('', checkSignIn, (req, res) => {
    res.render('index');
});

//Login page
app.get('/login', (req, res) => {
    res.render('sign-in');
});

//Register page
app.get('/register', (req, res) => {
    res.render('sign-up');
});

//Gallery page
app.get('/gallery', checkSignIn, (req, res) => {
    res.render('gallery');
});

//Blog page
app.get('/blog', checkSignIn, (req, res) => {
    res.render('blog');
});

//Add post page
app.get('/add',  (req, res) => {
    res.render('form-post');
});


//Lcogout page
app.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect(301, '/login');
 });


 //posting an article
 app.post('/add', async (req, res) => {
    console.log(req);
    //Creating new post
    const newpost = new Post({
    title: req.body.title,
    post: req.body.post
    });

    try{
    const savedPost = await newpost.save();
    res.redirect(301, `/blog`)

    }catch(err){
    res.status(400).send(err);
    }

});



app.use(express.json());


app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log('OK'));


/*
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('gdfgddf\n');
});

server.listen(port, hostname, function() {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
});*/