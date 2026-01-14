# MIU Shuttle

MIU Shuttle (SmartSeat) is a comprehensive shuttle bus booking and management system designed for universities. It facilitates real-time seat booking for students and provides a powerful dashboard for administrators to manage buses, bookings, and notices.

## 🚀 Features

### For Students (Client)
- **Real-time Seat Booking:** View available seats and book in real-time.
- **Live Updates:** Socket.io integration ensures seat availability is updated instantly across all users.
- **Secure Authentication:** User registration and login protected by JWT.
- **Notices:** View important announcements from the administration.

### For Administrators (Admin Client)
- **Bus Management:** Add, update, and remove bus schedules and details.
- **Booking Management:** Oversee student bookings.
- **Notice Board:** Post and manage notices for students.
- **Dashboard:** Overview of system status.

## 🛠 Tech Stack

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Real-time Communication:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Other Tools:** Firebase Admin, Nodemailer, Morgan, Helmet, Rate Limit, Zod.

### Frontend (Client & Admin)
- **Framework:** React (Vite)
- **Styling:** TailwindCSS v4
- **State/Network:** Axios, Socket.io-client
- **UI Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Routing:** React Router DOM

## 📂 Project Structure

```
MIU Shuttle/
├── admin-client/    # React admin dashboard
├── client/          # React student application
├── server/          # Node.js/Express backend
└── README.md        # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "MIU Shuttle"
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN_STUDENT=http://localhost:5173
CORS_ORIGIN_ADMIN=http://localhost:5174
# Add other necessary variables (Firebase, Email, etc.)
```

Start the server:
```bash
npm run dev
```

### 3. Client Setup (Student App)
Open a new terminal, navigate to the `client` directory:
```bash
cd client
npm install
```

Start the client:
```bash
npm run dev
```
The app will run at `http://localhost:5173`.

### 4. Admin Setup (Dashboard)
Open a new terminal, navigate to the `admin-client` directory:
```bash
cd admin-client
npm install
```

Start the admin dashboard:
```bash
npm run dev
```
The dashboard will run at `http://localhost:5174`.

## 📜 Scripts

### Server
- `npm run dev`: Runs the server with Nodemon for hot-reloading.
- `npm start`: Runs the server in production mode (if configured).

### Client & Admin
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: (Client only) Runs ESLint.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
[ISC](https://opensource.org/licenses/ISC)
