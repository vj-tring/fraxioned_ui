import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./newphoto.module.css";
import {
  propertyImageuploadapi,
  propertyspaceapi,
  propertyspacetypesapi,
} from "@/api";
import Loader from "@/components/loader";
import { Image, Trash2 } from "lucide-react";

interface Space {
  id: number;
  name: string;
}

interface SpaceType {
  id: number;
  name: string;
  space: {
    id: number;
    name: string;
  };
}

const PhotoUpload: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [spaceType, setSpaceType] = useState<number | null>(null);
  const [space, setSpace] = useState<number | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [filteredSpaceTypes, setFilteredSpaceTypes] = useState<SpaceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpacesAndSpaceTypes = async () => {
      try {
        const [spacesResponse, spaceTypesResponse] = await Promise.all([
          propertyspaceapi(),
          propertyspacetypesapi(),
        ]);

        if (spacesResponse.data && spacesResponse.data.data) {
          setSpaces(spacesResponse.data.data);
        }

        if (spaceTypesResponse.data && spaceTypesResponse.data.data) {
          setSpaceTypes(spaceTypesResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching spaces and space types:", error);
      }
    };

    fetchSpacesAndSpaceTypes();
  }, []);

  useEffect(() => {
    if (space) {
      const filtered = spaceTypes.filter((type) => type.space.id === space);
      setFilteredSpaceTypes(filtered);
      setSpaceType(filtered.length > 0 ? filtered[0].id : null);
    } else {
      setFilteredSpaceTypes([]);
      setSpaceType(null);
    }
  }, [space, spaceTypes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    // if (!space || !spaceType) {
    //   alert("Please select both Space and Space Type");
    //   return;
    // }

    setIsLoading(true);
    const createdBy = 1;
    const propertyImagesData = images.map((image, index) => ({
      property: { id: parseInt(id || "0", 10) },
      createdBy: { id: createdBy },
      displayOrder: index + 1,
      name: name,
      spaceType: { id: spaceType },
      space: { id: space },
    }));
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`imageFiles`, image);
    });
    formData.append("propertyImages", JSON.stringify(propertyImagesData));

    try {
      await propertyImageuploadapi(formData);
      navigate(`/admin/property/${id}/photos`, { state: { fromUpload: true } });
    } catch (error) {
      console.error("Error uploading images:", error);
      navigate(`/admin/property/${id}/photos`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      <h2 className={styles.title}>Upload Photos</h2>
      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="space" className={styles.label}>
              Space
            </label>
            <select
              id="space"
              className={styles.select}
              value={space || ""}
              onChange={(e) => setSpace(parseInt(e.target.value))}
            >
              <option value="">Select a Space</option>
              {spaces.map((spaceItem) => (
                <option key={spaceItem.id} value={spaceItem.id}>
                  {spaceItem.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="spaceType" className={styles.label}>
              Space Type
            </label>
            <select
              id="spaceType"
              className={styles.select}
              value={spaceType || ""}
              onChange={(e) => setSpaceType(parseInt(e.target.value))}
              disabled={!space}
            >
              <option value="">Select a Space Type</option>
              {filteredSpaceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              multiple
              className={styles.fileInput}
              onChange={handleFileChange}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.fileInputLabel}>
              Choose Image files
            </label>
          </div>
        </div>
        <div className={styles.previewSection}>
          {/* <Image /> */}
          <h3 className={styles.previewTitle}>Image Preview</h3>
          <div className={styles.previewScroll}>
            <div className={styles.previewGrid}>
              {images.map((image, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className={styles.previewImage}
                    loading="lazy"
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2  size={14} color="red"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
        <button
          className={styles.cancelButton}
          onClick={() => navigate(`/admin/property/${id}/photos`)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PhotoUpload;
