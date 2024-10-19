import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./newdocument.module.css";
import {
  propertyDocumentUploadApi,
  propertyDocumentTypesApi,
} from "@/api";
import Loader from "@/components/loader";
import { FileIcon, Trash2 } from "lucide-react";

interface DocumentType {
  id: number;
  name: string;
}

const DocumentUpload: React.FC = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await propertyDocumentTypesApi();
        if (response.data && response.data.data) {
          setDocumentTypes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching document types:", error);
      }
    };

    fetchDocumentTypes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([...documents, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async () => {
    if (!documentType) {
      alert("Please select a Document Type");
      return;
    }

    setIsLoading(true);
    const createdBy = 1; // Assuming a static user ID for now
    const propertyDocumentsData = documents.map((document) => ({
      property: { id: parseInt(id || "0", 10) },
      createdBy: { id: createdBy },
      name: name,
      documentType: documentType,
    }));
    const formData = new FormData();

    documents.forEach((document) => {
      formData.append(`documentFile`, document);
    });
    formData.append("propertyDocuments", JSON.stringify(propertyDocumentsData));

    try {
      await propertyDocumentUploadApi(formData);
      navigate(`/admin/property/${id}/documents`, { state: { fromUpload: true } });
    } catch (error) {
      console.error("Error uploading documents:", error);
      navigate(`/admin/property/${id}/documents`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <Loader />
        </div>
      )}
      <h2 className={styles.title}>Upload Documents</h2>
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
              placeholder="Enter document name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="documentType" className={styles.label}>
              Document Type
            </label>
            <select
              id="documentType"
              className={styles.select}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Select a Document Type</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.name}>
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
              accept=".pdf,.doc,.docx,.txt"
            />
            <label htmlFor="file-upload" className={styles.fileInputLabel}>
              Choose Document files
            </label>
          </div>
        </div>
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>Document Preview</h3>
          <div className={styles.previewScroll}>
            <div className={styles.previewList}>
              {documents.map((document, index) => (
                <div key={index} className={styles.previewItem}>
                  <FileIcon size={24} />
                  <span className={styles.documentName}>{document.name}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveDocument(index)}
                  >
                    <Trash2 size={14} color="red" />
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
          onClick={() => navigate(`/admin/property/${id}/documents`)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;