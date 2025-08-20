import { Request, Response } from 'express';
import Relationship from '../models/Relationship';

// Get all relationships for a specific entity
export const getRelationshipsForEntity = async (req: Request, res: Response) => {
  try {
    const { entityId } = req.params;
    const relationships = await Relationship.find({
      $or: [{ source: entityId }, { target: entityId }],
    }).populate('source target', 'name type'); // Populate with name and type

    res.status(200).json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ message: 'Error fetching relationships' });
  }
};

// Create a new relationship
export const createRelationship = async (req: Request, res: Response) => {
  try {
    const { projectId, source, target, type } = req.body;
    const newRelationship = await Relationship.create({
      projectId,
      source,
      target,
      type,
    });
    res.status(201).json(newRelationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    res.status(500).json({ message: 'Error creating relationship' });
  }
};

// Delete a relationship
export const deleteRelationship = async (req: Request, res: Response) => {
  try {
    const { relationshipId } = req.params;
    const deletedRelationship = await Relationship.findByIdAndDelete(relationshipId);
    if (!deletedRelationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ message: 'Error deleting relationship' });
  }
};
