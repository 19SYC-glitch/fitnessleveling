// Game State Management with Supabase Database
class FitnessGame {
    constructor() {
        this.db = new SupabaseDatabase();
        this.currentUser = null;
        this.userData = null;
        this.achievements = [];
        this.workouts = [];
        this.friends = [];
        this.pendingRequests = [];
        this.viewingProfileId = null; // Track which profile is being viewed
        this.profileMode = 'edit'; // 'edit', 'view', 'settings'
        this.init();
    }

    async init() {
        try {
            // ALWAYS show login page first - require explicit login
            this.hideAllSections();
            this.showSection('login');
            this.currentUser = null;
            this.userData = null;
            
            await this.db.init();
            this.setupEventListeners();
            
            // Don't auto-login - always require user to login manually
            // This ensures users must explicitly login each time
        } catch (error) {
            console.error('Initialization error:', error);
            this.hideAllSections();
            this.showSection('login');
            this.showToast('Error initializing app. Please refresh the page.', 'error');
        }
    }

    hideAllSections() {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
    }

    // Authentication
    async checkAuth() {
        try {
            const session = await this.db.getSession();
            if (session && session.user) {
                this.currentUser = session.user;
                return true;
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
        return false;
    }

    async login(username, password) {
        try {
            const { user } = await this.db.signInWithUsername(username, password);
            this.currentUser = user;
            
            // Remove initial hide style to allow sections to show
            const initialStyle = document.getElementById('initialHideStyle');
            if (initialStyle) {
                initialStyle.remove();
            }
            
            await this.loadUserData();
            this.updateNavbar();
            this.showToast('Welcome back!', 'success');
            this.showSection('dashboard');
            this.updateDashboard();
            this.updateAchievements();
            this.updateWorkouts();
            this.updateLeaderboard();
            this.updateProfile();
            return true;
        } catch (error) {
            console.error('Login error:', error);
            if (error.message.includes('Username not found')) {
                this.showToast('Username not found', 'error');
            } else if (error.message.includes('Invalid login credentials')) {
                this.showToast('Invalid username or password', 'error');
            } else {
                this.showToast(error.message || 'Login failed. Please try again.', 'error');
            }
            return false;
        }
    }

    async signup(username, name, email, password) {
        try {
            const { user } = await this.db.signUp(email, password, { username, name });
            this.currentUser = user;
            
            // Remove initial hide style to allow sections to show
            const initialStyle = document.getElementById('initialHideStyle');
            if (initialStyle) {
                initialStyle.remove();
            }
            
            await this.loadUserData();
            this.updateNavbar();
            this.showToast('Account created successfully! Welcome to FitnessLeveling!', 'success');
            this.showSection('dashboard');
            this.updateDashboard();
            this.updateProfile();
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                this.showToast('Email or username already exists', 'error');
            } else {
                this.showToast(error.message || 'Signup failed. Please try again.', 'error');
            }
            return false;
        }
    }

    async logout() {
        // Confirm logout
        if (!confirm('Are you sure you want to logout?')) {
            return;
        }

        try {
            // Sign out from Supabase
            await this.db.signOut();
            
            // Clear all local state
            this.currentUser = null;
            this.userData = null;
            this.achievements = [];
            this.workouts = [];
            this.friends = [];
            this.pendingRequests = [];
            this.viewingProfileId = null;
            
            // Update UI
            this.updateNavbar();
            this.showSection('login');
            
            // Clear any forms
            this.resetWorkoutForm();
            if (document.getElementById('loginForm')) {
                document.getElementById('loginForm').reset();
            }
            
            this.showToast('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, clear local state
            this.currentUser = null;
            this.userData = null;
            this.updateNavbar();
            this.showSection('login');
            this.showToast('Logged out', 'info');
        }
    }

    // Data Management
    async loadUserData() {
        if (!this.currentUser) return;

        try {
            const profile = await this.db.getUserProfile(this.currentUser.id);
            
            this.userData = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                username: profile.username,
                xp: profile.xp || 0,
                level: profile.level || 1,
                streak: profile.streak || 0,
                lastWorkoutDate: profile.last_workout_date,
                totalWorkouts: profile.total_workouts || 0,
                badges: profile.badges || [],
                // Profile data from dedicated columns
                age: profile.age,
                height: profile.height,
                weight: profile.weight,
                fitness_goal: profile.fitness_goal,
                bio: profile.bio,
                profile_visibility: profile.profile_visibility || 'public',
                // Also keep profile JSONB for backward compatibility
                profile: {
                    age: profile.age,
                    height: profile.height,
                    weight: profile.weight,
                    fitness_goal: profile.fitness_goal,
                    bio: profile.bio,
                    ...(profile.profile || {})
                }
            };

            this.workouts = await this.db.getWorkoutsByUserId(this.currentUser.id);
            this.achievements = await this.db.getAchievementsByUserId(this.currentUser.id);
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showToast('Error loading user data', 'error');
        }
    }

    async saveUserData() {
        if (!this.currentUser || !this.userData) return;

        try {
            await this.db.updateUserProfile(this.currentUser.id, {
                name: this.userData.name,
                xp: this.userData.xp,
                level: this.userData.level,
                streak: this.userData.streak,
                last_workout_date: this.userData.lastWorkoutDate,
                total_workouts: this.userData.totalWorkouts,
                badges: this.userData.badges,
                profile: this.userData.profile
            });
        } catch (error) {
            console.error('Error saving user data:', error);
            this.showToast('Error saving data', 'error');
        }
    }

    // XP and Level System
    calculateXP(duration, intensity) {
        const baseXP = duration;
        const intensityMultiplier = {
            low: 1,
            medium: 1.5,
            high: 2
        };
        return Math.floor(baseXP * intensityMultiplier[intensity]);
    }

    async addXP(amount) {
        this.userData.xp += amount;
        const oldLevel = this.userData.level;
        this.userData.level = this.calculateLevel(this.userData.xp);
        
        if (this.userData.level > oldLevel) {
            this.showToast(`Level Up! You reached Level ${this.userData.level}!`, 'success');
        }
        
        await this.saveUserData();
        this.updateDashboard();
    }

    calculateLevel(xp) {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    getXPForNextLevel(level) {
        return Math.pow(level, 2) * 100;
    }

    getXPForCurrentLevel(level) {
        return Math.pow(level - 1, 2) * 100;
    }

    // Streak System
    checkStreak() {
        if (!this.userData || !this.userData.lastWorkoutDate) {
            return;
        }

        const today = new Date().toDateString();
        const lastDate = this.userData.lastWorkoutDate;
        const lastWorkout = new Date(lastDate).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastWorkout !== yesterday.toDateString() && lastWorkout !== today) {
            this.userData.streak = 0;
            this.saveUserData();
        }
    }

    async updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.userData.lastWorkoutDate;

        if (!lastDate) {
            this.userData.streak = 1;
        } else {
            const lastWorkout = new Date(lastDate).toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastWorkout === yesterday.toDateString()) {
                this.userData.streak += 1;
            } else if (lastWorkout !== today) {
                this.userData.streak = 1;
            }
        }

        this.userData.lastWorkoutDate = today;
        await this.saveUserData();
        
        // Update last_workout_date in database
        await this.db.updateUserProfile(this.currentUser.id, {
            last_workout_date: today
        });
    }

    // Achievement System
    async checkAchievements() {
        const achievements = [
            {
                id: 'first-workout',
                check: () => this.userData.totalWorkouts >= 1,
                xp: 50
            },
            {
                id: 'streak-3',
                check: () => this.userData.streak >= 3,
                xp: 100
            },
            {
                id: 'streak-7',
                check: () => this.userData.streak >= 7,
                xp: 250
            },
            {
                id: 'streak-30',
                check: () => this.userData.streak >= 30,
                xp: 1000
            },
            {
                id: 'workouts-10',
                check: () => this.userData.totalWorkouts >= 10,
                xp: 200
            },
            {
                id: 'workouts-50',
                check: () => this.userData.totalWorkouts >= 50,
                xp: 500
            },
            {
                id: 'workouts-100',
                check: () => this.userData.totalWorkouts >= 100,
                xp: 1500
            },
            {
                id: 'level-5',
                check: () => this.userData.level >= 5,
                xp: 300
            },
            {
                id: 'level-10',
                check: () => this.userData.level >= 10,
                xp: 750
            }
        ];

        for (const achievement of achievements) {
            if (achievement.check() && !this.achievements.includes(achievement.id)) {
                await this.db.addAchievement(this.currentUser.id, achievement.id);
                this.achievements.push(achievement.id);
                await this.addXP(achievement.xp);
                this.userData.badges.push(achievement.id);
                this.showToast(`Achievement Unlocked: ${this.getAchievementName(achievement.id)}! +${achievement.xp} XP`, 'success');
            }
        }
    }

    getAchievementName(id) {
        const names = {
            'first-workout': 'First Steps',
            'streak-3': 'On Fire',
            'streak-7': 'Week Warrior',
            'streak-30': 'Month Master',
            'workouts-10': 'Dedicated',
            'workouts-50': 'Fitness Fanatic',
            'workouts-100': 'Century Club',
            'level-5': 'Rising Star',
            'level-10': 'Elite Athlete'
        };
        return names[id] || id;
    }

    // Workout Management
    async addWorkout(name, type, duration, intensity) {
        if (!this.currentUser || !this.currentUser.id) {
            throw new Error('User not authenticated');
        }

        const xp = this.calculateXP(duration, intensity);
        
        try {
            await this.db.addWorkout(this.currentUser.id, {
                name,
                type,
                duration,
                intensity,
                xp
            });

            this.userData.totalWorkouts += 1;
            await this.updateStreak();
            await this.addXP(xp);
            await this.checkAchievements();
            
            await this.loadUserData();
            
            this.showToast(`Workout logged! +${xp} XP earned!`, 'success');
            this.updateWorkouts();
            this.updateDashboard();
            this.updateAchievements();
            this.updateLeaderboard();
        } catch (error) {
            console.error('Error in addWorkout:', error);
            throw error;
        }
    }

    // UI Updates
    updateDashboard() {
        if (!this.userData) return;

        document.getElementById('userName').textContent = this.userData.name;
        document.getElementById('userLevel').textContent = this.userData.level;
        document.getElementById('totalXP').textContent = this.userData.xp.toLocaleString();
        document.getElementById('currentStreak').textContent = this.userData.streak;
        document.getElementById('totalWorkouts').textContent = this.userData.totalWorkouts;
        document.getElementById('totalBadges').textContent = this.userData.badges.length;

        // Level Progress
        const currentLevelXP = this.getXPForCurrentLevel(this.userData.level);
        const nextLevelXP = this.getXPForNextLevel(this.userData.level);
        const currentProgress = this.userData.xp - currentLevelXP;
        const neededProgress = nextLevelXP - currentLevelXP;
        const progressPercent = (currentProgress / neededProgress) * 100;

        document.getElementById('levelProgress').style.width = `${Math.min(progressPercent, 100)}%`;
        document.getElementById('currentXP').textContent = currentProgress;
        document.getElementById('nextLevelXP').textContent = neededProgress;

        // Recent Badges
        const recentBadges = this.userData.badges.slice(-3).reverse();
        const badgesContainer = document.getElementById('recentBadges');
        
        if (recentBadges.length === 0) {
            badgesContainer.innerHTML = '<p class="empty-state">Complete workouts to earn achievements!</p>';
        } else {
            badgesContainer.innerHTML = recentBadges.map(badgeId => {
                const name = this.getAchievementName(badgeId);
                return `
                    <div class="badge-item">
                        <i class="fas fa-trophy"></i>
                        <span>${name}</span>
                    </div>
                `;
            }).join('');
        }
    }

    updateWorkouts() {
        const container = document.getElementById('workoutsContainer');
        
        if (this.workouts.length === 0) {
            container.innerHTML = '<p class="empty-state">No workouts logged yet. Start your fitness journey!</p>';
            return;
        }

        container.innerHTML = this.workouts.map(workout => {
            const date = new Date(workout.created_at || workout.date);
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });

            return `
                <div class="workout-card">
                    <div class="workout-card-header">
                        <div>
                            <div class="workout-card-title">${workout.name}</div>
                            <span class="workout-card-type">${workout.type}</span>
                        </div>
                        <div class="workout-card-xp">+${workout.xp} XP</div>
                    </div>
                    <div class="workout-card-details">
                        <span><i class="fas fa-clock"></i> ${workout.duration} min</span>
                        <span><i class="fas fa-bolt"></i> ${workout.intensity}</span>
                        <span><i class="fas fa-calendar"></i> ${dateStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAchievements() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            const achievementId = card.dataset.achievement;
            const isUnlocked = this.achievements.includes(achievementId);
            
            if (isUnlocked) {
                card.classList.add('unlocked');
                const statusDiv = card.querySelector('.achievement-status');
                statusDiv.classList.remove('locked');
                statusDiv.classList.add('unlocked');
                statusDiv.innerHTML = '<i class="fas fa-check"></i> Unlocked';
            }
        });
    }

    async updateLeaderboard() {
        const container = document.getElementById('leaderboardList');
        
        try {
            const allUsers = await this.db.getAllUsers();
            const leaderboardData = allUsers
                .map(user => ({
                    id: user.id,
                    name: user.name,
                    xp: user.xp || 0,
                    level: user.level || 1,
                    isCurrentUser: this.currentUser && user.id === this.currentUser.id
                }))
                .sort((a, b) => b.xp - a.xp)
                .slice(0, 100); // Top 100 (already sorted by Supabase query)

            if (leaderboardData.length === 0) {
                container.innerHTML = '<p class="empty-state">No leaderboard data yet. Start working out!</p>';
                return;
            }

            container.innerHTML = leaderboardData.map((user, index) => {
                const rank = index + 1;
                const rankClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : '';
                const userClass = user.isCurrentUser ? 'current-user' : '';

                return `
                    <div class="leaderboard-item ${userClass}">
                        <div class="rank-number ${rankClass}">#${rank}</div>
                        <div class="user-name">
                            ${user.isCurrentUser ? '<i class="fas fa-user"></i>' : ''}
                            ${user.name}
                        </div>
                        <div class="user-xp">${user.xp.toLocaleString()} XP</div>
                        <div class="user-level">Level ${user.level}</div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Leaderboard error:', error);
            container.innerHTML = '<p class="empty-state">Error loading leaderboard</p>';
        }
    }

    updateProfile() {
        if (!this.userData) return;

        // If viewing another user's profile, don't update own profile
        if (this.viewingProfileId && this.viewingProfileId !== this.currentUser.id) {
            return;
        }

        document.getElementById('profileName').textContent = this.userData.name;
        document.getElementById('profileEmail').textContent = this.userData.email;
        document.getElementById('profileLevel').textContent = this.userData.level;
        document.getElementById('profileXP').textContent = this.userData.xp.toLocaleString();

        // Populate form
        document.getElementById('profileNameInput').value = this.userData.name;
        // Use dedicated columns first, fallback to profile JSONB
        document.getElementById('profileAge').value = this.userData.age || this.userData.profile?.age || '';
        document.getElementById('profileHeight').value = this.userData.height || this.userData.profile?.height || '';
        document.getElementById('profileWeight').value = this.userData.weight || this.userData.profile?.weight || '';
        document.getElementById('profileGoal').value = this.userData.fitness_goal || this.userData.profile?.fitness_goal || this.userData.profile?.fitnessGoal || '';
        document.getElementById('profileBio').value = this.userData.bio || this.userData.profile?.bio || '';
        
        // Update profile visibility setting
        if (this.userData.profile_visibility) {
            document.getElementById('profileVisibility').value = this.userData.profile_visibility;
        }

        // Load all settings
        this.loadProfileSettings();

        // Load all settings
        this.loadProfileSettings();
    }

    async viewUserProfile(userId) {
        if (!this.currentUser) return;

        try {
            const profile = await this.db.getUserProfile(userId);
            
            // Check profile visibility
            const visibility = profile.profile_visibility || 'public';
            const isFriend = this.friends.some(f => f.id === userId);
            
            if (visibility === 'private' && userId !== this.currentUser.id) {
                this.showToast('This profile is private', 'error');
                return;
            }
            
            if (visibility === 'friends' && !isFriend && userId !== this.currentUser.id) {
                this.showToast('This profile is only visible to friends', 'error');
                return;
            }

            this.viewingProfileId = userId;
            this.showOtherUserProfile(profile);
            this.showSection('profile');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="profile"]').classList.add('active');
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.showToast('Failed to load profile', 'error');
        }
    }

    showOtherUserProfile(profile) {
        // Hide own profile, show other user profile
        document.getElementById('myProfileContainer').style.display = 'none';
        document.getElementById('browseProfilesContainer').style.display = 'none';
        document.getElementById('otherUserProfileContainer').style.display = 'block';
        document.getElementById('profileModeSelector').style.display = 'none';
        document.getElementById('switchToMyProfileBtn').style.display = 'block';
        document.getElementById('viewPublicProfilesBtn').style.display = 'none';
        document.getElementById('profileSectionTitle').textContent = `${profile.name}'s Profile`;

        // Populate other user's profile
        document.getElementById('otherProfileName').textContent = profile.name;
        document.getElementById('otherProfileUsername').textContent = `@${profile.username}`;
        document.getElementById('otherProfileLevel').textContent = profile.level || 1;
        document.getElementById('otherProfileXP').textContent = (profile.xp || 0).toLocaleString();
        document.getElementById('otherProfileAge').textContent = profile.age || '-';
        document.getElementById('otherProfileHeight').textContent = profile.height ? `${profile.height} cm` : '-';
        document.getElementById('otherProfileWeight').textContent = profile.weight ? `${profile.weight} kg` : '-';
        document.getElementById('otherProfileGoal').textContent = this.formatFitnessGoal(profile.fitness_goal) || '-';
        document.getElementById('otherProfileBio').textContent = profile.bio || 'No bio yet';
        document.getElementById('otherTotalWorkouts').textContent = profile.total_workouts || 0;
        document.getElementById('otherStreak').textContent = profile.streak || 0;
        document.getElementById('otherBadges').textContent = (profile.badges || []).length;
    }

    showMyProfile() {
        this.viewingProfileId = null;
        document.getElementById('myProfileContainer').style.display = 'block';
        document.getElementById('otherUserProfileContainer').style.display = 'none';
        document.getElementById('browseProfilesContainer').style.display = 'none';
        document.getElementById('profileModeSelector').style.display = 'flex';
        document.getElementById('switchToMyProfileBtn').style.display = 'none';
        document.getElementById('viewPublicProfilesBtn').style.display = 'block';
        document.getElementById('profileSectionTitle').textContent = 'My Profile';
        this.updateProfile();
        this.switchProfileMode(this.profileMode);
    }

    showBrowseProfiles() {
        this.viewingProfileId = null;
        document.getElementById('myProfileContainer').style.display = 'none';
        document.getElementById('otherUserProfileContainer').style.display = 'none';
        document.getElementById('browseProfilesContainer').style.display = 'block';
        document.getElementById('profileModeSelector').style.display = 'none';
        document.getElementById('switchToMyProfileBtn').style.display = 'block';
        document.getElementById('viewPublicProfilesBtn').style.display = 'none';
        document.getElementById('profileSectionTitle').textContent = 'Browse Profiles';
    }

    switchProfileMode(mode) {
        this.profileMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Show/hide appropriate sections
        const editCard = document.getElementById('profileForm').closest('.profile-form-card');
        const settingsCard = document.getElementById('profileSettingsCard');
        
        if (mode === 'edit') {
            editCard.style.display = 'block';
            settingsCard.style.display = 'none';
        } else if (mode === 'view') {
            editCard.style.display = 'none';
            settingsCard.style.display = 'none';
        } else if (mode === 'settings') {
            editCard.style.display = 'none';
            settingsCard.style.display = 'block';
        }
    }

    formatFitnessGoal(goal) {
        const goals = {
            'weight-loss': 'Weight Loss',
            'muscle-gain': 'Muscle Gain',
            'endurance': 'Endurance',
            'flexibility': 'Flexibility',
            'general-fitness': 'General Fitness'
        };
        return goals[goal] || goal;
    }

    async browsePublicProfiles() {
        const username = document.getElementById('browseUsernameSearch').value.trim();
        if (!username) {
            this.showToast('Please enter a username', 'error');
            return;
        }

        try {
            const results = await this.db.searchUsersByUsername(username);
            const container = document.getElementById('browseProfilesResults');
            
            if (results.length === 0) {
                container.innerHTML = '<p class="empty-state">No users found</p>';
                return;
            }

            // Filter out current user
            const filteredResults = results.filter(u => u.id !== this.currentUser.id);
            
            if (filteredResults.length === 0) {
                container.innerHTML = '<p class="empty-state">No other users found</p>';
                return;
            }

            container.innerHTML = filteredResults.map(user => {
                return `
                    <div class="friend-card">
                        <div class="friend-card-header">
                            <div class="friend-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="friend-info">
                                <h3>${user.name}</h3>
                                <p>@${user.username} • Level ${user.level || 1}</p>
                            </div>
                        </div>
                        <div class="friend-stats">
                            <div class="friend-stat">
                                <span class="friend-stat-value">${user.level || 1}</span>
                                <span class="friend-stat-label">Level</span>
                            </div>
                            <div class="friend-stat">
                                <span class="friend-stat-value">${(user.xp || 0).toLocaleString()}</span>
                                <span class="friend-stat-label">XP</span>
                            </div>
                            <div class="friend-stat">
                                <span class="friend-stat-value">${user.total_workouts || 0}</span>
                                <span class="friend-stat-label">Workouts</span>
                            </div>
                        </div>
                        <div class="friend-actions">
                            <button class="btn btn-primary btn-small" onclick="window.fitnessGame.viewUserProfile('${user.id}')">
                                <i class="fas fa-eye"></i> View Profile
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Browse profiles error:', error);
            this.showToast('Error searching profiles', 'error');
        }
    }

    async saveProfileSettings() {
        if (!this.currentUser) {
            this.showToast('Please login to save settings', 'error');
            return;
        }

        try {
            // Collect all settings
            const settings = {
                profile_visibility: document.getElementById('profileVisibility').value,
                show_email_public: document.getElementById('showEmailPublic').checked,
                show_stats_public: document.getElementById('showStatsPublic').checked,
                email_notifications: document.getElementById('emailNotifications').checked,
                workout_reminders: document.getElementById('workoutReminders').checked,
                friend_requests_notifications: document.getElementById('friendRequestsNotifications').checked,
                achievement_notifications: document.getElementById('achievementNotifications').checked,
                units_system: document.getElementById('unitsSystem').value,
                date_format: document.getElementById('dateFormat').value,
                compact_view: document.getElementById('compactView').checked,
                default_workout_type: document.getElementById('defaultWorkoutType').value,
                streak_reminder_time: document.getElementById('streakReminderTime').value
            };

            // Save to database (store in profile JSONB field)
            await this.db.updateUserProfile(this.currentUser.id, { 
                profile_visibility: settings.profile_visibility,
                profile: {
                    ...(this.userData.profile || {}),
                    settings: settings
                }
            });

            // Update local userData
            if (!this.userData.profile) this.userData.profile = {};
            this.userData.profile.settings = settings;
            this.userData.profile_visibility = settings.profile_visibility;

            this.showToast('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving profile settings:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    loadProfileSettings() {
        if (!this.userData) return;

        // Load settings from userData.profile.settings or use defaults
        const settings = this.userData.profile?.settings || {};

        // Privacy Settings
        if (this.userData.profile_visibility) {
            document.getElementById('profileVisibility').value = this.userData.profile_visibility;
        }
        document.getElementById('showEmailPublic').checked = settings.show_email_public || false;
        document.getElementById('showStatsPublic').checked = settings.show_stats_public !== false; // default true

        // Notification Settings
        document.getElementById('emailNotifications').checked = settings.email_notifications !== false; // default true
        document.getElementById('workoutReminders').checked = settings.workout_reminders !== false; // default true
        document.getElementById('friendRequestsNotifications').checked = settings.friend_requests_notifications !== false; // default true
        document.getElementById('achievementNotifications').checked = settings.achievement_notifications !== false; // default true

        // Display Settings
        document.getElementById('unitsSystem').value = settings.units_system || 'metric';
        document.getElementById('dateFormat').value = settings.date_format || 'MM/DD/YYYY';
        document.getElementById('compactView').checked = settings.compact_view || false;

        // Activity Settings
        document.getElementById('defaultWorkoutType').value = settings.default_workout_type || 'cardio';
        document.getElementById('streakReminderTime').value = settings.streak_reminder_time || 'never';
    }

    async exportUserData() {
        if (!this.currentUser || !this.userData) {
            this.showToast('No data to export', 'error');
            return;
        }

        try {
            // Fetch all user data
            const workouts = await this.db.getWorkoutsByUserId(this.currentUser.id);
            const achievements = await this.db.getAchievementsByUserId(this.currentUser.id);
            const friends = await this.db.getFriendsList(this.currentUser.id);

            const exportData = {
                user: {
                    id: this.userData.id,
                    name: this.userData.name,
                    email: this.userData.email,
                    username: this.userData.username,
                    level: this.userData.level,
                    xp: this.userData.xp,
                    streak: this.userData.streak,
                    profile: this.userData.profile || {}
                },
                workouts: workouts || [],
                achievements: achievements || [],
                friends: friends || [],
                exported_at: new Date().toISOString()
            };

            // Create download
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `fitnessleveling-data-${this.userData.username}-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showToast('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Failed to export data', 'error');
        }
    }

    async deleteAccount() {
        if (!this.currentUser) {
            this.showToast('Not logged in', 'error');
            return;
        }

        // Double confirmation
        const confirm1 = confirm('Are you sure you want to delete your account? This will permanently delete all your data.');
        if (!confirm1) return;

        const confirm2 = confirm('This action CANNOT be undone. Type DELETE in the next prompt to confirm.');
        if (!confirm2) return;

        const confirm3 = prompt('Type DELETE to confirm account deletion:');
        if (confirm3 !== 'DELETE') {
            this.showToast('Account deletion cancelled', 'info');
            return;
        }

        try {
            // Delete user account from Supabase
            // Note: This requires proper RLS policies and may need admin function
            this.showToast('Account deletion requested. Please contact support for account deletion.', 'info');
            
            // For now, just sign out
            await this.logout();
            this.showToast('Account deletion feature coming soon. Please contact support.', 'info');
        } catch (error) {
            console.error('Error deleting account:', error);
            this.showToast('Failed to delete account. Please contact support.', 'error');
        }
    }

    async saveProfile() {
        if (!this.userData || !this.currentUser) {
            this.showToast('Please login to update profile', 'error');
            return;
        }

        try {
            this.userData.name = document.getElementById('profileNameInput').value.trim();
            
            // Save profile data to dedicated columns
            const profileData = {
                name: this.userData.name,
                age: document.getElementById('profileAge').value ? parseInt(document.getElementById('profileAge').value) : null,
                height: document.getElementById('profileHeight').value ? parseFloat(document.getElementById('profileHeight').value) : null,
                weight: document.getElementById('profileWeight').value ? parseFloat(document.getElementById('profileWeight').value) : null,
                fitness_goal: document.getElementById('profileGoal').value || null,
                bio: document.getElementById('profileBio').value.trim() || null
            };

            // Update userData for local state
            this.userData.profile = profileData;

            // Save to database with dedicated columns
            await this.db.updateUserProfile(this.currentUser.id, profileData);

            // Also update local userData
            this.userData.age = profileData.age;
            this.userData.height = profileData.height;
            this.userData.weight = profileData.weight;
            this.userData.fitness_goal = profileData.fitness_goal;
            this.userData.bio = profileData.bio;

            this.updateProfile();
            this.updateDashboard();
            this.showToast('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Error saving profile:', error);
            this.showToast(`Error: ${error.message || 'Failed to save profile. Check console for details.'}`, 'error');
        }
    }

    async updatePassword(currentPassword, newPassword) {
        if (!this.currentUser) return false;

        try {
            // Supabase handles password updates directly through auth
            await this.db.updatePassword(newPassword);
            this.showToast('Password updated successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Password update error:', error);
            this.showToast(error.message || 'Error updating password', 'error');
            return false;
        }
    }

    updateNavbar() {
        const authNavItem = document.getElementById('authNavItem');
        if (this.currentUser) {
            authNavItem.innerHTML = `
                <a href="#" class="nav-link" id="logoutLink">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
            document.getElementById('logoutLink').addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        } else {
            authNavItem.innerHTML = `
                <a href="#" class="nav-link" id="loginLink" data-section="login">Login</a>
            `;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Mobile Menu Toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });

            // Close mobile menu when clicking a nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Block access to all sections except login/signup if not authenticated
                if (!this.currentUser) {
                    const section = link.dataset.section;
                    if (section === 'login' || section === 'signup') {
                        this.showSection(section);
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    } else {
                        this.showToast('Please login to access this section', 'info');
                        this.showSection('login');
                        // Update login link as active
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        const loginLink = document.querySelector('[data-section="login"]');
                        if (loginLink) loginLink.classList.add('active');
                    }
                    return;
                }
                
                // User is authenticated, allow navigation
                const section = link.dataset.section;
                if (section) {
                    this.showSection(section);
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Load friends data when navigating to friends section
                    if (section === 'friends') {
                        this.updateFriends();
                    }
                    
                    // Reset to own profile when navigating to profile section
                    if (section === 'profile' && !this.viewingProfileId) {
                        this.showMyProfile();
                    }
                }
            });
        });

        // Login Form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            await this.login(username, password);
        });

        // Signup Form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value.trim();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                this.showToast('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                this.showToast('Password must be at least 6 characters', 'error');
                return;
            }

            await this.signup(username, name, email, password);
        });

        // Show Signup
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('signup');
        });

        // Show Login
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('login');
        });

        // Workout Form
        document.getElementById('addWorkoutBtn')?.addEventListener('click', () => {
            if (!this.currentUser) {
                this.showToast('Please login to log workouts', 'info');
                return;
            }
            document.getElementById('workoutForm').classList.remove('hidden');
        });

        document.getElementById('cancelWorkoutBtn')?.addEventListener('click', () => {
            document.getElementById('workoutForm').classList.add('hidden');
            this.resetWorkoutForm();
        });

        document.getElementById('saveWorkoutBtn')?.addEventListener('click', () => {
            this.saveWorkout();
        });

        // Profile Form
        document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProfile();
        });

        // Password Form
        document.getElementById('passwordForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                this.showToast('New passwords do not match', 'error');
                return;
            }

            if (newPassword.length < 6) {
                this.showToast('Password must be at least 6 characters', 'error');
                return;
            }

            await this.updatePassword(currentPassword, newPassword);
            document.getElementById('passwordForm').reset();
        });

        // Leaderboard Filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateLeaderboard();
            });
        });

        // Friends Section
        document.getElementById('addFriendBtn')?.addEventListener('click', () => {
            document.getElementById('addFriendForm').classList.toggle('hidden');
        });

        document.getElementById('searchUserBtn')?.addEventListener('click', () => {
            this.searchUsers();
        });

        // Friends Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });

        // Profile Switching
        document.getElementById('switchToMyProfileBtn')?.addEventListener('click', () => {
            this.showMyProfile();
        });

        document.getElementById('viewPublicProfilesBtn')?.addEventListener('click', () => {
            this.showBrowseProfiles();
        });

        // Profile Mode Selector
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchProfileMode(mode);
            });
        });

        // Browse Profiles Search
        document.getElementById('browseSearchBtn')?.addEventListener('click', () => {
            this.browsePublicProfiles();
        });

        // Profile Settings Form
        document.getElementById('profileSettingsForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProfileSettings();
        });

        // Export Data Button
        document.getElementById('exportDataBtn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.exportUserData();
        });

        // Delete Account Button
        document.getElementById('deleteAccountBtn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.deleteAccount();
        });
    }

    // Friends System
    async searchUsers() {
        const username = document.getElementById('searchUsername').value.trim();
        if (!username) {
            this.showToast('Please enter a username', 'error');
            return;
        }

        try {
            const results = await this.db.searchUsersByUsername(username);
            const container = document.getElementById('searchResults');
            
            if (results.length === 0) {
                container.innerHTML = '<p class="empty-state">No users found</p>';
                return;
            }

            // Filter out current user
            const filteredResults = results.filter(u => u.id !== this.currentUser.id);
            
            if (filteredResults.length === 0) {
                container.innerHTML = '<p class="empty-state">No other users found</p>';
                return;
            }

            container.innerHTML = filteredResults.map(user => {
                const isFriend = this.friends.some(f => f.id === user.id);
                const hasPendingRequest = this.pendingRequests.some(r => r.id === user.id);
                
                return `
                    <div class="search-result-item">
                        <div class="search-result-info">
                            <h3>${user.name}</h3>
                            <p>@${user.username} • Level ${user.level} • ${user.xp || 0} XP</p>
                        </div>
                        <div>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${isFriend ? 
                                    '<span class="btn btn-secondary btn-small">Already Friends</span>' :
                                    hasPendingRequest ?
                                    '<span class="btn btn-secondary btn-small">Request Pending</span>' :
                                    `<button class="btn btn-primary btn-small" onclick="window.fitnessGame.sendFriendRequest('${user.id}')">
                                        <i class="fas fa-user-plus"></i> Add Friend
                                    </button>`
                                }
                                <button class="btn btn-secondary btn-small" onclick="window.fitnessGame.viewUserProfile('${user.id}')">
                                    <i class="fas fa-eye"></i> View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Error searching users', 'error');
        }
    }

    async sendFriendRequest(friendId) {
        if (!this.currentUser) return;

        try {
            await this.db.sendFriendRequest(this.currentUser.id, friendId);
            this.showToast('Friend request sent!', 'success');
            await this.updateFriends();
            this.searchUsers(); // Refresh search results
        } catch (error) {
            console.error('Friend request error:', error);
            this.showToast(error.message || 'Failed to send friend request', 'error');
        }
    }

    async acceptFriendRequest(friendId) {
        if (!this.currentUser) return;

        try {
            await this.db.acceptFriendRequest(this.currentUser.id, friendId);
            this.showToast('Friend request accepted!', 'success');
            await this.updateFriends();
        } catch (error) {
            console.error('Accept friend error:', error);
            this.showToast('Failed to accept friend request', 'error');
        }
    }

    async rejectFriendRequest(friendId) {
        if (!this.currentUser) return;

        try {
            await this.db.rejectFriendRequest(this.currentUser.id, friendId);
            this.showToast('Friend request rejected', 'info');
            await this.updateFriends();
        } catch (error) {
            console.error('Reject friend error:', error);
            this.showToast('Failed to reject friend request', 'error');
        }
    }

    async updateFriends() {
        if (!this.currentUser) return;

        try {
            this.friends = await this.db.getFriends(this.currentUser.id);
            this.pendingRequests = await this.db.getPendingRequests(this.currentUser.id);
            
            this.renderFriends();
            this.renderPendingRequests();
        } catch (error) {
            console.error('Update friends error:', error);
        }
    }

    renderFriends() {
        const container = document.getElementById('friendsContainer');
        
        if (this.friends.length === 0) {
            container.innerHTML = '<p class="empty-state">No friends yet. Add some friends to see their progress!</p>';
            return;
        }

        container.innerHTML = this.friends.map(friend => {
            return `
                <div class="friend-card">
                    <div class="friend-card-header">
                        <div class="friend-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="friend-info">
                            <h3>${friend.name}</h3>
                            <p>@${friend.username}</p>
                        </div>
                    </div>
                    <div class="friend-stats">
                        <div class="friend-stat">
                            <span class="friend-stat-value">${friend.level || 1}</span>
                            <span class="friend-stat-label">Level</span>
                        </div>
                        <div class="friend-stat">
                            <span class="friend-stat-value">${(friend.xp || 0).toLocaleString()}</span>
                            <span class="friend-stat-label">XP</span>
                        </div>
                        <div class="friend-stat">
                            <span class="friend-stat-value">${friend.total_workouts || 0}</span>
                            <span class="friend-stat-label">Workouts</span>
                        </div>
                        <div class="friend-stat">
                            <span class="friend-stat-value">${friend.streak || 0}</span>
                            <span class="friend-stat-label">Streak</span>
                        </div>
                    </div>
                    <div class="friend-actions">
                        <button class="btn btn-primary btn-small" onclick="window.fitnessGame.viewUserProfile('${friend.id}')">
                            <i class="fas fa-user"></i> View Profile
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPendingRequests() {
        const container = document.getElementById('pendingRequestsContainer');
        
        if (this.pendingRequests.length === 0) {
            container.innerHTML = '<p class="empty-state">No pending requests</p>';
            return;
        }

        container.innerHTML = this.pendingRequests.map(request => {
            return `
                <div class="request-card">
                    <div class="request-info">
                        <div class="friend-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div>
                            <h3>${request.name}</h3>
                            <p>@${request.username} • Level ${request.level}</p>
                        </div>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-primary btn-small" onclick="window.fitnessGame.acceptFriendRequest('${request.id}')">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="window.fitnessGame.rejectFriendRequest('${request.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async viewFriendProgress(friendId) {
        // Redirect to viewUserProfile for better UI
        await this.viewUserProfile(friendId);
    }

    showSection(sectionId) {
        // Block access to protected sections if not authenticated
        const protectedSections = ['dashboard', 'workouts', 'achievements', 'leaderboard', 'friends', 'profile'];
        if (protectedSections.includes(sectionId) && !this.currentUser) {
            this.hideAllSections();
            this.showSection('login');
            this.showToast('Please login to access this section', 'info');
            return;
        }
        
        // Remove the initial hide style if user is authenticated (allows sections to show)
        if (this.currentUser) {
            const initialStyle = document.getElementById('initialHideStyle');
            if (initialStyle) {
                initialStyle.remove();
            }
        }
        
        // Hide all sections first
        this.hideAllSections();
        
        // Show requested section with !important to override any remaining inline styles
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            section.style.setProperty('display', 'block', 'important');
        }
    }

    async saveWorkout() {
        if (!this.currentUser) {
            this.showToast('Please login to log workouts', 'info');
            return;
        }

        const name = document.getElementById('workoutName').value.trim();
        const type = document.getElementById('workoutType').value;
        const duration = parseInt(document.getElementById('workoutDuration').value);
        const intensity = document.getElementById('workoutIntensity').value;

        if (!name || !duration || duration < 1) {
            this.showToast('Please fill in all fields correctly', 'error');
            return;
        }

        try {
            await this.addWorkout(name, type, duration, intensity);
            document.getElementById('workoutForm').classList.add('hidden');
            this.resetWorkoutForm();
            this.showSection('dashboard');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            const dashboardLink = document.querySelector('[data-section="dashboard"]');
            if (dashboardLink) dashboardLink.classList.add('active');
        } catch (error) {
            console.error('Error saving workout:', error);
            this.showToast(`Error: ${error.message || 'Failed to save workout. Check console for details.'}`, 'error');
        }
    }

    resetWorkoutForm() {
        document.getElementById('workoutName').value = '';
        document.getElementById('workoutType').value = 'cardio';
        document.getElementById('workoutDuration').value = '';
        document.getElementById('workoutIntensity').value = 'medium';
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');

        toast.className = `toast ${type}`;
        
        if (type === 'success') {
            icon.className = 'toast-icon fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'toast-icon fas fa-exclamation-circle';
        } else {
            icon.className = 'toast-icon fas fa-info-circle';
        }

        messageEl.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app - Run immediately to prevent flash of content
(function() {
    // Hide all sections immediately before JS loads
    document.addEventListener('DOMContentLoaded', () => {
        // Hide all sections first
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        
        // Only show login section
        const loginSection = document.getElementById('login');
        if (loginSection) {
            loginSection.classList.add('active');
            loginSection.style.display = 'block';
        }
        
        // Initialize app
        window.fitnessGame = new FitnessGame();
    });
    
    // Also run immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for DOMContentLoaded
    } else {
        // DOM is already loaded, run immediately
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        const loginSection = document.getElementById('login');
        if (loginSection) {
            loginSection.classList.add('active');
            loginSection.style.display = 'block';
        }
        window.fitnessGame = new FitnessGame();
    }
})();
