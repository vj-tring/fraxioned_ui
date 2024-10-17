import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { propertyImageapi, deletetpropertyImageById } from "@/api/api-endpoints";
import { Edit, Trash2, X, Plus } from "lucide-react";
import Loader from "@/components/loader";
import styles from "./propertyphoto.module.css";
import ConfirmationModal from "@/components/confirmation-modal";
import EditPhoto from "./edit-propertyphoto";
import PhotoUpload from "./new-photoupload";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyImage {
  id: number;
  url: string;
  description: string;
  propertySpace: {
    space: {
      id: number;
      name: string;
    };
  };
}

const PropertyPhotos: React.FC = () => {
  const [imagesBySpace, setImagesBySpace] = useState<{ [key: string]: PropertyImage[] }>({});
  const [activeTab, setActiveTab] = useState<string>("Bedroom");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const refreshPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await propertyImageapi(parseInt(id || "0"));
      if (response.data && response.data.success) {
        const groupedBySpace = response.data.data.reduce(
          (acc: { [key: string]: PropertyImage[] }, img: PropertyImage) => {
            const spaceName = img.propertySpace.space.name;
            if (!acc[spaceName]) {
              acc[spaceName] = [];
            }
            acc[spaceName].push(img);
            return acc;
          },
          {}
        );
        setImagesBySpace(groupedBySpace);
        if (!activeTab && groupedBySpace["Bedroom"]) {
          setActiveTab("Bedroom");
        }
      }
    } catch (error) {
      console.error("Error fetching property images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, activeTab]);

  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

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

  const handleNewFormOpen = () => {
    setShowNewForm(true);
  };

  const handleNewFormClose = () => {
    setShowNewForm(false);
    refreshPhotos();
  };

  const handleImageLoad = (imageId: number) => {
    setLoadedImages(prevLoadedImages => new Set(prevLoadedImages).add(imageId));
  };

  const filteredImages = imagesBySpace[activeTab] || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Property Photos</h1>
        <div className={styles.tabsContainer}>
          {Object.keys(imagesBySpace).map((spaceName) => (
            <button
              key={spaceName}
              className={`${styles.tab} ${activeTab === spaceName ? styles.activeTab : ''}`}
              onClick={() => handleTabClick(spaceName)}
            >
              {spaceName}
              <span className={styles.photoCount}>
                ({imagesBySpace[spaceName].length})
              </span>
            </button>
          ))}
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
            {filteredImages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No photos found for this space</p>
              </div>
            ) : (
              <div className={styles.photoGrid}>
                {filteredImages.map((image) => (
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
                    <div className={styles.imageContainer} onClick={() => handleImageClick(image.url)}>
                      {!loadedImages.has(image.id) && (
                        <div className={styles.skeleton}></div>
                      )}
                      <img 
                        src={image.url} 
                        alt={image.description} 
                        className={`${styles.propertyImage} ${loadedImages.has(image.id) ? styles.loaded : ''}`}
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
                    <div className={styles.imageDescription}>{image.description}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {isLoading && (
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
            <button className={styles.closeButton} onClick={() => setSelectedImageUrl(null)}>
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

      {showEditPopup && (
        <div className={styles.editPopupOverlay}>
          <div className={styles.editPopupContent}>
            <EditPhoto
              propertyId={id}
              imageId={selectedImageId?.toString()}
              onClose={() => setShowEditPopup(false)}
            />
          </div>
        </div>
      )}

      <button className={styles.addButton} onClick={handleNewFormOpen}>
        <Plus size={24} />
      </button>

      {showNewForm && (
        <div className={styles.newFormOverlay}>
          <div className={styles.newFormContent}>
            <button className={styles.closeButton} onClick={handleNewFormClose}>
              <X size={24} />
            </button>
            <PhotoUpload propertyId={id} onClose={handleNewFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPhotos;