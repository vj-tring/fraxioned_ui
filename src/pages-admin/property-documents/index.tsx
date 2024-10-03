import React from 'react';
import styles from './propertydocuments.module.css';
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, UploadIcon, XIcon, ShareIcon, HistoryIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';

interface Document {
  id: string
  name: string
  content: string
  category: string
  versions: { id: string; content: string; timestamp: Date }[]
}

const categories = ["General", "Contracts", "Invoices", "Reports"]

const EnhancedDocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          content,
          category: "General",
          versions: [{ id: Date.now().toString(), content, timestamp: new Date() }]
        }
        setDocuments((prevDocuments) => [...prevDocuments, newDocument])
      }
      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
  }

  const handleDocumentDelete = (documentToDelete: Document) => {
    setDocuments(documents.filter((doc) => doc !== documentToDelete))
    if (selectedDocument === documentToDelete) {
      setSelectedDocument(null)
    }
  }

  const handleCategoryChange = (documentId: string, newCategory: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, category: newCategory } : doc
    ))
  }

  const handleShareDocument = (document: Document) => {
    // Implement sharing functionality here
    console.log(`Sharing document: ${document.name}`)
  }

  const handleVersionChange = (document: Document, versionId: string) => {
    const version = document.versions.find(v => v.id === versionId)
    if (version) {
      setSelectedDocument({ ...document, content: version.content })
    }
  }

  const filteredDocuments = documents.filter(doc => 
    (selectedCategory === "All" || doc.category === selectedCategory) &&
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                    <Select value={doc.category} onValueChange={(value) => handleCategoryChange(doc.id, value)}>
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
                        e.stopPropagation()
                        handleShareDocument(doc)
                      }}
                    >
                      <ShareIcon size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDocumentDelete(doc)
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
      {selectedDocument && (
        <div className="mt-4 bg-white p-4 rounded shadow-md h-[calc(100vh-340px)] overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
            <div className="flex items-center space-x-2">
              <Select 
                value={selectedDocument.versions[selectedDocument.versions.length - 1].id} 
                onValueChange={(value) => handleVersionChange(selectedDocument, value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDocument.versions.map((version, index) => (
                    <SelectItem key={version.id} value={version.id}>
                      Version {selectedDocument.versions.length - index}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <HistoryIcon size={16} className="mr-2" />
                Revert
              </Button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap">{selectedDocument.content}</pre>
        </div>
      )}
    </div>
  )
}

export const PropertyDocuments: React.FC = () => {
  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <EnhancedDocumentManager />
      </div>
    </div>
  );
}

export default PropertyDocuments;