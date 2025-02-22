const express = require("express");
const app = express();
const fs = require("node:fs");
const path = require("node:path");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {  logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsConfig');
const booksRoutes = require('./routes/booksRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookMongoRoutes = require('./routes/bookMongoRoutes');

//Middlewarelar


//Her zaman en üstte yazılmalıdır.
app.use(cors(corsOptions));

//request loglama middleware
app.use(logger);

//middleware json parse işlemi
app.use(express.json());

//content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//cookie parser middleware
app.use(cookieParser());

//Routes
app.use('/books', booksRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/bookmongo', bookMongoRoutes);



app.use(errorHandler);



module.exports = app;