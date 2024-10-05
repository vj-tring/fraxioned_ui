///property doc 

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { FileIcon, UploadIcon, XIcon, ShareIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  fetchPropertyDocuments, 
  createPropertyDocumentThunk, 
  updatePropertyDocumentThunk, 
  deletePropertyDocumentThunk,
  setCurrentDocument
} from '../../store/slice/propertyDocumentSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { PropertyDocument } from '../../types/propertydoc'; 
import styles from './propertydocuments.module.css';

const categories = ["General", "Contracts", "Invoices", "Reports"]

const EnhancedDocumentManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { documents, isLoading, error } = useAppSelector((state) => state.propertyDocuments);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  useEffect(() => {
    dispatch(fetchPropertyDocuments());
  }, [dispatch]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('documentFile', file);
      formData.append('name', file.name);
      formData.append('documentType', 'General'); // You might want to adjust this
      dispatch(createPropertyDocumentThunk(formData));
    });
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleDocumentSelect = (document: PropertyDocument) => {
    dispatch(setCurrentDocument(document));
  };

  const handleDocumentDelete = (documentId: number) => {
    dispatch(deletePropertyDocumentThunk(documentId));
  };

  const handleCategoryChange = (documentId: number, newCategory: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      const formData = new FormData();
      formData.append('documentType', newCategory);
      dispatch(updatePropertyDocumentThunk({ id: documentId, documentData: formData }));
    }
  };

  const handleShareDocument = (document: PropertyDocument) => {
    // Implement sharing functionality here
    console.log(`Sharing document: ${document.name}`);
  };

  const filteredDocuments = documents.filter(doc => 
    (selectedCategory === "All" || doc.documentType === selectedCategory) &&
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
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
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 m-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDocumentSelect(doc)}
                >
                  <div className="flex items-center flex-grow">
                    <FileIcon className="mr-2" size={20} />
                    <span className="truncate">{doc.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={doc.documentType} onValueChange={(value) => handleCategoryChange(doc.id, value)}>
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareDocument(doc);
                      }}
                    >
                      <ShareIcon size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentDelete(doc.id);
                      }}
                    >
                      <XIcon size={20} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="upload" className="mt-4">
          <div {...getRootProps()} className="flex items-center justify-center h-[calc(100vh-300px)] border-2 border-dashed rounded-md">
            <input {...getInputProps()} />
            <div className="text-center">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <>
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Drag 'n' drop some files here, or click to select files</p>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};


export const PropertyDocuments: React.FC = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <EnhancedDocumentManager />
      </div>
    </div>
  );
}
