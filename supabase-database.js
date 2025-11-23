// Supabase Database Wrapper
// This replaces the IndexedDB implementation with Supabase

class SupabaseDatabase {
    constructor() {
        this.client = null;
        this.currentUser = null;
    }

    async init() {
        this.client = getSupabaseClient();
        if (!this.client) {
            throw new Error('Supabase client not initialized');
        }
        
        // Check for existing session
        const { data: { session } } = await this.client.auth.getSession();
        if (session) {
            this.currentUser = session.user;
        }
        
        return this.client;
    }

    // Authentication Methods
    async signUp(email, password, userData) {
        const { data, error } = await this.client.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: userData.username,
                    name: userData.name || userData.username
                }
            }
        });

        if (error) throw error;

        // Note: User profile is automatically created by the database trigger
        // But we can also manually insert if needed (trigger handles it)
        if (data.user) {
            this.currentUser = data.user;
            
            // Wait a moment for trigger to create profile, then verify
            setTimeout(async () => {
                try {
                    const profile = await this.getUserProfile(data.user.id);
                    if (!profile) {
                        // Fallback: manually create profile if trigger didn't work
                        await this.client
                            .from('users')
                            .insert({
                                id: data.user.id,
                                email: email,
                                username: userData.username,
                                name: userData.name || userData.username,
                                xp: 0,
                                level: 1,
                                streak: 0,
                                total_workouts: 0,
                                badges: [],
                                age: null,
                                height: null,
                                weight: null,
                                fitness_goal: null,
                                bio: null,
                                profile: {}
                            });
                    }
                } catch (err) {
                    console.error('Profile verification error:', err);
                }
            }, 500);
        }

        return data;
    }

    async signIn(email, password) {
        const { data, error } = await this.client.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        this.currentUser = data.user;
        return data;
    }

    async getUserByUsername(username) {
        const { data, error } = await this.client
            .from('users')
            .select('email, username')
            .eq('username', username)
            .single();

        if (error) throw error;
        return data;
    }

    async signInWithUsername(username, password) {
        // First, get the user's email by username
        const userData = await this.getUserByUsername(username);
        
        if (!userData || !userData.email) {
            throw new Error('Username not found');
        }

        // Then sign in with email
        return await this.signIn(userData.email, password);
    }

    async signOut() {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
        this.currentUser = null;
    }

    async getCurrentUser() {
        const { data: { user } } = await this.client.auth.getUser();
        this.currentUser = user;
        return user;
    }

    async getSession() {
        const { data: { session } } = await this.client.auth.getSession();
        return session;
    }

    // User Profile Methods
    async getUserProfile(userId) {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    async updateUserProfile(userId, updates) {
        if (!this.client) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.client
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Supabase profile update error:', error);
            throw new Error(error.message || 'Failed to update profile. Check RLS policies.');
        }
        return data;
    }

    async getAllUsers() {
        const { data, error } = await this.client
            .from('users')
            .select('id, name, xp, level, username')
            .order('xp', { ascending: false })
            .limit(100);

        if (error) throw error;
        return data || [];
    }

    // Workout Methods
    async addWorkout(userId, workoutData) {
        if (!this.client) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.client
            .from('workouts')
            .insert({
                user_id: userId,
                name: workoutData.name,
                type: workoutData.type,
                duration: workoutData.duration,
                intensity: workoutData.intensity,
                xp: workoutData.xp
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase workout insert error:', error);
            throw new Error(error.message || 'Failed to save workout. Check RLS policies.');
        }
        return data;
    }

    async getWorkoutsByUserId(userId) {
        const { data, error } = await this.client
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }

    // Achievement Methods
    async addAchievement(userId, achievementId) {
        // Check if achievement already exists
        const { data: existing } = await this.client
            .from('achievements')
            .select('*')
            .eq('user_id', userId)
            .eq('achievement_id', achievementId)
            .single();

        if (existing) {
            return existing;
        }

        const { data, error } = await this.client
            .from('achievements')
            .insert({
                user_id: userId,
                achievement_id: achievementId
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getAchievementsByUserId(userId) {
        const { data, error } = await this.client
            .from('achievements')
            .select('achievement_id')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []).map(a => a.achievement_id);
    }

    // Real-time subscriptions (optional)
    subscribeToLeaderboard(callback) {
        return this.client
            .channel('leaderboard-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'users' },
                callback
            )
            .subscribe();
    }

    // Password update (handled by Supabase Auth)
    async updatePassword(newPassword) {
        const { data, error } = await this.client.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        return data;
    }
}

