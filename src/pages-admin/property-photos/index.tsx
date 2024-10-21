import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  propertyImageapi,
  deletetpropertyImageById,
} from "@/api/api-endpoints";
import { fetchAdditionalImages, clearAdditionalImages, resetPropertyImagesState } from "@/store/slice/auth/additional-image";
import { RootState } from "@/store/reducers";
import { Edit, Trash2, X, Plus } from "lucide-react";
import Loader from "@/components/loader";
import styles from "./propertyphoto.module.css";
import ConfirmationModal from "@/components/confirmation-modal";
import { motion, AnimatePresence } from "framer-motion";
import AddPhoto from "./new-photoupload";
import { AppDispatch } from "@/store";

interface PropertyImage {
  id: number;
  url: string;
  description: string;
  propertySpace?: {
    id: number;
    instanceNumber: number;
    space: {
      id: number;
      name: string;
    };
  };
}

interface SpaceGroup {
  name: string;
  instances: {
    instanceNumber: number;
    images: PropertyImage[];
  }[];
}

const PropertyPhotos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { additionalImages, fetchLoading, fetchError } = useSelector(
    (state: RootState) => state.propertyImages
  );
  const [imagesBySpace, setImagesBySpace] = useState<{
    [key: string]: SpaceGroup;
  }>({});
  const [activeTab, setActiveTab] = useState<string>("All Photos");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const refreshPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const propertyImagesResponse = await propertyImageapi(parseInt(id || "0"));
      dispatch(fetchAdditionalImages(parseInt(id || "0")));
      console.log(propertyImagesResponse)
      if (propertyImagesResponse.data && propertyImagesResponse.data.success) {
        const allPhotos: PropertyImage[] = propertyImagesResponse.data.data;
        const groupedBySpace = allPhotos.reduce(
          (acc: { [key: string]: SpaceGroup }, img: PropertyImage) => {
            const spaceName = img.propertySpace?.space.name || "Uncategorized";
            if (!acc[spaceName]) {
              acc[spaceName] = { name: spaceName, instances: [] };
            }

            let instance = acc[spaceName].instances.find(
              (i) => i.instanceNumber === img.propertySpace?.instanceNumber
            );

            if (!instance) {
              instance = {
                instanceNumber: img.propertySpace?.instanceNumber || 0,
                images: [],
              };
              acc[spaceName].instances.push(instance);
            }

            instance.images.push(img);
            return acc;
          },
          {}
        );
        const allImagesWithAdditional = [...allPhotos, ...additionalImages];

        setImagesBySpace({
          "All Photos": {
            name: "All Photos",
            instances: [{ instanceNumber: 0, images: allImagesWithAdditional }],
          },
          ...groupedBySpace,
        });
      }
    } catch (error) {
      console.error("Error fetching property images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, dispatch, additionalImages]);

  useEffect(() => {
    refreshPhotos();
    return () => {
      dispatch(clearAdditionalImages());
      dispatch(resetPropertyImagesState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (location.state && (location.state.fromEdit || location.state.fromUpload)) {
      refreshPhotos();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, refreshPhotos]);

  const handleTabClick = (spaceName: string) => {
    setActiveTab(spaceName);
  };

  const handleEditImage = (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation();
    setSelectedImageId(imageId);
    setShowEditPopup(true);
  };

  const handleDeleteImage = (e: React.MouseEvent, imageId: number) => {
    e.stopPropagation();
    setImageToDelete(imageId);
    setShowDeleteConfirmation(true);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleAddPhotoClick = () => {
    setShowAddPhoto(true);
  };

  const handleAddPhotoClose = () => {
    setShowAddPhoto(false);
  };

  const handlePhotosAdded = () => {
    refreshPhotos();
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      setIsLoading(true);
      try {
        await deletetpropertyImageById(imageToDelete);
        await refreshPhotos();
        setShowDeleteConfirmation(false);
        setImageToDelete(null);
      } catch (error) {
        console.error("Error deleting property image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewFormClose = () => {
    setShowNewForm(false);
    refreshPhotos();
  };

  const handleImageLoad = (imageId: number) => {
    setLoadedImages((prevLoadedImages) => new Set(prevLoadedImages).add(imageId));
  };

  const renderImages = (images: PropertyImage[]) => (
    <div className={styles.photoGrid}>
      {images.map((image) => (
        <motion.div
          key={image.id}
          className={styles.photoCard}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={styles.imageContainer}
            onClick={() => handleImageClick(image.url)}
          >
            {!loadedImages.has(image.id) && (
              <div className={styles.skeleton}></div>
            )}
            <img
              src={image.url}
              alt={image.description}
              className={`${styles.propertyImage} ${loadedImages.has(image.id) ? styles.loaded : ""
                }`}
              onLoad={() => handleImageLoad(image.id)}
            />
            <div className={styles.overlay}>
              <button
                className={styles.iconButton}
                onClick={(e) => handleEditImage(e, image.id)}
              >
                <Edit size={20} />
              </button>
              <button
                className={styles.iconButton}
                onClick={(e) => handleDeleteImage(e, image.id)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className={styles.imageDescription}>
            {image.description}
            {activeTab === "All Photos" && image.propertySpace && (
              <span className={styles.spaceTag}>
                {`${image.propertySpace.space.name} ${image.propertySpace.instanceNumber}`}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (fetchError) {
    return <div className={styles.error}>Error: {fetchError}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Property Photos</h1>
        <div className={styles.tabsContainer}>
          {Object.entries(imagesBySpace).map(([spaceName, spaceGroup]) => (
            <button
              key={spaceName}
              className={`${styles.tab} ${activeTab === spaceName ? styles.activeTab : ""
                }`}
              onClick={() => handleTabClick(spaceName)}
            >
              {spaceName}
              {spaceName === "All Photos" ? (
                <span className={styles.photoCount}>
                  ({spaceGroup.instances[0].images.length})
                </span>
              ) : (
                <span className={styles.instanceCount}>
                  {spaceGroup.instances
                    .map((instance) => instance.instanceNumber)
                    .join(",  ")}
                </span>
              )}
            </button>
          ))}
          <button
            className={`${styles.tab} ${activeTab === "Other Photos" ? styles.activeTab : ""
              }`}
            onClick={() => handleTabClick("Other Photos")}
          >
            Other Photos
            <span className={styles.photoCount}>({additionalImages.length})</span>
          </button>
        </div>
      </div>

      <motion.div
        className={styles.gridContainer}
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "Other Photos" ? (
              additionalImages.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No additional photos found for this property</p>
                </div>
              ) : (
                renderImages(additionalImages)
              )
            ) : imagesBySpace[activeTab]?.instances.flatMap(
              (instance) => instance.images
            ).length === 0 ? (
              <div className={styles.emptyState}>
                <p>No photos found for this space</p>
              </div>
            ) : (
              renderImages(
                imagesBySpace[activeTab]?.instances.flatMap(
                  (instance) => instance.images
                ) || []
              )
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {(isLoading || fetchLoading) && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}

      {selectedImageUrl && (
        <motion.div
          className={styles.lightbox}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImageUrl(null)}
        >
          <motion.div
            className={styles.lightboxContent}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedImageUrl} alt="Selected property" />
            <button
              className={styles.closeButton}
              onClick={() => setSelectedImageUrl(null)}
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}

      <ConfirmationModal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this image?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <button className={styles.addButton} onClick={handleAddPhotoClick}>
        <Plus size={24} />
      </button>

      {showAddPhoto && (
        <div className={styles.addPhotoOverlay}>
          <AddPhoto
            propertyId={parseInt(id || "0")}
            onClose={handleAddPhotoClose}
            onPhotosAdded={handlePhotosAdded}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyPhotos;