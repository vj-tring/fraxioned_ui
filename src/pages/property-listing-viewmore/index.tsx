import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/loader";
import styles from "./propertyphotos.module.css";

import { motion, AnimatePresence } from "framer-motion";
import {
  fetchPropertyImages,
  selectPropertyImages,
} from "../../store/slice/auth/propertyImagesSlice ";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "./Carousel";

const PropertyMorePhotos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All Photos");
  const [isLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const { id } = useParams<{ id: string }>();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const dispatch = useDispatch();

  const imagesBySpace = useSelector(selectPropertyImages);
  console.log("imagesBySpace", imagesBySpace);
  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyImages(parseInt(id)));
    }
  }, [dispatch, id]);

  const dotsContainerRef = useRef<HTMLDivElement>(null); // Ref for dots container
  const scrollToActiveDot = (imageId: number) => {
    if (dotsContainerRef.current) {
      const activeDot = Array.from(dotsContainerRef.current.children).find(
        (dot) => (dot as HTMLDivElement).dataset.imageId === imageId.toString()
      ) as HTMLDivElement;

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
    const imagesForCarousel =
      imagesBySpace[activeTab]?.instances.flatMap(
        (instance) => instance.images
      ) || [];

    if (imagesForCarousel[selectedImageIndex]) {
      scrollToActiveDot(imagesForCarousel[selectedImageIndex].id); // Use image ID instead of index
    }
  }, [selectedImageIndex, activeTab, imagesBySpace]);

  const handleTabClick = (spaceName: string) => {
    setActiveTab(spaceName);
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
    setSelectedImageIndex(clickedImageIndex); // Set the correct index for carousel
  };
  const handleImageLoad = (imageId: number) => {
    setLoadedImages((prevLoadedImages) =>
      new Set(prevLoadedImages).add(imageId)
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
              {spaceName === "All Photos" ||
              spaceName === "Additional Photos" ? (
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
                      </div>
                      <div className={styles.imageDescription}>
                        {image.description}
                        {activeTab === "All Photos" && (
                          <span className={styles.spaceTag}>
                            {/* {`${image.name} ${image.instanceNumber}`} */}
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
        <Carousel
          images={imagesBySpace[activeTab]?.instances.flatMap(
            (instance) => instance.images
          )}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageUrl(null)}
        />
      )}
    </div>
  );
};

export default PropertyMorePhotos;
