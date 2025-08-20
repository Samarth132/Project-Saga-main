import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs'; // Import fs module

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Route imports
import entityRoutes from './routes/entities';
import templateRoutes from './routes/templates';
import relationshipRoutes from './routes/relationships';
import storyEventRoutes from './routes/storyEvents';
import projectRoutes from './routes/projects';
import mapRoutes from './routes/maps';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Project Saga API is running!');
});

app.use('/api', entityRoutes);
app.use('/api', templateRoutes);
app.use('/api', relationshipRoutes);
app.use('/api', storyEventRoutes);
app.use('/api', projectRoutes);
app.use('/api', mapRoutes);


const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (process.env.NODE_ENV !== 'test') {
  if (!mongoUri) {
    console.error('MONGO_URI is not defined in the .env file');
    process.exit(1);
  }

  mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB connected successfully');
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
}

export default app;