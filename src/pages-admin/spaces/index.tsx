// src/components/Spaces.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import styles from "./spaces.module.css";
import {
  createNewSpace,
  fetchAllSpaces,
  updateExistingSpace,
  deleteExistingSpace,
} from "@/store/slice/space";
import { Space } from "@/store/model";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Skeleton,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CustomizedSnackbars from "@/components/customized-snackbar";
import Loader from "@/components/loader";
import DeleteConfirmationDialog from "@/components/deleteconfirmationdialog";
import ImageUpload from "@/components/imageupload";
import { Edit, Trash2 } from "lucide-react";
import { IoClose } from "react-icons/io5";


// Types
interface FormValues {
  name: string;
  isBedTypeAllowed: boolean;
  isBathroomTypeAllowed: boolean;
  imageFile: File | null;
}

interface FormErrors {
  name: boolean;
  imageFile: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

interface SpacesProps {
  isSidebarOpen: boolean;
}

const INITIAL_FORM_VALUES: FormValues = {
  name: "",
  isBedTypeAllowed: false,
  isBathroomTypeAllowed: false,
  imageFile: null,
};

const INITIAL_FORM_ERRORS: FormErrors = {
  name: false,
  imageFile: false,
};

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const Spaces: React.FC<SpacesProps> = ({ isSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const spaces = useSelector((state: RootState) => state.spaces.spaces || []);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // State management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<FormErrors>(INITIAL_FORM_ERRORS);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: "", severity: "success" });

  // States for image upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Memoized values
  const isFormValid = useMemo(() => {
    const hasName = formValues.name.trim() !== "";
    const hasImage = selectedSpace ? true : formValues.imageFile !== null;
    return hasName && hasImage;
  }, [formValues.name, formValues.imageFile, selectedSpace]);

  // Form handling
  const resetForm = useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
    setSelectedSpace(null);
    setFormErrors(INITIAL_FORM_ERRORS);
    setUploadProgress(0);
    setImagePreview(null);
    setFileName(null);
  }, []);

  const handleDeleteSpace = async (space: Space) => {
    try {
      setLoadingAction(true);

      const result = await dispatch(deleteExistingSpace(space.id!)).unwrap();

      if (result.statusCode === 204) {
        setSnackbar({ open: true, message: "Space deleted successfully", severity: "success" });
        setIsDeleteDialogOpen(false);
      } else if (result.statusCode === 409) {
        setSnackbar({ open: true, message: result.message!, severity: "warning" });
      } else if (result.statusCode === 500) {
        setSnackbar({ open: true, message: result.message || "Unexpected error occurred", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete space", severity: "error" });
    } finally {
      setLoadingAction(false);
      setIsDeleteDialogOpen(false);
    }
  };


  const handleAddSpace = async () => {
    if (!isFormValid) {
      setFormErrors({
        name: formValues.name.trim() === "",
        imageFile: selectedSpace ? false : formValues.imageFile === null,
      });
      return;
    }

    try {
      setLoadingAction(true);
      const formData = new FormData();
      formData.append("name", formValues.name.trim());
      formData.append("isBedTypeAllowed", String(formValues.isBedTypeAllowed));
      formData.append("isBathroomTypeAllowed", String(formValues.isBathroomTypeAllowed));
      if (formValues.imageFile) {
        formData.append("imageFile", formValues.imageFile);
      }

      const userIdData = JSON.stringify({ id: userId });
      formData.append(selectedSpace ? "updatedBy" : "createdBy", userIdData);

      const action = selectedSpace
        ? updateExistingSpace({ id: selectedSpace.id!, spaceData: formData })
        : createNewSpace(formData);

      const res = await (dispatch(action) as any).unwrap();

      if (res.statusCode === 200 || res.statusCode === 201) {
        const message = selectedSpace ? "Space updated successfully" : "Space created successfully";
        setSnackbar({ open: true, message, severity: "success" });
        setIsDialogOpen(false);
        resetForm();
        await dispatch(fetchAllSpaces()).unwrap();
      } else if (res.statusCode === 409) {
        setSnackbar({
          open: true,
          message: res.message || "Conflict: Space already exists.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error saving space:", error);
      setSnackbar({
        open: true,
        message: "Failed to save space",
        severity: "error",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleFile = (file: File | null) => {

    if (!file) {
      setImagePreview(null);
      return null;
    }

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Please upload an image file (jpeg, png, gif).');
    }
    setFileName(file.name);
    setFormValues((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      simulateProgress(); // Start the progress animation
    };
    reader.readAsDataURL(file);
  }

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleCancelPreview = () => {
    setFormValues((prev) => ({ ...prev, imageFile: null }));
    setImagePreview(null);
    setFileName("");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSpaces(true);
        await dispatch(fetchAllSpaces()).unwrap();
      } catch (error) {
        console.error("Failed to load spaces:", error);
      } finally {
        setLoadingSpaces(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEditSpace = (space: Space) => {
    setSelectedSpace(space);
    setFormValues({
      name: space.name,
      isBedTypeAllowed: space.isBedTypeAllowed,
      isBathroomTypeAllowed: space.isBathroomTypeAllowed,
      imageFile: null, // Reset imageFile to null for updates
    });
    // setImagePreview(space.s3_url || null);
    setIsDialogOpen(true);
  };
  const confirmDeleteSpace = (space: Space) => {
    setSelectedSpace(space);
    setIsDeleteDialogOpen(true);
  };

  const getProgressColor = () => {
    if (uploadProgress < 50) return "#ff4d4f"; // Red
    if (uploadProgress < 80) return "#ffa940"; // Orange
    return "#4caf50"; // Green
  };

  return (
    <div className={`${styles.usersContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.fullContainer}>
        {loadingSpaces ? (
          Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={200} />
          ))
        ) : (
          <>
            <div className={styles.headersection}>
              <h2>Add Space</h2>
              <div className={styles.addspace} onClick={() => setIsDialogOpen(true)}>
                <FaPlus style={{ fontSize: ".8rem" }} /> Create Space
              </div>
            </div>

            <div className={styles.mainsection}>
              <div className={styles.spaceList}>
                {spaces.length > 0 ? (
                  [...spaces] // Create a shallow copy to avoid mutation
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort the copied array
                    .map((space) => (
                      <div key={space.id} className={styles.spaceItem}>
                        <div className={styles.spaceCard}>
                          <div className={styles.photoGridContainer}>
                            <img
                              src={space.s3_url || "https://via.placeholder.com/150"}
                              alt={space.name}
                              className={styles.spaceImage}
                            />
                            <div className={styles.spaceContent}>
                              <h4 className={styles.cardTitle}>{space.name}</h4>
                              <div className={styles.editOverlay}>
                                <button
                                  className={styles.iconButton}
                                  onClick={() => handleEditSpace(space)}
                                >
                                  <Edit size={20} />
                                </button>
                                <button
                                  className={styles.iconButton}
                                  onClick={() => confirmDeleteSpace(space)}
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No Available Spaces</p>
                )}
              </div>


            </div>

          </>
        )}

        {loadingAction && <Loader />}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => { setIsDialogOpen(false); resetForm(); }}>
        <DialogTitle sx={{ fontSize: '1.3rem', fontWeight: "600", letterSpacing: '.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedSpace ? "Edit Space" : "Create Space"}
          <IoClose size={26} style={{ cursor: 'pointer' }} onClick={() => { setIsDialogOpen(false); resetForm(); }} />
        </DialogTitle>
        <DialogContent sx={{ gap: 3, display: "flex", flexDirection: "column", width: '550px' }}>
          <TextField
            label="Space Name"
            value={formValues.name}
            onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
            error={formErrors.name}
            helperText={formErrors.name ? "Space name is required" : ""}
            fullWidth
            className="mt-2 font-medium"
            size="small"
          />
          <Box>
            <FormControlLabel
              control={<Checkbox size="small" checked={formValues.isBedTypeAllowed} onChange={() => setFormValues(prev => ({ ...prev, isBedTypeAllowed: !prev.isBedTypeAllowed }))} />}
              label="Is Bed Type Allowed"
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={formValues.isBathroomTypeAllowed} onChange={() => setFormValues(prev => ({ ...prev, isBathroomTypeAllowed: !prev.isBathroomTypeAllowed }))} />}
              label="Is Bathroom Type Allowed"
            />
          </Box>

          <ImageUpload
            selectedSpace={selectedSpace ? { s3_url: selectedSpace.s3_url! } : null}
            uploadProgress={uploadProgress}
            imagePreview={imagePreview}
            fileName={fileName}
            isDragging={isDragging}
            handleFile={handleFile}
            handleCancelPreview={handleCancelPreview}
            setIsDragging={setIsDragging}
            getProgressColor={getProgressColor}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsDialogOpen(false); resetForm(); }} color="primary">Cancel</Button>
          <Button onClick={handleAddSpace} disabled={!isFormValid} color="primary">{selectedSpace ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting Space */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={() => handleDeleteSpace(selectedSpace!)}
        selectedSpace={selectedSpace}
      />

      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default Spaces;
