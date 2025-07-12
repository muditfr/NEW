# DevTinder Backend

A Node.js/Express backend for the DevTinder application - a dating app for developers.

## Features

- User authentication (signup/login/logout)
- User profiles with validation
- Connection requests system
- Feed system to discover other users
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `PORT`: Server port (default: 7777)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:5173)

4. Start the server:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Profile
- `GET /profile/view` - Get user profile
- `PATCH /profile/edit` - Update user profile

### Connection Requests
- `POST /request/send/:status/:toUserId` - Send connection request
- `POST /request/review/:status/:requestId` - Accept/reject connection request

### User Routes
- `GET /user/requests/received` - Get received connection requests
- `GET /user/connections` - Get user connections
- `GET /feed` - Get user feed (pagination supported)

## Project Structure

```
src/
├── config/
│   └── database.js       # Database configuration
├── middlewares/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── user.js          # User model
│   └── connectionRequest.js  # Connection request model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── profile.js       # Profile routes
│   ├── request.js       # Connection request routes
│   └── userroute.js     # User-related routes
├── utils/
│   └── validation.js    # Validation utilities
└── app.js               # Main application file
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation
- Environment variable configuration
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC