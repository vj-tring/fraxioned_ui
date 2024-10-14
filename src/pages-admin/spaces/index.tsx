import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
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
} from "@mui/material";
import styles from "./spaces.module.css";
import { RootState } from "@/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  createNewSpace,
  fetchAllSpaces,
  updateExistingSpace,
  deleteExistingSpace,
  Space,
} from "@/store/slice/spaceSlice";
import { Delete, Edit } from "@mui/icons-material";
import { fontSize } from "@mui/system";

const Spaces: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [formValues, setFormValues] = useState<{
    name: string;
    isBedTypeAllowed: boolean;
    isBathroomTypeAllowed: boolean;
    imageFile: File | null;
  }>({
    name: "",
    isBedTypeAllowed: false,
    isBathroomTypeAllowed: false,
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const spaces = useSelector((state: RootState) => state.spaces.spaces || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllSpaces()).unwrap();
      } catch (error) {
        setError("Failed to load spaces or properties");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleAddSpace = async () => {
    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("isBedTypeAllowed", String(formValues.isBedTypeAllowed));
      formData.append(
        "isBathroomTypeAllowed",
        String(formValues.isBathroomTypeAllowed)
      );

      const createdBy = { id: userId };
      formData.append("createdBy", JSON.stringify(createdBy));

      if (formValues.imageFile) {
        formData.append("imageFile", formValues.imageFile);
      }

      if (selectedSpace) {
        await dispatch(
          updateExistingSpace({ id: selectedSpace.id!, spaceData: formData })
        ).unwrap();
      } else {
        await dispatch(createNewSpace(formData)).unwrap();
      }

      setIsDialogOpen(false);
      resetForm();
      await dispatch(fetchAllSpaces()).unwrap();
    } catch (error) {
      setError("Failed to save space");
    }
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      isBedTypeAllowed: false,
      isBathroomTypeAllowed: false,
      imageFile: null,
    });
    setImagePreview(null);
    setSelectedSpace(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormValues((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSpace = (space: Space) => {
    setSelectedSpace(space);
    setFormValues({
      name: space.name,
      isBedTypeAllowed: space.isBedTypeAllowed,
      isBathroomTypeAllowed: space.isBathroomTypeAllowed,
      imageFile: null,
    });
    setImagePreview(space.s3_url || null);
    setIsDialogOpen(true);
  };

  const handleDeleteSpace = async (space: Space) => {
    try {
      await dispatch(deleteExistingSpace(space.id!)).unwrap();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setError("Failed to delete space");
    }
  };

  const confirmDeleteSpace = (space: Space) => {
    setSelectedSpace(space);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div
      className={`${styles.usersContainer} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      <div className={styles.fullContainer}>
        {loading && <div>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.headersection}>
          <h2>Add Space</h2>
          <div
            className={styles.addspace}
            onClick={() => setIsDialogOpen(true)}
          >
            <FaPlus style={{ fontSize: ".8rem" }} /> Create Space
          </div>
        </div>

        <div className={styles.mainsection}>
          <div
            className={`${styles.spaceList} ${
              !spaces || spaces.length === 0 ? styles.noRooms : ""
            }`}
          >
            {Array.isArray(spaces) && spaces.length > 0 ? (
              spaces.map((space, index) => (
                <div key={index} className={styles.spaceItem}>
                  <div className={styles.photoGridContainer}>
                    <div className={styles.photoGrid}>
                      <img
                        src={space.s3_url || "https://via.placeholder.com/150"}
                        alt={space.name}
                        className={styles.spaceImage}
                      />
                    </div>

                    <div className={styles.spaceNameRow}>
                      <p>{space.name}</p>
                    </div>
                    <div className={styles.editOverlay}>
                      <button
                        className={styles.iconButton}
                        onClick={() => handleEditSpace(space)}
                      >
                        <Edit />
                      </button>
                      <button
                        className={styles.iconButton}
                        onClick={() => confirmDeleteSpace(space)}
                      >
                        <Delete />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.error}>No Available Spaces</p>
            )}
          </div>
        </div>

        {/* Dialog for Adding/Editing Space */}
        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          sx={{
            "& .MuiDialog-paper": {
              height: "1000px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "medium",
              fontWeight: "600",
            }}
          >
            {selectedSpace ? "Edit Space" : "Create Space"}
          </DialogTitle>
          <DialogContent
            sx={{ gap: 3, display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Space Name"
              id="outlined-size-small"
              value={formValues.name}
              onChange={(e) =>
                setFormValues({ ...formValues, name: e.target.value })
              }
              fullWidth
              className="mt-2 font-medium"
              size="small"
            />
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.isBedTypeAllowed}
                    onChange={() =>
                      setFormValues({
                        ...formValues,
                        isBedTypeAllowed: !formValues.isBedTypeAllowed,
                      })
                    }
                  />
                }
                label="Is Bed Type Allowed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.isBathroomTypeAllowed}
                    onChange={() =>
                      setFormValues({
                        ...formValues,
                        isBathroomTypeAllowed:
                          !formValues.isBathroomTypeAllowed,
                      })
                    }
                  />
                }
                label="Is Bathroom Type Allowed"
              />
            </Box>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <div className={styles.imagePreviewContainer}>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.cancelPreviewButton}
                    onClick={() => setImagePreview(null)} // Clear the image file
                  >
                    Cancel Preview
                  </button>
                </div>
              ) : (
                <div className={styles.defaultPreview}>
                  <p>Preview your image</p>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddSpace} color="primary">
              {selectedSpace ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Deleting Space */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {selectedSpace?.name}?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteSpace(selectedSpace!)}
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Spaces;
