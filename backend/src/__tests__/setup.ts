import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Request, Response, NextFunction } from 'express'; // Import these types

jest.mock('multer', () => ({
  diskStorage: jest.fn(() => ({
    destination: jest.fn(),
    filename: jest.fn(),
  })),
  single: jest.fn((fieldName) => (req: Request, res: Response, next: NextFunction) => {
    req.file = {
      fieldname: fieldName,
      originalname: 'mock_file.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: 'uploads/',
      filename: 'mock_file.png',
      path: 'uploads/mock_file.png',
      size: 12345,
      stream: {} as any,
      buffer: Buffer.from(''),
    };
    next();
  }),
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await mongoServer.stop();
});
