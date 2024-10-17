import React, { useRef } from "react";
import { IoIosImages } from "react-icons/io";
import { MdUploadFile } from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import { Edit } from "lucide-react";
import styles from "./imageupload.module.css";

interface ImageUploadProps {
    selectedSpace: { s3_url?: string } | null;
    uploadProgress: number;
    imagePreview: string | null;
    fileName: string | null;
    isDragging: boolean;
    handleFile: (file: File) => void;
    handleCancelPreview: () => void;
    setIsDragging: (isDragging: boolean) => void;
    getProgressColor: () => string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    selectedSpace,
    uploadProgress,
    imagePreview,
    fileName,
    isDragging,
    handleFile,
    handleCancelPreview,
    setIsDragging,
    getProgressColor,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const renderUploadPrompt = () => (
        <div
            className={`${styles.uploadContainer} ${isDragging ? styles.dragging : ""}`}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
            }}
        >
            {uploadProgress === 100 ? (
                <div className={styles.imagePreview}>
                    <img
                        src={imagePreview || undefined} // Convert null to undefined
                        alt="Preview"
                        className={styles.previewImage}
                    />
                </div>
            ) : (
                <div className={styles.uploadPrompt}>
                    {!fileName ? (
                        <>
                            <IoIosImages className={styles.icon} />
                            <p className={styles.dragDropText}>Drag and drop</p>
                            <p className={styles.orText}>or browse for photo</p>
                            <button
                                className={styles.uploadButton}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Browse
                            </button>
                        </>
                    ) : (
                        <p className={styles.uploading}>Uploading...</p>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <>
            {selectedSpace ? (
                uploadProgress === 100 ? (
                    <div className={styles.imagePreview}>
                        <img
                            src={imagePreview || undefined} // Convert null to undefined
                            alt="Preview"
                            className={styles.previewImage}
                        />
                    </div>
                ) : (
                    <div className={styles.uploadContainer}>
                        <div className={styles.uploadPrompt}>
                            {!fileName ? (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview || selectedSpace.s3_url || ""} alt="Preview" className={styles.previewImage} />
                                    <div className={styles.editOverlay}>
                                        <button className={styles.iconButton} onClick={() => fileInputRef.current?.click()}>
                                            <Edit size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.uploading}>Uploading...</p>
                            )}
                        </div>
                    </div>
                )
            ) : (
                renderUploadPrompt()
            )}

            {fileName && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressCircle}>
                        <p className={styles.progressCircleIcon}><MdUploadFile /></p>
                    </div>
                    <div className={styles.progressDetails}>
                        <div className={styles.progressDetailsHeader}>
                            <p className={styles.fileName}>{fileName}</p>
                            <button onClick={handleCancelPreview}>
                                <VscTrash size={17} />
                            </button>
                        </div>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progress}
                                style={{
                                    width: `${uploadProgress}%`,
                                    backgroundColor: getProgressColor(),
                                }}
                            ></div>
                        </div>
                        <p className={styles.uploadPercentage}>{`${uploadProgress}%`}</p>
                    </div>
                </div>
            )}
            <input
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                    }
                }}
            />
        </>
    );
};

export default ImageUpload;
