# Receipto

## Online Receipt Management Backend RESTful API

**Receipto** is a backend application designed to simplify the storage, categorization, and management of digital receipts. This API provides secure, scalable, and flexible options for uploading, categorizing, and retrieving receipts, with metadata extraction capabilities powered by **Tesseract.js** for OCR (optical character recognition). 

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
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer for handling multipart/form-data
- **OCR**: Tesseract.js for text extraction from receipts
- **Documentation**: Swaagger for API documentation

---

## Getting Started

Follow these instructions to get a copy of the project running locally.

### Installation

1.    Clone the repository
   ```bash
   git clone https://github.com/your-username/receipto.git
   cd receipto
    ```
    
2.  Install dependencies
    ```bash
    npm install
    ```
### Environment Variables

Create **.env** file in the root directory and add the following variables.

```bash
PORT =5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Database SetUp
This project uses MongoDB for data storage. Set up a local MongoDB instance or create a free cluster on [MongoDB Atlas](#https://www.mongodb.com/atlas/database) and use its connection string in your .env file.

### Running the server
To start the server, use:
    ```bash
    npm run dev
    ```
    This command will run the server in development mode
    ***http://localhost:3000***

## API Documentation
API documentation is available through Swagger. After starting the server, visit:
    ```bash
    http://localhost:3000/api-docs
    Here you can explore available endpoints, test functionality, and see example responses.
    ```

## Example Endpoints


 
 
 
 
 
 
 
 
 
 
 
 
 
 


