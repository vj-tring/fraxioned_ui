import React, { useState, useEffect } from 'react';
import { amenitiesapi, updateamenities, deleteAmenity } from '@/api';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Check, X, Trash2, Plus, Search } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';
import CustomizedSnackbars from '@/components/customized-snackbar';

interface Amenity {
    id: number;
    amenityName: string;
    amenityType: string;
    amenityDescription?: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

const AmenityManagement: React.FC = () => {
    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
    const [loading, setLoading] = useState(true);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState<string | null>(null);

    useEffect(() => {
        fetchAmenities();
    }, []);

    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                setSnackbar((prev) => ({ ...prev, open: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const fetchAmenities = async () => {
        try {
            const response = await amenitiesapi();
            const groupedAmenities = groupAmenitiesByType(response.data.data);
            setAmenities(groupedAmenities);
            setLoading(false);
        } catch (err) {
            showSnackbar('Failed to fetch amenities. Please try again later.', 'error');
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
                const response = await updateamenities(editingAmenity.id, {
                    updatedBy: { id: 1 },
                    amenityName: editingAmenity.amenityName,
                    amenityDescription: editingAmenity.amenityDescription || '',
                    amenityType: editingAmenity.amenityType
                });
                if (response.data.success) {
                    setEditingAmenity(null);
                    await fetchAmenities();
                    showSnackbar('Amenity updated successfully', 'success');
                } else {
                    showSnackbar(response.data.message || 'Failed to update amenity. Please try again.', 'error');
                }
            } catch (err: any) {
                showSnackbar(err.response?.data?.message || 'Failed to update amenity. Please try again.', 'error');
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
        showSnackbar('New amenity added successfully', 'success');
    };

    const handleDeleteClick = (amenity: Amenity) => {
        setAmenityToDelete(amenity);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (amenityToDelete) {
            try {
                const response = await deleteAmenity(amenityToDelete.id);
                if (response.data.success) {
                    showSnackbar('Amenity deleted successfully', 'success');
                    setTimeout(() => {
                        setShowDeleteModal(false);
                        setAmenityToDelete(null);
                    }, 500);
                    await fetchAmenities();
                } else {
                    showSnackbar(response.data.message || 'Failed to delete amenity. Please try again.', 'error');
                    setTimeout(() => {
                        setShowDeleteModal(false);
                        setAmenityToDelete(null);
                    }, 500);
                }
            } catch (err: any) {
                showSnackbar(err.response?.data?.message || 'Failed to delete amenity. Please try again.', 'error');
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setAmenityToDelete(null);
                }, 500);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
    };

    const filteredAmenities = Object.entries(amenities).reduce((acc, [type, amenitiesList]) => {
        const filtered = amenitiesList.filter(amenity =>
            amenity.amenityName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[type] = filtered;
        }
        return acc;
    }, {} as { [key: string]: Amenity[] });

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Amenity Types</h2>
                <ul className={styles.typeList}>
                    {Object.keys(amenities).map(type => (
                        <li
                            key={type}
                            className={`${styles.typeItem} ${activeType === type ? styles.active : ''}`}
                            onClick={() => setActiveType(type === activeType ? null : type)}
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Amenity Management</h1>
                    <div className={styles.actions}>
                        <div className={styles.searchBar}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search amenities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className={styles.addButton} onClick={handleAddNew}>
                            New Amenity
                        </button>
                    </div>
                </div>
                <div className={styles.content}>
                    {isAddingNew && (
                        <NewAmenityForm
                            onClose={handleCloseNewAmenityForm}
                            onAmenityAdded={handleAmenityAdded}
                        />
                    )}
                    <div className={styles.amenitiesGrid}>
                        {Object.entries(filteredAmenities)
                            .filter(([type]) => !activeType || type === activeType)
                            .map(([type, amenitiesList]) => (
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
                                                    <div className={styles.actionButtons}>
                                                        <button onClick={handleSave} className={styles.saveButton}><Check size={16} /></button>
                                                        <button onClick={handleCancel} className={styles.cancelButton}><X size={16} /></button>
                                                    </div>
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
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={handleSnackbarClose}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </div>
    );
};

export default AmenityManagement;