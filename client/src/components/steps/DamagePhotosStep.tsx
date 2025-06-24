import React, { useRef } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Chip
} from '@mui/material';
import { 
  CameraAlt, 
  Delete, 
  CloudUpload,
  DirectionsCar 
} from '@mui/icons-material';
import { DamagePhoto } from '../../types/claim';

interface DamagePhotosStepProps {
  photos: DamagePhoto[];
  onUpdate: (photos: DamagePhoto[]) => void;
}

const damageLocations = [
  { id: 'front', label: 'Front', icon: '🚗' },
  { id: 'back', label: 'Back', icon: '🚗' },
  { id: 'left-side', label: 'Left Side', icon: '🚗' },
  { id: 'right-side', label: 'Right Side', icon: '🚗' },
  { id: 'interior', label: 'Interior', icon: '🪑' },
  { id: 'other', label: 'Other', icon: '📷' }
];

const DamagePhotosStep: React.FC<DamagePhotosStepProps> = ({ 
  photos, 
  onUpdate 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<string>('front');

  const handleFileUpload = (files: FileList | null, location: string) => {
    if (!files) return;

    const newPhotos: DamagePhoto[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const photo: DamagePhoto = {
          id: Date.now().toString() + Math.random(),
          location,
          file,
          preview: URL.createObjectURL(file)
        };
        newPhotos.push(photo);
      }
    });

    onUpdate([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (photoId: string) => {
    const photoToRemove = photos.find(p => p.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    onUpdate(photos.filter(photo => photo.id !== photoId));
  };

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getPhotosForLocation = (location: string) => {
    return photos.filter(photo => photo.location === location);
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Attach Damage Photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Take or upload photos of the damage. Click on a car area below to add photos for that location.
      </Typography>

      {/* Car Diagram with Clickable Areas */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCar sx={{ mr: 1 }} />
            Vehicle Damage Areas
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 2,
            mt: 2
          }}>
            {damageLocations.map((location) => {
              const locationPhotos = getPhotosForLocation(location.id);
              return (
                <Button
                  key={location.id}
                  variant={locationPhotos.length > 0 ? "contained" : "outlined"}
                  onClick={() => handleLocationClick(location.id)}
                  sx={{
                    height: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    position: 'relative'
                  }}
                >
                  <Typography variant="h5">{location.icon}</Typography>
                  <Typography variant="body2">{location.label}</Typography>
                  {locationPhotos.length > 0 && (
                    <Chip
                      label={locationPhotos.length}
                      size="small"
                      color="primary"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                </Button>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Uploaded Photos ({photos.length})
            </Typography>
            
            <ImageList variant="masonry" cols={3} gap={8}>
              {photos.map((photo) => (
                <ImageListItem key={photo.id}>
                  <img
                    src={photo.preview}
                    alt={`Damage at ${photo.location}`}
                    loading="lazy"
                    style={{
                      borderRadius: 8,
                      maxHeight: 200,
                      objectFit: 'cover'
                    }}
                  />
                  <ImageListItemBar
                    title={damageLocations.find(loc => loc.id === photo.location)?.label || photo.location}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        onClick={() => handleRemovePhoto(photo.id)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      )}

      {/* Manual Upload Option */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Or Upload Photos Manually
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={() => fileInputRef.current?.click()}
            fullWidth
            sx={{ mt: 1 }}
          >
            Choose Files
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Supported formats: JPG, PNG, HEIC. Maximum 10MB per file.
          </Typography>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files, selectedLocation)}
      />

      {photos.length === 0 && (
        <Box sx={{ 
          mt: 3, 
          p: 3, 
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <CameraAlt sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            No photos uploaded yet. Please add at least one photo to continue.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DamagePhotosStep;
