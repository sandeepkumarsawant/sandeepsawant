# SamCoder Portfolio Website

A modern portfolio website with comprehensive admin panel and user management system.

## Features

### Portfolio Website
- Responsive portfolio website
- 12+ project showcases
- About section with skills
- Contact information
- Neon-themed UI design

### Admin Panel
- Admin registration and login
- Project upload with image preview
- Project management (view, delete)
- User management dashboard
- Statistics and analytics
- Secure authentication

### User System
- User registration with detailed profile
- User login with remember me option
- Personal dashboard
- Profile management
- Activity tracking
- Interest-based categorization

## Setup Instructions

### Frontend Only (Current Implementation)

The system uses localStorage for data persistence. No backend setup required.

1. Open `index.html` in your browser to view the portfolio
2. Click "Admin" to access admin panel or "Login" for user login
3. Register accounts as needed

### Admin Panel Access
1. Go to `admin.html`
2. Register a new admin account
3. Login to access dashboard
4. Upload projects with images
5. Manage users and view statistics

### User Registration & Login
1. Go to `register.html` to create a user account
2. Fill in your details and select area of interest
3. Login at `user-login.html`
4. Access your personal dashboard

### Backend Setup (Optional - For Production)

To use the Node.js backend with proper authentication:

1. Install Node.js from https://nodejs.org/

2. Install dependencies:
```bash
cd "My Website"
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the website:
   - Portfolio: http://localhost:3000/index.html
   - Admin Panel: http://localhost:3000/admin.html

## Admin Panel Features

- Admin registration with validation
- Secure login system
- **Project upload with image preview**
- **Projects automatically appear on main portfolio page**
- **Complete Image Management System**
  - Update profile picture (hero section)
  - **Dynamic Journey Pictures Management**
    - Default 3 journey pictures included
    - Add unlimited journey pictures
    - Update existing journey pictures
    - Delete any journey picture (including defaults)
    - Each with title and description
  - **Dynamic Achievement Management**
    - Default 2 achievements included (My Bharat Quiz, Skill Spardha)
    - Add unlimited achievements
    - Update existing achievements
    - Delete any achievement (including defaults)
    - Each with title and description
- Project management (add, view, delete)
- User management dashboard
- Statistics tracking
- Quick action buttons
- Responsive design

### First Time Setup:

When you first open the website, default content is automatically initialized:
- 3 Journey Pictures (At Work, Creative Process, Professional Life)
- 2 Achievements (My Bharat Quiz, Skill Spardha)

These appear in both the admin panel (for management) and main website (for display).

### Journey Picture Management:

1. **Access**: Login → "Manage Images" → Journey Pictures section
2. **View Defaults**: See 3 pre-loaded journey pictures
3. **Add**: Enter title, description, upload image → "Add Journey Picture"
4. **Update**: Select new image on any card → Click "Update"
5. **Delete**: Click "Delete" on any card (including defaults) → Confirm
6. **View**: Refresh main page to see all changes in gallery section

### Achievement Management:

1. **Access**: Login → "Manage Images" → Achievement Images section
2. **View Defaults**: See 2 pre-loaded achievements
3. **Add**: Enter title, description, upload image → "Add Achievement"
4. **Update**: Select new image on any card → Click "Update"
5. **Delete**: Click "Delete" on any card (including defaults) → Confirm
6. **View**: Refresh main page to see all changes in achievements section

### Project Management:

1. **Upload**: Admin uploads project through admin panel
2. **Storage**: Project saved to browser's localStorage
3. **Display**: Automatically appears on portfolio page
4. **Delete**: Remove projects from admin panel

**Note**: All data stored in browser localStorage. For production, use a backend database.

## User Features

- User registration with profile details
- Secure login with remember me
- Personal dashboard
- Profile viewing
- Activity statistics
- Interest-based categorization
- Quick access to portfolio projects

## Technologies Used

- HTML5
- CSS3 (with neon effects)
- JavaScript (ES6+)
- Node.js & Express (backend)
- JWT for authentication
- bcrypt for password hashing

## Security Notes

⚠️ The current localStorage implementation is for demonstration purposes only.

For production use:
1. Use the provided Node.js backend
2. Change the SECRET_KEY in server.js
3. Use a real database (MongoDB, PostgreSQL, etc.)
4. Implement HTTPS
5. Add rate limiting
6. Add input sanitization

## File Structure

```
My Website/
├── index.html              # Main portfolio page
├── admin.html              # Admin panel
├── user-login.html         # User login page
├── register.html           # User registration page
├── style.css               # Main styles
├── css/
│   └── admin.css           # Admin & auth styles
├── script/
│   ├── admin.js            # Admin panel logic
│   ├── user-login.js       # User login logic
│   └── user-register.js    # User registration logic
├── server.js               # Backend server (optional)
├── package.json            # Node.js dependencies
└── README.md               # This file
```

## Contact

- Instagram: https://www.instagram.com/_sandeep_sawant/
- YouTube: https://www.youtube.com/@_sandeep_sawant
- Facebook: https://www.facebook.com/profile.php?id=100046152923110

## License

MIT License - Feel free to use this for your own projects!
