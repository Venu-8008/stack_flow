import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('StockFlow API is running');
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
        if (!process.env.DATABASE_URL) {
            console.error('\n❌ CRITICAL: DATABASE_URL is missing in .env file!');
        } else if (process.env.DATABASE_URL.startsWith('file:')) {
            console.log('✅ Connected to SQLite database.');
        } else {
            console.log('✅ Connected to PostgreSQL database.');
        }
    });

    // Keep process alive for local development (prevents premature exit in some environments)
    const keepAlive = setInterval(() => { }, 60000);

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        clearInterval(keepAlive);
        server.close(() => {
            console.log('Server closed');
        });
    });

}

export default app;
