//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Ahoy there! Welcome aboard our platform that connects pirates at sea with their beloved ones back on shore. Our modern-day marvels of technology enable you to stay connected like never before, regardless of how far you roam across the vast ocean. Look below to see journal entries in blog format from pirates around the world.";
const aboutContent = "Our crew of seasoned sailors and tech wizards came together with a single goal - to make the life of our fellow pirates at sea easier and more enjoyable. We know how tough it is to be away from your loved ones for months on end, so we created a platform that allows you to stay in touch with them no matter where you are on the high seas.";
const contactContent = "Avast, me hearties! If ye have any questions, feedback, or just want to share yer thoughts on how we can improve our service, send us a message via our carrier pigeon or drop us a line via our telegraph. We're always keen to hear from ye!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(process.env.MDB_URI, { useUnifiedTopology: true, useNewUrlParser: true, });

const postSchema = mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get('/', function(req, res){
  Post.find({}, function(err, foundPosts){
    if(!err){
      res.render('home.ejs', {startingContent: homeStartingContent, posts: foundPosts});
    }
  });
});

app.get('/about', function(req, res){
  res.render('about.ejs', {aboutContent: aboutContent});
});

app.get('/contact', function(req, res){
  res.render('contact.ejs', {contactContent: contactContent});
});

app.get('/compose', function(req, res){
  res.render('compose.ejs');
});

app.post('/compose', function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save();

  res.redirect('/');
});

app.get('/:postId', function(req, res){
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId}, function(err, postFound){
    if(!err){
      res.render("post.ejs", {postTitle: postFound.title, postContent: postFound.content});
    }
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
port = 3000;
};

app.use(express.static('public'));

app.listen(port, function() {
  console.log("Server started on port 3000");
});
