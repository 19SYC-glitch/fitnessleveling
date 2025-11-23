# FitnessLeveling - Gamified Fitness Tracker

**Website URL**: [fitnessleveling.com](https://fitnessleveling.com) (suggested)

A modern, gamified fitness web application that makes working out fun and engaging through points, levels, achievements, and streaks.

## Features

### 🔐 User Authentication
- **Sign Up**: Create a new account with username, email, and password
- **Login**: Secure login system with password verification
- **Session Management**: Stay logged in across browser sessions
- **User Profiles**: Customizable profiles with personal information

### 🏋️ Fitness Tracking
- Log workouts with details (name, type, duration, intensity)
- Track workout history
- View statistics and progress
- Personal workout dashboard

### 🎮 Gamification System
- **XP System**: Earn experience points for each workout
- **Levels**: Level up as you gain XP
- **Streaks**: Maintain daily workout streaks
- **Achievements**: Unlock badges for milestones
- **Leaderboard**: Compete with other users globally

### 🏆 Achievements
- First Steps - Complete your first workout
- On Fire - 3 day workout streak
- Week Warrior - 7 day workout streak
- Month Master - 30 day workout streak
- Dedicated - Complete 10 workouts
- Fitness Fanatic - Complete 50 workouts
- Century Club - Complete 100 workouts
- Rising Star - Reach Level 5
- Elite Athlete - Reach Level 10

### 👤 User Profiles
- Edit personal information (name, age, height, weight)
- Set fitness goals
- Add bio and personal details
- Change password securely

### 💎 Modern UI
- Dark theme with gradient accents
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive navigation
- Beautiful login/signup pages

## How to Use

1. Open `index.html` in a web browser
2. **Sign Up** for a new account or **Login** if you already have one
3. Navigate to the "Workouts" section
4. Click "New Workout" to log a workout
5. Fill in the workout details and save
6. Earn XP and unlock achievements as you progress!
7. Check the **Leaderboard** to see how you rank
8. Update your **Profile** with personal information

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks required
- **IndexedDB** - Robust database storage for user data
- **Session Management** - Secure authentication system
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Font Awesome Icons** - Beautiful iconography

## XP Calculation

XP is calculated based on:
- **Duration**: Base XP = workout duration in minutes
- **Intensity Multiplier**:
  - Low: 1x
  - Medium: 1.5x
  - High: 2x

## Level System

Levels are calculated using the formula:
```
Level = floor(sqrt(XP / 100)) + 1
```

Each level requires progressively more XP to advance.

## Data Storage

All data is stored locally in your browser using **IndexedDB**:
- **Users**: User accounts with authentication
- **Workouts**: Complete workout history per user
- **Achievements**: Unlocked achievements per user
- **User Progress**: XP, level, streak, and profile data

### Database Structure
- **Users Store**: User accounts, profiles, and progress
- **Workouts Store**: All workout entries linked to users
- **Achievements Store**: Achievement unlocks per user

### Security
- Passwords are hashed before storage
- Session management for secure authentication
- User data is isolated per account

## Account Management

### Creating an Account
1. Click "Sign Up" on the login page
2. Enter username, display name, email, and password
3. Password must be at least 6 characters
4. Your account is created and you're automatically logged in

### Profile Management
- Edit your display name, age, height, weight
- Set your fitness goal
- Add a personal bio
- Change your password anytime

### Logout
- Click "Logout" in the navigation bar
- Your session ends but data is saved
- Login again to continue your progress

## Future Enhancements

Potential features for expansion:
- Social features (friends, challenges)
- Exercise library with instructions
- Workout plans and programs
- Nutrition tracking
- Progress photos
- Export/import data
- Email verification
- Password recovery

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Enjoy your fitness journey! 💪

