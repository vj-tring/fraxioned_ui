export interface PropertyDocument {
    id: number;
    property: { id: number };
    createdBy: { id: number };
    updatedBy?: { id: number };
    name: string;
    documentType: string;
    documentFile: File | null;
  }
  
  export interface PropertyDocumentState {
    documents: PropertyDocument[];
    currentDocument: PropertyDocument | null;
    isLoading: boolean;
    error: string | null;
  }