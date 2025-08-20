import { Request, Response } from 'express';
import StoryEvent from '../models/StoryEvent';

// Get all events for a project
export const getEventsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const events = await StoryEvent.find({ projectId });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, eventDate, entities } = req.body;
    const newEvent = await StoryEvent.create({
      projectId,
      title,
      description,
      eventDate,
      entities,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const updatedEvent = await StoryEvent.findByIdAndUpdate(
      eventId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await StoryEvent.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};
