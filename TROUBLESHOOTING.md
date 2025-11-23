# Troubleshooting Guide

## Can't Save Workouts or Profile Changes

### Step 1: Check Browser Console
1. Open browser console: **F12** or **Right-click → Inspect → Console**
2. Look for red error messages
3. Common errors:
   - `Row Level Security policy violation`
   - `Supabase client not initialized`
   - `User not authenticated`

### Step 2: Verify Authentication
1. Check if you're logged in:
   - Look for "Logout" button in navigation
   - If you see "Login", you're not authenticated
2. Try logging out and logging back in

### Step 3: Check RLS Policies in Supabase

Go to Supabase Dashboard → **Authentication** → **Policies**

**For workouts table:**
- Should have: "Users can insert own workouts"
- Policy should check: `auth.uid() = user_id`

**For users table:**
- Should have: "Users can update own profile"
- Policy should check: `auth.uid() = id`

### Step 4: Verify Database Client

Open browser console and run:
```javascript
window.fitnessGame.db.client
```

Should return the Supabase client object. If it's `null`, the client isn't initialized.

### Step 5: Check Supabase Connection

1. Verify `supabase-config.js` has correct:
   - URL: `https://vpsodiippwabpivlhery.supabase.co`
   - Anon key: Should start with `eyJ...`

2. Check if Supabase library is loaded:
   - In console, type: `typeof supabase`
   - Should return: `"function"`

### Step 6: Test RLS Policies

Run this in Supabase SQL Editor to check policies:

```sql
-- Check workouts policies
SELECT * FROM pg_policies WHERE tablename = 'workouts';

-- Check users policies  
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Step 7: Common Fixes

#### Fix 1: Re-run RLS Policies
If policies are missing, run this in Supabase SQL Editor:

```sql
-- Workouts policies
DROP POLICY IF EXISTS "Users can insert own workouts" ON public.workouts;
CREATE POLICY "Users can insert own workouts"
    ON public.workouts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);
```

#### Fix 2: Check User Session
In browser console:
```javascript
// Check current user
window.fitnessGame.currentUser

// Check session
window.fitnessGame.db.client.auth.getSession().then(console.log)
```

#### Fix 3: Verify User Profile Exists
In Supabase → **Table Editor** → **users**
- Make sure your user ID exists
- User ID should match `auth.users` table

### Step 8: Debug Steps

1. **Clear browser cache** and hard refresh
2. **Check network tab** (F12 → Network) for failed requests
3. **Verify Supabase project** is active (not paused)
4. **Check Supabase logs** for API errors

## Error Messages Explained

### "Row Level Security policy violation"
- **Cause**: RLS policy blocking the operation
- **Fix**: Verify policies exist and are correct (see Step 7)

### "Supabase client not initialized"
- **Cause**: Supabase library not loaded or config wrong
- **Fix**: Check `supabase-config.js` and verify library loads

### "User not authenticated"
- **Cause**: No active session
- **Fix**: Log out and log back in

### "new row violates row-level security policy"
- **Cause**: RLS policy doesn't allow insert
- **Fix**: Re-run workout insert policy (see Step 7)

## Still Not Working?

1. **Share the console error** - Copy the exact error message
2. **Check Supabase logs** - Dashboard → Logs → API
3. **Verify tables exist** - Table Editor should show users, workouts, achievements
4. **Test with a new account** - Create fresh account and try again

## Quick Test

Run this in browser console to test workout insert:

```javascript
// Get current user
const user = await window.fitnessGame.db.getCurrentUser();
console.log('Current user:', user);

// Try inserting a test workout
try {
    const result = await window.fitnessGame.db.addWorkout(user.id, {
        name: 'Test Workout',
        type: 'cardio',
        duration: 30,
        intensity: 'medium',
        xp: 30
    });
    console.log('Success:', result);
} catch (error) {
    console.error('Error:', error);
}
```

This will help identify the exact issue!

