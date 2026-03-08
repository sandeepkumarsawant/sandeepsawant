# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install & Start
```bash
npm install
npm start
```

### Step 2: Login to Admin Panel
- Open `admin.html` in your browser
- Login with: `sandeep.sawant@samcoder.com` / `123`

### Step 3: Manage Users
- Click **"View Registered Users"** to see all users
- Click **"Register New User"** to add new users
- Click **"Delete User"** to remove users

---

## 📋 Quick Reference

### Admin Panel Features

| Feature | Button | Description |
|---------|--------|-------------|
| View Users | "View Registered Users" | See all registered users and admins |
| Add User | "Register New User" | Create new user or admin account |
| Delete User | "Delete User" (on user card) | Remove user from system |
| Add Project | "Add New Project" | Upload portfolio project |
| View Projects | "View All Projects" | See all uploaded projects |
| Manage Images | "Manage Images" | Update profile and gallery images |

### Test Accounts

**Admin Login:**
- Email: `sandeep.sawant@samcoder.com`
- Password: `123`

**User Login:**
- Email: `john.doe@example.com`
- Password: `hashed_password_123`

### File Locations

- **Users Data**: `data/users/userdetails.json`
- **Admin Data**: `data/admin/admindetails.json`
- **Server**: `server.js` (runs on port 3001)

### API Endpoints

```
GET    /api/users              - Get all users
POST   /api/register           - Register new user
POST   /api/login              - Login user
DELETE /api/users/:email       - Delete user
```

### Testing

Open `test-api.html` to test all API endpoints interactively.

---

## 🎯 Common Tasks

### Add a New User
1. Login to admin panel
2. Click "Register New User"
3. Fill in: Name, Email, Password, Role
4. Click "Register User"

### Delete a User
1. Login to admin panel
2. Click "View Registered Users"
3. Find the user
4. Click "Delete User" button
5. Confirm deletion

### View All Users
1. Login to admin panel
2. Click "View Registered Users"
3. See list with names, emails, passwords, roles

---

## ⚠️ Important Notes

- Server must be running on port 3001
- Passwords are stored in plain text (demo only)
- Deletions are permanent
- Changes save to JSON files immediately

---

## 🐛 Troubleshooting

**Server not starting?**
- Check if port 3001 is available
- Run `npm install` first

**Can't delete user?**
- Make sure you're logged in as admin
- Check server console for errors

**Changes not saving?**
- Verify server is running
- Check file permissions on `data/` folder

---

## 📚 More Documentation

- **README.md** - Full setup guide
- **ADMIN_GUIDE.md** - Detailed admin features
- **CHANGELOG.md** - Version history
