const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const USERS_FILE = path.join(__dirname, 'data', 'users', 'userdetails.json');
const ADMIN_FILE = path.join(__dirname, 'data', 'admin', 'admindetails.json');

// Helper function to read JSON file
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Simple hash function (same as frontend)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Get all users (both regular users and admins)
app.get('/api/users', async (req, res) => {
    const usersData = await readJSONFile(USERS_FILE);
    const adminData = await readJSONFile(ADMIN_FILE);
    
    if (!usersData || !adminData) {
        return res.status(500).json({ error: 'Failed to read user data' });
    }

    // Combine users and admins with plain passwords
    const allUsers = [
        ...usersData.users.map(u => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            phone: u.phoneNumber || 'Not provided',
            interest: u.interest || 'N/A',
            password: u.password,
            plainPassword: u.password, // Show actual password
            createdAt: u.createdDate,
            role: 'user'
        })),
        ...adminData.admins.map(a => ({
            id: a.id,
            name: a.fullName,
            email: a.email,
            password: a.password,
            plainPassword: a.password, // Show actual password
            createdAt: a.createdDate,
            role: a.role
        }))
    ];

    res.json(allUsers);
});

// Register new user or admin
app.post('/api/register', async (req, res) => {
    const { name, email, password, role, phone, interest } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userRole = role || 'user';
    
    // Check if user already exists
    const usersData = await readJSONFile(USERS_FILE);
    const adminData = await readJSONFile(ADMIN_FILE);
    
    if (!usersData || !adminData) {
        return res.status(500).json({ error: 'Failed to read user data' });
    }

    // Check for existing email
    const emailExists = usersData.users.some(u => u.email.toLowerCase() === email.toLowerCase()) ||
                       adminData.admins.some(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
        return res.status(400).json({ error: 'User with this email already exists' });
    }

    const newUser = {
        id: Date.now(),
        fullName: name,
        email: email.toLowerCase(),
        password: password, // Store plain password
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    };

    if (userRole === 'user') {
        newUser.phoneNumber = phone || '';
        newUser.interest = interest || 'general';
        newUser.agreeTerms = true;
        
        usersData.users.push(newUser);
        const success = await writeJSONFile(USERS_FILE, usersData);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to save user' });
        }
    } else {
        newUser.role = userRole;
        newUser.isActive = true;
        
        adminData.admins.push(newUser);
        const success = await writeJSONFile(ADMIN_FILE, adminData);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to save admin' });
        }
    }

    res.json({ 
        success: true, 
        message: 'Registration successful',
        user: {
            id: newUser.id,
            name: newUser.fullName,
            email: newUser.email,
            role: userRole
        }
    });
});

// Login user or admin
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const usersData = await readJSONFile(USERS_FILE);
    const adminData = await readJSONFile(ADMIN_FILE);
    
    if (!usersData || !adminData) {
        return res.status(500).json({ error: 'Failed to read user data' });
    }

    // Check in users
    let user = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    let userRole = 'user';
    
    // Check in admins if not found in users
    if (!user) {
        user = adminData.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (user) {
            userRole = user.role;
        }
    }

    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare plain passwords
    if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: userRole,
            createdAt: user.createdDate
        }
    });
});

// Delete user
app.delete('/api/users/:email', async (req, res) => {
    const { email } = req.params;

    const usersData = await readJSONFile(USERS_FILE);
    const adminData = await readJSONFile(ADMIN_FILE);
    
    if (!usersData || !adminData) {
        return res.status(500).json({ error: 'Failed to read user data' });
    }

    // Try to delete from users
    const userIndex = usersData.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
        usersData.users.splice(userIndex, 1);
        const success = await writeJSONFile(USERS_FILE, usersData);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        
        return res.json({ success: true, message: 'User deleted successfully' });
    }

    // Try to delete from admins
    const adminIndex = adminData.admins.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
    if (adminIndex !== -1) {
        adminData.admins.splice(adminIndex, 1);
        const success = await writeJSONFile(ADMIN_FILE, adminData);
        
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete admin' });
        }
        
        return res.json({ success: true, message: 'Admin deleted successfully' });
    }

    res.status(404).json({ error: 'User not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
