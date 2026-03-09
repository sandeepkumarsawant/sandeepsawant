// API Client for Admin Panel
const API_BASE_URL = 'http://localhost:3001/api';

class AdminAPI {
    // Get all users
    static async getUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    // Register new user
    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error registering user:', error);
            return { error: 'Failed to register user' };
        }
    }

    // Login user
    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error logging in:', error);
            return { error: 'Failed to login' };
        }
    }

    // Delete user
    static async deleteUser(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${email}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting user:', error);
            return { error: 'Failed to delete user' };
        }
    }
}
