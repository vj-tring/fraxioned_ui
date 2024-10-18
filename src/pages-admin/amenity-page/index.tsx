import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { amenitiesapi } from '@/api/api-endpoints';
import { updateAmenity, resetAmenitiesState, deleteAmenityAsync, fetchAmenities } from '@/store/slice/amenity';
import { RootState } from '@/store/reducers';
import styles from './amenitypage.module.css';
import NewAmenityForm from '../property-amenities/new-amenity';
import { Edit2, Trash2, Plus, ChevronRight, ChevronDown, RefreshCw, Search, ImageIcon, Upload } from 'lucide-react';
import ConfirmationModal from '@/components/confirmation-modal';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { IconButton, Tooltip } from '@mui/material';
import { AppDispatch } from '@/store';
import Loader from '@/components/loader';
import { Amenity } from '@/store/model';
// interface Amenity {
//   id: number;
//   amenityName: string;
//   amenityDescription?: string;
//   s3_url?: string;
//   amenityGroup: {
//     id: number;
//     name: string;
//   };
//   imageFile?: File | null;
// }

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

const AmenityManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    amenities,
    loading: updateLoading,
    error: updateError,
    success: updateSuccess,
    deleteLoading,
    deleteError,
    deleteSuccess,
  } = useSelector((state: RootState) => state.amenities);

  const [groupAmenities, setGroupAmenities] = useState<{
    [key: string]: Amenity[];
  }>({});
  const [groupSearchTerms, setGroupSearchTerms] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState<Amenity | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const groupRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>(
    {}
  );

  useEffect(() => {
    getAmenities();
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      showSnackbar("Amenity updated successfully", "success");
      setEditingAmenity(null);
      getAmenities();
      dispatch(resetAmenitiesState());
    }
    if (updateError) {
      showSnackbar(updateError, "error");
      dispatch(resetAmenitiesState());
    }
  }, [updateSuccess, updateError, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      showSnackbar("Amenity deleted successfully", "success");
      getAmenities();
      dispatch(resetAmenitiesState());
    }
    if (deleteError) {
      showSnackbar(deleteError, "error");
      dispatch(resetAmenitiesState());
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const getAmenities = async () => {
    try {
      dispatch(fetchAmenities());
      const groupedAmenities = groupAmenitiesByType(amenities);
      setGroupAmenities(groupedAmenities);
      setLoading(false);

      // Initialize refs for each group
      Object.keys(groupedAmenities).forEach((group) => {
        if (!groupRefs.current[group]) {
          groupRefs.current[group] = React.createRef();
        }
      });
    } catch (err) {
      showSnackbar("Failed to fetch amenities", "error");
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (editingAmenity && file) {
      setLoadingImages(prev => ({ ...prev, [editingAmenity.id]: true }));
      setEditingAmenity({
        ...editingAmenity,
        imageFile: file,
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingImages(prev => ({ ...prev, [editingAmenity.id]: false }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGroupSearch = (group: string, term: string) => {
    setGroupSearchTerms((prev) => ({ ...prev, [group]: term }));
  };

  const groupAmenitiesByType = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      const groupName = amenity.amenityGroup.name;
      if (groupName !== undefined) {
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(amenity);
      }
      return acc;
    }, {} as { [key: string]: Amenity[] });
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
  };

  const handleSave = async () => {
    if (editingAmenity) {
      const formData = new FormData();
      formData.append("updatedBy", JSON.stringify({ id: 1 }));
      formData.append("amenityName", editingAmenity.amenityName);
      formData.append(
        "amenityDescription",
        editingAmenity.amenityDescription || ""
      );
      formData.append(
        "amenityGroup",
        JSON.stringify({ id: editingAmenity.amenityGroup.id })
      );

      if (editingAmenity.imageFile) {
        formData.append("imageFile", editingAmenity.imageFile);
      }

      try {
        if (editingAmenity.id !== undefined && editingAmenity.id !== null) {
          await dispatch(
            updateAmenity({
              id: editingAmenity.id,
              updateData: formData,
            })
          );
        }
        setEditingAmenity(null);
      } catch (error) {
        console.error("Error updating amenity:", error);
        showSnackbar("Failed to update amenity", "error");
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
    getAmenities();
    showSnackbar("New amenity added successfully", "success");
  };

  const handleDeleteClick = (amenity: Amenity) => {
    setAmenityToDelete(amenity);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (amenityToDelete) {
      try {
        const result = await dispatch(
          deleteAmenityAsync(amenityToDelete.id ?? 0)
        );

        if (
          result.payload &&
          typeof result.payload === "object" &&
          "success" in result.payload
        ) {
          const response = result.payload as ErrorResponse;

          if (!response.success) {
            showSnackbar(response.message, "error");
          } else {
            showSnackbar("Amenity deleted successfully", "success");
            getAmenities();
          }
        } else if (deleteAmenityAsync.fulfilled.match(result)) {
          showSnackbar("Amenity deleted successfully", "success");
          getAmenities();
        } else {
          showSnackbar("Failed to delete amenity", "error");
        }
      } catch (err: any) {
        showSnackbar("An unexpected error occurred", "error");
      } finally {
        setShowDeleteModal(false);
        setAmenityToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAmenityToDelete(null);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent |   Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleGroupExpansion = (group: string) => {
    setExpandedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );

    setTimeout(() => {
      const groupRef = groupRefs.current[group];
      if (groupRef && groupRef.current) {
        groupRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const filteredAmenities = Object.entries(groupAmenities).reduce(
    (acc, [group, amenitiesList]) => {
      const groupSearchTerm = groupSearchTerms[group] || "";
      const filtered = amenitiesList.filter((amenity) =>
        amenity.amenityName
          .toLowerCase()
          .includes(groupSearchTerm.toLowerCase())
      );
      acc[group] = filtered;
      return acc;
    },
    {} as { [key: string]: Amenity[] }
  );

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
            <div
              key={group}
              className={styles.amenityGroup}
              ref={groupRefs.current[group]}
            >
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
              </div>
              {expandedGroups.includes(group) && (
                <div className={styles.amenityItems}>
                  <div className={styles.groupSearchContainer}>
                    <div className={styles.groupSearchBar}>
                      <Search size={15} />
                      <input
                        type="text"
                        placeholder={`Search in ${group}...`}
                        value={groupSearchTerms[group] || ""}
                        onChange={(e) =>
                          handleGroupSearch(group, e.target.value)
                        }
                      />
                    </div>
                    <span className={styles.groupTotalCount}>
                      Total {group} amenities: {amenitiesList.length}
                    </span>
                  </div>
                  {amenitiesList.length > 0 ? (
                    amenitiesList.map((amenity) => (
                      <div key={amenity.id} className={styles.amenityItem}>
                        <div className={styles.amenityContent}>
                          {editingAmenity?.id === amenity.id ? (
                            <div className={styles.editingContainer}>
                              <input
                                type="text"
                                value={editingAmenity?.amenityName}
                                onChange={(e) =>
                                  setEditingAmenity({
                                    ...(editingAmenity as Amenity),
                                    amenityName: e.target.value,
                                  })
                                }
                                className={styles.editInput}
                                placeholder="Amenity name"
                              />
                              <textarea
                                value={editingAmenity?.amenityDescription || ""}
                                onChange={(e) =>
                                  setEditingAmenity({
                                    ...(editingAmenity as Amenity),
                                    amenityDescription: e.target.value,
                                  })
                                }
                                className={styles.editDescription}
                                placeholder="Description (optional)"
                              />
                              <div className={styles.fileInputWrapper}>
                                <button
                                  type="button"
                                  onClick={triggerFileInput}
                                  className={styles.fileInputButton}
                                >
                                  <Upload size={10} />
                                  <span>Choose File</span>
                                </button>
                                <span className={styles.fileName}>
                                  {editingAmenity!.imageFile?.name ||
                                    "No file chosen"}
                                </span>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className={styles.hiddenFileInput}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className={styles.displayContainer}>
                            <div className={styles.amenityIcon}>
                              {loadingImages[amenity.id] ? (
                                <Loader />
                              ) : amenity.s3_url ? (
                                <img
                                  src={amenity.s3_url}
                                  alt={amenity.amenityName}
                                  className={styles.amenityImage}
                                  onLoad={() => setLoadingImages(prev => ({ ...prev, [amenity.id]: false }))}
                                />
                                ) : (
                                  <ImageIcon size={14} />
                                )}
                              </div>
                              <div className={styles.amenityDetails}>
                                <span className={styles.amenityName}>
                                  {amenity.amenityName}
                                </span>
                                {amenity.amenityDescription && (
                                  <p className={styles.amenityDescription}>
                                    {amenity.amenityDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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
                                <button
                                  onClick={() => handleEdit(amenity)}
                                  className={styles.editButton}
                                >
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
