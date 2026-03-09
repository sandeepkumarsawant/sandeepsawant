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
const USERS_FILE = path.join(__dirname, 'users.json');
const PASSWORDS_FILE = path.join(__dirname, 'passwords.json');

// Helper functions to read/write files
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readPasswords() {
    try {
        const data = await fs.readFile(PASSWORDS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function writePasswords(passwords) {
    await fs.writeFile(PASSWORDS_FILE, JSON.stringify(passwords, null, 2));
}

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await readUsers();
        const passwords = await readPasswords();
        
        // Add passwords to user objects for admin viewing
        const usersWithPasswords = users.map(user => ({
            ...user,
            plainPassword: passwords[user.email] || '••••••••'
        }));
        
        res.json(usersWithPasswords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load users' });
    }
});

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        
        const users = await readUsers();
        const passwords = await readPasswords();
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
            role: role || 'admin'
        };
        
        users.push(newUser);
        passwords[email] = password;
        
        await writeUsers(users);
        await writePasswords(passwords);
        
        res.json({ 
            success: true, 
            message: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const users = await readUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        if (user.password !== hashPassword(password)) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Delete user
app.delete('/api/users/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        const users = await readUsers();
        const passwords = await readPasswords();
        
        const filteredUsers = users.filter(u => u.email !== email);
        delete passwords[email];
        
        await writeUsers(filteredUsers);
        await writePasswords(passwords);
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

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

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Authentication Server running on http://localhost:${PORT}`);
    console.log(`📁 Users stored in: ${USERS_FILE}`);
    console.log(`🔑 Passwords stored in: ${PASSWORDS_FILE}`);
});
