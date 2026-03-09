// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.projects = this.loadProjects();
        this.useFileStorage = true; // Flag to use file storage
        this.init();
    }

    async init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }

        // Load users from file storage
        await this.loadUsersFromFile();

        // Event Listeners
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Project Upload Event Listeners
        document.getElementById('showProjectUpload').addEventListener('click', () => {
            this.showProjectUpload();
        });

        document.getElementById('closeProjectUpload').addEventListener('click', () => {
            this.hideProjectUpload();
        });

        document.getElementById('cancelUpload').addEventListener('click', () => {
            this.hideProjectUpload();
        });

        document.getElementById('projectUploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProjectUpload();
        });

        document.getElementById('projectImage').addEventListener('change', (e) => {
            this.previewImage(e);
        });

        document.getElementById('viewProjects').addEventListener('click', () => {
            this.showProjectsList();
        });

        document.getElementById('closeProjectsList').addEventListener('click', () => {
            this.hideProjectsList();
        });

        // Image Management Event Listeners
        document.getElementById('showImageManager').addEventListener('click', () => {
            this.showImageManager();
        });

        document.getElementById('closeImageManager').addEventListener('click', () => {
            this.hideImageManager();
        });

        // Register User Event Listeners
        document.getElementById('showRegisterUser').addEventListener('click', () => {
            this.showRegisterUser();
        });

        document.getElementById('closeRegisterUser').addEventListener('click', () => {
            this.hideRegisterUser();
        });

        document.getElementById('cancelQuickRegister').addEventListener('click', () => {
            this.hideRegisterUser();
        });

        document.getElementById('quickRegisterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuickRegister();
        });

        // Registered Users Event Listeners
        document.getElementById('showRegisteredUsers').addEventListener('click', () => {
            this.showRegisteredUsersSection();
        });

        document.getElementById('closeRegisteredUsers').addEventListener('click', () => {
            this.hideRegisteredUsersSection();
        });
    }

    // Load projects from localStorage
    loadProjects() {
        const projects = localStorage.getItem('portfolioProjects');
        return projects ? JSON.parse(projects) : [];
    }

    // Save projects to localStorage
    saveProjects() {
        localStorage.setItem('portfolioProjects', JSON.stringify(this.projects));
    }

    // Load users from file storage
    async loadUsersFromFile() {
        try {
            this.users = await AdminAPI.getUsers();
        } catch (error) {
            console.error('Error loading users from file:', error);
            this.users = [];
        }
    }

    // Load users from localStorage (fallback)
    loadUsers() {
        const users = localStorage.getItem('adminUsers');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage (fallback)
    saveUsers() {
        localStorage.setItem('adminUsers', JSON.stringify(this.users));
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

    // Show register form
    showRegisterForm() {
        document.getElementById('loginCard').classList.add('hidden');
        document.getElementById('registerCard').classList.remove('hidden');
    }

    // Show login form
    showLoginForm() {
        document.getElementById('registerCard').classList.add('hidden');
        document.getElementById('loginCard').classList.remove('hidden');
    }

    // Handle registration
    async handleRegister() {
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validation
        if (!name || !email || !password) {
            this.showNotification('Please fill in all fields', 'error');
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

        // Register via API
        const result = await AdminAPI.register({
            name,
            email,
            password,
            role: 'admin'
        });

        if (result.error) {
            this.showNotification(result.error, 'error');
            return;
        }

        this.showNotification('Registration successful! Please login.', 'success');
        
        // Clear form and show login
        document.getElementById('registerForm').reset();
        setTimeout(() => {
            this.showLoginForm();
        }, 1500);
    }

    // Handle login
    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Please enter email and password', 'error');
            return;
        }

        // Login via API
        const result = await AdminAPI.login(email, password);
        
        if (result.error) {
            this.showNotification(result.error, 'error');
            return;
        }

        // Login successful
        this.currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        this.showNotification('Login successful!', 'success');
        
        setTimeout(() => {
            this.showDashboard();
        }, 1000);
    }

    // Handle logout
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginCard').classList.remove('hidden');
        document.getElementById('loginForm').reset();
        
        this.showNotification('Logged out successfully', 'success');
    }

    // Show dashboard
    showDashboard() {
        document.getElementById('loginCard').classList.add('hidden');
        document.getElementById('registerCard').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Update user name
        document.getElementById('userName').textContent = this.currentUser.name;
        
        // Update stats
        this.updateDashboardStats();
    }

    // Load users list in dashboard
    loadUsersList() {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        if (this.users.length === 0) {
            usersList.innerHTML = '<p style="color: var(--secondary); text-align: center;">No users registered yet</p>';
            return;
        }

        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            const createdDate = new Date(user.createdAt).toLocaleDateString();
            
            // Get the original password from localStorage (stored separately for display)
            const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
            const displayPassword = userPasswords[user.email] || '••••••••';
            
            userItem.innerHTML = `
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Password:</strong> <span style="color: var(--accent); font-family: monospace;">${displayPassword}</span></p>
                    <p style="font-size: 0.85rem; color: var(--secondary);">Joined: ${createdDate}</p>
                </div>
                <div style="color: var(--primary); font-weight: 600;">${user.role}</div>
            `;
            
            usersList.appendChild(userItem);
        });
    }

    // Show project upload form
    showProjectUpload() {
        document.getElementById('projectUploadSection').classList.remove('hidden');
        document.getElementById('projectsListSection').classList.add('hidden');
    }

    // Hide project upload form
    hideProjectUpload() {
        document.getElementById('projectUploadSection').classList.add('hidden');
        document.getElementById('projectUploadForm').reset();
        document.getElementById('imagePreview').classList.add('hidden');
    }

    // Preview uploaded image
    previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('imagePreview').classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle project upload
    handleProjectUpload() {
        const title = document.getElementById('projectTitle').value.trim();
        const category = document.getElementById('projectCategory').value;
        const description = document.getElementById('projectDescription').value.trim();
        const technologies = document.getElementById('projectTechnologies').value.trim();
        const liveUrl = document.getElementById('projectLiveUrl').value.trim();
        const githubUrl = document.getElementById('projectGithubUrl').value.trim();
        const imageFile = document.getElementById('projectImage').files[0];

        if (!title || !category || !description || !technologies || !imageFile) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Read image as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const newProject = {
                id: Date.now(),
                title,
                category,
                description,
                technologies,
                liveUrl: liveUrl || '#',
                githubUrl: githubUrl || '#',
                image: e.target.result,
                createdAt: new Date().toISOString(),
                createdBy: this.currentUser.name
            };

            this.projects.push(newProject);
            this.saveProjects();

            this.showNotification('Project uploaded successfully! It will now appear on your portfolio page.', 'success');
            this.hideProjectUpload();
            this.updateDashboardStats();
        };
        reader.readAsDataURL(imageFile);
    }

    // Show projects list
    showProjectsList() {
        document.getElementById('projectsListSection').classList.remove('hidden');
        document.getElementById('projectUploadSection').classList.add('hidden');
        this.loadProjectsList();
    }

    // Hide projects list
    hideProjectsList() {
        document.getElementById('projectsListSection').classList.add('hidden');
    }

    // Load projects list
    loadProjectsList() {
        const projectsList = document.getElementById('projectsList');
        projectsList.innerHTML = '';

        if (this.projects.length === 0) {
            projectsList.innerHTML = '<p style="color: var(--secondary); text-align: center; grid-column: 1/-1;">No projects uploaded yet</p>';
            return;
        }

        this.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <span class="project-category">${project.category}</span>
                    <p>${project.description}</p>
                    <p class="project-tech"><strong>Tech:</strong> ${project.technologies}</p>
                    <div class="project-actions">
                        <button class="btn-small btn-view" onclick="window.open('${project.liveUrl}', '_blank')">View</button>
                        <button class="btn-small btn-delete" onclick="adminPanel.deleteProject(${project.id})">Delete</button>
                    </div>
                </div>
            `;
            
            projectsList.appendChild(projectCard);
        });
    }

    // Delete project
    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveProjects();
            this.loadProjectsList();
            this.updateDashboardStats();
            this.showNotification('Project deleted successfully', 'success');
        }
    }

    // Update dashboard stats
    updateDashboardStats() {
        const statCards = document.querySelectorAll('.stat-number');
        if (statCards.length > 0) {
            statCards[0].textContent = this.projects.length;
        }
    }

    // Simple hash function (for demo purposes - use proper hashing in production)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Show image manager
    showImageManager() {
        document.getElementById('imageManagementSection').classList.remove('hidden');
        document.getElementById('projectUploadSection').classList.add('hidden');
        document.getElementById('projectsListSection').classList.add('hidden');
        this.loadCurrentImages();
        this.loadJourneyPictures();
    }

    // Hide image manager
    hideImageManager() {
        document.getElementById('imageManagementSection').classList.add('hidden');
    }

    // Show register user section
    showRegisterUser() {
        document.getElementById('registerUserSection').classList.remove('hidden');
        document.getElementById('projectUploadSection').classList.add('hidden');
        document.getElementById('projectsListSection').classList.add('hidden');
        document.getElementById('imageManagementSection').classList.add('hidden');
        document.getElementById('registeredUsersSection').classList.add('hidden');
    }

    // Hide register user section
    hideRegisterUser() {
        document.getElementById('registerUserSection').classList.add('hidden');
        document.getElementById('quickRegisterForm').reset();
    }

    // Show registered users section
    async showRegisteredUsersSection() {
        document.getElementById('registeredUsersSection').classList.remove('hidden');
        document.getElementById('projectUploadSection').classList.add('hidden');
        document.getElementById('projectsListSection').classList.add('hidden');
        document.getElementById('imageManagementSection').classList.add('hidden');
        document.getElementById('registerUserSection').classList.add('hidden');
        await this.loadRegisteredUsersList();
    }

    // Hide registered users section
    hideRegisteredUsersSection() {
        document.getElementById('registeredUsersSection').classList.add('hidden');
    }

    // Load registered users list in popup section
    async loadRegisteredUsersList() {
        const usersList = document.getElementById('registeredUsersList');
        usersList.innerHTML = '<p style="color: var(--secondary); text-align: center; padding: 2rem;">Loading users...</p>';

        // Load fresh data from file
        await this.loadUsersFromFile();

        if (this.users.length === 0) {
            usersList.innerHTML = '<p style="color: var(--secondary); text-align: center; padding: 2rem;">No users registered yet</p>';
            return;
        }

        usersList.innerHTML = '';

        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            
            const createdDate = new Date(user.createdAt).toLocaleDateString();
            
            // Password comes from API response
            const displayPassword = user.plainPassword || '••••••••';
            
            userItem.innerHTML = `
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Password:</strong> <span style="color: var(--accent); font-family: monospace; font-size: 1.1rem;">${displayPassword}</span></p>
                    <p style="font-size: 0.85rem; color: var(--secondary);">Joined: ${createdDate}</p>
                </div>
                <div style="color: var(--primary); font-weight: 600; text-transform: uppercase;">${user.role}</div>
            `;
            
            usersList.appendChild(userItem);
        });
    }

    // Handle quick register from dashboard
    async handleQuickRegister() {
        const name = document.getElementById('quickRegisterName').value.trim();
        const email = document.getElementById('quickRegisterEmail').value.trim().toLowerCase();
        const password = document.getElementById('quickRegisterPassword').value;
        const confirmPassword = document.getElementById('quickRegisterConfirmPassword').value;
        const role = document.getElementById('quickRegisterRole').value;

        // Validation
        if (!name || !email || !password) {
            this.showNotification('Please fill in all fields', 'error');
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

        // Register via API
        const result = await AdminAPI.register({
            name,
            email,
            password,
            role
        });

        if (result.error) {
            this.showNotification(result.error, 'error');
            return;
        }

        this.showNotification('User registered successfully!', 'success');
        
        // Clear form and hide section
        document.getElementById('quickRegisterForm').reset();
        this.hideRegisterUser();
        
        // Reload users
        await this.loadUsersFromFile();
    }

    // Load current images from localStorage
    loadCurrentImages() {
        const images = this.loadImagesFromStorage();
        
        // Update profile picture preview
        if (images.profile) {
            document.getElementById('currentProfilePic').src = images.profile;
        }

        // Add preview for new journey upload
        const newJourneyUpload = document.getElementById('newJourneyUpload');
        if (newJourneyUpload) {
            newJourneyUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('newJourneyPreviewImg').src = event.target.result;
                        document.getElementById('newJourneyPreview').classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Add preview for new achievement upload
        const newAchievementUpload = document.getElementById('newAchievementUpload');
        if (newAchievementUpload) {
            newAchievementUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('newAchievementPreviewImg').src = event.target.result;
                        document.getElementById('newAchievementPreview').classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Load achievements
        this.loadAchievementImages();
    }

    // Load journey pictures
    loadJourneyPictures() {
        const journeys = this.loadJourneysFromStorage();
        const container = document.getElementById('journeyImagesContainer');
        
        if (!container) return;
        
        container.innerHTML = '';

        if (journeys.length === 0) {
            container.innerHTML = '<p style="color: var(--secondary); text-align: center; padding: 2rem;">No journey pictures yet. Add your first one below!</p>';
            return;
        }

        journeys.forEach(journey => {
            const journeyCard = this.createJourneyCard(journey);
            container.appendChild(journeyCard);
        });
    }

    // Create journey card
    createJourneyCard(journey) {
        const card = document.createElement('div');
        card.className = 'journey-card';
        card.setAttribute('data-journey-id', journey.id);

        card.innerHTML = `
            <div class="journey-card-header">
                <h5>${journey.title}</h5>
                <button class="btn-delete-journey" onclick="adminPanel.deleteJourney(${journey.id})">Delete</button>
            </div>
            <div class="journey-card-image">
                <img src="${journey.image}" alt="${journey.title}">
            </div>
            <div class="journey-card-info">
                <p><strong>Description:</strong> ${journey.description}</p>
            </div>
            <div class="journey-card-actions">
                <input type="file" id="updateJourney${journey.id}" accept="image/*">
                <button class="btn-update-journey" onclick="adminPanel.updateJourney(${journey.id})">Update</button>
            </div>
        `;

        return card;
    }

    // Load journeys from localStorage
    loadJourneysFromStorage() {
        const journeys = localStorage.getItem('journeyPictures');
        return journeys ? JSON.parse(journeys) : [];
    }

    // Save journeys to localStorage
    saveJourneysToStorage(journeys) {
        localStorage.setItem('journeyPictures', JSON.stringify(journeys));
    }

    // Add new journey
    addNewJourney() {
        const title = document.getElementById('newJourneyTitle').value.trim();
        const description = document.getElementById('newJourneyDescription').value.trim();
        const fileInput = document.getElementById('newJourneyUpload');
        const file = fileInput.files[0];

        if (!title || !description || !file) {
            this.showNotification('Please fill in all fields and select an image', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const journeys = this.loadJourneysFromStorage();
            const newJourney = {
                id: Date.now(),
                title: title,
                description: description,
                image: e.target.result,
                createdAt: new Date().toISOString()
            };

            journeys.push(newJourney);
            this.saveJourneysToStorage(journeys);

            this.showNotification('Journey picture added successfully! Refresh the main page to see it.', 'success');
            
            // Clear inputs
            document.getElementById('newJourneyTitle').value = '';
            document.getElementById('newJourneyDescription').value = '';
            fileInput.value = '';
            document.getElementById('newJourneyPreview').classList.add('hidden');
            
            // Reload journey pictures
            this.loadJourneyPictures();
        };
        reader.readAsDataURL(file);
    }

    // Update journey
    updateJourney(journeyId) {
        const fileInput = document.getElementById(`updateJourney${journeyId}`);
        const file = fileInput.files[0];

        if (!file) {
            this.showNotification('Please select an image first', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const journeys = this.loadJourneysFromStorage();
            const journeyIndex = journeys.findIndex(j => j.id === journeyId);

            if (journeyIndex !== -1) {
                journeys[journeyIndex].image = e.target.result;
                journeys[journeyIndex].updatedAt = new Date().toISOString();
                this.saveJourneysToStorage(journeys);

                this.showNotification('Journey picture updated successfully! Refresh the main page to see changes.', 'success');
                
                // Clear file input
                fileInput.value = '';
                
                // Reload journey pictures
                this.loadJourneyPictures();
            }
        };
        reader.readAsDataURL(file);
    }

    // Delete journey
    deleteJourney(journeyId) {
        if (!confirm('Are you sure you want to delete this journey picture?')) {
            return;
        }

        const journeys = this.loadJourneysFromStorage();
        const filteredJourneys = journeys.filter(j => j.id !== journeyId);
        
        this.saveJourneysToStorage(filteredJourneys);
        this.showNotification('Journey picture deleted successfully!', 'success');
        
        // Reload journey pictures
        this.loadJourneyPictures();
    }

    // Load images from localStorage
    loadImagesFromStorage() {
        const images = localStorage.getItem('websiteImages');
        return images ? JSON.parse(images) : {};
    }

    // Save images to localStorage
    saveImagesToStorage(images) {
        localStorage.setItem('websiteImages', JSON.stringify(images));
    }

    // Upload image
    uploadImage(imageType) {
        let fileInput;
        let imageKey;

        switch(imageType) {
            case 'profile':
                fileInput = document.getElementById('profilePicUpload');
                imageKey = 'profile';
                break;
            case 'journey1':
                fileInput = document.getElementById('journey1Upload');
                imageKey = 'journey1';
                break;
            case 'journey2':
                fileInput = document.getElementById('journey2Upload');
                imageKey = 'journey2';
                break;
            case 'journey3':
                fileInput = document.getElementById('journey3Upload');
                imageKey = 'journey3';
                break;
            case 'achievement1':
                fileInput = document.getElementById('achievement1Upload');
                imageKey = 'achievement1';
                break;
            case 'achievement2':
                fileInput = document.getElementById('achievement2Upload');
                imageKey = 'achievement2';
                break;
            default:
                this.showNotification('Invalid image type', 'error');
                return;
        }

        const file = fileInput.files[0];
        if (!file) {
            this.showNotification('Please select an image first', 'error');
            return;
        }

        // Read and save image
        const reader = new FileReader();
        reader.onload = (e) => {
            const images = this.loadImagesFromStorage();
            images[imageKey] = e.target.result;
            this.saveImagesToStorage(images);
            
            this.showNotification('Image updated successfully! Refresh the main page to see changes.', 'success');
            this.loadCurrentImages();
            
            // Clear file input
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    }

    // Add new achievement
    addNewAchievement() {
        const title = document.getElementById('newAchievementTitle').value.trim();
        const description = document.getElementById('newAchievementDescription').value.trim();
        const fileInput = document.getElementById('newAchievementUpload');
        const file = fileInput.files[0];

        if (!title || !description || !file) {
            this.showNotification('Please fill in all fields and select an image', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const achievements = this.loadAchievementsFromStorage();
            const newAchievement = {
                id: Date.now(),
                title: title,
                description: description,
                image: e.target.result,
                createdAt: new Date().toISOString()
            };

            achievements.push(newAchievement);
            localStorage.setItem('customAchievements', JSON.stringify(achievements));

            this.showNotification('Achievement added successfully! Refresh the main page to see it.', 'success');
            
            // Clear inputs
            document.getElementById('newAchievementTitle').value = '';
            document.getElementById('newAchievementDescription').value = '';
            fileInput.value = '';
            document.getElementById('newAchievementPreview').classList.add('hidden');

            // Reload achievements
            this.loadAchievementImages();
        };
        reader.readAsDataURL(file);
    }

    // Load achievements from localStorage
    loadAchievementsFromStorage() {
        const achievements = localStorage.getItem('customAchievements');
        return achievements ? JSON.parse(achievements) : [];
    }

    // Load achievement images
    loadAchievementImages() {
        const achievements = this.loadAchievementsFromStorage();
        const container = document.getElementById('achievementImagesContainer');
        
        if (!container) return;
        
        container.innerHTML = '';

        if (achievements.length === 0) {
            container.innerHTML = '<p style="color: var(--secondary); text-align: center; padding: 2rem;">No achievements yet. Add your first one below!</p>';
            return;
        }

        achievements.forEach(achievement => {
            const achievementCard = this.createAchievementCard(achievement);
            container.appendChild(achievementCard);
        });
    }

    // Create achievement card
    createAchievementCard(achievement) {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.setAttribute('data-achievement-id', achievement.id);

        card.innerHTML = `
            <div class="achievement-card-header">
                <h5>${achievement.title}</h5>
                <button class="btn-delete-achievement" onclick="adminPanel.deleteAchievement(${achievement.id})">Delete</button>
            </div>
            <div class="achievement-card-image">
                <img src="${achievement.image}" alt="${achievement.title}">
            </div>
            <div class="achievement-card-info">
                <p><strong>Description:</strong> ${achievement.description}</p>
            </div>
            <div class="achievement-card-actions">
                <input type="file" id="updateAchievement${achievement.id}" accept="image/*">
                <button class="btn-update-achievement" onclick="adminPanel.updateAchievement(${achievement.id})">Update</button>
            </div>
        `;

        return card;
    }

    // Update achievement
    updateAchievement(achievementId) {
        const fileInput = document.getElementById(`updateAchievement${achievementId}`);
        const file = fileInput.files[0];

        if (!file) {
            this.showNotification('Please select an image first', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const achievements = this.loadAchievementsFromStorage();
            const achievementIndex = achievements.findIndex(a => a.id === achievementId);

            if (achievementIndex !== -1) {
                achievements[achievementIndex].image = e.target.result;
                achievements[achievementIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('customAchievements', JSON.stringify(achievements));

                this.showNotification('Achievement updated successfully! Refresh the main page to see changes.', 'success');
                
                // Clear file input
                fileInput.value = '';
                
                // Reload achievements
                this.loadAchievementImages();
            }
        };
        reader.readAsDataURL(file);
    }

    // Delete achievement
    deleteAchievement(achievementId) {
        if (!confirm('Are you sure you want to delete this achievement?')) {
            return;
        }

        const achievements = this.loadAchievementsFromStorage();
        const filteredAchievements = achievements.filter(a => a.id !== achievementId);
        
        localStorage.setItem('customAchievements', JSON.stringify(filteredAchievements));
        this.showNotification('Achievement deleted successfully!', 'success');
        
        // Reload achievements
        this.loadAchievementImages();
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});
