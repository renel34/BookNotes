# My Reading Journal

## Description

My Reading Journal is a web application that allows users to keep track of books they've read, rate them, and add personal notes. It's built with Node.js, Express, and PostgreSQL, providing a simple yet powerful way to manage your reading list and reflections.

## Features

- Add books to your reading journal
- Edit existing book entries
- Delete book entries
- Rate books on a 5-star scale
- Add personal summaries or notes for each book
- Sort books by rating or recency
- Fetch book information from the Open Library API
- Responsive design for various screen sizes

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- EJS (Embedded JavaScript templating)
- Axios for API requests
- HTML/CSS for frontend

## Installation

1. Clone the repository: git clone https://github.com/renel34/BookNotes.git
2. Navigate to the project directory: cd BookNotes
3. Install dependencies: npm install
4. Set up your PostgreSQL database and update the connection details in "index.js":
   const db = new pg.Client({
   user: "your_username",
   host: "localhost",
   database: "your_database_name",
   password: "your_password",
   port: 5432,
   });
5. Start the server: node index.js
6. Open your browser and visit http://localhost:3000

Usage:
To add a new book, click on the "Add a Book" button and fill in the details.
To edit or delete a book, use the respective buttons on each book card.
Use the "Sort by Rating" or "Sort by Recency" buttons to reorder your book list.
When adding a book, you can fetch book information from the Open Library API by entering a title or author.

Contributing:
Contributions are welcome! Please feel free to submit a Pull Request.

License:
This project is open source and available under the MIT License.

Contact:
René Laplante - laplanter96@gmail.com
Project Link: https://github.com/renel34/BookNotes.git
