# Vercel Deployment Guide

This guide will help you deploy your Humisha Fireworks website to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. A MongoDB Atlas account for your database (or any MongoDB cloud service)
3. Git installed on your machine
4. GitHub, GitLab, or Bitbucket account

## Step 1: Prepare Your MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster if you haven't already
3. Get your MongoDB connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
4. Make sure to whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access for Vercel to connect

## Step 2: Push Your Code to Git

If you haven't already pushed your code to a Git repository:

```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option 1: Using Vercel Dashboard (Recommended for first-time users)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

5. Add Environment Variables (click "Environment Variables"):
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secure string (e.g., `your-super-secret-jwt-key-12345`)
   - `ADMIN_USERNAME`: Your admin username (e.g., `admin`)
   - `ADMIN_PASSWORD`: Your admin password (e.g., `secure-password-123`)
   - `PORT`: 5000

6. Click "Deploy"

### Option 2: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

5. For production deployment:
```bash
vercel --prod
```

## Step 4: Configure Environment Variables in Vercel

If you didn't add them during deployment, you can add them later:

1. Go to your project in Vercel Dashboard
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add the following variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `PORT`

## Step 5: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the following:
   - Homepage loads correctly
   - Shop page (`/shop`) displays products
   - Admin page (`/admin`) login works
   - Adding products works (images are stored as base64)
   - Cart functionality works
   - PDF invoice generation works

## Important Changes Made for Vercel

The following changes were made to make your app compatible with Vercel:

1. **Image Storage**: Images are now stored as base64 in MongoDB instead of the file system (Vercel's serverless functions don't have persistent storage)
2. **API URLs**: Frontend now uses relative paths (`/api`) instead of `http://localhost:5000/api`
3. **Server Export**: The Express app is exported for Vercel to use as a serverless function
4. **Conditional Server Start**: Server only starts when running locally, not in Vercel's serverless environment

## Functionality Preserved

All original functionality remains intact:
- ✅ Product listing
- ✅ Shopping cart
- ✅ Admin login
- ✅ Add/Delete products
- ✅ Image uploads (now base64)
- ✅ PDF invoice generation
- ✅ Mobile responsive design
- ✅ No registration required for shopping
- ✅ WhatsApp order completion

## Troubleshooting

### Deployment Fails
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set correctly
- Make sure MongoDB connection string is correct

### Can't Connect to Database
- Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
- Verify MONGODB_URI environment variable is correct
- Check MongoDB Atlas cluster is running

### Images Not Displaying
- New images are stored as base64 - they should work automatically
- Old images (file paths) are still supported for backwards compatibility
- Check browser console for any errors

### API Routes Not Working
- Ensure `vercel.json` is in the root directory
- Check that routes in `vercel.json` match your API endpoints
- Review Vercel function logs

## Local Development

To continue developing locally:

```bash
cd backend
npm install
npm run dev
```

The app will run on `http://localhost:5000`

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Support

For issues related to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **MongoDB**: Check [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

## Next Steps

After successful deployment:
1. Share your Vercel URL with customers
2. Set up a custom domain (optional)
3. Monitor your app using Vercel Analytics
4. Set up automatic deployments for every Git push
