import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { type LatLng, type LatLngBoundsExpression } from 'leaflet';
import useMapStore from '../store/mapStore';
import useProjectStore from '../store/projectStore';
import useEntityStore from '../store/entityStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autocomplete } from '@mui/material';

// Set a default icon for the markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapInitializer: React.FC<{ bounds: LatLngBoundsExpression | undefined, imageDimensions: {width: number, height: number} | null }> = ({ bounds, imageDimensions }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
      map.invalidateSize(); // Added invalidateSize
    }
  }, [map, bounds]);

  return null;
};

const AddPinOnClick: React.FC<{ onPinAdd: (position: LatLng) => void }> = ({ onPinAdd }) => {
  useMapEvents({
    click(e) {
      onPinAdd(e.latlng);
    },
  });
  return null;
};

const CartographerPage: React.FC = () => {
  const { selectedProject } = useProjectStore();
  const { maps, selectedMap, pins, fetchMaps, createMap, deleteMap, selectMap, fetchPins, createPin, deletePin, updatePin } = useMapStore();
  const { entities, fetchEntities } = useEntityStore();
  const [open, setOpen] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newMapImage, setNewMapImage] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null);


  useEffect(() => {
    if (selectedProject) {
      fetchMaps(selectedProject._id);
      fetchEntities(selectedProject._id);
    }
  }, [selectedProject, fetchMaps, fetchEntities]);

  useEffect(() => {
    const loadMapData = async () => {
      if (selectedMap) {
        setImageDimensions(null); // Reset dimensions to show loading state
        const imageUrl = `http://localhost:5001/${selectedMap.imageUrl}`;
        console.log('Attempting to load map image from:', imageUrl);

        try {
          const img = new Image();
          img.src = imageUrl;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              console.log('Map image loaded successfully. Dimensions:', img.naturalWidth, img.naturalHeight);
              setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
              resolve();
            };
            img.onerror = (error) => {
              console.error('Error loading map image:', imageUrl, error);
              reject(error);
            };
          });
          
          await fetchPins(selectedMap._id);

        } catch (error) {
          setImageDimensions(null); // Ensure dimensions are null on error
        }
      } else {
        setImageDimensions(null);
      }
    };

    loadMapData();
  }, [selectedMap, fetchPins]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateMap = async () => {
    if (selectedProject && newMapName && newMapImage) {
      await createMap(selectedProject._id, newMapName, newMapImage);
      setNewMapName('');
      setNewMapImage(null);
      handleClose();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewMapImage(event.target.files[0]);
    }
  };

  const addPin = (position: LatLng) => {
    if (selectedMap) {
      createPin(selectedMap._id, { lat: position.lat, lng: position.lng });
    }
  };

  const bounds: LatLngBoundsExpression | undefined = imageDimensions && selectedMap
  ? [[0, 0], [imageDimensions.height, imageDimensions.width]]
  : undefined;

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        The Cartographer's Table
      </Typography>
      <Box mb={2} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl fullWidth>
          <InputLabel>Select Map</InputLabel>
          <Select
            value={selectedMap?._id || ''}
            label="Select Map"
            onChange={(e) => selectMap(maps.find(m => m._id === e.target.value) || null)}
          >
            {maps.map(map => (
              <MenuItem key={map._id} value={map._id}>{map.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleOpen}>New Map</Button>
        {selectedMap && (
            <IconButton onClick={() => deleteMap(selectedMap._id)} color="error">
                <DeleteIcon />
            </IconButton>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Map</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Map Name"
            type="text"
            fullWidth
            variant="standard"
            value={newMapName}
            onChange={(e) => setNewMapName(e.target.value)}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          {newMapImage && <Typography sx={{ mt: 1 }}>{newMapImage.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateMap}>Create</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ flexGrow: 1, minHeight: '500px' }}>
        <MapContainer
          key={selectedMap?._id}
          style={{ height: '100%', width: '100%' }}
          crs={L.CRS.Simple}
          minZoom={-5}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          className="leaflet-map-container"
        >
          {selectedMap && bounds && imageDimensions ? (
            <>
              <ImageOverlay url={`http://localhost:5001/${selectedMap.imageUrl}`} bounds={bounds} />
              <MapInitializer bounds={bounds} imageDimensions={imageDimensions} /> {/* Pass imageDimensions */}
            </>
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          )}
          <AddPinOnClick onPinAdd={addPin} />
          {pins.map((pin) => {
            console.log('Rendering pin:', pin); // Added log
            const linkedEntity = pin.entityId ? entities.find(e => e._id === pin.entityId) : null;
            return (
              <Marker key={pin._id} position={pin.position}>
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {/* Changed alignItems to center */}
                      <Typography variant="subtitle1">
                        {linkedEntity ? linkedEntity.name : 'Unlinked Pin'}
                      </Typography>
                      <IconButton size="small" onClick={() => deletePin(pin._id)} color="error">
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                    <Autocomplete
                      size="small"
                      options={entities}
                      getOptionLabel={(option) => option.name}
                      value={linkedEntity || null}
                      onChange={(_, newValue) => {
                        if (newValue) {
                          updatePin(pin._id, { entityId: newValue._id });
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Link to Entity" variant="standard" />}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </Box>
    </Container>
  );
};

export default CartographerPage;
