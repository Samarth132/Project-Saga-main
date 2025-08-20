import request from 'supertest';
import app from '../server';
import Project from '../models/Project';
import Entity from '../models/Entity';
import Relationship from '../models/Relationship'; // Import Relationship model
import mongoose from 'mongoose';

// Mock the models
jest.mock('../models/Project');
jest.mock('../models/Entity');
jest.mock('../models/Relationship'); // Mock Relationship model

describe('Entity API', () => {
  const projectId = new mongoose.Types.ObjectId().toString();

  // ... (existing tests for POST, GET all, GET one, PUT)

  describe('POST /api/projects/:projectId/entities', () => {
    it('should create a new entity and return 201', async () => {
      const newEntityData = { name: 'Test Character', type: 'Character', data: {} };
      (Entity.create as jest.Mock).mockResolvedValue({ ...newEntityData });
      (Project.findById as jest.Mock).mockResolvedValue({ _id: projectId });
      const response = await request(app).post(`/api/projects/${projectId}/entities`).send(newEntityData);
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newEntityData.name);
    });
  });

  describe('GET /api/projects/:projectId/entities', () => {
    it('should return all entities for a project', async () => {
      const mockEntities = [{ name: 'Entity 1' }, { name: 'Entity 2' }];
      (Entity.find as jest.Mock).mockResolvedValue(mockEntities);
      const response = await request(app).get(`/api/projects/${projectId}/entities`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/entities/:entityId', () => {
    it('should return a single entity by its ID', async () => {
      const entityId = new mongoose.Types.ObjectId().toString();
      (Entity.findById as jest.Mock).mockResolvedValue({ _id: entityId, name: 'Specific Entity' });
      const response = await request(app).get(`/api/entities/${entityId}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Specific Entity');
    });
  });

  describe('PUT /api/entities/:entityId', () => {
    it('should update an entity and return 200', async () => {
      const entityId = new mongoose.Types.ObjectId().toString();
      const updatedData = { name: 'Updated Name' };
      (Entity.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...updatedData });
      const response = await request(app).put(`/api/entities/${entityId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/entities/:entityId', () => {
    it('should delete an entity and return 204', async () => {
      const entityId = new mongoose.Types.ObjectId().toString();
      (Entity.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: entityId });
      const response = await request(app).delete(`/api/entities/${entityId}`);
      expect(response.status).toBe(204);
    });
  });

  // Correctly placed test for the graph endpoint
  describe('GET /api/projects/:projectId/graph', () => {
    it('should return nodes and edges for the graph', async () => {
      (Entity.find as jest.Mock).mockResolvedValue([]);
      (Relationship.find as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get(`/api/projects/${projectId}/graph`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('edges');
    });
  });
});
