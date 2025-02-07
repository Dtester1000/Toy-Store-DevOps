# 🧸 Toy Store API

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Description

The Toy Store API is a robust backend service designed to manage a toy inventory system.
It provides endpoints for creating, reading, updating, and deleting toy records, as well as user authentication and authorization features.

## 📑 Table of Contents

- [Description](#-description)
- [Table of Contents](#-table-of-contents)
- [Technologies Used](#-technologies-used)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database](#-database)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🛠 Technologies Used

- Node.js (v14.x or later)
- Express.js (v4.x)
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Joi (for request validation)
- Bootstrap (for API documentation UI)

## 🚀 Installation

1. Clone the repository:
https://github.com/Dtester1000/Toy-Store.git

2. Navigate to the project directory:
cd Toy-Store

3. Install dependencies:
npm install

4. Set up environment variables:
- Create a `.env` file in the root directory
- Add the following variables:
  ```
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017/toystore
  JWT_SECRET=your_jwt_secret_here
  NODE_ENV=production / development
  ```

## 💻 Usage

1. Start the server:
npm start

2. Access the API documentation at `http://localhost:3000/api-docs`
3. Use Postman or a similar tool to interact with the API endpoints.

## 🔗 API Endpoints

### Toy Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /toys | Get 10 toys (with optional skip parameter) |
| GET    | /toys/count | Get total count of toys |
| GET    | /toys/search | Search toys by name or info |
| GET    | /toys/prices | Get toys within a price range |
| GET    | /toys/category/:catname | Get toys by category |
| POST   | /toys | Create a new toy (requires authentication) |
| GET    | /toys/:id | Get a single toy by ID |
| PUT    | /toys/:id | Update a toy by ID (requires authentication) |
| DELETE | /toys/:id | Delete a toy by ID (requires authentication) |

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /register | Register a new user |
| POST   | /login | Log in a user |
| POST   | /logout | Log out a user |

For detailed information on request/response formats, please refer to the API documentation.

## 🔐 Authentication

- Authentication is implemented using JSON Web Tokens (JWT).
- Upon successful login, a JWT is set as an HTTP-only cookie.
- Protected routes require a valid JWT in the cookie to access.
- To authenticate, include the JWT in the `Authorization` header as a Bearer token:
Authorization: Bearer <your_jwt_token>


## 🗄️ Database

- MongoDB is used as the database.
- Ensure MongoDB is running on your system or provide a valid MongoDB URI in the `.env` file.
- The application will create the necessary collections automatically.


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Create a pull request

Please ensure your code adheres to the existing style and all tests pass.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

~ Dtester1000 ~

For any additional questions or concerns, please open an issue or contact the author directly.
