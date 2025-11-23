# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Create on GitHub Website (Easiest)

1. **Go to GitHub**
   - Visit [github.com](https://github.com)
   - Sign up/login to your account

2. **Create New Repository**
   - Click the **"+"** icon (top right) → **"New repository"**
   - Or go to: [github.com/new](https://github.com/new)

3. **Fill in Repository Details**
   - **Repository name**: `fitnessleveling` (or any name you like)
   - **Description**: "Gamified Fitness Tracker with Supabase"
   - **Visibility**: 
     - ✅ **Public** (free, anyone can see code)
     - 🔒 **Private** (requires GitHub Pro, or free for students)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we'll add our own)

4. **Click "Create repository"**

5. **Copy the Repository URL**
   - You'll see a page with setup instructions
   - **Copy the HTTPS URL** (looks like: `https://github.com/yourusername/fitnessleveling.git`)
   - ⚠️ **Save this URL** - you'll need it!

## Step 2: Push Your Code to GitHub

### Open Terminal in Your Project Folder

1. **Open Terminal** (if not already open)
2. **Navigate to your project**:
   ```bash
   cd "/Users/oscarprabs/Fitness App 2.0"
   ```

### Initialize Git (if not already done)

```bash
# Initialize git repository
git init

# Check status
git status
```

### Add All Files

```bash
# Add all files to git
git add .

# Check what will be committed
git status
```

### Create .gitignore File (Optional but Recommended)

Create a `.gitignore` file to exclude unnecessary files:

```bash
# Create .gitignore
cat > .gitignore << 'EOF'
# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log
npm-debug.log*

# Environment variables (if you add them later)
.env
.env.local
.env.*.local
EOF
```

### Commit Your Code

```bash
# Commit all files
git commit -m "Initial commit: FitnessLeveling app with Supabase integration"

# Verify commit
git log
```

### Connect to GitHub and Push

```bash
# Add your GitHub repository as remote
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/fitnessleveling.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password (or personal access token).

## Step 3: Get Your Repository URL

### After Pushing, Your Repository URL is:

```
https://github.com/YOUR_USERNAME/fitnessleveling
```

### Where to Find It:

1. **On GitHub Website**:
   - Go to your repository page
   - Click the green **"Code"** button
   - Copy the HTTPS URL shown

2. **From Terminal**:
   ```bash
   git remote get-url origin
   ```

3. **Repository Settings**:
   - Go to your repo → **Settings** → Scroll down
   - You'll see the repository URL

## Step 4: Connect to Vercel

### Now That You Have GitHub Repository:

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login (use GitHub to connect easily!)

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**

3. **Select Your Repository**
   - You'll see a list of your GitHub repositories
   - Find `fitnessleveling` (or your repo name)
   - Click **"Import"**

4. **Configure Project**
   - **Framework Preset**: Select **"Other"** or **"Static Site"**
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: Leave empty

5. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes
   - Your app is live! 🎉

## Quick Reference: Repository URL Format

```
https://github.com/USERNAME/REPOSITORY_NAME.git
```

Example:
```
https://github.com/oscarprabs/fitnessleveling.git
```

## Troubleshooting

### "Repository not found"
- Make sure you've pushed code to GitHub first
- Check that the repository name is correct
- Verify you're logged into the correct GitHub account

### "Permission denied"
- You need to authenticate with GitHub
- Use GitHub Personal Access Token instead of password
- Or connect Vercel account with GitHub (easier!)

### "Remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/fitnessleveling.git
```

### Can't Push to GitHub
```bash
# Check your remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/YOUR_USERNAME/fitnessleveling.git
```

## Alternative: Upload Without Git

If you don't want to use Git, you can:

1. **Zip your project folder**
2. **Go to Vercel** → **Add New Project**
3. **Upload the zip file** (drag and drop)
4. Vercel will extract and deploy

**Note**: This won't auto-deploy on changes. Git is recommended for auto-deployments.

## Next Steps After Deployment

1. ✅ Test your live app
2. ✅ Add custom domain (fitnessleveling.com)
3. ✅ Set up auto-deployments (automatic with Git)
4. ✅ Share your app with the world!

## Need Help?

- GitHub Docs: [docs.github.com](https://docs.github.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Git Basics: [git-scm.com/doc](https://git-scm.com/doc)

