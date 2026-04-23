const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// 1. Obtener todos los libros usando async/await
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await Promise.resolve(books);
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// 2. Obtener libro por ISBN usando Promise
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found"));
        }
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err.message }));
});

// 3. Obtener libros por autor usando async/await
public_users.get('/author/:author', async function (req, res) {
    const author = decodeURIComponent(req.params.author);
    const filtered = [];
    
    for (let id in books) {
        if (books[id].author && books[id].author.toLowerCase() === author.toLowerCase()) {
            filtered.push({ id: id, ...books[id] });
        }
    }
    
    try {
        const result = await Promise.resolve(filtered);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// 4. Obtener libros por título usando Promise
public_users.get('/title/:title', function (req, res) {
    const title = decodeURIComponent(req.params.title);
    const filtered = [];
    
    for (let id in books) {
        if (books[id].title && books[id].title.toLowerCase() === title.toLowerCase()) {
            filtered.push({ id: id, ...books[id] });
        }
    }
    
    Promise.resolve(filtered)
        .then(result => res.status(200).json(result))
        .catch(() => res.status(500).json({ message: "Error fetching books by title" }));
});

// 5. Obtener reseña de un libro
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book && book.reviews) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(200).json({ reviews: {} });
    }
});

module.exports.general = public_users;
