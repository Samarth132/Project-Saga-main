import request from 'supertest';
import app from '../server';
import StoryEvent from '../models/StoryEvent';
import mongoose from 'mongoose';

// Mock the model
jest.mock('../models/StoryEvent');

describe('Story Event API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/projects/:projectId/events - should create a new event', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const newEventData = { title: 'The Coronation', description: 'A grand event.', eventDate: 'TA 3019', entities: [] };
    (StoryEvent.create as jest.Mock).mockResolvedValue(newEventData);
    const response = await request(app).post(`/api/projects/${projectId}/events`).send(newEventData);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('The Coronation');
  });

  it('GET /api/projects/:projectId/events - should get all events for a project', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    (StoryEvent.find as jest.Mock).mockResolvedValue([{ title: 'Event 1' }, { title: 'Event 2' }]);
    const response = await request(app).get(`/api/projects/${projectId}/events`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('PUT /api/events/:eventId - should update an event', async () => {
    const eventId = new mongoose.Types.ObjectId().toString();
    const updatedData = { title: 'An Updated Coronation', status: 'In Progress' };
    (StoryEvent.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...updatedData });
    const response = await request(app).put(`/api/events/${eventId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.status).toBe(updatedData.status);
  });

  it('DELETE /api/events/:eventId - should delete an event', async () => {
    const eventId = new mongoose.Types.ObjectId().toString();
    (StoryEvent.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: eventId });
    const response = await request(app).delete(`/api/events/${eventId}`);
    expect(response.status).toBe(204);
  });
});
