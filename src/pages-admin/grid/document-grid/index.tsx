import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { FileIcon, UploadIcon, Eye, Trash2, Download } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import mammoth from 'mammoth';
import { createPropertyDocuments } from '@/api/api-endpoints';
import { useDispatch, useAppSelector } from '@/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from './document.module.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { deletePropertyDocumentThunk, fetchPropertyDocuments } from '@/store/slice/property-document/actions';
import { setCurrentDocument } from '@/store/slice/property-document';

interface PropertyDocument {
  id: number;
  documentUrl: string;
  documentName: string;
  documentType: string;
  property: { id: number; propertyName: string; };
  createdAt: string;
  updatedAt: string;
}

const categories = ["Blueprint", "Legal", "General", "Contracts", "Invoices", "Reports"];


const DocumentGrid: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {

  const dispatch = useDispatch();
  const propertyDocumentsState = useAppSelector((state) => state.propertyDocuments);
  const { documents, isLoading, error } = propertyDocumentsState;
  const data = documents?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<PropertyDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<PropertyDocument | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<{ file: File; documentType: string; propertyId: number }[]>([]);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPropertyDocuments());
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      documentType: "General",
      propertyId: 1
    }));
    setFilesToUpload(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDocumentSelect = (document: PropertyDocument) => {
    dispatch(setCurrentDocument(document));
  };

  const handleDocumentDelete = (documentId: number) => {
    dispatch(deletePropertyDocumentThunk(documentId));

  };

  const handlePreview = async (document: PropertyDocument) => {
    setPreviewDocument(document);
    if (document.documentName.endsWith('.docx')) {
      try {
        const response = await fetch(document.documentUrl);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setPreviewContent(result.value);
      } catch (error) {
        console.error('Error converting DOCX:', error);
        setPreviewContent('<p>Error previewing DOCX file</p>');
      }
    } else {
      setPreviewContent(null);
    }
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

  const handleFilePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPreviewDocument({
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

  const handleUploadSubmit = async () => {
    setUploadError(null);

    try {
      const propertyDocuments = filesToUpload.map(({ file, documentType }, index) => ({
        documentName: file.name,
        documentType: documentType,
        displayOrder: index + 1,
        property: { id: 1 },
        createdBy: { id: 1 },
      }));

      const formData = new FormData();
      formData.append('propertyDocuments', JSON.stringify(propertyDocuments));

      filesToUpload.forEach(({ file }) => {
        formData.append('documentFiles', file);
      });

      await createPropertyDocuments(formData);

      setFilesToUpload([]);
      setUploadError(null);
      dispatch(fetchPropertyDocuments());

      console.log('Documents uploaded successfully');
    } catch (error) {
      console.error('Error uploading documents:', error);
      setUploadError('Failed to upload documents. Please try again.');
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
                            <DialogHeader>
                              <DialogTitle>{previewDocument?.documentName}</DialogTitle>
                            </DialogHeader>
                            <div className="w-full h-full">
                              {previewDocument && (
                                previewContent ? (
                                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                                ) : (
                                  <iframe
                                    src={`${previewDocument.documentUrl}#toolbar=0`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none', minHeight: '70vh' }}
                                  />
                                )
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
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
              <div className="flex h-[calc(100vh-300px)]">
                <div className="w-1/2 pr-2">
                  <div {...getRootProps()} className="flex items-center justify-center h-32 border-2 border-dashed rounded-md mb-2">
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
                  <ScrollArea className="h-[calc(100vh-400px)] border rounded-md">
                    {filesToUpload.map(({ file, documentType }, index) => (
                      <div key={index} className="flex items-center justify-between p-2 m-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <FileIcon className="mr-2" size={20} />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <Select
                          value={documentType}
                          onValueChange={(value) => {
                            const newFiles = [...filesToUpload];
                            newFiles[index].documentType = value;
                            setFilesToUpload(newFiles);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Document Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => handleFilePreview(file)}>
                          Preview
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button variant="outline" className="mt-2 w-full" style={{ backgroundColor: '#e28f25', color: '#fff' }} onClick={handleUploadSubmit} disabled={filesToUpload.length === 0}>
                    Upload {filesToUpload.length} file(s)
                  </Button>
                </div>
                <div className="w-1/2 pl-2 border-l">
                  {previewDocument ? (
                    <div className="h-full overflow-auto">
                      <h3 className="text-lg font-semibold mb-2">{previewDocument.documentName}</h3>
                      <iframe
                        src={previewDocument.documentUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', minHeight: '60vh' }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Select a file to preview
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default DocumentGrid;
