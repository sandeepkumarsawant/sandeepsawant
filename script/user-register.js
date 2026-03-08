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

    // Handle registration
    async handleRegistration() {
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

        // Register via API
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone: phone || '',
                    password,
                    interest,
                    role: 'user'
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                this.showNotification(data.error || 'Registration failed', 'error');
                return;
            }

            this.showNotification('Registration successful!', 'success');

            // Show success card
            setTimeout(() => {
                document.getElementById('userRegisterCard').classList.add('hidden');
                document.getElementById('successCard').classList.remove('hidden');
            }, 1500);
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Failed to connect to server. Please try again.', 'error');
        }
    }
}

// Initialize registration
document.addEventListener('DOMContentLoaded', () => {
    new UserRegistration();
});
