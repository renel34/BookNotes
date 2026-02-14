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

// Establish the connection to the database
db.connect();

const app = express();
const port = 3000;

// Middleware
// Parse JSON bodies for API requests
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to render the edit.ejs template with consistent data structure
const renderEdit = (
  res,
  { book = {}, books = [], action = "add", error = null } = {},
) => {
  // Renders the 'edit.ejs' view, passing in data for the book, a list of books, the current action (add/edit), and any errors.
  res.render("edit.ejs", { book, books, action, error });
};

// Display all books sorted by ID for the home page.
app.get("/", async (req, res) => {
  try {
    // Query the database to get all books, ordered by their ID
    const result = await db.query("SELECT * FROM books ORDER BY id");
    const books = result.rows;
    // Render the index.ejs template, passing the list of books
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

// GET route to display books sorted by rating in descending order
app.get("/rating", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

// GET route to display books sorted by the date they were read (most recent first)
app.get("/recency", async (req, res) => {
  try {
    // Query the database to get all books, ordered by the date read
    const result = await db.query(
      "SELECT * FROM books ORDER BY date_read DESC",
    );
    const books = result.rows;
    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
  }
});

// GET route to display the form for adding a new book
app.get("/add", (req, res) => {
  // Use the helper function to render the edit page in 'add' mode
  renderEdit(res, { book: {}, books: [], action: "add" });
});

// POST route to handle the submission of a new book
app.post("/add", async (req, res) => {
  try {
    // Destructure book details from the request body
    const { title, author, summary, date_read, rating, cover_i } = req.body;
    // Insert the new book into the database
    await db.query(
      'INSERT INTO books (title, author, summary, date_read, rating, "cover_i") VALUES ($1, $2, $3, $4, $5, $6)',
      [title, author, summary, date_read, rating, cover_i],
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// GET route to display the form for editing an existing book
app.get("/edit", async (req, res) => {
  try {
    // Get the book ID from the query parameters
    const bookId = req.query.bookId;
    // Fetch the book details from the database using its ID
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);
    // If the book is found, render the edit page with the book's data
    if (result.rows.length > 0) {
      renderEdit(res, { book: result.rows[0], action: "edit", books: [] });
    } else {
      // If no book is found, redirect to the home page
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

// POST route to handle the submission of an edited book
app.post("/edit", async (req, res) => {
  try {
    // Get the book ID and updated details from the request body
    const bookId = parseInt(req.body.bookId);
    const { title, author, summary, date_read, rating, cover_i } = req.body;
    // Update the book's details in the database
    await db.query(
      'UPDATE books SET title=$1, author=$2, summary=$3, date_read=$4, rating=$5, "cover_i"=$6 WHERE id=$7',
      [title, author, summary, date_read, rating, cover_i, bookId],
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// POST route to fetch book information from the Open Library API
app.post("/fetch-book", async (req, res) => {
  const { title, author } = req.body;

  // Validate that either a title or an author is provided
  if (!title && !author) {
    return res.render("edit.ejs", {
      book: {},
      books: [],
      action: "add",
      error: "Please enter a title or author to fetch book info.",
    });
  }

  try {
    // Construct the API URL based on whether a title or author was provided
    const url = title
      ? `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
      : `https://openlibrary.org/search.json?author=${encodeURIComponent(
          author,
        )}`;

    // Make a GET request to the Open Library API
    const response = await axios.get(url);
    const booksData = response.data.docs;

    // Handle cases where no results are found
    if (!booksData || booksData.length === 0) {
      return res.render("edit.ejs", {
        book: {},
        books: [],
        action: "add",
        error: "No results found. Please try a different search.",
      });
    }

    // Map the API response to a simplified book object format, taking the top 10 results
    const books = booksData.slice(0, 10).map((bookData) => ({
      title: bookData.title || "",
      author: bookData.author_name?.[0] || "",
      cover_i: bookData.cover_i?.toString() || "",
      first_publish_year: bookData.first_publish_year || "",
    }));

    // Render the edit page with the list of fetched books for the user to choose from
    res.render("edit.ejs", { book: {}, books, action: "add", error: null });
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    // Render the edit page with an error message if the API call fails
    res.render("edit.ejs", {
      book: {},
      books: [],
      action: "add",
      error: "An error occurred while fetching book data.",
    });
  }
});

// POST route to handle the selection of a book from the fetched results
app.post("/select-book", (req, res) => {
  const { title, author, cover_i } = req.body;

  // Create a book object with the selected details
  const book = {
    title,
    author,
    cover_i,
  };

  // Render the edit page again, this time pre-filling the form with the selected book's data
  renderEdit(res, { book, action: "add" });
});

// POST route to handle the deletion of a book
app.post("/delete", async (req, res) => {
  try {
    // Get the book ID from the request body
    const bookId = parseInt(req.body.bookId);
    // Delete the book from the database
    await db.query("DELETE FROM books WHERE id=$1", [bookId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
