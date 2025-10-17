
# MovieTicket-Fullstack

A full-stack movie ticket booking application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project allows users to browse movies, select showtimes, and book tickets online.

## 🚀 Live Demo

Experience the application live at:  
👉 [https://movie-ticket-fullstack-3tx1.vercel.app/](https://movie-ticket-fullstack-3tx1.vercel.app/)

## 🛠️ Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (Frontend), Heroku (Backend)

## 📁 Project Structure

```
MovieTicket-Fullstack/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   └── src/                 # React components and hooks
├── server/                  # Node.js backend
│   ├── config/              # Configuration files
│   ├── controllers/         # Route handlers
│   ├── models/              # MongoDB models
│   └── routes/              # Express routes
└── .gitignore               # Git ignore file
```

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Kush146/MovieTicket-Fullstack.git
cd MovieTicket-Fullstack
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace `your_mongodb_connection_string` with your MongoDB URI and `your_jwt_secret` with a secret key for JWT.

### 4. Run the Application Locally

#### Backend

```bash
cd server
npm start
```

#### Frontend

```bash
cd client
npm start
```

The backend will run on [http://localhost:5000](http://localhost:5000), and the frontend will run on [http://localhost:3000](http://localhost:3000).

## 🚀 Deployment

### Frontend (Vercel)

1. Push the `client` directory to a new GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and create a new project.
3. Import the GitHub repository containing the `client` directory.
4. Vercel will automatically detect the React application and deploy it.

### Backend (Heroku)

1. Push the `server` directory to a new GitHub repository.
2. Sign in to [Heroku](https://heroku.com/) and create a new application.
3. Connect the GitHub repository containing the `server` directory to the Heroku app.
4. Set up the environment variables in the Heroku dashboard:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_jwt_secret`
5. Deploy the application.

## 📌 Notes

- Ensure that your MongoDB database is accessible and the URI is correctly set in the `.env` file.
- The JWT secret should be kept secure and not exposed publicly.
- For production environments, consider using services like MongoDB Atlas for database hosting and setting up SSL for secure connections.
