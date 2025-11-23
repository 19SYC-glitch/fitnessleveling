# Set Up Custom Domain - Shorter URL

## 🎯 Goal: Short, Memorable URL

Instead of: `fitnessleveling-abc123xyz.vercel.app`  
You want: `fitnessleveling.com` or `fitleveling.com`

## Option 1: Use Your Own Domain (Recommended)

### Step 1: Buy a Domain

**Recommended Domain Registrars:**
- **Namecheap**: [namecheap.com](https://namecheap.com) - ~$10-15/year
- **Google Domains**: [domains.google](https://domains.google) - ~$12/year
- **Cloudflare**: [cloudflare.com](https://cloudflare.com) - At-cost pricing
- **GoDaddy**: [godaddy.com](https://godaddy.com) - ~$12-15/year

**Domain Suggestions:**
- `fitnessleveling.com` (exact match)
- `fitleveling.com` (shorter)
- `fitlevel.app` (modern .app extension)
- `fitlevel.io` (tech-focused)

### Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard**
   - Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your **fitnessleveling** project

2. **Go to Settings → Domains**
   - Click **Settings** tab
   - Click **Domains** in left sidebar

3. **Add Your Domain**
   - Enter your domain: `fitnessleveling.com`
   - Click **"Add"**

4. **Vercel will show DNS instructions**
   - Copy the DNS records shown
   - You'll need to add these to your domain registrar

### Step 3: Configure DNS

**At Your Domain Registrar:**

1. **Go to DNS Settings**
   - Log into your domain registrar
   - Find **DNS Management** or **DNS Settings**

2. **Add DNS Records**
   - Vercel will show you what to add
   - Usually you need:
     - **A Record** or **CNAME Record**
     - Points to Vercel's servers

3. **Common DNS Setup:**

   **Option A: CNAME (Easier)**
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

   **Option B: A Record**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21 (Vercel's IP - they'll provide)
   ```

4. **Wait for DNS Propagation**
   - Usually takes 5 minutes to 24 hours
   - Vercel will show status: "Valid Configuration" when ready

### Step 4: SSL Certificate

- ✅ **Automatic!** Vercel provides free SSL certificates
- ✅ HTTPS enabled automatically
- ✅ No extra configuration needed

## Option 2: Use Vercel's Shorter Subdomain

If you don't want to buy a domain:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. **Add a Vercel Domain**
   - You can use: `fitnessleveling.vercel.app`
   - This is shorter than the auto-generated one
   - But you need to set it up manually

**Note**: Vercel auto-generates random subdomains. You can't customize the random part, but you can add your own custom domain.

## Option 3: Use a Free Short Domain Service

**Not Recommended** - but options exist:
- **Short.io** - URL shortener with custom domains
- **Rebrandly** - Link management
- **Bitly** - URL shortener

These add an extra redirect layer, which isn't ideal for a web app.

## 🎯 Recommended: Buy Your Own Domain

### Why?
- ✅ Professional
- ✅ Memorable
- ✅ SEO-friendly
- ✅ Brandable
- ✅ Only $10-15/year

### Quick Setup Guide

1. **Buy domain**: `fitnessleveling.com` (~$12/year)
2. **Add to Vercel**: Settings → Domains → Add domain
3. **Configure DNS**: Add CNAME record at registrar
4. **Wait 5-30 minutes**: DNS propagates
5. **Done!** Your app is at `fitnessleveling.com`

## 📋 DNS Configuration Example

**If using Namecheap:**

1. Go to: **Domain List** → Click **Manage** next to your domain
2. Go to: **Advanced DNS** tab
3. Add record:
   ```
   Type: CNAME Record
   Host: @
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```
4. Click **Save**

**If using Cloudflare:**

1. Add your domain to Cloudflare
2. Go to **DNS** settings
3. Add CNAME:
   ```
   Type: CNAME
   Name: @
   Target: cname.vercel-dns.com
   Proxy: Off (or On, both work)
   ```

## ✅ Verification

After DNS is configured:

1. **Check Vercel Dashboard**
   - Should show: "Valid Configuration" ✅
   - Status: "Valid"

2. **Test Your Domain**
   - Visit: `fitnessleveling.com`
   - Should load your app!

3. **Check HTTPS**
   - Should automatically redirect to `https://fitnessleveling.com`
   - SSL certificate is automatic

## 🎉 Result

**Before**: `fitnessleveling-abc123xyz.vercel.app`  
**After**: `fitnessleveling.com` ✨

Much shorter and more professional!

## 💡 Pro Tips

- **Buy for multiple years** - Often cheaper
- **Enable auto-renewal** - Don't lose your domain
- **Add www subdomain** - Vercel can handle both `fitnessleveling.com` and `www.fitnessleveling.com`
- **Privacy protection** - Most registrars offer free WHOIS privacy

## 🚀 Quick Start

1. Buy domain at [namecheap.com](https://namecheap.com)
2. Add to Vercel: Settings → Domains
3. Configure DNS (CNAME to Vercel)
4. Wait 5-30 minutes
5. Done! 🎉

Your FitnessLeveling app will have a short, professional URL!

