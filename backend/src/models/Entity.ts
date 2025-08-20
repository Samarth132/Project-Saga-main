import { Schema, model, Document } from 'mongoose';

export interface IEntity extends Document {
  _id: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  type: string;
  name: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const EntitySchema = new Schema<IEntity>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

const Entity = model<IEntity>('Entity', EntitySchema);

export default Entity;
