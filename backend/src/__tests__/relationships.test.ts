import request from 'supertest';
import app from '../server';
import Relationship from '../models/Relationship';
import mongoose from 'mongoose';

// Mock the model
jest.mock('../models/Relationship');

describe('Relationship API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/relationships - should create a new relationship', async () => {
    const newRelationshipData = {
      projectId: new mongoose.Types.ObjectId().toString(),
      source: new mongoose.Types.ObjectId().toString(),
      target: new mongoose.Types.ObjectId().toString(),
      type: 'ally of',
    };
    (Relationship.create as jest.Mock).mockResolvedValue(newRelationshipData);

    const response = await request(app)
      .post('/api/relationships')
      .send(newRelationshipData);

    expect(response.status).toBe(201);
    expect(response.body.type).toBe('ally of');
    expect(Relationship.create).toHaveBeenCalledWith(newRelationshipData);
  });

  it('GET /api/entities/:entityId/relationships - should get all relationships for an entity', async () => {
    const entityId = new mongoose.Types.ObjectId().toString();
    const mockRelationships = [
      { type: 'ally of', target: 'entity2' },
      { type: 'enemy of', source: 'entity3' },
    ];
    (Relationship.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockRelationships),
    });

    const response = await request(app)
      .get(`/api/entities/${entityId}/relationships`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRelationships);
    expect(Relationship.find).toHaveBeenCalledWith({
      $or: [{ source: entityId }, { target: entityId }],
    });
  });

  it('DELETE /api/relationships/:relationshipId - should delete a relationship', async () => {
    const relationshipId = new mongoose.Types.ObjectId().toString();
    (Relationship.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: relationshipId });

    const response = await request(app)
      .delete(`/api/relationships/${relationshipId}`);

    expect(response.status).toBe(204);
  });
});
