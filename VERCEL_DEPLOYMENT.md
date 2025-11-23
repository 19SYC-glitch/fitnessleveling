# Deploy FitnessLeveling to Vercel

## ✅ Why Vercel?

- **Free tier** - Perfect for personal projects
- **Automatic HTTPS** - Secure by default
- **Global CDN** - Fast worldwide
- **Easy deployment** - Connect GitHub and auto-deploy
- **Custom domains** - Use your fitnessleveling.com domain
- **Zero config** - Works out of the box with static sites

## 🚀 Quick Deployment (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository (or upload files)

3. **Configure Project**
   - **Framework Preset**: Other (or Static Site)
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "/Users/oscarprabs/Fitness App 2.0"
   vercel
   ```

4. **Follow prompts**
   - Link to existing project or create new
   - Deploy to production

## 📝 Important: Environment Variables

Your Supabase credentials are in `supabase-config.js`, which is fine for client-side. However, for better security, you can use environment variables:

### Optional: Use Environment Variables

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Environment Variables**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://vpsodiippwabpivlhery.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`

2. **Update `supabase-config.js`** (optional):
   ```javascript
   const SUPABASE_CONFIG = {
       url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vpsodiippwabpivlhery.supabase.co',
       anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
   };
   ```

**Note**: Since this is a static site, your current setup (credentials in JS file) is fine. The anon key is meant to be public.

## 🌐 Custom Domain Setup

### Connect Your Domain

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Add your domain: `fitnessleveling.com`

2. **Configure DNS**:
   - Add CNAME record pointing to Vercel
   - Vercel will provide exact instructions

3. **SSL Certificate**:
   - Automatically provisioned by Vercel (free!)

## 🔄 Auto-Deploy from GitHub

### Set Up GitHub Integration

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/fitnessleveling.git
   git push -u origin main
   ```

2. **Connect in Vercel**:
   - Import from GitHub
   - Select your repository
   - Vercel will auto-deploy on every push!

## 📋 Pre-Deployment Checklist

- [ ] Test app locally (http://localhost:8000)
- [ ] Verify Supabase connection works
- [ ] Test sign up/login
- [ ] Test workout logging
- [ ] Check browser console for errors
- [ ] Update `supabase-config.js` if needed
- [ ] Remove any test/console.log statements (optional)

## 🎯 Deployment Steps Summary

1. **Sign up** at vercel.com
2. **Create new project**
3. **Import your code** (GitHub or upload)
4. **Deploy** (automatic)
5. **Get your URL** (e.g., `fitnessleveling.vercel.app`)
6. **Add custom domain** (optional)

## 🐛 Post-Deployment Testing

After deployment, test:

1. ✅ Visit your Vercel URL
2. ✅ Sign up with a new account
3. ✅ Log a workout
4. ✅ Check leaderboard
5. ✅ Update profile
6. ✅ Test on mobile device

## 💡 Pro Tips

### Performance
- Vercel automatically optimizes your site
- Global CDN ensures fast loading worldwide
- Static files are cached automatically

### Updates
- Every `git push` auto-deploys
- Preview deployments for pull requests
- Instant rollback if needed

### Monitoring
- Vercel Analytics (optional)
- Check deployment logs
- Monitor API usage in Supabase

## 🔒 Security Notes

- ✅ Your Supabase anon key is safe to expose (it's public by design)
- ✅ RLS policies protect your data
- ✅ HTTPS is automatic on Vercel
- ✅ No backend secrets needed (Supabase handles auth)

## 📊 Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Builds**: Unlimited
- **Deployments**: Unlimited
- **Custom domains**: Unlimited
- **Team members**: 1 (upgrade for more)

**This is more than enough for FitnessLeveling!**

## 🚀 Ready to Deploy?

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "Add New Project"
4. Follow the prompts
5. Your app will be live in minutes!

## Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Vercel Discord: [vercel.com/discord](https://vercel.com/discord)

Your FitnessLeveling app is ready for the world! 🌍💪

