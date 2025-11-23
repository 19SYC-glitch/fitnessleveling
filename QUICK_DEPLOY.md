# Quick Deploy Guide - 3 Simple Steps

## 🚀 Step 1: Create GitHub Repository

1. **Go to**: [github.com/new](https://github.com/new)
2. **Repository name**: `fitnessleveling`
3. **Visibility**: Public or Private (your choice)
4. **DO NOT** check "Initialize with README"
5. **Click "Create repository"**
6. **Copy the URL** shown (looks like: `https://github.com/YOUR_USERNAME/fitnessleveling.git`)

## 📤 Step 2: Push Your Code

Run these commands in your terminal:

```bash
# Navigate to your project
cd "/Users/oscarprabs/Fitness App 2.0"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: FitnessLeveling app"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fitnessleveling.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll need to enter your GitHub username and password/token.

## 🌐 Step 3: Deploy to Vercel

1. **Go to**: [vercel.com](https://vercel.com)
2. **Sign up/login** (use GitHub - it's easier!)
3. **Click "Add New..." → "Project"**
4. **Click "Import Git Repository"**
5. **Select** `fitnessleveling` from the list
6. **Click "Import"**
7. **Framework**: Select "Other"
8. **Click "Deploy"**
9. **Done!** Your app is live! 🎉

## 📋 Your Repository URL Format

After creating the repo, your URL will be:
```
https://github.com/YOUR_USERNAME/fitnessleveling
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## ⚡ Even Faster: Use Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from your project folder)
cd "/Users/oscarprabs/Fitness App 2.0"
vercel
```

Follow the prompts - it's that easy!

## 🎯 What You'll Get

After deployment:
- ✅ Live URL: `fitnessleveling.vercel.app` (or your custom domain)
- ✅ Auto-deploy on every git push
- ✅ HTTPS automatically enabled
- ✅ Global CDN for fast loading

## ❓ Need Help?

See `GITHUB_SETUP.md` for detailed instructions!

