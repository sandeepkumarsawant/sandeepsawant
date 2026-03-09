# Quick Start Guide - File-Based User Storage

Your website now stores user data in actual files instead of browser localStorage!

## 📁 Where User Data is Stored

User data is now stored in these files:
```
My Website/
└── backend/
    ├── users.json       ← All user accounts stored here
    └── passwords.json   ← User passwords stored here
```

## 🚀 How to Start

### Step 1: Open Terminal/Command Prompt
Navigate to your website folder:
```bash
cd "My Website"
```

### Step 2: Start the Authentication Server
```bash
npm run auth-server
```

You should see:
```
🚀 Authentication Server running on http://localhost:3001
📁 Users stored in: [path]/users.json
🔑 Passwords stored in: [path]/passwords.json
```

### Step 3: Open Your Website
Open `admin.html` in your browser and start registering users!

## ✅ What Changed

**Before:**
- Users stored in browser localStorage
- Data lost when clearing browser
- Not accessible from other devices

**After:**
- Users stored in `backend/users.json` file
- Passwords stored in `backend/passwords.json` file
- Data persists even after clearing browser
- Can be accessed from any device (when server is running)

## 📝 View Stored Data

You can open and view the JSON files directly:

**users.json** example:
```json
[
  {
    "id": 1708176000000,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashed_password",
    "createdAt": "2024-02-17T10:00:00.000Z",
    "role": "admin"
  }
]
```

**passwords.json** example:
```json
{
  "john@example.com": "password123",
  "jane@example.com": "mypassword"
}
```

## 🔄 How It Works

1. When you register a user, the data is sent to the backend server
2. Server saves it to `users.json` and `passwords.json`
3. When you login, server checks the files
4. When you view users, data is loaded from files

## ⚠️ Important Notes

- Keep the auth server running while using the website
- The server must be running on port 3001
- Don't delete the JSON files (they contain your user data)
- This is for development/demo purposes only

## 🛑 Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## 📞 Troubleshooting

**Problem:** "Failed to register user" error
**Solution:** Make sure the auth server is running (`npm run auth-server`)

**Problem:** Port 3001 already in use
**Solution:** Stop other applications using port 3001, or change the port in `backend/server-auth.js`

**Problem:** CORS errors in browser console
**Solution:** Make sure you're accessing the website through a web server, not directly opening the HTML file
