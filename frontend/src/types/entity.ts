export interface Entity {
  _id: string;
  projectId: string;
  name: string;
  type: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// For creating a new entity, we don't have the _id or timestamps
export type NewEntity = Omit<Entity, '_id' | 'createdAt' | 'updatedAt'>;

// For updating an entity, all fields are optional
export type UpdateEntity = Partial<NewEntity>;

export interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewProject {
    name: string;
    description: string;
}