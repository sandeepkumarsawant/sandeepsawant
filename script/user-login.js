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

    // Handle login
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!email || !password) {
            this.showNotification('Please enter email and password', 'error');
            return;
        }

        // Login via API
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                this.showNotification(data.error || 'Login failed', 'error');
                return;
            }

            // Login successful
            this.currentUser = data.user;
            
            if (rememberMe) {
                localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            } else {
                sessionStorage.setItem('loggedInUser', JSON.stringify(data.user));
            }

            this.showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                this.showDashboard();
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Failed to connect to server. Please try again.', 'error');
        }
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
        
        // Update stats (default values since we don't track these yet)
        document.getElementById('projectsViewed').textContent = 0;
        document.getElementById('favoritesCount').textContent = 0;
        document.getElementById('commentsCount').textContent = 0;
        
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
                    <span>${this.currentUser.phone || 'Not provided'}</span>
                </div>
                <div class="info-item">
                    <label>Interest</label>
                    <span>${this.currentUser.interest ? this.formatInterest(this.currentUser.interest) : 'N/A'}</span>
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
