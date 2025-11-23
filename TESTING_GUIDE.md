# Testing Your FitnessLeveling App

## ✅ Database Setup Complete!

Your Supabase database is now configured with:
- ✅ Users table
- ✅ Workouts table  
- ✅ Achievements table
- ✅ Security policies
- ✅ Auto-triggers

## 🧪 Test Your App

### Step 1: Refresh Your Browser
1. Go to http://localhost:8000
2. **Hard refresh** the page:
   - **Mac**: `Cmd + Shift + R`
   - **Windows/Linux**: `Ctrl + Shift + R`

### Step 2: Test Sign Up
1. Click **"Sign Up"** or go to the signup page
2. Create a test account:
   - **Username**: `testuser`
   - **Name**: `Test User`
   - **Email**: `test@example.com` (or any email)
   - **Password**: `test123456` (min 6 characters)
3. Click **"Sign Up"**

**Expected Result**: 
- ✅ You should see "Account created successfully!"
- ✅ You should be redirected to the Dashboard
- ✅ Your name should appear at the top

### Step 3: Verify in Supabase
1. Go to your Supabase dashboard
2. Click **Table Editor** → **users**
3. You should see your new user profile!

### Step 4: Test Workout Logging
1. Click **"Workouts"** in the navigation
2. Click **"New Workout"**
3. Fill in:
   - **Name**: "Morning Run"
   - **Type**: Cardio
   - **Duration**: 30
   - **Intensity**: Medium
4. Click **"Save Workout"**

**Expected Result**:
- ✅ Toast notification: "Workout logged! +45 XP earned!"
- ✅ Workout appears in your workout history
- ✅ XP increases on dashboard
- ✅ Check Supabase → **workouts** table to see the entry

### Step 5: Test Leaderboard
1. Click **"Leaderboard"** in navigation
2. You should see yourself on the leaderboard!

### Step 6: Test Profile
1. Click **"Profile"** in navigation
2. Update your profile:
   - Change your name
   - Add age, height, weight
   - Set fitness goal
   - Add a bio
3. Click **"Save Changes"**

**Expected Result**:
- ✅ Profile updates successfully
- ✅ Changes persist after refresh

### Step 7: Test Logout/Login
1. Click **"Logout"**
2. You should be redirected to login page
3. Login with your credentials
4. All your data should still be there!

## 🎉 Success Checklist

- [ ] Can sign up new account
- [ ] User appears in Supabase users table
- [ ] Can log workouts
- [ ] Workouts appear in Supabase workouts table
- [ ] XP and level increase correctly
- [ ] Leaderboard shows users
- [ ] Profile updates work
- [ ] Logout/login works
- [ ] Data persists after refresh

## 🐛 Troubleshooting

### "Supabase client not initialized"
- Check browser console (F12) for errors
- Verify `supabase-config.js` has correct URL and key
- Make sure Supabase JS library is loaded

### "Row Level Security policy violation"
- Check that RLS policies were created
- Verify you're logged in
- Check browser console for specific error

### "User profile not created"
- Check Supabase → **Database** → **Functions**
- Verify `handle_new_user()` function exists
- Check **Database** → **Triggers** for `on_auth_user_created`

### Can't see data in Supabase
- Make sure you're looking at the right project
- Check **Table Editor** for the tables
- Verify RLS policies allow viewing

## 🚀 Next Steps

Once everything works:
1. **Test on different devices** - Data should sync!
2. **Create multiple accounts** - Test the leaderboard
3. **Try different workouts** - Test XP calculation
4. **Unlock achievements** - Complete milestones

## 📊 Monitor Your Database

In Supabase dashboard:
- **Table Editor**: View all your data
- **SQL Editor**: Run custom queries
- **Authentication**: See all users
- **Logs**: Monitor API requests

Enjoy your fully functional FitnessLeveling app! 💪

