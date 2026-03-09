// User Registration JavaScript
class UserRegistration {
    constructor() {
        this.init();
    }

    init() {
        document.getElementById('userRegisterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Load existing users
    loadUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    // Save users
    saveUsers(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // Hash password (simple hash for demo)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Handle registration
    handleRegistration() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim().toLowerCase();
        const phone = document.getElementById('userPhone').value.trim();
        const password = document.getElementById('userPassword').value;
        const confirmPassword = document.getElementById('userConfirmPassword').value;
        const interest = document.getElementById('userInterest').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!name || !email || !password || !interest) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to Terms & Conditions', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Load existing users
        const users = this.loadUsers();

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            this.showNotification('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone: phone || 'Not provided',
            interest,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            role: 'user',
            projectsViewed: 0,
            favorites: 0,
            comments: 0
        };

        users.push(newUser);
        this.saveUsers(users);

        this.showNotification('Registration successful!', 'success');

        // Show success card
        setTimeout(() => {
            document.getElementById('userRegisterCard').classList.add('hidden');
            document.getElementById('successCard').classList.remove('hidden');
        }, 1500);
    }
}

// Initialize registration
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistration();
});
