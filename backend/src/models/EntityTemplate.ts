import { Schema, model, Document } from 'mongoose';

export interface IField {
  name: string;
  type: 'string' | 'text' | 'number' | 'date';
}

export interface IEntityTemplate extends Document {
  name: string;
  description?: string;
  fields: IField[];
}

const FieldSchema = new Schema<IField>({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['string', 'text', 'number', 'date'] },
}, { _id: false });

const EntityTemplateSchema = new Schema<IEntityTemplate>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  fields: [FieldSchema],
}, { timestamps: true });

const EntityTemplate = model<IEntityTemplate>('EntityTemplate', EntityTemplateSchema);

export default EntityTemplate;
