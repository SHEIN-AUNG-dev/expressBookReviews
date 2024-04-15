const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (Task 10)
public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
      try {
        // Prepare the JSON string
        let bookData = JSON.stringify(books, null, 4);
        resolve(bookData);
      } catch (error) {
        reject(error);  // Reject with any errors during stringification
      }
    })
    .then((bookData) => {
      res.send(bookData);
    })
    .catch((error) => {
        //logs error message
      console.error("Error sending book list:", error);
    });
  });

// Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let myPromise = new Promise ((resolve,reject)=>
  {
    try {
        //prepare requested book
        const isbn = req.params.isbn;
        let myBook = books[isbn];
        resolve (myBook);
    }
    catch(error){
        reject (error); //reject with error if the book is not found
    }
  })
  .then ((myBook)=>{
    res.send(myBook);
  })
  .catch((error)=>
  {
    console.error("Error Finding the Book", error);
  });
  
 });
  
// Get book details based on author (Task 12)
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    let myPromise = new Promise ((resolve,reject)=>{
        try {
            const myauthor = req.params.author;
            var myBooks = Object.values(books);
            const filtered_books=myBooks.filter((book)=>book.author==myauthor)
            resolve(filtered_books);
        }
        catch(error){
            reject(error);//return error if the book is not found

        }
    })
    .then((filtered_books)=>
    {
        if (filtered_books.length>0)
        {
          res.send(filtered_books);
        }
        else{
          res.send("No book found by this author");
        }
    })
    .catch((error)=>{
        console.error("invalid request",error);
    })



});

// Get all books based on title (task 13)
public_users.get('/title/:title',function (req, res) {
  //Write your code here
let myPromise = new Promise ((resolve,reject)=>{
    try {
        const myTitle = req.params.title;
        var myBooks = Object.values(books);
        const filtered_books=myBooks.filter((book)=>book.title==myTitle)//filtered with requested title
        resolve (filtered_books);
    }
    catch(error){
        reject(error)//reject with error if invalid input
    }
})
.then((filtered_books)=>{
    if (filtered_books.length>0){
        res.send(filtered_books);
    }
    else{
        res.send("Book with the given title not found");
    }
    
})
.catch((error)=>{
    console.error("Invalid title given",error);
})


 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});


module.exports.general = public_users;
