import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updatePropertyImage } from "@/api/api-endpoints";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById, fetchPropertyDetailsById } from "@/store/slice/auth/propertiesSlice";
import { AppDispatch } from '@/store';
import { RootState } from "@/store/reducers";
import EditButton from "@/components/edit";
import styles from "./property-generalinfo.module.css";
import imageone from "../../assests/bear-lake-bluffs.jpg";
import imagetwo from "../../assests/crown-jewel.jpg";
import imagethree from "../../assests/lake-escape.jpg";
import Loader from "@/components/loader";
import pinImage from "../../assets/images/pin.jpg";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const PropertyGeneralInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: any) => state.auth.user?.id);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the uploaded image
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage the dialog visibility
  const navigate = useNavigate();

  const propertyData = useSelector(
    (state: RootState) => state.property.selectedProperty
  );
  const propertyDetails = useSelector(
    (state: RootState) => state.property.selectedPropertyDetails
  );
  const status = useSelector((state: RootState) => state.property.status);
  const error = useSelector((state: RootState) => state.property.error);

  const images = [imageone, imagetwo, imagethree];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(Number(id)));
      dispatch(fetchPropertyDetailsById(Number(id)));
    }
  }, [id, dispatch]);

  const handleEdit = () => {
    navigate(`/admin/property/${id}/edit`);
  };

  const handleEditImage = () => {
    setDialogOpen(true); // Open the upload dialog
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]); // Set the uploaded file
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    const updatedBy = { id: userId };
    formData.append("updatedBy", JSON.stringify(updatedBy));
    formData.append("coverImageFile", imageFile);

    try {
      await updatePropertyImage(Number(id), formData); // Call the PATCH API
      setDialogOpen(false);
    } catch (err) {
      console.error("Error uploading image:", err);
      // setError("Failed to upload image. Please try again.");
    }
  };

  if (status === "loading") return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!propertyData || !propertyDetails)
    return <div className={styles.noData}>No property data found.</div>;

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>General Information</h2>
          <EditButton onClick={handleEdit} />
        </div>
        <div className={styles.propertyCard}>
          <div className={styles.imageContainer}>
            <img
              src={propertyData.coverImageUrl || randomImage}
              alt={propertyData.propertyName}
              className={styles.propertyImage}
            />
            <div className={styles.exclusiveTag}>
              <img src={pinImage} alt="Pin" className={styles.pinIcon} />
              <span>
                {propertyData.isExclusive ? "Exclusive" : "Collective"}
              </span>
            </div>
            <div className={styles.editOverlay}>
              <button className={styles.iconButton} onClick={handleEditImage}>
                <Edit size={20} />
              </button>
            </div>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoColumns}>
              <h3 className={styles.propertyName}>
                {propertyData.propertyName}
              </h3>
              <div className={styles.addressColumn}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Address <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {`${propertyData.address}, ${propertyData.city}, ${propertyData.state}, ${propertyData.country}, ${propertyData.zipcode}`}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Square Footage <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyDetails.squareFootage} sq ft
                  </span>
                </div>
              </div>
              <div className={styles.detailsColumn}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Property Share <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyData.propertyShare}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Bedrooms <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyDetails.noOfBedrooms}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Bathrooms <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyDetails.noOfBathrooms}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Share left <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyData.propertyRemainingShare}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    Cleaning fee <span>:</span>
                  </span>
                  <span className={styles.infoValue}>
                    {propertyDetails.cleaningFee}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoBlock1}>
              <h4 className={styles.descriptionTitle}>Description</h4>
              <p className={styles.description}>
                {propertyData.houseDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent
          sx={{ gap: 4, display: "flex", flexDirection: "column" }}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div className={styles.imagePreviewContainer}>
            {imageFile ? (
              <>
                <div className={styles.imagePreview}>
                  <img
                    src={URL.createObjectURL(imageFile)} // Create a URL for the selected file
                    alt="Preview"
                    className={styles.previewImage}
                  />
                  <button
                    className={styles.cancelPreviewButton}
                    onClick={() => setImageFile(null)} // Clear the image file
                  >
                    Cancel Preview
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.defaultPreview}>
                <p>Preview your image here</p>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PropertyGeneralInfo;
