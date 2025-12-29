# StockFlow - PostgreSQL Setup

## Database Setup

### 1. Install PostgreSQL
- Download and install PostgreSQL from https://www.postgresql.org/download/
- Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

### 2. Create Database
```sql
CREATE DATABASE stackflow_db;
CREATE USER stackflow_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stackflow_db TO stackflow_user;
```

### 3. Update Environment Variables
Update `server/.env`:
```
DATABASE_URL="postgresql://stackflow_user:your_password@localhost:5432/stackflow_db"
JWT_SECRET="your_jwt_secret_here"
PORT=3000
```

### 4. Run Migrations
```bash
cd server
npm install
npm run db:push
```

### 5. Start Development
```bash
# From root directory
npm run dev
```

## Production Deployment

For production, use a managed PostgreSQL service:
- **Supabase**: Free tier available
- **Railway**: Free tier available  
- **Vercel Postgres**: Integrated with Vercel
- **AWS RDS**: Production-ready

Update the `DATABASE_URL` environment variable with your production database URL.