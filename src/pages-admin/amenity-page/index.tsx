import React, { useState, useEffect } from 'react';
import { amenitiesapi, updateamenities, deleteAmenity, getamenitygroup } from '@/api';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Check, X, Trash2, Plus, ChevronDown, Search } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';
import CustomizedSnackbars from '@/components/customized-snackbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

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
    const [amenityGroups, setAmenityGroups] = useState<AmenityGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dropdownSearch, setDropdownSearch] = useState('');
    const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('All amenities');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchAmenities();
        fetchAmenityGroups();
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

    const fetchAmenityGroups = async () => {
        try {
            const response = await getamenitygroup();
            if (response.data.success) {
                setAmenityGroups(response.data.data);
            } else {
                showSnackbar('Failed to fetch amenity groups. Please try again later.', 'error');
            }
        } catch (err) {
            showSnackbar('Failed to fetch amenity groups. Please try again later.', 'error');
        }
    };

    const filteredAmenityGroups = amenityGroups.filter(group =>
        group.name.toLowerCase().includes(dropdownSearch.toLowerCase())
    );

    const handleDropdownSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDropdownSearch(e.target.value);
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
                    setShowDeleteModal(false);
                    setAmenityToDelete(null);
                    await fetchAmenities();
                } else {
                    showSnackbar(response.data.message || 'Failed to delete amenity. Please try again.', 'error');
                    setShowDeleteModal(false);
                    setAmenityToDelete(null);
                }
            } catch (err: any) {
                showSnackbar(err.response?.data?.message || 'Failed to delete amenity. Please try again.', 'error');
                setShowDeleteModal(false);
                setAmenityToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
    };

    const handleGroupSelect = (group: string) => {
        setSelectedGroup(group);
        setIsDropdownOpen(false);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedGroup('All amenities');
        setEditingAmenity(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            setDropdownSearch('');
        }
    };

    const filteredAmenities = Object.entries(amenities).reduce((acc, [group, amenitiesList]) => {
        const filtered = amenitiesList.filter(amenity =>
            amenity.amenityName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[group] = filtered;
        }
        return acc;
    }, {} as { [key: string]: Amenity[] });

    const renderAmenityGroup = (group: string, amenitiesList: Amenity[]) => (
        <div key={group} className={styles.amenityGroup}>
            <h2 className={styles.amenityType}>{group}</h2>
            <div className={styles.amenityList}>
                {amenitiesList.slice(0, 2).map((amenity) => (
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
                {amenitiesList.length > 2 && (
                    <button className={styles.moreLink} onClick={() => handleGroupSelect(group)}>
                        more...
                    </button>
                )}
            </div>
        </div>
    );

    const AmenityPopup: React.FC<{ group: string; amenities: Amenity[] }> = ({ group, amenities }) => (
        <div className={styles.popupOverlay} onClick={closePopup}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.popupTitle}>{group}</h2>
                <div className={styles.popupAmenityList}>
                    {amenities.map((amenity) => (
                        <div key={amenity.id} className={styles.popupAmenityItem}>
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
            </div>
        </div>
    );

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Amenity Management</h1>
                <div className={styles.actions}>
                    <div className={styles.dropdown}>
                        <button className={styles.dropdownToggle} onClick={toggleDropdown}>
                            <span className={styles.selectedText}>{selectedGroup}</span>
                            <ChevronDown size={20} className={styles.chevronIcon} />
                        </button>
                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.dropdownSearch}>
                                    <Search size={16} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Search amenity groups..."
                                        value={dropdownSearch}
                                        onChange={handleDropdownSearchChange}
                                        className={styles.dropdownSearchInput}
                                    />
                                </div>
                                <div className={styles.dropdownOptions}>
                                    <button onClick={() => handleGroupSelect('All amenities')}>All amenities</button>
                                    {filteredAmenityGroups.map(group => (
                                        <button
                                            key={group.id}
                                            className={styles.dropdownOption}
                                            onClick={() => handleGroupSelect(group.name)}
                                        >
                                            {group.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button className={styles.addButton} onClick={handleAddNew}>
                        <Plus size={20} />
                        New Amenity
                    </button>
                    <IconButton
                        onClick={() => window.location.reload()}
                        className={styles.refreshIcon}
                        aria-label="refresh"
                    >
                        <RefreshIcon />
                    </IconButton>
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
                    {Object.entries(filteredAmenities).map(([group, amenitiesList]) =>
                        renderAmenityGroup(group, amenitiesList)
                    )}
                </div>
            </div>

            {showPopup && selectedGroup !== 'All amenities' && (
                <AmenityPopup
                    group={selectedGroup}
                    amenities={filteredAmenities[selectedGroup] || []}
                />
            )}
            <ConfirmationModal
                show={showDeleteModal}
                onHide={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Amenity"
                message={`Are you sure you want to delete the amenity "${amenityToDelete?.amenityName}"?`}
                confirmLabel="Delete"
                cancelLabel="Cancel" />
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