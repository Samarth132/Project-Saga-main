import { Request, Response, NextFunction } from 'express'; // Import these types
import request from 'supertest';
import app from '../server'; // Corrected import path
import Pin from '../models/Pin';
import Map from '../models/Map'; // Import Map model
import Project from '../models/Project'; // Import Project model
import mongoose from 'mongoose';
import path from 'path'; // Import path for file handling
import multer from 'multer'; // Import multer for mocking

jest.mock('multer'); // Mock multer module
jest.mock('../models/Pin');
jest.mock('../models/Map'); // Mock Map model
jest.mock('../models/Project'); // Mock Project model

describe('Map and Pin API', () => {
  describe('PUT /api/pins/:pinId', () => {
    it('should link an entity to a pin and return the updated pin', async () => {
      const pinId = new mongoose.Types.ObjectId().toString();
      const entityId = new mongoose.Types.ObjectId().toString();
      const position = { lat: 10, lng: 20 };

      const updatedPinData = {
        _id: pinId,
        position: position,
        entityId: entityId,
      };

      (Pin.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPinData);

      const response = await request(app)
        .put(`/api/pins/${pinId}`)
        .send({ entityId: entityId, position: position }); // Pass position as well

      expect(response.status).toBe(200);
      expect(response.body.entityId).toBe(entityId);
      expect(Pin.findByIdAndUpdate).toHaveBeenCalledWith(
        pinId,
        { entityId: entityId, position: position },
        { new: true }
      );
    });

    it('should update a pin position without affecting the entityId', async () => {
        const pinId = new mongoose.Types.ObjectId().toString();
        const newPosition = { lat: 30, lng: 40 };

        const updatedPinData = {
          _id: pinId,
          position: newPosition,
          entityId: new mongoose.Types.ObjectId().toString(),
        };

        (Pin.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedPinData);

        const response = await request(app)
          .put(`/api/pins/${pinId}`)
          .send({ position: newPosition });

        expect(response.status).toBe(200);
        expect(response.body.position.lat).toBe(newPosition.lat);
        expect(response.body.position.lng).toBe(newPosition.lng);
        expect(Pin.findByIdAndUpdate).toHaveBeenCalledWith(
          pinId,
          { position: newPosition, entityId: undefined }, // entityId will be undefined in the body
          { new: true }
        );
      });
  });

  describe('POST /api/projects/:projectId/maps', () => {
    it('should create a new map with an image', async () => {
      const projectId = new mongoose.Types.ObjectId().toString();
      const mapName = 'Test Map';
      const imageUrl = 'uploads/test-image.png';

      (Map.prototype.save as jest.Mock).mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        projectId: new mongoose.Types.ObjectId(projectId),
        name: mapName,
        imageUrl: imageUrl,
      });
      (Project.findById as jest.Mock).mockResolvedValue({ _id: projectId }); // Mock a project existing

      const response = await request(app)
        .post(`/api/projects/${projectId}/maps`)
        .field('name', mapName)
        .field('projectId', projectId)
        .attach('mapImage', path.resolve(__dirname, 'test_image.png')); // Attach a dummy image

      if (response.status !== 201) {
        console.error('Error response body:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(mapName);
      expect(response.body.projectId).toBe(projectId);
      expect(response.body.imageUrl).toContain('uploads/');
      expect(Map.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 if no file is uploaded', async () => {
      // Override the default multer single behavior for this test
      (multer().single as jest.Mock).mockImplementationOnce(() => (req: Request, res: Response, next: NextFunction) => {
        req.file = undefined; // No file attached
        next();
      });

      const projectId = new mongoose.Types.ObjectId().toString();
      const mapName = 'Test Map';

      const response = await request(app)
        .post(`/api/projects/${projectId}/maps`)
        .field('name', mapName)
        .field('projectId', projectId);

      expect(response.status).toBe(400);
      expect(response.text).toBe('No file uploaded.');
    });
  });
});
