import React, { useState, useEffect } from 'react';
import { amenitiesapi, updateamenities, deleteAmenity, getamenitygroup } from '@/api';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown, RefreshCw, Search } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { IconButton, Tooltip } from '@mui/material';

interface Amenity {
    id: number;
    amenityName: string;
    amenityDescription?: string;
    amenityGroup: {
        id: number;
        name: string;
    };
}

interface AmenityGroup {
    id: number;
    name: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

const AmenityManagement: React.FC = () => {
    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
    const [groupSearchTerms, setGroupSearchTerms] = useState<{ [key: string]: string }>({});
    const [amenityGroups, setAmenityGroups] = useState<AmenityGroup[]>([]);
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
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        fetchAmenities();
        fetchAmenityGroups();
    }, []);

    const fetchAmenityGroups = async () => {
        try {
            const response = await getamenitygroup();
            if (response.data.success) {
                setAmenityGroups(response.data.data);
            } else {
                showSnackbar('Failed to fetch amenity groups', 'error');
            }
        } catch (err) {
            showSnackbar('Failed to fetch amenity groups', 'error');
        }
    };

    const fetchAmenities = async () => {
        try {
            const response = await amenitiesapi();
            const groupedAmenities = groupAmenitiesByType(response.data.data);
            setAmenities(groupedAmenities);
            setLoading(false);
        } catch (err) {
            showSnackbar('Failed to fetch amenities', 'error');
            setLoading(false);
        }
    };

    const handleGroupSearch = (group: string, term: string) => {
        setGroupSearchTerms(prev => ({ ...prev, [group]: term }));
    };

    const groupAmenitiesByType = (data: Amenity[]) => {
        return data.reduce((acc, amenity) => {
            const groupName = amenity.amenityGroup.name;
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(amenity);
            return acc;
        }, {} as { [key: string]: Amenity[] });
    };

    const handleEdit = (amenity: Amenity) => {
        setEditingAmenity(amenity);
    };

    const handleSave = async () => {
        if (editingAmenity) {
            try {
                const updateData = {
                    updatedBy: { id: 1 },
                    amenityName: editingAmenity.amenityName,
                    amenityDescription: editingAmenity.amenityDescription || '',
                    amenityGroup: { id: editingAmenity.amenityGroup.id }
                };

                const response = await updateamenities(editingAmenity.id, updateData);
                if (response.data.success) {
                    setEditingAmenity(null);
                    await fetchAmenities();
                    showSnackbar('Amenity updated successfully', 'success');
                } else {
                    showSnackbar(response.data.message || 'Failed to update amenity', 'error');
                }
            } catch (err: any) {
                showSnackbar(err.response?.data?.message || 'Failed to update amenity', 'error');
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
                    setShowDeleteModal(false);
                    setAmenityToDelete(null);
                    await fetchAmenities();
                } else {
                    showSnackbar(response.data.message || 'Failed to delete amenity', 'error');
                    setShowDeleteModal(false);
                    setAmenityToDelete(null);
                }
            } catch (err: any) {
                showSnackbar(err.response?.data?.message || 'Failed to delete amenity', 'error');
                setShowDeleteModal(false);
                setAmenityToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
    };

    const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const toggleGroupExpansion = (group: string) => {
        setExpandedGroups(prev =>
            prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
        );
    };

    const filteredAmenities = Object.entries(amenities).reduce((acc, [group, amenitiesList]) => {
        const groupSearchTerm = groupSearchTerms[group] || '';
        const filtered = amenitiesList.filter(amenity =>
            amenity.amenityName.toLowerCase().includes(groupSearchTerm.toLowerCase())
        );
        acc[group] = filtered;
        return acc;
    }, {} as { [key: string]: Amenity[] });

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Amenity Management</h1>
                <div className={styles.actions}>
                    <Tooltip title="Add New Amenity" arrow>
                        <button className={styles.addButton} onClick={handleAddNew}>
                            <Plus size={20} />
                            <span className={styles.buttonText}>New Amenity</span>
                        </button>
                    </Tooltip>
                    <Tooltip title="Refresh" arrow>
                        <IconButton
                            onClick={() => window.location.reload()}
                            className={styles.refreshIcon}
                            aria-label="refresh"
                        >
                            <RefreshCw size={20} />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={styles.content}>
                {isAddingNew && (
                    <NewAmenityForm
                        onClose={handleCloseNewAmenityForm}
                        onAmenityAdded={handleAmenityAdded}
                    />
                )}
                <div className={styles.amenitiesList}>
                    {Object.entries(filteredAmenities).map(([group, amenitiesList]) => (
                        <div key={group} className={styles.amenityGroup}>
                            <div
                                className={styles.groupHeader}
                                onClick={() => toggleGroupExpansion(group)}
                            >
                                {expandedGroups.includes(group) ? (
                                    <ChevronDown size={20} />
                                ) : (
                                    <ChevronRight size={20} />
                                )}
                                <h2>{group}</h2>
                                <span className={styles.amenityCount}>{amenitiesList.length}</span>
                            </div>
                            {expandedGroups.includes(group) && (
                                <div className={styles.amenityItems}>
                                    <div className={styles.groupSearchContainer}>
                                        <h3 className={styles.groupSearchHeading}>{group} amenity list</h3>
                                        <div className={styles.groupSearchBar}>
                                            <Search size={20} />
                                            <input
                                                type="text"
                                                placeholder={`Search in ${group}...`}
                                                value={groupSearchTerms[group] || ''}
                                                onChange={(e) => handleGroupSearch(group, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {amenitiesList.length > 0 ? (
                                        amenitiesList.map((amenity) => (
                                            <div key={amenity.id} className={styles.amenityItem}>
                                                {editingAmenity?.id === amenity.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingAmenity.amenityName}
                                                        onChange={(e) => setEditingAmenity({ ...editingAmenity, amenityName: e.target.value })}
                                                        className={styles.editInput}
                                                    />
                                                ) : (
                                                    <span className={styles.amenityName}>{amenity.amenityName}</span>
                                                )}
                                                <div className={styles.actionButtons}>
                                                    {editingAmenity?.id === amenity.id ? (
                                                        <>
                                                            <Tooltip title="Save" arrow>
                                                                <button onClick={handleSave} className={styles.saveButton}>Save</button>
                                                            </Tooltip>
                                                            <Tooltip title="Cancel" arrow>
                                                                <button onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Tooltip title="Edit" arrow>
                                                                <button onClick={() => handleEdit(amenity)} className={styles.editButton}>
                                                                    <Edit2 size={16} />
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip title="Delete" arrow>
                                                                <button onClick={() => handleDeleteClick(amenity)} className={styles.deleteButton}>
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.notFoundMessage}>
                                            No amenities found in {group} for this search.
                                        </div>
                                    )}
                                </div>
                            )}
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
                cancelLabel="Cancel" children={undefined}            />
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