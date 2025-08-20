import request from 'supertest';
import app from '../server';
import Project from '../models/Project';

// Mock the model
jest.mock('../models/Project');

describe('Project API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/projects - should return all projects', async () => {
    (Project.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ name: 'Project 1' }]),
    });
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe('Project 1');
  });

  it('POST /api/projects - should create a new project', async () => {
    const newProjectData = { name: 'New Test Project', description: 'A test desc' };
    (Project.create as jest.Mock).mockResolvedValue(newProjectData);
    const response = await request(app).post('/api/projects').send(newProjectData);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newProjectData.name);
  });

  it('DELETE /api/projects/:projectId - should delete a project', async () => {
      const projectId = 'some-id';
      (Project.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: projectId });
      const response = await request(app).delete(`/api/projects/${projectId}`);
      expect(response.status).toBe(204);
  });

});
