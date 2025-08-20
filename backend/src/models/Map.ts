import { Schema, model, Document, Types } from 'mongoose';

export interface IMap extends Document {
  projectId: Types.ObjectId;
  name: string;
  imageUrl: string;
}

const mapSchema = new Schema<IMap>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Map = model<IMap>('Map', mapSchema);

export default Map;
