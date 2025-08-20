import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = model<IProject>('Project', ProjectSchema);

export default Project;
