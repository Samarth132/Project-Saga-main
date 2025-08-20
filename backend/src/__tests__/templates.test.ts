import request from 'supertest';
import app from '../server';
import EntityTemplate from '../models/EntityTemplate';

// Mock the EntityTemplate model
jest.mock('../models/EntityTemplate');

describe('Template API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/templates - should return all templates', async () => {
    const mockTemplates = [{ name: 'Character' }, { name: 'Location' }];
    (EntityTemplate.find as jest.Mock).mockResolvedValue(mockTemplates);

    const response = await request(app).get('/api/templates');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTemplates);
  });

  it('POST /api/templates - should create a new template', async () => {
    const newTemplate = { name: 'Magic System', fields: [{ name: 'Rules', type: 'text' }] };
    (EntityTemplate.create as jest.Mock).mockResolvedValue(newTemplate);

    const response = await request(app)
      .post('/api/templates')
      .send(newTemplate);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newTemplate);
    expect(EntityTemplate.create).toHaveBeenCalledWith(newTemplate);
  });

  it('GET /api/templates/:templateId - should return a single template', async () => {
    const templateId = 'some-id';
    const mockTemplate = { _id: templateId, name: 'Character' };
    (EntityTemplate.findById as jest.Mock).mockResolvedValue(mockTemplate);

    const response = await request(app).get(`/api/templates/${templateId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTemplate);
  });

  it('PUT /api/templates/:templateId - should update a template', async () => {
    const templateId = 'some-id';
    const updates = { name: 'Updated Character' };
    (EntityTemplate.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...updates });

    const response = await request(app).put(`/api/templates/${templateId}`).send(updates);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Character');
  });

  it('DELETE /api/templates/:templateId - should delete a template', async () => {
    const templateId = 'some-id';
    (EntityTemplate.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: templateId });

    const response = await request(app).delete(`/api/templates/${templateId}`);

    expect(response.status).toBe(204);
  });

  it('POST /api/templates/seed - should seed default templates', async () => {
    (EntityTemplate.updateOne as jest.Mock).mockResolvedValue({ ok: 1 });

    const response = await request(app).post('/api/templates/seed');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Default templates seeded successfully.');
    expect(EntityTemplate.updateOne).toHaveBeenCalledTimes(3);
  });

});
