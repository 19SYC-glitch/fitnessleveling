// IndexedDB Database Wrapper
class FitnessDatabase {
    constructor() {
        this.dbName = 'FitnessLevelingDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('username', 'username', { unique: true });
                }

                // Workouts store (linked to userId)
                if (!db.objectStoreNames.contains('workouts')) {
                    const workoutsStore = db.createObjectStore('workouts', { keyPath: 'id', autoIncrement: true });
                    workoutsStore.createIndex('userId', 'userId', { unique: false });
                    workoutsStore.createIndex('date', 'date', { unique: false });
                }

                // Achievements store (linked to userId)
                if (!db.objectStoreNames.contains('achievements')) {
                    const achievementsStore = db.createObjectStore('achievements', { keyPath: 'id', autoIncrement: true });
                    achievementsStore.createIndex('userId', 'userId', { unique: false });
                    achievementsStore.createIndex('achievementId', 'achievementId', { unique: false });
                }
            };
        });
    }

    // User Operations
    async createUser(userData) {
        const transaction = this.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        
        const user = {
            username: userData.username,
            email: userData.email,
            password: await this.hashPassword(userData.password),
            name: userData.name || userData.username,
            xp: 0,
            level: 1,
            streak: 0,
            lastWorkoutDate: null,
            totalWorkouts: 0,
            badges: [],
            createdAt: new Date().toISOString(),
            profile: {
                age: null,
                height: null,
                weight: null,
                fitnessGoal: null,
                bio: null
            }
        };

        return new Promise((resolve, reject) => {
            const request = store.add(user);
            request.onsuccess = () => resolve({ ...user, id: request.result });
            request.onerror = () => reject(request.error);
        });
    }

    async getUserByEmail(email) {
        const transaction = this.db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('email');

        return new Promise((resolve, reject) => {
            const request = index.get(email);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUserById(userId) {
        const transaction = this.db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');

        return new Promise((resolve, reject) => {
            const request = store.get(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateUser(userId, updates) {
        const transaction = this.db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');

        return new Promise(async (resolve, reject) => {
            const getRequest = store.get(userId);
            getRequest.onsuccess = async () => {
                const user = getRequest.result;
                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                // Update user data
                Object.assign(user, updates);
                if (updates.password) {
                    user.password = await this.hashPassword(updates.password);
                }

                const updateRequest = store.put(user);
                updateRequest.onsuccess = () => resolve(user);
                updateRequest.onerror = () => reject(updateRequest.error);
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    async getAllUsers() {
        const transaction = this.db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');

        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Workout Operations
    async addWorkout(userId, workoutData) {
        const transaction = this.db.transaction(['workouts'], 'readwrite');
        const store = transaction.objectStore('workouts');

        const workout = {
            userId: userId,
            name: workoutData.name,
            type: workoutData.type,
            duration: workoutData.duration,
            intensity: workoutData.intensity,
            xp: workoutData.xp,
            date: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(workout);
            request.onsuccess = () => resolve({ ...workout, id: request.result });
            request.onerror = () => reject(request.error);
        });
    }

    async getWorkoutsByUserId(userId) {
        const transaction = this.db.transaction(['workouts'], 'readonly');
        const store = transaction.objectStore('workouts');
        const index = store.index('userId');

        return new Promise((resolve, reject) => {
            const request = index.getAll(userId);
            request.onsuccess = () => {
                const workouts = request.result;
                workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
                resolve(workouts);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Achievement Operations
    async addAchievement(userId, achievementId) {
        const transaction = this.db.transaction(['achievements'], 'readwrite');
        const store = transaction.objectStore('achievements');

        // Check if achievement already exists
        const index = store.index('userId');
        const existing = await new Promise((resolve) => {
            const request = index.getAll(userId);
            request.onsuccess = () => {
                const achievements = request.result;
                resolve(achievements.find(a => a.achievementId === achievementId));
            };
            request.onerror = () => resolve(null);
        });

        if (existing) {
            return existing;
        }

        const achievement = {
            userId: userId,
            achievementId: achievementId,
            unlockedAt: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(achievement);
            request.onsuccess = () => resolve({ ...achievement, id: request.result });
            request.onerror = () => reject(request.error);
        });
    }

    async getAchievementsByUserId(userId) {
        const transaction = this.db.transaction(['achievements'], 'readonly');
        const store = transaction.objectStore('achievements');
        const index = store.index('userId');

        return new Promise((resolve, reject) => {
            const request = index.getAll(userId);
            request.onsuccess = () => {
                const achievements = request.result.map(a => a.achievementId);
                resolve(achievements);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Password Hashing (simple hash for demo - in production use proper hashing)
    async hashPassword(password) {
        // Simple hash function for demo purposes
        // In production, use Web Crypto API or a proper hashing library
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    async verifyPassword(password, hashedPassword) {
        const hash = await this.hashPassword(password);
        return hash === hashedPassword;
    }
}

