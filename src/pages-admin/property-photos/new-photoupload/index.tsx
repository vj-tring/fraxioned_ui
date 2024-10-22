import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus } from 'lucide-react';
import styles from './newphoto.module.css';
import {
  uploadPropertyImages
} from '@/store/slice/additional-image/action';
import {
  resetPropertyImagesState,
  clearPropertyImages
} from '@/store/slice/additional-image';
import Loader from '@/components/loader';
import CustomizedSnackbars from '@/components/customized-snackbar';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';
import { PropertyImage } from '@/store/model/additional-image';

interface AddPhotoProps {
  propertyId: number;
  onClose: () => void;
  onPhotosAdded: () => void;
}

const AddPhoto: React.FC<AddPhotoProps> = ({ propertyId, onClose, onPhotosAdded }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { loading, success, error } = useSelector((state: RootState) => state.PropertyImage);

  useEffect(() => {
    return () => {
      dispatch(resetPropertyImagesState());
      dispatch(clearPropertyImages());
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      const timer = setTimeout(() => {
        onPhotosAdded();
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onPhotosAdded, onClose]);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowSnackbar(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => {
      URL.revokeObjectURL(prevUrls[index]);
      return prevUrls.filter((_, i) => i !== index);
    });
  };

  const handleSave = async () => {
    const formData = new FormData();
    const additionalImagesData: Partial<PropertyImage>[] = selectedFiles.map((_, index) => ({
      description: "",
      displayOrder: index + 1,
      property: { id: propertyId },
      createdBy: { id: 1 }
    }));

    formData.append('propertyAdditionalImages', JSON.stringify(additionalImagesData));
    selectedFiles.forEach(file => {
      formData.append('imageFiles', file);
    });

    dispatch(uploadPropertyImages(formData));
  };

  return (
    <>
      <div className={styles.addPhotoContainer}>
        <div className={styles.header}>
          <h2>Add Photos</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.content}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.photoGridContainer}>
            <div className={styles.photoGrid}>
              <div
                className={styles.addPhotoButton}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={24} />
                <span>Add Photo</span>
              </div>
              {previewUrls.map((url, index) => (
                <div key={index} className={styles.previewItem}>
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.footer}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={selectedFiles.length === 0 || loading}
            >
              {loading ? 'Saving..' : 'Save'}
            </button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={handleSnackbarClose}
        message="Photos uploaded successfully!"
        severity="success"
      />
    </>
  );
};

export default AddPhoto;


