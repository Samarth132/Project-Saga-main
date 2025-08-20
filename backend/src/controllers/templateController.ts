import { Request, Response } from 'express';
import EntityTemplate from '../models/EntityTemplate';

// Get all templates
export const getAllTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await EntityTemplate.find();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
};

// Create a new template
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, fields } = req.body;
    const newTemplate = await EntityTemplate.create({ name, description, fields });
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Error creating template' });
  }
};

// Get a single template
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const template = await EntityTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Error fetching template' });
  }
};

// Update a template
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const updatedTemplate = await EntityTemplate.findByIdAndUpdate(
      templateId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Error updating template' });
  }
};

// Delete a template
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const deletedTemplate = await EntityTemplate.findByIdAndDelete(templateId);
    if (!deletedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Error deleting template' });
  }
};

// Seed default templates
export const seedDefaultTemplates = async (req: Request, res: Response) => {
  const defaultTemplates = [
    {
      name: 'Character',
      description: 'A template for characters in your story.',
      fields: [
        { name: 'Age', type: 'number' },
        { name: 'Appearance', type: 'text' },
        { name: 'Personality', type: 'text' },
        { name: 'Backstory', type: 'text' },
      ],
    },
    {
      name: 'Location',
      description: 'A template for locations in your world.',
      fields: [
        { name: 'Description', type: 'text' },
        { name: 'History', type: 'text' },
        { name: 'Inhabitants', type: 'text' },
      ],
    },
    {
      name: 'Magic System',
      description: 'A template for a magic system.',
      fields: [
        { name: 'Rules', type: 'text' },
        { name: 'Limitations', type: 'text' },
        { name: 'Source of Power', type: 'string' },
      ],
    },
  ];

  try {
    // Use updateOne with upsert to avoid creating duplicates on multiple calls
    await Promise.all(defaultTemplates.map(template =>
      EntityTemplate.updateOne({ name: template.name }, template, { upsert: true })
    ));
    res.status(201).json({ message: 'Default templates seeded successfully.' });
  } catch (error) {
    console.error('Error seeding templates:', error);
    res.status(500).json({ message: 'Error seeding templates' });
  }
};
