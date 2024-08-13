const express = require("express");
const {
  getAllBooks,
  createBooks,
  getBooks,
  updateBooks,
  deleteBooks,
} = require("../controllers/books");
const router = express.Router();

router.get("/", getAllBooks);
router.post("/", createBooks);
router.get("/:id", getBooks);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);

module.exports = router;
