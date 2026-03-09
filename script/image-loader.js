// Image Loader - Loads updated images from admin panel
class ImageLoader {
    constructor() {
        this.loadImages();
        this.loadJourneyPictures();
        this.loadAchievements();
    }

    loadImages() {
        const images = localStorage.getItem('websiteImages');
        
        if (!images) {
            return;
        }

        const imageData = JSON.parse(images);

        // Update profile picture in hero section
        if (imageData.profile) {
            const profileImg = document.querySelector('.hero-image img');
            if (profileImg) {
                profileImg.src = imageData.profile;
            }
        }

        // Update achievement images
        if (imageData.achievement1) {
            const achievement1Img = document.querySelector('.achievements-grid .achievement-item:nth-child(1) img');
            if (achievement1Img) {
                achievement1Img.src = imageData.achievement1;
            }
        }

        if (imageData.achievement2) {
            const achievement2Img = document.querySelector('.achievements-grid .achievement-item:nth-child(2) img');
            if (achievement2Img) {
                achievement2Img.src = imageData.achievement2;
            }
        }
    }

    loadJourneyPictures() {
        const journeys = localStorage.getItem('journeyPictures');
        
        if (!journeys) {
            return;
        }

        const journeysArray = JSON.parse(journeys);
        
        if (journeysArray.length === 0) {
            return;
        }

        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (!galleryGrid) {
            return;
        }

        // Clear existing dynamic journey items (keep static HTML ones or replace all)
        const existingDynamicItems = galleryGrid.querySelectorAll('.gallery-item[data-dynamic="true"]');
        existingDynamicItems.forEach(item => item.remove());
        
        // Add all journey pictures from localStorage
        journeysArray.forEach((journey, index) => {
            const journeyItem = this.createJourneyCard(journey, index);
            galleryGrid.appendChild(journeyItem);
        });

        // Reinitialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    createJourneyCard(journey, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-aos', 'fade-up');
        galleryItem.setAttribute('data-aos-delay', ((index + 1) * 100).toString());
        galleryItem.setAttribute('data-dynamic', 'true');

        // Handle both file paths and base64 images
        const imageSrc = journey.image;

        galleryItem.innerHTML = `
            <img src="${imageSrc}" alt="${journey.title}">
            <div class="gallery-info">
                <h3>${journey.title}</h3>
                <p>${journey.description}</p>
            </div>
        `;

        return galleryItem;
    }

    loadAchievements() {
        const achievements = localStorage.getItem('customAchievements');
        
        if (!achievements) {
            return;
        }

        const achievementsArray = JSON.parse(achievements);
        
        if (achievementsArray.length === 0) {
            return;
        }

        const achievementsGrid = document.querySelector('.achievements-grid');
        
        if (!achievementsGrid) {
            return;
        }

        // Clear existing dynamic achievement items
        const existingDynamicItems = achievementsGrid.querySelectorAll('.achievement-card[data-dynamic="true"]');
        existingDynamicItems.forEach(item => item.remove());

        // Add all achievements from localStorage
        achievementsArray.forEach((achievement, index) => {
            const achievementItem = this.createAchievementCard(achievement, index);
            achievementsGrid.appendChild(achievementItem);
        });

        // Reinitialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    createAchievementCard(achievement, index) {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        achievementCard.setAttribute('data-aos', 'zoom-in');
        achievementCard.setAttribute('data-aos-delay', ((index + 1) * 100).toString());
        achievementCard.setAttribute('data-dynamic', 'true');

        // Handle both file paths and base64 images
        const imageSrc = achievement.image;

        achievementCard.innerHTML = `
            <div class="achievement-icon">
                <img src="${imageSrc}" alt="${achievement.title}">
            </div>
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
        `;

        return achievementCard;
    }
}

// Initialize image loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageLoader();
});
