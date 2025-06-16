# 🛒 E-commerce Backend API #**(on-going)**

A powerful and modular backend-only E-commerce REST API built with **Node.js**, **Express.js**, and **MongoDB**. It includes user authentication, product management, cart operations, order placement, and admin-only controls — tested using **Postman**.

---

## 📘 Overview

This project is the server-side backend API for an E-commerce platform. It is built with best practices using MVC architecture and supports:

- User Registration & Login with JWT Authentication
- Role-based access (Admin vs. Customer)
- Full Product CRUD operations
- Cart management
- Order placement
- Admin-only controls for product and order management

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** + Mongoose
- **JWT** (JSON Web Tokens)
- **bcryptjs**
- **dotenv**
- **cors**
- **multer**
- **cloudinary**
- **joi** (Server Side Validation)
- **multer-storage-cloudinary** (to store image)

---

## 📁 Folder Structure

ecommerce-backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── validation/
├── .env
├── server.js
└── package.json

🔗 API Routes Overview
| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a new user    |
| POST   | `/api/auth/login`    | Login with credentials |

🛍️ Product APIs
| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/products`     | Get all products             |
| GET    | `/api/products/:id` | Get single product           |
| POST   | `/api/products`     | Add new product (admin only) |
| PUT    | `/api/products/:id` | Update product (admin only)  |
| DELETE | `/api/products/:id` | Delete product (admin only)  |

🛒 Cart APIs
| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| POST   | `/api/cart/:itemId` | Add product to cart (user only) |
| GET    | `/api/cart`         | Get current user's cart         |
| PUT    | `/api/cart/:itemId` | Update quantity of a cart item  |
| DELETE | `/api/cart/:itemId` | Remove item from cart           |

📦 Order APIs
| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/orders`       | Place order from cart (user only) |
| GET    | `/api/orders`       | Get current user's orders         |
| GET    | `/api/admin/orders` | Get all orders (admin only)       |

🔐 Admin Operations
| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/admin/users`    | Get all users (admin only)     |
| GET    | `/api/admin/orders`   | View all orders (admin only)   |
| GET    | `/api/admin/products` | View all products (admin only) |

🧪 API Testing
Use Postman to test all API endpoints.

Send JWT token in headers for protected routes:
Authorization: Bearer <your_token_here>
