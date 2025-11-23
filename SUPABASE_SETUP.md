# Supabase Setup Guide for FitnessLeveling

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email
4. Create a new organization (if needed)

## Step 2: Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Name**: FitnessLeveling (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect to start
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

## Step 3: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 4: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
5. You should see "Success. No rows returned"

## Step 5: Configure Your App

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'YOUR_SUPABASE_URL', // Paste your Project URL here
       anonKey: 'YOUR_SUPABASE_ANON_KEY' // Paste your anon key here
   };
   ```

## Step 6: Update HTML

The Supabase JS library is already included in `index.html`. Make sure this line exists:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## Step 7: Test the Integration

1. Open your app in the browser
2. Try signing up with a new account
3. Check your Supabase dashboard → **Authentication** → **Users** to see the new user
4. Check **Table Editor** → **users** to see the user profile

## Verification Checklist

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] API keys copied to `supabase-config.js`
- [ ] Can sign up new users
- [ ] Can login with existing users
- [ ] User data appears in Supabase tables
- [ ] Workouts are saved to database
- [ ] Leaderboard shows all users

## Troubleshooting

### "Supabase client not initialized"
- Check that `supabase-config.js` has correct URL and key
- Verify Supabase JS library is loaded in HTML

### "Row Level Security policy violation"
- Make sure you ran the SQL schema completely
- Check that RLS policies were created

### "User profile not created"
- Check the trigger function `handle_new_user()` was created
- Verify in Supabase dashboard → **Database** → **Functions**

### "Cannot read property 'auth' of undefined"
- Supabase library not loaded - check script tag in HTML
- Make sure script loads before your app code

## Security Notes

- ✅ The `anon` key is safe to use in client-side code
- ✅ Row Level Security (RLS) protects user data
- ✅ Users can only access their own data
- ✅ Leaderboard data is publicly readable (by design)
- ⚠️ Never commit your `service_role` key to version control

## Next Steps

Once everything works:
1. Consider enabling email verification in Supabase Auth settings
2. Set up password reset functionality
3. Add OAuth providers (Google, GitHub) if desired
4. Monitor usage in Supabase dashboard

## Support

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)

