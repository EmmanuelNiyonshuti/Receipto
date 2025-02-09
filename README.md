# Receipto

## Online Receipt Management Backend RESTful API

**Receipto** is a backend RESTful API designed to simplify the storage, categorization, and management of physical receipts. This API provides secure, scalable, and flexible options for uploading, categorizing, and retrieving receipts, with metadata extraction capabilities powered by **Tesseract.js** for OCR (optical character recognition).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Example Endpoints](#example-endpoints)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Secure JWT-based authentication.
- **File Uploads**: Handles receipt uploads with metadata extraction for easy categorization.
- **OCR Extraction**: Extracts text from receipts using Tesseract.js for easy search and retrieval.
- **Receipt Categorization**: Organizes receipts by categories, making them easier to manage.
- **Database Storage**: Stores receipt data in MongoDB for scalable storage.
- **RESTful API**: Well-documented endpoints for integration with frontend or other services.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer for handling multipart/form-data
- **OCR**: Tesseract.js for text extraction from receipts
- **Documentation**: Swagger for API documentation

---

## Getting Started

You can follow the instructions below to get a copy of the project running on your local machine.

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:EmmanuelNiyonshuti/Receipto.git

2. cd into the project directory
   ```
   cd Receipto
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a **.env** file in the root directory and add the following variables:

```bash
# Application
NODE_ENV=development # optional, for logging OCR progress
PORT=5000  # Optional; defaults to 3000 if not set

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWTs
JWT_SECRET=your_jwt_secret_key

# Cloudinary Storage
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### Database Setup
   - This project uses MongoDB as the primary database. Instead of using an ODM like **Mongoose**, this project interacts directly with MongoDB via the **MongoDB Node.js Driver** for a lightweight and flexible approach.  

Set up a local MongoDB instance or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database) and use its connection string in your **.env** file.

### Running the Server

To start the server in development mode, use:

```bash
npm run dev
```

The server should be running on [http://localhost:3000](http://localhost:5000).

---

## API Documentation
API documentation is available with Swagger.
You can view the API documentation here: [API Documentation](https://receipto.onrender.com/api-docs/)

Or if you are running it locally, After starting the server, visit:
```plaintext
http://localhost:3000/api-docs # use the port number that your server is running on
```

This documentation provides details about available endpoints, example responses, and request parameters.

---

## Example Endpoints

All endpoints are prefixed with `/api`.

### General

- `GET /status`: Check if the API is up and running.
- `GET /stats`: Get basic stats about the API.

### User Authentication Endpoints

- `POST /users/register`: Register a new user.
- `POST /users/login`: Log in an existing user.
- `GET /users/profile`: Retrieve profile information of the authenticated user.
- `PUT /users`: Update user profile (authenticated).
- `DELETE /users`: Delete user account (authenticated).

### Receipt Management Endpoints

- `POST /receipts`: Upload a new receipt.
- `GET /receipts`: Retrieve all receipts for the authenticated user.
- `GET /receipts/:id`: Retrieve a specific receipt by its ID.
- `GET /receipts/category/:category`: Retrieve receipts by category.

---

## Folder Structure

```plaintext
Receipto/
├── src/
│   ├── api/
│   │   ├── controllers/      # Handles requests and responses for each endpoint
│   │   ├── middlewares/      # Middleware functions (e.g., authUser for authentication)
│   │   ├── routes/           # Defines API routes and links them to controllers
│   │   ├── services/         # Business logic for handling tasks like file uploads, OCR, etc.
│   │   ├── utils/            # Helper functions and database connection logic
├── .env                      # Environment variables configuration
├── docs/                     # Swagger documentation setup and config files
├── README.md                 # Main project documentation
└── server.js                 # Sets up and starts the Express server
```
---

## Future Enhancements
- **Improved OCR**: Leverage more advanced OCR techniques for better accuracy and implement easy search and retrieval.
- **Analytics**: Provide insights into spending patterns by analyzing receipts.
- **User Dashboard**: Create a dashboard where users can visually interact with their receipts.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
