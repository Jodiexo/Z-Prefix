# Z-Prefix

## VERY IMPORTANT!
-When you register a account you must logout first then login with your email and password in order to see your items.
-Once you login the login dialogue box with still be open but you are able to see your items as well as edit/add items.


## Overview

This Inventory Management System is a web application that allows users to manage their inventory items. It provides features for creating, reading, updating, and deleting inventory items, as well as user authentication.

## Features

- User Registration and Authentication
- Create, Read, Update, and Delete (CRUD) operations for inventory items
- Public view of all items (limited information)
- Detailed view of individual items
- Pagination for item lists
- Responsive design for various screen sizes

## Technologies Used

- Frontend:
  - React.js
  - React Router for navigation
  - Axios for API requests
- Backend:
  - Node.js
  - Express.js
  - PostgreSQL database
  - Knex.js as SQL query builder
- Authentication:
  - JSON Web Tokens (JWT)

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/Jodiexo/Z-Prefix
   cd Z-Prefix
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Update the database configuration in `server/knexfile.js`

4. Run migrations:
   ```
   cd server
   npx knex migrate:latest
   ```

5. Set up environment variables:
   - Create a `.env` file in the `server` directory
   - Add the following variables:
     ```
     PORT=3000
     JWT_SECRET=your_jwt_secret_here
     ```

6. Start the servers:
   ```
   # Start backend server
   cd server
   npm run dev

   # In a new terminal, start frontend server
   cd client/my-app
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3001`

## Usage

1. Register a new account or log in with existing credentials.
2. View the list of inventory items on the main page.
3. Click on an item to view its details.
4. Use the "Add Item" button to create a new inventory item.
5. Edit or delete items using the respective buttons on each item card.