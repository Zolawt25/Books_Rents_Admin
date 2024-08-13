const pool = require("../db");
//
//
//
//
//
//
//
//
const getAllBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
const createBooks = async (req, res) => {
  const {
    bookno,
    status,
    price,
    category,
    author,
    quantity,
    coverimg,
    bookname,
    owner,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (bookno, status, price, category, author, quantity, coverimg, bookname, owner) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        bookno,
        status,
        price,
        category,
        author,
        quantity,
        coverimg,
        bookname,
        owner,
      ]
    );
    const addBook = result.rows[0];
    res.status(201).json(addBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
const getBooks = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
const updateBooks = async (req, res) => {
  const { id } = req.params;
  const {
    bookno,
    status,
    price,
    category,
    author,
    quantity,
    coverimg,
    bookname,
    owner,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET bookno = $1, status = $2, price = $3, category = $4, author = $5, quantity = $6, bookname = $7, owner = $8 WHERE id = $9 RETURNING *",
      [bookno, status, price, category, author, quantity, bookname, owner, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
const deleteBooks = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ msg: "deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBooks,
  createBooks,
  updateBooks,
  deleteBooks,
};
