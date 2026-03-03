# Admin Panel User Guide

## Quick Start

### 1. Start the Server
```bash
npm install
npm start
```

### 2. Login to Admin Panel
- Open `admin.html` in your browser
- Use test credentials:
  - Email: `sandeep.sawant@samcoder.com`
  - Password: `123`

## User Management Features

### View All Users
1. Click **"View Registered Users"** button in the dashboard
2. You'll see a list of all registered users and admins
3. Each user card displays:
   - Full name
   - Email address
   - Password (visible for demo purposes)
   - Join date
   - User role (USER, ADMIN, MODERATOR)
   - Delete button

### Add New User
1. Click **"Register New User"** button in the dashboard
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
   - User Role (Admin, User, or Moderator)
3. Click **"Register User"** button
4. The new user will be added to the appropriate JSON file:
   - Regular users → `data/users/userdetails.json`
   - Admins/Moderators → `data/admin/admindetails.json`

### Delete User
1. Go to **"View Registered Users"** section
2. Find the user you want to delete
3. Click the **"Delete User"** button on their card
4. Confirm the deletion in the popup dialog
5. The user will be permanently removed from the JSON file

### Important Notes
- Deleting a user is permanent and cannot be undone
- The user will be removed from the JSON file immediately
- If the user is currently logged in, they will be logged out
- You cannot delete yourself while logged in (safety feature)

## Other Admin Features

### Project Management
- **Add New Project**: Upload project details with images
- **View All Projects**: See all uploaded projects
- **Delete Project**: Remove projects from the portfolio

### Image Management
- **Profile Picture**: Update the hero section profile image
- **Journey Pictures**: Manage gallery images
- **Achievement Images**: Update achievement section images

## Data Storage

All data is stored in JSON files:
- **Users**: `data/users/userdetails.json`
- **Admins**: `data/admin/admindetails.json`

### JSON File Structure

#### User Entry
```json
{
  "id": 1234567890,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1-234-567-8900",
  "password": "mypassword123",
  "interest": "web-development",
  "agreeTerms": true,
  "createdDate": "2026-03-03T10:00:00Z",
  "updatedDate": "2026-03-03T10:00:00Z"
}
```

#### Admin Entry
```json
{
  "id": 1234567890,
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "admin",
  "isActive": true,
  "createdDate": "2026-03-03T10:00:00Z",
  "updatedDate": "2026-03-03T10:00:00Z"
}
```

## API Endpoints

The backend server provides these endpoints:

### GET /api/users
Returns all users and admins combined

### POST /api/register
Register a new user or admin
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phone": "+1-234-567-8900",
  "interest": "web-development"
}
```

### POST /api/login
Authenticate a user or admin
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### DELETE /api/users/:email
Delete a user by email address

## Security Notes

⚠️ **This is a demo application. For production use:**

1. **Never store plain text passwords**
   - Use bcrypt or similar hashing
   - Implement proper password policies

2. **Add authentication tokens**
   - Use JWT for session management
   - Implement token refresh mechanisms

3. **Add authorization checks**
   - Verify admin permissions before deletions
   - Implement role-based access control

4. **Validate all inputs**
   - Sanitize user inputs
   - Prevent SQL injection (if using database)
   - Prevent XSS attacks

5. **Use HTTPS**
   - Never send passwords over HTTP
   - Use SSL certificates in production

6. **Add rate limiting**
   - Prevent brute force attacks
   - Limit API requests per user

## Troubleshooting

### Users not showing up
- Check if the server is running
- Verify JSON files are not corrupted
- Check browser console for errors

### Cannot delete user
- Ensure you're logged in as admin
- Check server console for errors
- Verify the email exists in the JSON file

### Changes not saving
- Check file permissions on data folder
- Ensure server has write access
- Check for JSON syntax errors

## Tips

1. **Backup your data**: Copy JSON files before making bulk changes
2. **Test with dummy data**: Don't use real user information during testing
3. **Monitor server logs**: Check console output for errors
4. **Use browser DevTools**: Check Network tab for API responses
