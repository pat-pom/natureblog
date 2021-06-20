const express = require('express');
const app = express();
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;


//importuje routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


//*************************************** 
const dotenv = require('dotenv');
dotenv.config();
//***************************************



//Static files
app.use(session({secret: process.env.SECRET}));
app.use(express.static('public'));
app.use(express.json());
app.use('/css',express.static(__dirname + 'public/css'));
app.use('/img',express.static(__dirname + 'public/img'));
app.use('/js',express.static(__dirname + 'public/js'));

//Set views

app.set('views', './views');
app.set('view engine', 'ejs');

const checkSignIn = (req, res, next) => {
    if(req.session.token){
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        next(err);  //Error, trying to access unauthorized page!
    }
}

app.get('', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('sign-in');
});

app.get('/register', (req, res) => {
    res.render('sign-up');
});

app.get('/gallery', (req, res) => {
    res.render('gallery');
});

app.get('/search', (req, res) => {
    var searchTerm = req.query.searchterm;
    //console.log(searchTerm);
    MongoClient.connect(process.env.MONGO, {}, async (error, client) => {
        
        const db = client.db(process.env.DB_NAME)
        const posts = db.collection('posts').find(

            {"title": searchTerm}
 /*           {
                position:
                  { $near:
                     {
                       $geometry: { type: "Point",  coordinates: [ 16.58, 52.25 ] },
                       $minDistance: 1000,
                       $maxDistance: 50000
                     }
                  }
              }*/

        ).toArray((err, posts) => {
            //console.log(posts);
            res.render('search', {posts});
        })
    })
});

app.get('/blog', (req, res) => {

    MongoClient.connect(process.env.MONGO, {}, async (error, client) => {
        
        const db = client.db(process.env.DB_NAME)
        const posts = db.collection('posts').find().toArray((err, posts) => {
            //console.log(posts);
            res.render('blog', {posts});
        })
    })
});

app.get('/add',  (req, res) => {
    res.render('form-post');
});

//Logout page
app.get('/logout', function(req, res){
    req.session.destroy(function(){
       console.log("user logged out.")
    });
    res.redirect(301, '/login');
 });


app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => {});