# How to Run Commands in Terminal

## 🖥️ Where to Run Commands

You need to run commands in **Terminal** (also called Command Line).

## 📍 Step 1: Open Terminal

### On Mac:
1. **Press**: `Cmd + Space` (opens Spotlight)
2. **Type**: `Terminal`
3. **Press**: `Enter`
   
   OR
   
1. **Go to**: Applications → Utilities → Terminal
2. **Double-click** Terminal

### Alternative: Use VS Code Terminal
If you're using VS Code:
1. **Press**: `Ctrl + `` (backtick, above Tab key)
2. OR go to: **Terminal** → **New Terminal**

## 📂 Step 2: Navigate to Your Project

Once Terminal is open, type:

```bash
cd "/Users/oscarprabs/Fitness App 2.0"
```

Press `Enter`

**Verify you're in the right place:**
```bash
pwd
```

Should show: `/Users/oscarprabs/Fitness App 2.0`

## 🚀 Step 3: Run the Push Command

Now run:

```bash
git push -u origin main
```

## 📋 Complete Steps in Order

Copy and paste these commands one by one:

```bash
# 1. Navigate to your project
cd "/Users/oscarprabs/Fitness App 2.0"

# 2. Verify you're in the right place
pwd

# 3. Push to GitHub
git push -u origin main
```

## 🔐 When It Asks for Credentials

After running `git push`, it will ask:
- **Username**: Type `19SYC-glitch` and press Enter
- **Password**: Paste your **Personal Access Token** (not your password!)

## 💡 Visual Guide

```
Terminal Window:
┌─────────────────────────────────────┐
│ Last login: ...                     │
│ oscarprabs@Oscars-MacBook-Air:~$   │  ← Type commands here
│                                     │
└─────────────────────────────────────┘
```

## 🎯 Quick Checklist

- [ ] Terminal is open
- [ ] Navigated to project folder: `cd "/Users/oscarprabs/Fitness App 2.0"`
- [ ] Verified location: `pwd` shows correct path
- [ ] Ready to push: `git push -u origin main`
- [ ] Have Personal Access Token ready

## ❓ Still Confused?

**Option 1: Use VS Code**
- Open your project in VS Code
- Press `Ctrl + `` to open terminal
- Commands run in the project folder automatically

**Option 2: Use Finder**
- Right-click on "Fitness App 2.0" folder
- Select "New Terminal at Folder" (if available)

**Option 3: Drag and Drop**
- Open Terminal
- Type `cd ` (with a space)
- Drag your "Fitness App 2.0" folder into Terminal
- Press Enter

## 🎉 After Running

Once you push successfully, you'll see:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/19SYC-glitch/fitnessleveling.git
 * [new branch]      main -> main
```

Then go to GitHub and refresh - your files will be there!

