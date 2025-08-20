import { Schema, model, Document, Types } from 'mongoose';

export interface IPin extends Document {
  mapId: Types.ObjectId;
  position: {
    lat: number;
    lng: number;
  };
  entityId?: Types.ObjectId;
}

const pinSchema = new Schema<IPin>(
  {
    mapId: { type: Schema.Types.ObjectId, ref: 'Map', required: true },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    entityId: { type: Schema.Types.ObjectId, ref: 'Entity' },
  },
  { timestamps: true }
);

const Pin = model<IPin>('Pin', pinSchema);

export default Pin;
