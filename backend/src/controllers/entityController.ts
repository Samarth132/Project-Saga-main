import type { Request, Response } from 'express';
import Entity from '../models/Entity';
import type { IEntity } from '../models/Entity';
import Project from '../models/Project';
import Relationship from '../models/Relationship';
import type { IRelationship } from '../models/Relationship';

// Get all entities for a specific project
export const getEntitiesByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const entities = await Entity.find({ projectId });
    res.status(200).json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ message: 'Error fetching entities' });
  }
};

// Create a new entity within a project
export const createEntity = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, type, data } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newEntity = await Entity.create({
      projectId,
      name,
      type,
      data,
    });

    res.status(201).json(newEntity);
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ message: 'Error creating entity' });
  }
};

// Get a single entity by its ID
export const getEntity = async (req: Request, res: Response) => {
  try {
    const { entityId } = req.params;
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return res.status(404).json({ message: 'Entity not found' });
    }
    res.status(200).json(entity);
  } catch (error) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ message: 'Error fetching entity' });
  }
};

// Update an entity
export const updateEntity = async (req: Request, res: Response) => {
  try {
    const { entityId } = req.params;
    const updatedEntity = await Entity.findByIdAndUpdate(
      entityId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEntity) {
      return res.status(404).json({ message: 'Entity not found' });
    }
    res.status(200).json(updatedEntity);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ message: 'Error updating entity' });
  }
};

// Delete an entity
export const deleteEntity = async (req: Request, res: Response) => {
  try {
    const { entityId } = req.params;
    const deletedEntity = await Entity.findByIdAndDelete(entityId);
    if (!deletedEntity) {
      return res.status(404).json({ message: 'Entity not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ message: 'Error deleting entity' });
  }
};

// Get all entities and relationships for graph view
export const getGraphData = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const entities: IEntity[] = await Entity.find({ projectId });
    const relationships: IRelationship[] = await Relationship.find({ projectId });

    const numNodes = entities.length;
    const radius = numNodes * 30; // Dynamic radius
    const nodes = entities.map((entity, index) => {
      const angle = (index / numNodes) * 2 * Math.PI;
      return {
        id: entity._id.toString(),
        type: 'default',
        data: { label: entity.name },
        position: {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        },
      };
    });

    const edges = relationships.map((rel) => ({
      id: rel._id.toString(),
      source: rel.source.toString(),
      target: rel.target.toString(),
      label: rel.type,
    }));

    res.status(200).json({ nodes, edges });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ message: 'Error fetching graph data' });
  }
};

// Find entities by name for backlinking
export const findEntitiesByName = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { names } = req.body;

    if (!Array.isArray(names)) {
      return res.status(400).json({ message: 'Names must be an array' });
    }

    const entities = await Entity.find({
      projectId,
      name: { $in: names },
    });

    res.status(200).json(entities);
  } catch (error) {
    console.error('Error finding entities by name:', error);
    res.status(500).json({ message: 'Error finding entities by name' });
  }
};
