import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
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

type Document = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  content: string;
};

const DocumentManagerCard = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Report.pdf",
      type: "PDF",
      size: "2.5 MB",
      uploadDate: "2023-05-15",
      content: "This is a sample report content.",
    },
    {
      id: "2",
      name: "Presentation.pptx",
      type: "PowerPoint",
      size: "5.1 MB",
      uploadDate: "2023-05-14",
      content: "This is a sample presentation content.",
    },
    {
      id: "3",
      name: "Spreadsheet.xlsx",
      type: "Excel",
      size: "1.8 MB",
      uploadDate: "2023-05-13",
      content: "This is a sample spreadsheet content.",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        content: "New document content placeholder.",
      };
      setDocuments([...documents, newDocument]);
    }
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingDocument) {
      setDocuments(
        documents.map((doc) =>
          doc.id === editingDocument.id ? editingDocument : doc
        )
      );
      setEditingDocument(null);
    }
  };

  const handleExport = (doc: Document) => {
    alert(
      `Exporting ${doc.name}. In a real application, this would download the file.`
    );
  };

  return (
    <Card className="w-full max-xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-1xl ">Document Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-grow">
            {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
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
              <Button as="span" style={{
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
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <File className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-small">{doc.name}</p>
                    <p className="text-sm  text-muted-foreground">
                      {doc.type} • {doc.size} • Uploaded on {doc.uploadDate}
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
                        <DialogTitle>{doc.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <p>{doc.content}</p>
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
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editingDocument?.name || ""}
                            onChange={(e) =>
                              setEditingDocument((prev) =>
                                prev ? { ...prev, name: e.target.value } : null
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <textarea
                            id="content"
                            value={editingDocument?.content || ""}
                            onChange={(e) =>
                              setEditingDocument((prev) =>
                                prev
                                  ? { ...prev, content: e.target.value }
                                  : null
                              )
                            }
                            className="w-full h-32 p-2 border rounded"
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
