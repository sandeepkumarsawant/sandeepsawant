# Portfolio Website with JSON File Storage

This portfolio website now stores all user and admin registrations in JSON files instead of localStorage.

## Features

### Admin Panel Features

1. **User Management**
   - Register new users (both regular users and admins)
   - View all registered users with their details
   - Delete users from the system
   - See user passwords (for demo purposes)

2. **Project Management**
   - Upload new projects with images
   - View all projects
   - Delete projects

3. **Image Management**
   - Update profile pictures
   - Manage journey pictures
   - Manage achievement images

### User Features

- User registration with email validation
- User login with authentication
- View personal dashboard
- Profile management

## Setup Instructions

### 1. Install Dependencies

First, install the required Node.js packages:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable cross-origin requests

### 2. Start the Backend Server

Run the server:

```bash
npm start
```

The server will start on `http://localhost:3001`

You should see: `Server running on http://localhost:3001`

### 3. Open the Website

Open any of the HTML files in your browser:
- `index.html` - Main portfolio page
- `register.html` - User registration page
- `user-login.html` - User login page
- `admin.html` - Admin panel
- `test-api.html` - API testing page (for developers)

## How It Works

### Data Storage

All user and admin data is stored in JSON files:

- **User registrations**: `data/users/userdetails.json`
- **Admin registrations**: `data/admin/admindetails.json`

### API Endpoints

The backend server (`server.js`) provides these endpoints:

- `GET /api/users` - Get all users and admins
- `POST /api/register` - Register a new user or admin
- `POST /api/login` - Login user or admin
- `DELETE /api/users/:email` - Delete a user by email

### Password Storage

Passwords are now stored as plain text in the JSON files for demo purposes. In production, you should:
1. Hash passwords using bcrypt or similar
2. Never store plain passwords
3. Use environment variables for sensitive data

## Testing the System

### Test User Registration

1. Open `register.html`
2. Fill in the registration form
3. Submit the form
4. Check `data/users/userdetails.json` - your new user should be added

### Test Admin Registration

1. Open `admin.html`
2. Click "Register" to create a new admin account
3. Fill in the form and submit
4. Check `data/admin/admindetails.json` - your new admin should be added

### Test Login

1. Open `user-login.html` or `admin.html`
2. Use credentials from the JSON files:
   - Admin: `sandeep.sawant@samcoder.com` / `123`
   - User: `john.doe@example.com` / (check the password in userdetails.json)
3. Login should work and show the dashboard

### Test User Management

1. Login to admin panel (`admin.html`)
2. Click "View Registered Users" to see all users
3. Each user card shows:
   - Name, email, password, join date, and role
   - Delete button to remove the user
4. Click "Delete User" to remove a user from the system
5. The user will be removed from the JSON file immediately
6. Click "Register New User" to add a new user directly from admin panel

### Test API Endpoints

1. Open `test-api.html` in your browser
2. Use the test buttons to verify each API endpoint
3. Check the results displayed on the page

## Existing Test Accounts

### Admin Accounts (from admindetails.json)
- Email: `sandeep.sawant@samcoder.com` | Password: `123`
- Email: `sandeep@admin.com` | Password: `456`
- Email: `sandeep@moderator.com` | Password: `789`

### User Accounts (from userdetails.json)
- Email: `john.doe@example.com` | Password: `hashed_password_123`
- Email: `sarah.johnson@example.com` | Password: `hashed_password_456`
- Email: `mike.chen@example.com` | Password: `hashed_password_789`

Note: The existing users have hashed passwords. New registrations will use plain text passwords.

## Important Notes

1. **Server Must Be Running**: The backend server must be running for registration and login to work
2. **Port 3001**: Make sure port 3001 is available
3. **CORS Enabled**: The server allows requests from any origin for development
4. **File Permissions**: Ensure the server has write permissions to the `data` folder

## Troubleshooting

### "Failed to connect to server"
- Make sure the server is running (`npm start`)
- Check if port 3001 is available
- Check browser console for errors

### "Failed to save user"
- Check file permissions on `data/users/` and `data/admin/` folders
- Ensure JSON files are valid JSON format

### Registration not working
- Open browser console (F12) to see error messages
- Check server console for error logs
- Verify the JSON files are not corrupted

### Cannot delete user
- Ensure you're logged in as admin
- Check server console for errors
- Verify the email exists in the JSON file

## Documentation

- **ADMIN_GUIDE.md** - Detailed guide for using the admin panel
- **test-api.html** - Interactive API testing page

## Future Improvements

- Add password hashing (bcrypt)
- Add user authentication tokens (JWT)
- Add input validation and sanitization
- Add rate limiting
- Add database support (MongoDB, PostgreSQL)
- Add email verification
- Add password reset functionality
- Prevent admins from deleting themselves
- Add user edit functionality
- Add bulk user operations
