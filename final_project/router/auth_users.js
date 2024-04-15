const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
    }//returns boolean
//write code to check is the username is valid


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const review = req.query.review;
   const rating = req.query.rating;
   const isbn = req.params.isbn;
   const username =req.session.authorization.username;
  
   //try to find book
   try {
    const book = books[isbn];
    const newReview = {
        username: username,
        review: review,
        rating: rating
      };
    if(book){
       
            book.reviews[username]=newReview;
            return res.send("Review added");
        }
    else {
        return res.send("book not found");
    }
   }
 
   catch(error)
   {
    return res.status(500).send("Server Error!");
   }
   
   
});
//delete a review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const username =req.session.authorization.username;
    const isbn = req.params.isbn;
    delete books[isbn].reviews[username];

    return res.send('Successfully deleted');

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
