// Portfolio Loader - Loads projects from admin panel
class PortfolioLoader {
    constructor() {
        this.loadProjects();
    }

    loadProjects() {
        // Get projects from localStorage
        const projects = localStorage.getItem('portfolioProjects');
        
        if (!projects) {
            console.log('No uploaded projects found');
            return;
        }

        const projectsArray = JSON.parse(projects);
        
        if (projectsArray.length === 0) {
            console.log('No projects to display');
            return;
        }

        // Get the portfolio grid
        const portfolioGrid = document.querySelector('.portfolio-grid');
        
        if (!portfolioGrid) {
            console.error('Portfolio grid not found');
            return;
        }

        // Add uploaded projects to the grid
        projectsArray.forEach((project, index) => {
            const portfolioItem = this.createProjectCard(project, index);
            portfolioGrid.appendChild(portfolioItem);
        });

        // Reinitialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    createProjectCard(project, index) {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.setAttribute('data-aos', 'fade-up');
        portfolioItem.setAttribute('data-aos-delay', (1000 + (index * 100)).toString());

        const liveUrl = project.liveUrl || '#';
        const githubUrl = project.githubUrl || '#';

        portfolioItem.innerHTML = `
            <div class="portfolio-card">
                <img src="${project.image}" alt="${project.title}">
                <div class="card-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.technologies}</p>
                    <div class="card-buttons">
                        ${liveUrl !== '#' ? `<a href="${liveUrl}" class="btn card-btn" target="_blank">View Project</a>` : ''}
                        ${githubUrl !== '#' ? `<a href="${githubUrl}" class="btn card-btn" target="_blank">View Source</a>` : ''}
                        ${liveUrl === '#' && githubUrl === '#' ? '<span class="btn card-btn" style="opacity: 0.6;">Coming Soon</span>' : ''}
                    </div>
                </div>
            </div>
        `;

        return portfolioItem;
    }
}

// Initialize portfolio loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioLoader();
});
