// Initialize Default Content - Run once to populate default journey pics and achievements
class DefaultContentInitializer {
    constructor() {
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Check if already initialized
        const initialized = localStorage.getItem('defaultsInitialized');
        
        if (initialized === 'true') {
            console.log('Defaults already initialized');
            return;
        }

        // Initialize default journey pictures
        this.initializeJourneyPictures();
        
        // Initialize default achievements
        this.initializeAchievements();
        
        // Mark as initialized
        localStorage.setItem('defaultsInitialized', 'true');
        console.log('Default content initialized successfully');
    }

    initializeJourneyPictures() {
        const defaultJourneys = [
            {
                id: 1,
                title: 'At Work',
                description: 'Passionate about coding and creating innovative solutions',
                image: 'assests/images/journey_pic/mypic1.jpg',
                createdAt: new Date().toISOString(),
                isDefault: true
            },
            {
                id: 2,
                title: 'Creative Process',
                description: 'Designing and developing with precision',
                image: 'assests/images/journey_pic/mypic2.jpg',
                createdAt: new Date().toISOString(),
                isDefault: true
            },
            {
                id: 3,
                title: 'Professional Life',
                description: 'Committed to excellence in every project',
                image: 'assests/images/journey_pic/mypic3.jpg',
                createdAt: new Date().toISOString(),
                isDefault: true
            }
        ];

        // Get existing journeys
        const existingJourneys = localStorage.getItem('journeyPictures');
        const journeys = existingJourneys ? JSON.parse(existingJourneys) : [];

        // Add defaults if not already present
        defaultJourneys.forEach(defaultJourney => {
            const exists = journeys.find(j => j.id === defaultJourney.id);
            if (!exists) {
                journeys.push(defaultJourney);
            }
        });

        localStorage.setItem('journeyPictures', JSON.stringify(journeys));
        console.log('Default journey pictures initialized');
    }

    initializeAchievements() {
        const defaultAchievements = [
            {
                id: 1,
                title: 'My Bharat Quiz',
                description: 'Successfully participated and achieved recognition in the My Bharat Quiz competition',
                image: 'assests/images/my_achievements/MyBharatQuiz.png',
                createdAt: new Date().toISOString(),
                isDefault: true
            },
            {
                id: 2,
                title: 'Skill Spardha',
                description: 'Demonstrated exceptional skills and earned recognition in the Skill Spardha competition',
                image: 'assests/images/my_achievements/SkillSpardha.jpg',
                createdAt: new Date().toISOString(),
                isDefault: true
            }
        ];

        // Get existing achievements
        const existingAchievements = localStorage.getItem('customAchievements');
        const achievements = existingAchievements ? JSON.parse(existingAchievements) : [];

        // Add defaults if not already present
        defaultAchievements.forEach(defaultAchievement => {
            const exists = achievements.find(a => a.id === defaultAchievement.id);
            if (!exists) {
                achievements.push(defaultAchievement);
            }
        });

        localStorage.setItem('customAchievements', JSON.stringify(achievements));
        console.log('Default achievements initialized');
    }

    // Method to reset to defaults (useful for testing)
    static resetToDefaults() {
        localStorage.removeItem('defaultsInitialized');
        localStorage.removeItem('journeyPictures');
        localStorage.removeItem('customAchievements');
        console.log('Defaults cleared. Refresh page to reinitialize.');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DefaultContentInitializer();
});

// Expose reset function globally for admin use
window.resetDefaults = () => DefaultContentInitializer.resetToDefaults();
