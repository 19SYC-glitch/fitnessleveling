# Quick Start - Supabase Integration

## 🚀 3-Step Setup

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project named "FitnessLeveling"
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### Step 2: Configure Your App

Open `supabase-config.js` and replace:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',        // ← Paste your Project URL here
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // ← Paste your anon key here
};
```

### Step 3: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see "Success. No rows returned"

## ✅ Done!

Your app is now connected to Supabase! 

- **Test it**: Try signing up with a new account
- **Verify**: Check Supabase dashboard → **Table Editor** → **users** to see your profile
- **Features**: All data now syncs to the cloud!

## Need Help?

See `SUPABASE_SETUP.md` for detailed instructions and troubleshooting.

