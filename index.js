import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

// Connect to the PostgreSQL database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "mybook",
  password: "Papita01",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to render edit.ejs with consistent data
const renderEdit = (
  res,
  { book = {}, books = [], action = "add", error = null } = {}
) => {
  res.render("edit.ejs", { book, books, action, error });
};

// Routes
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id");
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

app.get("/rating", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

app.get("/recency", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM books ORDER BY date_read DESC"
    );
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

app.get("/add", (req, res) => {
  renderEdit(res, { book: {}, books: [], action: "add" });
});

app.post("/add", async (req, res) => {
  try {
    const { title, author, summary, date_read, rating, cover_i } = req.body;
    await db.query(
      'INSERT INTO books (title, author, summary, date_read, rating, "cover_i") VALUES ($1, $2, $3, $4, $5, $6)',
      [title, author, summary, date_read, rating, cover_i]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/edit", async (req, res) => {
  try {
    const bookId = req.query.bookId;
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);
    if (result.rows.length > 0) {
      renderEdit(res, { book: result.rows[0], action: "edit", books: [] });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const bookId = parseInt(req.body.bookId);
    const { title, author, summary, date_read, rating, cover_i } = req.body;
    await db.query(
      'UPDATE books SET title=$1, author=$2, summary=$3, date_read=$4, rating=$5, "cover_i"=$6 WHERE id=$7',
      [title, author, summary, date_read, rating, cover_i, bookId]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/fetch-book", async (req, res) => {
  const { title, author } = req.body;

  if (!title && !author) {
    return res.render("edit.ejs", {
      book: {},
      books: [],
      action: "add",
      error: "Please enter a title or author to fetch book info.",
    });
  }

  try {
    const url = title
      ? `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
      : `https://openlibrary.org/search.json?author=${encodeURIComponent(
          author
        )}`;

    const response = await axios.get(url);
    const booksData = response.data.docs;

    if (!booksData || booksData.length === 0) {
      return res.render("edit.ejs", {
        book: {},
        books: [],
        action: "add",
        error: "No results found. Please try a different search.",
      });
    }

    const books = booksData.slice(0, 10).map((bookData) => ({
      title: bookData.title || "",
      author: bookData.author_name?.[0] || "",
      cover_i: bookData.cover_i?.toString() || "",
      first_publish_year: bookData.first_publish_year || "",
    }));

    res.render("edit.ejs", { book: {}, books, action: "add", error: null });
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    res.render("edit.ejs", {
      book: {},
      books: [],
      action: "add",
      error: "An error occurred while fetching book data.",
    });
  }
});

app.post("/select-book", (req, res) => {
  const { title, author, cover_i } = req.body;

  const book = {
    title,
    author,
    cover_i,
  };

  renderEdit(res, { book, action: "add" });
});

app.post("/delete", async (req, res) => {
  try {
    const bookId = parseInt(req.body.bookId);
    await db.query("DELETE FROM books WHERE id=$1", [bookId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
