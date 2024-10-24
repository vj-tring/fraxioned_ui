import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAmenity,
  resetAmenitiesState,
  deleteAmenityAsync,
  fetchAmenities,
} from "@/store/slice/amenity";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import styles from "./amenitypage.module.css";
import NewAmenityForm from "../property-amenities/new-amenity";
import {
  Edit2,
  Trash2,
  Pencil,
  Plus,
  ChevronRight,
  ChevronDown,
  Search,
  ImageIcon,
  Upload,
} from "lucide-react";
import ConfirmationModal from "@/components/confirmation-modal";
import CustomizedSnackbars from "@/components/customized-snackbar";
import { Tooltip } from "@mui/material";
import Loader from "@/components/loader";
import { Amenity } from "@/store/model";
import { SnackbarState, ErrorResponse } from "./amenity-page.types";

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
  const [loadingImages, setLoadingImages] = useState<{
    [key: number]: boolean;
  }>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [matchedGroups, setMatchedGroups] = useState<string[]>([]);
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

  const getAmenities = useCallback(async () => {
    try {
      await dispatch(fetchAmenities());
      setLoading(false);
    } catch (err) {
      showSnackbar("Failed to fetch amenities", "error");
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getAmenities();
  }, [getAmenities]);

  useEffect(() => {
    if (amenities.length > 0) {
      const groupedAmenities = groupAmenitiesByType(amenities);
      setGroupAmenities(groupedAmenities);

      // Initialize refs for each group
      Object.keys(groupedAmenities).forEach((group) => {
        if (!groupRefs.current[group]) {
          groupRefs.current[group] = React.createRef();
        }
      });
    }
  }, [amenities]);

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
  }, [updateSuccess, updateError, dispatch, getAmenities]);

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
  }, [deleteSuccess, deleteError, dispatch, getAmenities]);

  //Search condition
  const handleGlobalSearch = (searchValue: string) => {
    setGlobalSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      handleEmptySearch();
      return;
    }

    //getting matched value
    const getMatchedValue = Object.entries(groupAmenities).reduce(
      (acc, [group, amenities]) => {
        const groupMatch = group
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const amenityMatch = amenities.some((amenity) =>
          amenity.amenityName.toLowerCase().includes(searchValue.toLowerCase())
        );
        if (groupMatch || amenityMatch) {
          acc.push(group);
        }
        return acc;
      },
      [] as string[]
    );

    //show the matched result
    updateSearchResults(getMatchedValue);

    if (getMatchedValue.length > 0) {
      setTimeout(() => {
        const groupRef = groupRefs.current[getMatchedValue[0]];
        if (groupRef && groupRef.current) {
          groupRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };
  //Empty serach case
  const handleEmptySearch = () => {
    setMatchedGroups([]);
    setExpandedGroups([]);
    setNoResultsFound(false);
  };

  //update the result based on search item
  const updateSearchResults = (matchedGroups: string[]) => {
    setMatchedGroups(matchedGroups);
    setExpandedGroups(matchedGroups);
    setNoResultsFound(matchedGroups.length === 0);
  };

  // reset function
  const resetSearchStates = () => {
    setGlobalSearchTerm("");
    handleEmptySearch();
  };

  const handleResetSearch = () => {
    resetSearchStates();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (editingAmenity && file) {
      setLoadingImages((prev) => ({ ...prev, [editingAmenity.id]: true }));
      setEditingAmenity({
        ...editingAmenity,
        imageFile: file,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoadingImages((prev) => ({ ...prev, [editingAmenity.id]: false }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
    _event?: React.SyntheticEvent | Event,
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
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Amenity Management</h1>
          <div className={styles.actions}>
            <button className={styles.addButton} onClick={handleAddNew}>
              <Plus size={20} />
              <span className={styles.buttonText}>New Amenity</span>
            </button>
          </div>
        </div>
        <div className={styles.globalSearchContainer}>
          <div className={styles.globalSearchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search amenity groups or items..."
              value={globalSearchTerm}
              onChange={(e) => handleGlobalSearch(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.scrollableContent}>
          {isAddingNew && (
            <NewAmenityForm
              onClose={handleCloseNewAmenityForm}
              onAmenityAdded={handleAmenityAdded}
            />
          )}
          {noResultsFound && globalSearchTerm && (
            <div className={styles.notFoundMessage}>
              Not found "{globalSearchTerm}" item
            </div>
          )}

          <div className={styles.amenitiesList}>
            {Object.entries(filteredAmenities).map(([group, amenitiesList]) => (
              <div
                key={group}
                className={`${styles.amenityGroup} ${
                  matchedGroups.includes(group) ? styles.matchedGroup : ""
                }`}
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
                  {/* <span className={styles.groupTotalCount}>
                    Total Count: {amenitiesList.length}
                  </span> */}
                </div>
                {expandedGroups.includes(group) && (
                  <div className={styles.amenityItems}>
                    <div className={styles.groupSearchContainer}>
                      {/* <div className={styles.groupSearchBar}>
                        <Search size={15} />
                        <input
                          type="text"
                          placeholder={`Search in ${group}...`}
                          value={groupSearchTerms[group] || ""}
                          onChange={(e) =>
                            handleGroupSearch(group, e.target.value)
                          }
                        />
                      </div> */}
                      <span className={styles.groupTotalCount}>
                        Total Count: {amenitiesList.length}
                      </span>
                    </div>
                    {amenitiesList.length > 0 ? (
                      amenitiesList.map((amenity) => (
                        <div
                          key={amenity.id}
                          className={`${styles.amenityItem} ${
                            globalSearchTerm &&
                            amenity.amenityName
                              .toLowerCase()
                              .includes(globalSearchTerm.toLowerCase())
                              ? styles.matchedItem
                              : ""
                          }`}
                        >
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
                                  value={
                                    editingAmenity?.amenityDescription || ""
                                  }
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
                                      onLoad={() =>
                                        setLoadingImages((prev) => ({
                                          ...prev,
                                          [amenity.id]: false,
                                        }))
                                      }
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
                                    <Pencil size={16} />
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
