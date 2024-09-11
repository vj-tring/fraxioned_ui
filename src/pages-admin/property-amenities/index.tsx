import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './propertyamenities.module.css';
import { amenitiesapi, getAmenitiesById, updateamenityforproperty, updateamenities } from '@/api';
import NewAmenityForm from './new-amenity';
import { Pencil, Check, X } from 'lucide-react';

interface Amenity {
  id: number;
  amenityName: string;
  amenityType: string;
  amenityDescription?: string;
}

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [showNewAmenityForm, setShowNewAmenityForm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByType(response.data.data);
      setAmenities(groupedAmenities);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch amenities. Please try again later.');
      setLoading(false);
    }
  };

  const fetchSelectedAmenities = async (propertyId: number) => {
    try {
      const response = await getAmenitiesById(propertyId);
      const selected = response.data.data.map((item: any) => item.amenity.id);
      setSelectedAmenities(selected);
    } catch (err) {
      setError('Failed to fetch selected amenities for this property.');
    }
  };

  const groupAmenitiesByType = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      if (!acc[amenity.amenityType]) {
        acc[amenity.amenityType] = [];
      }
      acc[amenity.amenityType].push(amenity);
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

      const response = await updateamenityforproperty(updateData);
      setUpdateStatus('Amenities updated successfully!');
      console.log('Update response:', response);
    } catch (err) {
      setUpdateStatus('Failed to update amenities. Please try again.');
      console.error('Update error:', err);
    }
  };

 

  const handleCloseNewAmenityForm = () => {
    setShowNewAmenityForm(false);
  };

  const handleNewAmenityAdded = () => {
    fetchAmenities();
    setShowNewAmenityForm(false);
  };

  const toggleEditMode = async () => {
    if (editMode && editingAmenity) {
      await saveEdit();
    }
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

  const saveEdit = async () => {
    if (editingAmenity) {
      try {
        const updateData = {
          updatedBy: {
            id: 1
          },
          amenityName: editingAmenity.amenityName,
          amenityDescription: editingAmenity.amenityDescription || "",
          amenityType: editingAmenity.amenityType
        };

        await updateamenities(editingAmenity.id, updateData);

        setAmenities(prev => {
          const newAmenities = { ...prev };
          const typeArray = newAmenities[editingAmenity.amenityType];
          const index = typeArray.findIndex(a => a.id === editingAmenity.id);
          if (index !== -1) {
            typeArray[index] = editingAmenity;
          }
          return newAmenities;
        });
        setEditingAmenity(null);
        setUpdateStatus('Amenity updated successfully!');
      } catch (err) {
        setUpdateStatus('Failed to update amenity. Please try again.');
        console.error('Update error:', err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingAmenity(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Property Amenities</h1>
          <div className={styles.buttonGroup}>
            {/* <button className={`${styles.updateButton} ${editMode ? styles.active : ''}`} onClick={toggleEditMode}>
              {editMode ? 'Done' : 'Edit'}
            </button> */}
            <button className={styles.updateButton} onClick={handleUpdate}>Update</button>
            {/* <button className={styles.addButton} onClick={handleAddNewAmenity}>Add</button> */}
          </div>
        </div>
        <div className={styles.amenitiesGrid}>
          {Object.entries(amenities).map(([type, amenitiesList]) => (
            <div key={type} className={styles.amenityGroup}>
              <h2 className={styles.amenityType}>{type}</h2>
              {amenitiesList.map((amenity) => (
                <div key={amenity.id} className={styles.amenityItem}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleCheckboxChange(amenity.id)}
                    className={styles.checkbox}
                  />
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
                </div>
              ))}
            </div>
          ))}
        </div>
        {updateStatus && <div className={styles.updateStatus}>{updateStatus}</div>}
      </div>
      {showNewAmenityForm && (
        <NewAmenityForm
          onClose={handleCloseNewAmenityForm}
          onAmenityAdded={handleNewAmenityAdded}
        />
      )}
    </div>
  );
};

export default PropertyAmenities;




