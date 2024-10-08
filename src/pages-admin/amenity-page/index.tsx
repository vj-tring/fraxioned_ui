import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { amenitiesapi } from '@/api';
import { updateAmenity, resetAmenitiesState, deleteAmenityAsync } from '@/store/slice/auth/amenitiespageSlice';
import { RootState } from '@/store/reducers';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown, RefreshCw, Search } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { IconButton, Tooltip } from '@mui/material';
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
    const dispatch = useDispatch<AppDispatch>();
    const {
        loading: updateLoading,
        error: updateError,
        success: updateSuccess,
        deleteLoading,
        deleteError,
        deleteSuccess
    } = useSelector((state: RootState) => state.amenitiesPage);

    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
    const [groupSearchTerms, setGroupSearchTerms] = useState<{ [key: string]: string }>({});
    const [amenityGroups, setAmenityGroups] = useState<AmenityGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        fetchAmenities();
        // fetchAmenityGroups();
    }, []);

    useEffect(() => {
        if (updateSuccess) {
            showSnackbar('Amenity updated successfully', 'success');
            setEditingAmenity(null);
            fetchAmenities();
            dispatch(resetAmenitiesState());
        }
        if (updateError) {
            showSnackbar(updateError, 'error');
            dispatch(resetAmenitiesState());
        }
    }, [updateSuccess, updateError, dispatch]);

    useEffect(() => {
        if (deleteSuccess) {
            showSnackbar('Amenity deleted successfully', 'success');
            fetchAmenities();
            dispatch(resetAmenitiesState());
        }
        if (deleteError) {
            showSnackbar(deleteError, 'error');
            dispatch(resetAmenitiesState());
        }
    }, [deleteSuccess, deleteError, dispatch]);

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
            setShowUpdateModal(true);
        }
    };

    const handleUpdateConfirm = async () => {
        if (editingAmenity) {
            const updateData = {
                updatedBy: { id: 1 },
                amenityName: editingAmenity.amenityName,
                amenityDescription: editingAmenity.amenityDescription || '',
                amenityGroup: { id: editingAmenity.amenityGroup.id }
            };

            dispatch(updateAmenity({
                id: editingAmenity.id,
                updateData
            }));
        }
        setShowUpdateModal(false);
    };

    const handleUpdateCancel = () => {
        setShowUpdateModal(false);
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
                dispatch(deleteAmenityAsync(amenityToDelete.id));
                setShowDeleteModal(false);
                setAmenityToDelete(null);
            } catch (err: any) {
                showSnackbar('Failed to delete amenity', 'error');
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
                                                                <button
                                                                    onClick={handleSave}
                                                                    className={styles.saveButton}
                                                                    disabled={updateLoading}
                                                                >
                                                                    Save
                                                                </button>
                                                            </Tooltip>
                                                            <Tooltip title="Cancel" arrow>
                                                                <button
                                                                    onClick={handleCancel}
                                                                    className={styles.cancelButton}
                                                                    disabled={updateLoading}
                                                                >
                                                                    Cancel
                                                                </button>
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
                                                                <button
                                                                    onClick={() => handleDeleteClick(amenity)}
                                                                    className={styles.deleteButton}
                                                                    disabled={deleteLoading}
                                                                >
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
                cancelLabel="Cancel"
                children={undefined}
            />

            <ConfirmationModal
                show={showUpdateModal}
                onHide={handleUpdateCancel}
                onConfirm={handleUpdateConfirm}
                title="Update Amenity"
                message={`Are you sure you want to update the amenity "${editingAmenity?.amenityName}"?`}
                confirmLabel="Update"
                cancelLabel="Cancel"
                children={undefined}
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