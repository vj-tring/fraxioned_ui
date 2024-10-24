import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  FileIcon,
  UploadIcon,
  Eye,
  Trash2,
  Download,
  FileText,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useAppSelector } from "../../store";
import styles from "./propertydocuments.module.css";
import mammoth from "mammoth";
import { createPropertyDocuments } from "@/store/services";
import { useParams } from "react-router-dom";
import {
  deletePropertyDocumentThunk,
  fetchPropertyDocumentsByProperty,
  updatePropertyDocumentThunk,
} from "@/store/slice/property-document/actions";
import { setCurrentDocument } from "@/store/slice/property-document";
import Loader from "@/components/loader";

interface PropertyDocument {
  id: number;
  documentUrl: string;
  documentName: string;
  documentType: string;
  property: { id: number; propertyName: string };
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Blueprint",
  "Legal",
  "General",
  "Contracts",
  "Invoices",
  "Reports",
];

const PropertyDocuments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const propertyDocumentsState = useAppSelector(
    (state) => state.propertyDocuments
  );
  const { documents, error } = propertyDocumentsState;
  const data = documents?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] =
    useState<PropertyDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] =
    useState<PropertyDocument | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<
    { file: File; documentType: string; propertyId: number }[]
  >([]);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [documentsTabPreview, setDocumentsTabPreview] =
    useState<PropertyDocument | null>(null);
  const [uploadTabPreview, setUploadTabPreview] =
    useState<PropertyDocument | null>(null);
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyDocumentsByProperty(Number(id)));
    }
  }, [dispatch, id]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        documentType: "General",
        propertyId: Number(id),
      }));
      setFilesToUpload((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDocumentSelect = (document: PropertyDocument) => {
    dispatch(setCurrentDocument(document));
  };

  const handleDocumentDelete = async (documentId: number) => {
    setIsLoading(true);
    try {
      await dispatch(deletePropertyDocumentThunk(documentId));
      await dispatch(fetchPropertyDocumentsByProperty(Number(id)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handlePreview = async (document: PropertyDocument) => {
    const previewDocument =
      activeTab === "documents" ? setDocumentsTabPreview : setUploadTabPreview;
    previewDocument(document);
    if (document.documentName.endsWith(".docx")) {
      try {
        const response = await fetch(document.documentUrl);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setPreviewContent(result.value);
      } catch (error) {
        setPreviewContent("<p>Error previewing DOCX file</p>");
      }
    } else {
      setPreviewContent(null);
    }
  };

  const handleDownload = async (doc: PropertyDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(doc.documentUrl, { mode: "no-cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = doc.documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };
  const handleDeleteClick = (doc: PropertyDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      handleDocumentDelete(documentToDelete.id);
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDocumentToDelete(null);
  };

  const handleFilePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadTabPreview({
        id: Date.now(),
        documentName: file.name,
        documentUrl: URL.createObjectURL(file),
        documentType: "General",
        property: { id: 0, propertyName: "" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    };
    reader.readAsText(file);
  };
  const handleDocumentTypeChange = (value: string, index: number) => {
    const newFiles = [...filesToUpload];
    newFiles[index].documentType = value;
    setFilesToUpload(newFiles);
  };

  const handleRemoveFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = filesToUpload.filter((_, i) => i !== index);
    setFilesToUpload(newFiles);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (newTab === "documents") {
      setUploadTabPreview(null);
    } else {
      setDocumentsTabPreview(null);
    }
  };

  const handleUploadSubmit = async () => {
    setUploadError(null);
    setIsLoading(true);

    try {
      const propertyDocuments = filesToUpload.map(
        ({ file, documentType }, index) => ({
          documentName: file.name,
          documentType: documentType,
          displayOrder: index + 1,
          property: { id: Number(id) },
          createdBy: { id: 1 },
        })
      );

      const formData = new FormData();
      formData.append("propertyDocuments", JSON.stringify(propertyDocuments));

      filesToUpload.forEach(({ file }) => {
        formData.append("documentFiles", file);
      });

      const response = await createPropertyDocuments(formData);
      const newDocuments = response.data;

      setFilesToUpload([]);
      setUploadError(null);
      dispatch(fetchPropertyDocumentsByProperty(Number(id)));

      if (Array.isArray(newDocuments) && newDocuments.length > 0) {
        const firstUpload = newDocuments.find(
          (doc) => doc && doc.documentName && doc.documentUrl
        );
        if (firstUpload) {
          setDocumentsTabPreview(firstUpload);
        }
      }
      setActiveTab("documents");
    } catch (error) {
      setUploadError("Failed to upload documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = React.useMemo(() => {
    return data.filter(
      (doc: { documentType: string; documentName: string }) =>
        (selectedCategory === "All" || doc.documentType === selectedCategory) &&
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, selectedCategory, searchTerm]);

  if (propertyDocumentsState.isLoading || isLoading) {
    return <Loader />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className="flex-1 p-4">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="mt-4">
              <div className="mb-4 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-grow"
                />
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)] border rounded-md">
                {filteredDocuments.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No documents found</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc: PropertyDocument) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 m-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer h-10"
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <div className="flex items-center flex-grow">
                        <FileIcon className="mr-2" size={15} />
                        <span className="text-sm">{doc.documentName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className={styles.buttonOutlineSm}
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(doc)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={styles.preview}>
                            <DialogClose className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 hover:bg-gray-100">
                              <X className="h-4 w-4" />
                            </DialogClose>
                            <div className="w-full h-full">
                              {documentsTabPreview &&
                                (previewContent ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: previewContent,
                                    }}
                                  />
                                ) : (
                                  <iframe
                                    src={`${documentsTabPreview.documentUrl}#toolbar=0`}
                                    width="100%"
                                    height="100%"
                                    style={{
                                      border: "none",
                                      minHeight: "70vh",
                                    }}
                                  />
                                ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          onClick={(e) => handleDownload(doc, e)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              onClick={(e) => handleDeleteClick(doc, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={styles.delete}>
                            <DialogHeader>
                              <DialogTitle>Delete Document</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                              <p>
                                Are you sure you want to delete this document?
                              </p>
                              <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                  variant="outline"
                                  onClick={handleDeleteCancel}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDeleteConfirm}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
              <div className="flex h-[calc(100vh-215px)]">
                <div className="w-1/2 border rounded-md">
                  {uploadTabPreview ? (
                    <div className="h-full overflow-auto">
                      <iframe
                        src={uploadTabPreview.documentUrl}
                        width="100%"
                        height="100%"
                        style={{ border: "none", minHeight: "60vh" }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileText size={48} className="mb-2" />
                      <div className="text-gray-500">
                        Select a file to preview
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-1/2 pr-2">
                  <div
                    {...getRootProps()}
                    className="flex items-center justify-center h-32 border-2 border-dashed rounded-md mb-2"
                  >
                    <input {...getInputProps()} />
                    <div className="text-center">
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <>
                          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100vh-400px)] border rounded-md">
                    {filesToUpload.map(({ file, documentType }, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 m-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center w-[300px]">
                          <FileIcon className="mr-2 flex-shrink-0" size={20} />
                          <span className="truncate" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Select
                            value={documentType}
                            onValueChange={(value) =>
                              handleDocumentTypeChange(value, index)
                            }
                          >
                            <SelectTrigger className="w-[117px]">
                              <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => handleRemoveFile(index, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleFilePreview(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    style={{ backgroundColor: "#e28f25", color: "#fff" }}
                    onClick={handleUploadSubmit}
                    disabled={filesToUpload.length === 0}
                  >
                    Upload {filesToUpload.length} file(s)
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default PropertyDocuments;
