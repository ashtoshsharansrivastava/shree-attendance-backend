import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// 1. Ensure authRoutes is imported
import authRoutes from './routes/authRoutes.js'; 
import attendanceRoutes from './routes/attendanceRoutes.js';
import productRoutes from './routes/productRoutes.js';
import workerRoutes from './routes/workerRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 2. Ensure authRoutes is mounted to /api (so it handles /api/login and /api/register)
app.use('/api', authRoutes); 

app.use('/api/attendance', attendanceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});