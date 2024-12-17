# **Wallet App**

This repository contains a complete **Wallet Application** with three key parts:

1. **wallet-admin**: Admin panel for managing users and wallets.
2. **wallet-backend**: Backend server for handling APIs, authentication, and data.
3. **WalletApp**: Frontend/mobile app for users to manage their wallets.

---

## **Folder Structure**


---

## **1. Wallet-Backend**

### **Overview**
The backend is built with **Node.js**, **Express.js**, and **Prisma ORM**. It handles:

- User authentication (JWT)
- Wallet creation, updates, and deletion
- Transactions (send/receive)
- User management APIs

### **Installation**

1. Navigate to the `wallet-backend` folder:

   ```bash
   cd wallet-backend
Install dependencies:

bash

npm install
Set up the environment variables by creating a .env file:

env
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
Start the backend server:

bash
npm start
API server will run at:


http://localhost:3000/api


![image](https://github.com/user-attachments/assets/cb695fed-078c-4267-a2bb-133956c2b954)



