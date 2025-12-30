# Complete Supabase Migration Guide

## Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Sign up/Login and create new project
3. Project settings:
   - Name: `stackflow-db`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait for project setup (2-3 minutes)

## Step 2: Get Database Connection
1. Go to Settings → Database
2. Find "Connection string" section
3. Copy the **URI** format (not the other formats)
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Update Environment Variables
Replace your Supabase URL in `server/.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
JWT_SECRET="your_secure_jwt_secret_here"
PORT=3000
```

## Step 4: Push Schema to Supabase
```bash
cd server
npm run db:push
```

## Step 5: Migrate Existing Data
```bash
npm run migrate:supabase
```

## Step 6: Deploy to Vercel
```bash
# Add environment variables to Vercel
vercel env add DATABASE_URL
# Paste your Supabase URL

vercel env add JWT_SECRET
# Enter: your_secure_jwt_secret_here

# Deploy
vercel --prod
```

## Verification
After migration, your Supabase database will have:
- 1 Organization: "gfhdgfs"
- 1 User: "venuchepyala008@gmail.com"
- 0 Products (none in current database)

## Troubleshooting
- If migration fails, check your DATABASE_URL format
- Ensure Supabase project is fully initialized
- Check network connectivity to Supabase

Your app will now use Supabase PostgreSQL instead of local SQLite!