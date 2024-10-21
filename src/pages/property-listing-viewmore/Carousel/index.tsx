// Carousel.tsx
import React, { useState, useEffect, useRef } from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import styles from "./Carousel.module.css"

interface CarouselProps {
  images: { id: number; url: string; description: string }[];
  initialIndex: number;
  onClose: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ images, initialIndex, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(initialIndex);
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToActiveDot(selectedImageIndex); 
  }, [selectedImageIndex]);

  const scrollToActiveDot = (index: number) => {
    if (dotsContainerRef.current) {
      const activeDot = dotsContainerRef.current.children[index] as HTMLDivElement;
      if (activeDot) {
        const containerWidth = dotsContainerRef.current.offsetWidth;
        const dotWidth = activeDot.offsetWidth;
        const dotOffsetLeft = activeDot.offsetLeft;
        const scrollPosition = dotOffsetLeft - containerWidth / 2 + dotWidth / 2;

        dotsContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrevImage = () => {
    const prevIndex = (selectedImageIndex - 1 + images.length) % images.length;
    setSelectedImageIndex(prevIndex);
  };

  const handleNextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImageIndex(nextIndex);
  };

  const handleCardClick = (index: number) => {
    setSelectedImageIndex(index);
    scrollToActiveDot(index);
  };

  return (
    <motion.div
      className={styles.lightbox}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
         <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
      <motion.div
        className={styles.lightboxContent}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.carouselContainer}>
          <button className={styles.prevButton} onClick={handlePrevImage}>
            <ArrowBackIosOutlinedIcon sx={{ fontSize: "50px" }} />
          </button>

          <img
            src={images[selectedImageIndex]?.url}
            alt={images[selectedImageIndex]?.description}
            className={styles.carouselImage}
          />

          <button className={styles.nextButton} onClick={handleNextImage}>
            <ArrowForwardIosOutlinedIcon sx={{ fontSize: "50px" }} />
          </button>
        </div>

        <div className={styles.dotsContainer} ref={dotsContainerRef}>
          {images.slice(Math.max(0, selectedImageIndex - 5), selectedImageIndex + 8).map((image, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                index + Math.max(0, selectedImageIndex - 5) === selectedImageIndex ? styles.active : ""
              }`}
              onClick={() => handleCardClick(index + Math.max(0, selectedImageIndex - 5))}
            >
              <img src={image.url} alt={image.description} className={styles.carouselImage1} />
            </div>
          ))}
        </div>

       
      </motion.div>
    </motion.div>
  );
};

export default Carousel;
