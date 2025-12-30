# Quick Supabase Setup

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign in with GitHub/Google
4. Click "New Project"
5. Choose organization and enter:
   - Name: `stackflow-db`
   - Database Password: (save this!)
   - Region: Choose closest to you
6. Click "Create new project"

## Step 2: Get Database URL
1. Wait for project setup (2-3 minutes)
2. Go to Settings → Database
3. Scroll to "Connection string" 
4. Copy the "URI" format
5. Replace `[YOUR-PASSWORD]` with your database password

## Step 3: Update Local Environment
Replace the DATABASE_URL in `server/.env` with your Supabase URL

## Step 4: Run These Commands
```bash
cd server
npm install
npm run db:push
```

## Step 5: Deploy to Vercel
```bash
vercel env add DATABASE_URL
# Paste your Supabase URL when prompted

vercel env add JWT_SECRET  
# Enter: stackflow_jwt_secret_2024

vercel --prod
```

Your DATABASE_URL should look like:
`postgresql://postgres:YOUR_PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres`