// User Login JavaScript
class UserLogin {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }

        // Event Listeners
        document.getElementById('userLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Profile buttons
        const viewProfileBtn = document.getElementById('viewProfile');
        const editProfileBtn = document.getElementById('editProfile');
        
        if (viewProfileBtn) {
            viewProfileBtn.addEventListener('click', () => {
                this.showProfile();
            });
        }

        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                this.showNotification('Profile editing coming soon!', 'success');
            });
        }
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

    // Load users
    loadUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    // Hash password
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Handle login
    handleLogin() {
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            this.showNotification('Please enter email and password', 'error');
            return;
        }

        // Load users
        const users = this.loadUsers();

        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            this.showNotification('User not found. Please register first.', 'error');
            return;
        }

        // Verify password
        if (user.password !== this.hashPassword(password)) {
            this.showNotification('Incorrect password', 'error');
            return;
        }

        // Login successful
        this.currentUser = user;
        
        if (rememberMe) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        }

        this.showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            this.showDashboard();
        }, 1000);
    }

    // Handle logout
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUser');
        
        document.getElementById('userDashboard').classList.add('hidden');
        document.getElementById('userLoginCard').classList.remove('hidden');
        document.getElementById('userLoginForm').reset();
        
        this.showNotification('Logged out successfully', 'success');
    }

    // Show dashboard
    showDashboard() {
        document.getElementById('userLoginCard').classList.add('hidden');
        document.getElementById('userDashboard').classList.remove('hidden');
        
        // Update user name
        document.getElementById('userName').textContent = this.currentUser.name;
        
        // Update stats
        document.getElementById('projectsViewed').textContent = this.currentUser.projectsViewed || 0;
        document.getElementById('favoritesCount').textContent = this.currentUser.favorites || 0;
        document.getElementById('commentsCount').textContent = this.currentUser.comments || 0;
        
        // Format member since date
        const memberDate = new Date(this.currentUser.createdAt);
        const monthYear = memberDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        document.getElementById('memberSince').textContent = monthYear;
        
        // Show profile
        this.showProfile();
    }

    // Show profile
    showProfile() {
        const userProfile = document.getElementById('userProfile');
        
        // Get first letter of name for avatar
        const initial = this.currentUser.name.charAt(0).toUpperCase();
        
        userProfile.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">${initial}</div>
                <div class="profile-details">
                    <h3>${this.currentUser.name}</h3>
                    <p>${this.currentUser.email}</p>
                </div>
            </div>
            <div class="profile-info">
                <div class="info-item">
                    <label>Full Name</label>
                    <span>${this.currentUser.name}</span>
                </div>
                <div class="info-item">
                    <label>Email</label>
                    <span>${this.currentUser.email}</span>
                </div>
                <div class="info-item">
                    <label>Phone</label>
                    <span>${this.currentUser.phone}</span>
                </div>
                <div class="info-item">
                    <label>Interest</label>
                    <span>${this.formatInterest(this.currentUser.interest)}</span>
                </div>
                <div class="info-item">
                    <label>Member Since</label>
                    <span>${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                    <label>Account Type</label>
                    <span style="color: var(--primary); text-transform: uppercase;">${this.currentUser.role}</span>
                </div>
            </div>
        `;
    }

    // Format interest text
    formatInterest(interest) {
        return interest.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}

// Initialize user login
document.addEventListener('DOMContentLoaded', () => {
    new UserLogin();
});
