import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileIcon, UploadIcon, ShareIcon, Eye, Trash2, Download } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  fetchPropertyDocuments, 
  createPropertyDocumentThunk, 
  updatePropertyDocumentThunk, 
  deletePropertyDocumentThunk,
  setCurrentDocument
} from '../../store/slice/propertyDocumentSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import styles from './propertydocuments.module.css';

interface PropertyDocument {
  id: number;
  documentUrl: string;
  documentName: string;
  documentType: string;
  property: {
    id: number;
    propertyName: string;
  };
  createdAt: string;
  updatedAt: string;
}

const categories = ["Blueprint", "Legal", "General", "Contracts", "Invoices", "Reports"];

const PropertyDocuments: React.FC = () => {
  const dispatch = useAppDispatch();
  const propertyDocumentsState = useAppSelector((state) => state.propertyDocuments);
  const { documents, isLoading, error } = propertyDocumentsState;
  const data = documents?.data || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<PropertyDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<PropertyDocument | null>(null);

  useEffect(() => {
    dispatch(fetchPropertyDocuments());
  }, [dispatch]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('property', JSON.stringify({ id: 3 })); // Make this dynamic if needed
      formData.append('createdBy', JSON.stringify({ id: 1 })); // Make this dynamic if needed
      formData.append('name', file.name);
      formData.append('documentType', 'General'); // Make this dynamic if needed
      formData.append('documentFile', file);

      console.log('Payload being sent:', Object.fromEntries(formData));

      dispatch(createPropertyDocumentThunk(formData))
        .unwrap()
        .then((result) => {
          console.log('Document created successfully:', result);
          setUploadError(null);
        })
        .catch((error) => {
          console.error('Error creating document:', error);
          setUploadError(error.message || 'An error occurred while uploading the document');
        });
    });
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDocumentSelect = (document: PropertyDocument) => {
    dispatch(setCurrentDocument(document));
  };

  const handleDocumentDelete = (documentId: number) => {
    dispatch(deletePropertyDocumentThunk(documentId));
  };

  const handleCategoryChange = (documentId: number, newCategory: string) => {
    const document = data.find((doc: { id: number; }) => doc.id === documentId);
    if (document) {
      const formData = new FormData();
      formData.append('documentType', newCategory);
      dispatch(updatePropertyDocumentThunk({ id: documentId, documentData: formData }));
    }
  };

  const handlePreview = (document: PropertyDocument) => {
    setPreviewDocument(document);
  };

  const handleDownload = async (doc: PropertyDocument) => {
    try {
      const response = await fetch(doc.documentUrl, { mode: 'no-cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = doc.documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const filteredDocuments = React.useMemo(() => {
    return data.filter((doc: { documentType: string; documentName: string; }) => 
      (selectedCategory === "All" || doc.documentType === selectedCategory) &&
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, selectedCategory, searchTerm]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className="flex-1 p-4">
          <Tabs defaultValue="documents" className="w-full">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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
                      className="flex items-center justify-between p-2 m-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer h-10 "
                      onClick={() => handleDocumentSelect(doc)}
                    >
                      <div className="flex items-center flex-grow">
                        <FileIcon className="mr-2" size={15} />
                        <span className="text-sm">{doc.documentName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[100vw] ml-30">
                            <DialogHeader>
                              <DialogTitle>{previewDocument?.documentName}</DialogTitle>
                            </DialogHeader>
                            <div className="w-full h-full">
                              {previewDocument && (
                                <iframe
                                  src={`${previewDocument.documentUrl}#toolbar=0`}
                                  width="100%"
                                  height="100%"
                                  style={{ border: 'none', minHeight: '60vh' }}
                                />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="icon" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDocumentToDelete(doc);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Document</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                              <p>Are you sure you want to delete this document?</p>
                              <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={() => setDocumentToDelete(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (documentToDelete) {
                                      handleDocumentDelete(documentToDelete.id);
                                      setDocumentToDelete(null);
                                    }
                                  }}
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
              <div
                {...getRootProps()}
                className={`p-10 rounded-md border-2 border-dashed ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center text-gray-500">Drop the files here...</p>
                ) : (
                  <div className="text-center">
                    <UploadIcon className="mx-auto mb-2" size={48} />
                    <p className="text-gray-500">Drag and drop files here, or click to select files</p>
                  </div>
                )}
              </div>
              {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PropertyDocuments;
