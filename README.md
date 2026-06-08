# Book Notes

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![EJS](https://img.shields.io/badge/View-EJS-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack book tracking application built with **Node.js**, **Express**, **PostgreSQL**, and **EJS** that allows users to maintain a personal reading log, rate books, write summaries, and automatically retrieve book information from the Open Library API.

---

## Overview

Book Notes was developed to demonstrate full-stack web development concepts including:

- PostgreSQL database integration
- Third-party API consumption
- Server-side rendering
- CRUD operations
- Express routing and middleware
- Environment variable management

The application enables users to build and manage a personal reading collection while automatically retrieving book information and cover images from the Open Library API.

---

## Screenshot

> Replace this image with an actual screenshot of your application.

```text
screenshots/homepage.png
```

```markdown
![Homepage](./screenshots/homepage.png)
```

---

## Features

- Add books to a personal reading collection
- Edit existing book entries
- Delete books from the database
- Store ratings and reading dates
- Save personal summaries and notes
- Sort books by rating
- Sort books by reading date
- Retrieve book information from the Open Library API
- Display book cover images
- Persistent PostgreSQL data storage

---

## Technologies Used

| Technology | Purpose |
|------------|----------|
| Node.js | JavaScript Runtime |
| Express.js | Web Framework |
| PostgreSQL | Relational Database |
| pg | PostgreSQL Client |
| EJS | Server-Side Templating |
| Axios | HTTP Requests |
| Dotenv | Environment Variables |
| HTML5 | Structure |
| CSS3 | Styling |

---

## Skills Demonstrated

This project demonstrates practical experience with:

- Full-Stack Web Development
- CRUD Operations
- Database Design
- PostgreSQL
- SQL Queries
- API Integration
- Express.js
- EJS Templating
- Middleware Configuration
- Error Handling
- Environment Variable Security
- Git & GitHub Version Control

---

## Architecture

The application follows a traditional server-rendered architecture:

```text
Browser
   │
   ▼
Express Server
   │
   ├── PostgreSQL Database
   │
   └── Open Library API
```

### Request Flow

1. User submits a book search.
2. Express processes the request.
3. The application retrieves data from the Open Library API.
4. Book information is displayed to the user.
5. User adds ratings and notes.
6. Data is stored in PostgreSQL.
7. EJS renders updated content.

---

## Project Structure

```text
Book-Notes/
│
├── public/
│   ├── css/
│   ├── images/
│   └── assets/
│
├── views/
│   ├── partials/
│   ├── index.ejs
│   ├── edit.ejs
│   └── add.ejs
│
├── .env
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/renel34/BookNotes.git
```

### Navigate to the Project Folder

```bash
cd BookNotes
```

### Install Dependencies

```bash
npm install
```

### Create a `.env` File

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=booknotes
PORT=3000
```

### Start PostgreSQL

Make sure your PostgreSQL server is running and the database has been created.

### Run the Application

```bash
node index.js
```

### Open Your Browser

```text
http://localhost:3000
```

---

## Database

The application uses PostgreSQL to persist data.

Each book record contains:

- Title
- Author
- Summary
- Date Read
- Rating
- Cover Image Identifier

Unlike applications that store data in memory, all book information remains available after the server restarts.

---

## API Integration

The application integrates with the **Open Library API** to automatically retrieve:

- Book titles
- Author information
- Cover image identifiers
- Publication details

This reduces manual data entry and improves the overall user experience.

---

## How It Works

### Adding a Book

1. Search for a book title or author.
2. Select a matching result.
3. Review the automatically populated information.
4. Add your personal rating and notes.
5. Save the book to your collection.

### Managing Your Collection

Users can:

- View all books
- Edit book details
- Update ratings
- Modify summaries
- Delete books from the collection

---

## Challenges Solved

During development I gained experience with:

- PostgreSQL database connectivity
- Parameterized SQL queries
- API integration using Axios
- Handling asynchronous operations
- Express middleware configuration
- Dynamic page rendering with EJS
- Error handling and validation

---

## What I Learned

This project helped me develop practical experience with:

- Building database-driven web applications
- Connecting Node.js to PostgreSQL
- Writing SQL CRUD operations
- Consuming external APIs
- Managing asynchronous JavaScript code
- Structuring Express applications
- Securing configuration using environment variables

---

## Author

**René Laplante**

- GitHub: https://github.com/renel34
- Email: laplanter96@gmail.com
- Portfolio: *Add your portfolio URL here*

---

## License

This project is licensed under the MIT License.

---

### ⭐ If you found this project interesting, consider giving it a star on GitHub.
