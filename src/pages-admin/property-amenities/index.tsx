import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './propertyamenities.module.css';
import { amenitiesapi } from '@/api';
import { Pencil, Check, X, ChevronRight } from 'lucide-react';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import ConfirmationModal from '@/components/confirmation-modal';
import { 
  getAmenitiesById, 
  updatePropertyAmenities, 
  resetPropertyAmenities 
} from '@/store/slice/auth/propertyamenities';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

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
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, amenities: propertyAmenities } = useSelector((state: RootState) => state.propertyAmenities);

  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getAmenitiesById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (propertyAmenities.length > 0) {
      const selected = propertyAmenities.map((item) => item.amenity.id);
      setSelectedAmenities(selected);
    }
  }, [propertyAmenities]);

  useEffect(() => {
    if (editingAmenity && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingAmenity]);

  useEffect(() => {
    if (success) {
      showSnackbar('Amenities updated successfully!', 'success');
      setDialogOpen(false);
      setShowConfirmModal(false);
      dispatch(resetPropertyAmenities());
    }
    if (error) {
      showSnackbar(error, 'error');
      dispatch(resetPropertyAmenities());
    }
  }, [success, error, dispatch]);

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
    } catch (err) {
      showSnackbar('Failed to fetch amenities. Please try again later.', 'error');
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

  const handleUpdateClick = () => {
    setShowConfirmModal(true);
  };

  const handleUpdate = async () => {
    const updateData = {
      property: {
        id: Number(id)
      },
      amenities: selectedAmenities.map(amenityId => ({ id: amenityId })),
      updatedBy: {
        id: 1 // Assuming a static user ID for now
      }
    };

    dispatch(updatePropertyAmenities(updateData));
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
            <button className={styles.updateButton} onClick={handleUpdateClick}>Update</button>
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
          <button onClick={handleUpdateClick} className={styles.dialogUpdateButton}>
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
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleUpdate}
        title="Confirm Update"
        message="Are you sure you want to update the amenities for this property?"
        confirmLabel="Update"
        cancelLabel="Cancel" children={undefined}      />
    </div>
  );
};

export default PropertyAmenities;