import React, {useRef, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  propertyImageapi,
  deletetpropertyImageById,
} from "@/api/api-endpoints";
import { Edit, Trash2, X, Plus } from "lucide-react";
import Loader from "@/components/loader";
import styles from "./propertyphoto.module.css";
import ConfirmationModal from "@/components/confirmation-modal";
import EditPhoto from "./edit-propertyphoto";
import PhotoUpload from "./new-photoupload";
import { motion, AnimatePresence } from "framer-motion";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
interface PropertyImage {
  id: number;
  url: string;
  description: string;
  propertySpace: {
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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // To track the current index of carousel
  const dotsContainerRef = useRef<HTMLDivElement>(null); // Ref for dots container
  const scrollToActiveDot = (index: number) => {
    if (dotsContainerRef.current) {
      const activeDot = dotsContainerRef.current.children[
        index
      ] as HTMLDivElement;
      if (activeDot) {
        const containerWidth = dotsContainerRef.current.offsetWidth;
        const dotWidth = activeDot.offsetWidth;
        const dotOffsetLeft = activeDot.offsetLeft;

        // Center the active dot in the container
        const scrollPosition =
          dotOffsetLeft - containerWidth / 2 + dotWidth / 2;

        dotsContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth", // Adds a smooth scrolling effect
        });
      }
    }
  };

  useEffect(() => {
    scrollToActiveDot(selectedImageIndex); // Scroll when the active image index changes
  }, [selectedImageIndex]);

  const refreshPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await propertyImageapi(parseInt(id || "0"));
      if (response.data && response.data.success) {
        const allPhotos: PropertyImage[] = response.data.data;
        const groupedBySpace = allPhotos.reduce(
          (acc: { [key: string]: SpaceGroup }, img: PropertyImage) => {
            const spaceName = img.propertySpace.space.name;
            if (!acc[spaceName]) {
              acc[spaceName] = { name: spaceName, instances: [] };
            }

            let instance = acc[spaceName].instances.find(
              (i) => i.instanceNumber === img.propertySpace.instanceNumber
            );

            if (!instance) {
              instance = {
                instanceNumber: img.propertySpace.instanceNumber,
                images: [],
              };
              acc[spaceName].instances.push(instance);
            }

            instance.images.push(img);
            return acc;
          },
          {}
        );

        setImagesBySpace({
          "All Photos": {
            name: "All Photos",
            instances: [{ instanceNumber: 0, images: allPhotos }],
          },
          ...groupedBySpace,
        });
      }
    } catch (error) {
      console.error("Error fetching property images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

  useEffect(() => {
    if (
      location.state &&
      (location.state.fromEdit || location.state.fromUpload)
    ) {
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
    // Filter the images based on the active section
    const imagesForCarousel =
      imagesBySpace[activeTab]?.instances.flatMap(
        (instance) => instance.images
      ) || [];

    const clickedImageIndex = imagesForCarousel.findIndex(
      (img) => img.url === imageUrl
    );

    setSelectedImageUrl(imageUrl);
    setSelectedImageIndex(clickedImageIndex);
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
    setLoadedImages((prevLoadedImages) =>
      new Set(prevLoadedImages).add(imageId)
    );
  };

  // Navigation functions for the carousel
  const handlePrevImage = () => {
    const imagesForCarousel =
      imagesBySpace[activeTab]?.instances.flatMap(
        (instance) => instance.images
      ) || [];

    const prevIndex =
      (selectedImageIndex - 1 + imagesForCarousel.length) %
      imagesForCarousel.length;
    setSelectedImageIndex(prevIndex);
    setSelectedImageUrl(imagesForCarousel[prevIndex].url);
  };
  const handleNextImage = () => {
    const imagesForCarousel =
      imagesBySpace[activeTab]?.instances.flatMap(
        (instance) => instance.images
      ) || [];

    const nextIndex = (selectedImageIndex + 1) % imagesForCarousel.length;
    setSelectedImageIndex(nextIndex);
    setSelectedImageUrl(imagesForCarousel[nextIndex].url);
  };
  const handleCardClick = (index: number) => {
    setSelectedImageIndex(index);
    scrollToActiveDot(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Property Photos</h1>
        <div className={styles.tabsContainer}>
          {Object.entries(imagesBySpace).map(([spaceName, spaceGroup]) => (
            <button
              key={spaceName}
              className={`${styles.tab} ${
                activeTab === spaceName ? styles.activeTab : ""
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
            {imagesBySpace[activeTab]?.instances.flatMap(
              (instance) => instance.images
            ).length === 0 ? (
              <div className={styles.emptyState}>
                <p>No photos found for this space</p>
              </div>
            ) : (
              <div className={styles.photoGrid}>
                {imagesBySpace[activeTab]?.instances.flatMap((instance) =>
                  instance.images.map((image) => (
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
                          className={`${styles.propertyImage} ${
                            loadedImages.has(image.id) ? styles.loaded : ""
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
                        {activeTab === "All Photos" && (
                          <span className={styles.spaceTag}>
                            {`${image.propertySpace.space.name} ${image.propertySpace.instanceNumber}`}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
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
            <div className={styles.carouselContainer}>
              <button className={styles.prevButton} onClick={handlePrevImage}>
                <ArrowBackIosOutlinedIcon
                  sx={{
                    fontSize: "50px",
                  }}
                />
              </button>

              <img
                src={
                  imagesBySpace[activeTab]?.instances.flatMap(
                    (instance) => instance.images
                  )[selectedImageIndex]?.url
                }
                alt={
                  imagesBySpace[activeTab]?.instances.flatMap(
                    (instance) => instance.images
                  )[selectedImageIndex]?.description
                }
                className={styles.carouselImage}
              />
              {/* Next Button */}
              <button className={styles.nextButton} onClick={handleNextImage}>
                <ArrowForwardIosOutlinedIcon
                  sx={{
                    fontSize: "50px",
                  }}
                />
              </button>
            </div>
            <div
              className={`${styles.dotscontainer} ${
                selectedImageIndex !== null ? styles.active : ""
              }`}
              ref={dotsContainerRef}
            >
              {imagesBySpace[activeTab]?.instances
                .flatMap((instance) => instance.images)
                .slice(
                  Math.max(0, selectedImageIndex - 5), // Show images around the active one
                  selectedImageIndex + 8 // 5 before and 5 after the active
                )
                .map((image, index: number) => (
                  <div
                    key={index}
                    className={`${styles.dot} ${
                      index + Math.max(0, selectedImageIndex - 5) ===
                      selectedImageIndex
                        ? `${styles.active}`
                        : ""
                    }`}
                    onClick={() =>
                      handleCardClick(
                        index + Math.max(0, selectedImageIndex - 5)
                      )
                    }
                  >
                    <img
                      src={image.url}
                      alt={image.description}
                      className={styles.carouselImage1}
                    />
                  </div>
                ))}
            </div>
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
