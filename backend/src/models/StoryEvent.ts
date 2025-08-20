import { Schema, model, Document } from 'mongoose';

export const KANBAN_STATUSES = ['To Do', 'In Progress', 'Done'];

export interface IStoryEvent extends Document {
  projectId: Schema.Types.ObjectId;
  title: string;
  description: string;
  eventDate: string; // Using a string for flexible narrative dates
  entities: Schema.Types.ObjectId[];
  status: string;
}

const StoryEventSchema = new Schema<IStoryEvent>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  entities: [{
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  }],
  status: {
    type: String,
    required: true,
    enum: KANBAN_STATUSES,
    default: 'To Do',
  },
}, { timestamps: true });

const StoryEvent = model<IStoryEvent>('StoryEvent', StoryEventSchema);

export default StoryEvent;
