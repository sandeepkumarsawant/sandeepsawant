# User Authentication Backend

This backend server stores user registration data in JSON files instead of browser localStorage.

## Files Created

- `server-auth.js` - Express server for user authentication
- `users.json` - Stores user account data (ID, name, email, hashed password, role, creation date)
- `passwords.json` - Stores plain passwords for admin viewing (NOT recommended for production)

## How to Run

### 1. Install Dependencies (if not already installed)
```bash
cd "My Website"
npm install
```

### 2. Start the Authentication Server
```bash
npm run auth-server
```

Or for development with auto-restart:
```bash
npm run auth-dev
```

The server will run on: `http://localhost:3001`

### 3. Open Your Website
Open `admin.html` in your browser. The website will now connect to the backend server.

## API Endpoints

- `GET /api/users` - Get all registered users with passwords
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `DELETE /api/users/:email` - Delete a user

## Data Storage

All user data is stored in:
- `My Website/backend/users.json` - User accounts
- `My Website/backend/passwords.json` - Plain passwords

## Important Notes

⚠️ **Security Warning**: This implementation stores plain passwords for demonstration purposes only. 

For production use, you should:
- Never store plain passwords
- Use proper password hashing (bcrypt)
- Use HTTPS
- Implement JWT tokens
- Use a proper database (MySQL, MongoDB, etc.)
- Add input validation and sanitization
- Implement rate limiting
- Add CSRF protection

## Troubleshooting

If you get connection errors:
1. Make sure the auth server is running (`npm run auth-server`)
2. Check that port 3001 is not being used by another application
3. Check browser console for CORS errors
4. Make sure you're accessing the website via a web server (not file://)
