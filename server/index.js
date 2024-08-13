require("dotenv").config();
const express = require("express");
const cors = require("cors");
const booksRouter = require("./routs/books");
const usersRouter = require("./routs/users");
//
//
//
//
//
//
//
const app = express();

app.use(express.json());
app.use(cors());

app.use("/books", booksRouter);
app.use("/accounts", usersRouter);

app.listen(5000, () => {
	console.log(`Server started on 5000`);
});
