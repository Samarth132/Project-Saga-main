import { Schema, model, Document } from 'mongoose';

export interface IRelationship extends Document {
  _id: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  source: Schema.Types.ObjectId;
  target: Schema.Types.ObjectId;
  type: string;
  description?: string;
}

const RelationshipSchema = new Schema<IRelationship>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
    required: true,
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

const Relationship = model<IRelationship>('Relationship', RelationshipSchema);

export default Relationship;
