# Database Setup Instructions

## ✅ Step 1: Configuration Complete!

Your Supabase credentials are configured:
- **URL**: `https://vpsodiippwabpivlhery.supabase.co` ✅
- **Anon Key**: Configured ✅

## 📋 Step 2: Set Up Database Schema

Now you need to create the database tables in Supabase:

### Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `vpsodiippwabpivlhery`

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query** button

3. **Run the Schema**
   - Open the file `supabase-schema.sql` in your project
   - Copy **ALL** the contents (142 lines)
   - Paste into the SQL Editor
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter` on Mac)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - If you see errors, check the error message

### What This Creates:

✅ **users** table - Stores user profiles and progress
✅ **workouts** table - Stores all workout entries
✅ **achievements** table - Stores unlocked achievements
✅ **Indexes** - For fast queries
✅ **Row Level Security** - Protects user data
✅ **Triggers** - Auto-creates user profiles on signup

## 🧪 Step 3: Test the Connection

1. **Refresh your app** in the browser (http://localhost:8000)
2. **Try signing up** with a new account:
   - Email: test@example.com
   - Username: testuser
   - Password: test123456
   - Name: Test User

3. **Verify in Supabase**:
   - Go to **Table Editor** → **users**
   - You should see your new user profile!

## 🎉 Step 4: You're Done!

Once the schema is set up, your app is fully connected to Supabase!

### Features Now Available:
- ✅ Cloud data storage
- ✅ Cross-device sync
- ✅ Global leaderboard
- ✅ Secure authentication
- ✅ Data backup

## ❌ Troubleshooting

### "Relation does not exist" error
- Make sure you ran the entire SQL schema
- Check that all tables were created in **Table Editor**

### "Policy violation" error
- Make sure RLS policies were created
- Check **Authentication** → **Policies** in Supabase

### "Trigger does not exist" error
- The trigger should be created automatically
- Check **Database** → **Functions** in Supabase

### Can't sign up
- Check browser console for errors
- Verify Supabase URL and key are correct
- Make sure SQL schema ran successfully

## Need Help?

Check the browser console (F12) for any error messages and share them if you need assistance!

