import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './propertyamenities.module.css';
import { amenitiesapi, getAmenitiesById, updateamenityforproperty } from '@/api';
import { Pencil, Check, X, ChevronRight, Save } from 'lucide-react';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription?: string;
  amenityGroup: {
    id: number;
    name: string;
  };
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (id) {
      fetchSelectedAmenities(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (editingAmenity && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingAmenity]);

  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMoreClick = (group: string) => {
    setSelectedGroup(group);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByGroup(response.data.data);
      setAmenities(groupedAmenities);
      setLoading(false);
    } catch (err) {
      showSnackbar('Failed to fetch amenities. Please try again later.', 'error');
      setLoading(false);
    }
  };

  const fetchSelectedAmenities = async (propertyId: number) => {
    try {
      const response = await getAmenitiesById(propertyId);
      const selected = response.data.data.map((item: any) => item.amenity.id);
      setSelectedAmenities(selected);
    } catch (err) {
      showSnackbar('Failed to fetch selected amenities for this property.', 'error');
    }
  };

  const groupAmenitiesByGroup = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      const group = amenity.amenityGroup.name;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(amenity);
      return acc;
    }, {} as { [key: string]: Amenity[] });
  };

  const handleCheckboxChange = (amenityId: number) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        property: {
          id: Number(id)
        },
        amenities: selectedAmenities.map(amenityId => ({ id: amenityId })),
        updatedBy: {
          id: 1
        }
      };

      await updateamenityforproperty(updateData);
      showSnackbar('Amenities updated successfully!', 'success');
      setDialogOpen(false);
    } catch (err) {
      showSnackbar('Failed to update amenities. Please try again.', 'error');
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditingAmenity(null);
  };

  const startEditing = (amenity: Amenity) => {
    setEditingAmenity(amenity);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingAmenity) {
      setEditingAmenity({ ...editingAmenity, amenityName: e.target.value });
    }
  };

  const saveEdit = () => {
    if (editingAmenity) {
      setAmenities(prev => {
        const newAmenities = { ...prev };
        const groupArray = newAmenities[editingAmenity.amenityGroup.name];
        const index = groupArray.findIndex(a => a.id === editingAmenity.id);
        if (index !== -1) {
          groupArray[index] = editingAmenity;
        }
        return newAmenities;
      });
      setEditingAmenity(null);
      showSnackbar('Amenity updated successfully!', 'success');
    }
  };

  const cancelEdit = () => {
    setEditingAmenity(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Property Amenities</h1>
          <div className={styles.buttonGroup}>
            <button className={styles.updateButton} onClick={handleUpdate}>Update</button>
          </div>
        </div>
        <div className={styles.amenitiesScrollContainer}>
          <div className={styles.amenitiesGrid}>
            {Object.entries(amenities).map(([group, amenitiesList]) => (
              <div key={group} className={styles.amenityGroup}>
                <h2 className={styles.amenityType}>{group}</h2>
                <div className={styles.amenityList}>
                  {amenitiesList.slice(0, 3).map((amenity) => (
                    <div key={amenity.id} className={styles.amenityItem}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => handleCheckboxChange(amenity.id)}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkmark}></span>
                        {editMode && editingAmenity?.id === amenity.id ? (
                          <div className={styles.editingWrapper}>
                            <input
                              ref={inputRef}
                              type="text"
                              value={editingAmenity.amenityName}
                              onChange={handleEditChange}
                              className={styles.editInput}
                            />
                            <button onClick={saveEdit} className={styles.editButton}>
                              <Check size={16} />
                            </button>
                            <button onClick={cancelEdit} className={styles.editButton}>
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className={styles.amenityName}>
                            {amenity.amenityName}
                            {editMode && (
                              <button onClick={() => startEditing(amenity)} className={styles.editButton}>
                                <Pencil size={16} />
                              </button>
                            )}
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                {amenitiesList.length > 3 && (
                  <button className={styles.moreButton} onClick={() => handleMoreClick(group)}>
                    More <ChevronRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        classes={{ paper: styles.dialogPaper }}
      >
        <DialogTitle className={styles.dialogTitle}>
          {selectedGroup} Amenities
          <button onClick={handleUpdate} className={styles.dialogUpdateButton}>
            Update
          </button>
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <div className={styles.dialogAmenityList}>
            {amenities[selectedGroup]?.map((amenity) => (
              <div key={amenity.id} className={styles.dialogAmenityItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleCheckboxChange(amenity.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkmark}></span>
                  {amenity.amenityName}
                </label>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyAmenities;
