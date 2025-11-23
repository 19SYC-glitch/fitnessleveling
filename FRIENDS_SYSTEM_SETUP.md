# Friends System Setup Guide

## ✅ What's Been Added

A complete friends/social system for FitnessLeveling!

### Features:
- 🔍 **Search Users** - Find users by username
- 👥 **Add Friends** - Send friend requests
- ✅ **Accept/Reject Requests** - Manage incoming requests
- 📊 **View Friend Progress** - See friends' stats, workouts, achievements
- 📱 **Friends List** - View all your friends in one place

## 🗄️ Database Setup

### Step 1: Update Database Schema

Run this SQL in your Supabase SQL Editor:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `supabase-schema.sql`
3. Copy the **friendships table** section and **RLS policies** for friendships
4. Paste and run in SQL Editor

Or run the entire updated `supabase-schema.sql` file (it includes the friends table).

### What Gets Created:

- **friendships table** - Stores friend relationships
  - `user_id` - The user
  - `friend_id` - The friend
  - `status` - 'pending', 'accepted', or 'blocked'
  - `requested_by` - Who sent the request
- **Indexes** - For fast friend queries
- **RLS Policies** - Secure friend data access

## 🎨 UI Features

### Friends Section
- **Add Friend** button - Opens search form
- **My Friends** tab - Shows all accepted friends
- **Pending Requests** tab - Shows incoming friend requests

### Friend Cards
Each friend card shows:
- Name and username
- Level
- Total XP
- Number of workouts
- Current streak
- "View Progress" button

### Search Results
- Search by username
- See user stats before adding
- One-click "Add Friend" button

## 🚀 How to Use

### Adding a Friend:
1. Go to **Friends** section
2. Click **"Add Friend"**
3. Enter username and click **Search**
4. Click **"Add Friend"** next to the user
5. They'll receive a friend request

### Accepting Requests:
1. Go to **Friends** → **Pending Requests** tab
2. See incoming requests
3. Click **Accept** or **Reject**

### Viewing Friend Progress:
1. Go to **Friends** → **My Friends**
2. Click **"View Progress"** on any friend card
3. See their stats, workouts, and achievements

## 🔒 Security

- Users can only see their own friendships
- Friend requests require acceptance
- RLS policies protect friend data
- Users can only view friends they're connected to

## 📊 Friend Data Visible

When viewing a friend's progress, you can see:
- Level and XP
- Total workouts
- Current streak
- Recent workouts (last 10)
- Unlocked achievements
- Basic profile info

## 🎯 Next Steps

1. **Run the SQL schema** in Supabase
2. **Test the friends system**:
   - Create two test accounts
   - Search for a friend
   - Send a friend request
   - Accept the request
   - View friend progress

## 🐛 Troubleshooting

### "Friendships table does not exist"
- Run the updated `supabase-schema.sql` in Supabase SQL Editor

### "Policy violation" error
- Make sure RLS policies for friendships were created
- Check that you're logged in

### Can't find users
- Make sure users exist in the database
- Check username spelling
- Search is case-insensitive

### Friend requests not showing
- Check the "Pending Requests" tab
- Make sure you're looking at requests sent TO you, not BY you

## 🎉 Enjoy!

Your FitnessLeveling app now has a complete social/friends system! Users can connect, compete, and motivate each other! 💪👥

