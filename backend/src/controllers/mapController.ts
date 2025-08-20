import { Request, Response, NextFunction } from 'express'; // Add NextFunction import
import Map from '../models/Map';
import Pin from '../models/Pin';
import Project from '../models/Project';
import { IMap } from '../models/Map';
import { IPin } from '../models/Pin';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const createMap = [
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('mapImage')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error('Multer error:', err);
        return res.status(500).json({ message: 'File upload error', error: err.message });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error('Unknown upload error:', err);
        return res.status(500).json({ message: 'Unknown file upload error', error: (err as Error).message });
      }
      console.log('Multer next() called'); // Add this line
      next(); // Everything went fine.
    });
  },
  async (req: Request, res: Response) => {
    try {
      const { name, projectId } = req.body;
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
      const imageUrl = req.file.path;
      const map = new Map({ name, projectId, imageUrl });
      console.log('Map object before save:', map); // Add this line
      await map.save();
      console.log('Map object after save:', map); // Add this line
      res.status(201).json(map);
    } catch (error) {
        console.error('Error creating map:', error);
        res.status(500).json({ message: 'Error creating map', error: (error as Error).message }); // Add error message to response
    }
  }
];

export const getMapsByProject = async (req: Request, res: Response) => {
  try {
    const maps = await Map.find({ projectId: req.params.projectId });
    res.json(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    res.status(500).json({ message: 'Error fetching maps' });
  }
};

export const deleteMap = async (req: Request, res: Response) => {
  try {
    const map = await Map.findById(req.params.mapId);
    if (!map) {
      return res.status(404).json({ message: 'Map not found' });
    }

    // Delete the image file from the uploads folder
    try {
      if (map.imageUrl) {
        fs.unlinkSync(map.imageUrl);
      }
    } catch (err) {
      console.error('Error deleting map image file:', err);
      // Not treating this as a fatal error for the map deletion itself
    }

    await map.deleteOne();
    res.json({ message: 'Map deleted successfully' });
  } catch (error) {
    console.error('Error deleting map:', error);
    res.status(500).json({ message: 'Error deleting map' });
  }
};

export const createPin = async (req: Request, res: Response) => {
    try {
      const { mapId, position, entityId } = req.body;
      const pin = new Pin({ mapId, position, entityId });
      await pin.save();
      res.status(201).json(pin);
    } catch (error) {
        console.error('Error creating pin:', error);
        res.status(500).json({ message: 'Error creating pin' });
    }
};

export const getPinsByMap = async (req: Request, res: Response) => {
    try {
        const pins = await Pin.find({ mapId: req.params.mapId });
        res.json(pins);
    } catch (error) {
        console.error('Error fetching pins:', error);
        res.status(500).json({ message: 'Error fetching pins' });
    }
};

export const updatePin = async (req: Request, res: Response) => {
    try {
        const { position, entityId } = req.body;
        const pin = await Pin.findByIdAndUpdate(
            req.params.pinId,
            { position, entityId },
            { new: true }
        );
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        res.json(pin);
    } catch (error) {
        console.error('Error updating pin:', error);
        res.status(500).json({ message: 'Error updating pin' });
    }
};

export const deletePin = async (req: Request, res: Response) => {
    try {
        const pin = await Pin.findById(req.params.pinId);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        await pin.deleteOne();
        res.json({ message: 'Pin deleted successfully' });
    } catch (error) {
        console.error('Error deleting pin:', error);
        res.status(500).json({ message: 'Error deleting pin' });
    }
};
