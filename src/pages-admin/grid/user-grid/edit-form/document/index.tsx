import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  File,
  Trash2,
  Edit,
  Eye,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { UserPropertyDocument, fetchUserPropertyDocument, createUserPropertyDocumentThunk, deleteUserPropertyDocumentThunk, updateUserPropertyDocumentThunk } from "@/store/slice/userDocumentSlice";

interface DocumentManagerCardProps {
  userId: number;
}

const DocumentManagerCard: React.FC<DocumentManagerCardProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, isLoading, error } = useSelector((state: RootState) => state.userDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDocument, setEditingDocument] = useState<UserPropertyDocument | null>(null);

  useEffect(() => {
    dispatch(fetchUserPropertyDocument(userId));
  }, [dispatch, userId]);

  const filteredDocuments = Array.isArray(documents?.data)
    ? documents.data.filter((doc: UserPropertyDocument) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('documentFile', file);
      formData.append('documentName', file.name);
      formData.append('documentType', file.type);
      formData.append('user', JSON.stringify({ id: userId }));
      await dispatch(createUserPropertyDocumentThunk({ userId, formData }));
    }
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteUserPropertyDocumentThunk({ userId, documentId: id }));
  };

  const handleEdit = (doc: UserPropertyDocument) => {
    setEditingDocument(doc);
  };

  const handleSaveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingDocument) {
      const formData = new FormData();
      formData.append('documentName', editingDocument.documentName);
      formData.append('documentType', editingDocument.documentType);
      await dispatch(updateUserPropertyDocumentThunk({ userId, documentId: editingDocument.id, documentData: formData }));
      setEditingDocument(null);
    }
  };

  const handleExport = (doc: UserPropertyDocument) => {
    window.open(doc.documentUrl, '_blank');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-full max-xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-1xl ">User Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-grow">
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 "
            />
          </div>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            />
            <label htmlFor="file-upload">
              <Button style={{
                backgroundColor:'#2d6aa0',
                color:'white',
                height:'30px',
                borderRadius:'3px',
                fontSize:'small',
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
              }}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </label>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredDocuments.map((doc: UserPropertyDocument) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <File className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-small">{doc.documentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.documentType} • Property: {doc.property.propertyName}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{doc.documentName}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <p>Document preview not available</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div>
                          <Label htmlFor="documentName">Name</Label>
                          <Input
                            id="documentName"
                            value={editingDocument?.documentName || ""}
                            onChange={(e) =>
                              setEditingDocument((prev) =>
                                prev ? { ...prev, documentName: e.target.value } : null
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="documentType">Document Type</Label>
                          <Input
                            id="documentType"
                            value={editingDocument?.documentType || ""}
                            onChange={(e) =>
                              setEditingDocument((prev) =>
                                prev ? { ...prev, documentType: e.target.value } : null
                              )
                            }
                          />
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExport(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredDocuments.length === 0 && (
              <p className="text-center text-muted-foreground">
                No documents found.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentManagerCard;