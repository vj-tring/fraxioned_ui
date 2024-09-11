import React, { useState, useEffect } from 'react';
import { amenitiesapi, updateamenities, deleteAmenity } from '@/api';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';

interface Amenity {
    id: number;
    amenityName: string;
    amenityType: string;
    amenityDescription?: string;
}

const AmenityManagement: React.FC = () => {
    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
    

    useEffect(() => {
        fetchAmenities();
    }, []);

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

    const groupAmenitiesByType = (data: Amenity[]) => {
        return data.reduce((acc, amenity) => {
            if (!acc[amenity.amenityType]) {
                acc[amenity.amenityType] = [];
            }
            acc[amenity.amenityType].push(amenity);
            return acc;
        }, {} as { [key: string]: Amenity[] });
    };

    const handleEdit = (amenity: Amenity) => {
        setEditingAmenity(amenity);
    };

    const handleSave = async () => {
        if (editingAmenity) {
            try {
                await updateamenities(editingAmenity.id, {
                    updatedBy: { id: 1 },
                    amenityName: editingAmenity.amenityName,
                    amenityDescription: editingAmenity.amenityDescription || '',
                    amenityType: editingAmenity.amenityType
                });
                setEditingAmenity(null);
                await fetchAmenities();
            } catch (err) {
                setError('Failed to update amenity. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        setEditingAmenity(null);
    };

    const handleAddNew = () => {
        setIsAddingNew(true);
    };

    const handleCloseNewAmenityForm = () => {
        setIsAddingNew(false);
    };

    const handleAmenityAdded = () => {
        fetchAmenities();
    };

    const handleDeleteClick = (amenity: Amenity) => {
        setAmenityToDelete(amenity);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (amenityToDelete) {
            try {
                await deleteAmenity(amenityToDelete.id);
                setShowDeleteModal(false);
                setAmenityToDelete(null);
                await fetchAmenities();
            } catch (err) {
                setError('Failed to delete amenity. Please try again.');
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Amenity Management</h1>
                <button className={styles.addButton} onClick={handleAddNew}>
                    New Amenity
                </button>
            </div>
            <div className={styles.content}>
                {isAddingNew && (
                    <NewAmenityForm
                        onClose={handleCloseNewAmenityForm}
                        onAmenityAdded={handleAmenityAdded}
                    />
                )}
                <div className={styles.amenitiesGrid}>
                    {Object.entries(amenities).map(([type, amenitiesList]) => (
                        <div key={type} className={styles.amenityGroup}>
                            <h2 className={styles.amenityType}>{type}</h2>
                            {amenitiesList.map((amenity) => (
                                <div key={amenity.id} className={styles.amenityItem}>
                                    {editingAmenity?.id === amenity.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingAmenity.amenityName}
                                                onChange={(e) => setEditingAmenity({ ...editingAmenity, amenityName: e.target.value })}
                                                className={styles.editInput}
                                            />
                                            <button onClick={handleSave} className={styles.saveButton}><Check size={16} /></button>
                                            <button onClick={handleCancel} className={styles.cancelButton}><X size={16} /></button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{amenity.amenityName}</span>
                                            <div className={styles.actionButtons}>
                                                <button onClick={() => handleEdit(amenity)} className={styles.editButton}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteClick(amenity)} className={styles.deleteButton}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmationModal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Amenity"
                message={`Are you sure you want to delete the amenity "${amenityToDelete?.amenityName}"?`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default AmenityManagement;
