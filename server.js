// Simple Node.js/Express Backend for Admin Panel
// To use this, you need to install: npm install express cors body-parser bcrypt jsonwebtoken multer

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.')); // Serve static files

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// In-memory databases (replace with real database in production)
let adminUsers = [];
let registeredUsers = [];
let projects = [];

// Admin Register endpoint
app.post('/api/admin/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = adminUsers.find(u => u.email === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'admin'
        };

        adminUsers.push(newUser);

        res.status(201).json({
            message: 'Admin registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Login endpoint
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = adminUsers.find(u => u.email === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Register endpoint
app.post('/api/user/register', async (req, res) => {
    try {
        const { name, email, phone, password, interest } = req.body;

        // Validation
        if (!name || !email || !password || !interest) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = registeredUsers.find(u => u.email === email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now(),
            name,
            email: email.toLowerCase(),
            phone: phone || 'Not provided',
            interest,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'user',
            projectsViewed: 0,
            favorites: 0,
            comments: 0
        };

        registeredUsers.push(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login endpoint
app.post('/api/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = registeredUsers.find(u => u.email === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                interest: user.interest,
                role: user.role,
                projectsViewed: user.projectsViewed,
                favorites: user.favorites,
                comments: user.comments,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get all users (protected route)
app.get('/api/users', authenticateToken, (req, res) => {
    const allUsers = [...adminUsers, ...registeredUsers];
    const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
});

// Get current user info (protected route)
app.get('/api/me', authenticateToken, (req, res) => {
    const allUsers = [...adminUsers, ...registeredUsers];
    const user = allUsers.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
});

// Upload project (admin only)
app.post('/api/projects', authenticateToken, upload.single('image'), (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can upload projects' });
        }

        const { title, category, description, technologies, liveUrl, githubUrl } = req.body;

        if (!title || !category || !description || !technologies) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        const newProject = {
            id: Date.now(),
            title,
            category,
            description,
            technologies,
            liveUrl: liveUrl || '#',
            githubUrl: githubUrl || '#',
            image: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date().toISOString(),
            createdBy: req.user.email
        };

        projects.push(newProject);

        res.status(201).json({
            message: 'Project uploaded successfully',
            project: newProject
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all projects
app.get('/api/projects', (req, res) => {
    res.json({ projects });
});

// Delete project (admin only)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete projects' });
        }

        const projectId = parseInt(req.params.id);
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }

        projects.splice(projectIndex, 1);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Portfolio: http://localhost:${PORT}/index.html`);
    console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`User login: http://localhost:${PORT}/user-login.html`);
    console.log(`User register: http://localhost:${PORT}/register.html`);
});
