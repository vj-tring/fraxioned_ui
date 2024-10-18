export interface CreatePropertySpaceBedDto {
    propertySpace: { id: number };
    spaceBedType: { id: number };
    count: number;
    createdBy: { id: number };
  }
  
  export interface UpdatePropertySpaceBedDto {
    propertySpace?: { id: number };
    spaceBedType?: { id: number };
    count?: number;
    updatedBy: { id: number };
  }
  
  export interface UpdatePropertySpaceBathroomDto {
    spaceBathroomType?:  { id: number };
    propertySpace?: { id: number };
    count: number;
    updatedBy: { id: number };
  }

  export interface CreateOrDeletePropertySpaceBedsDto {
    propertySpace: { id: number };
    spaceBedTypes: SpaceBedTypeCount[];
    updatedBy: { id: number | undefined };
  }

  export interface SpaceBedTypeCount{
    spaceBedType: { id: number  };
    count: number;
  }
  
  export interface CreatePropertySpaceBathroomDto {
    spaceBathroomType: { id: number };
    propertySpace: { id: number };
    count: number;
    createdBy: { id: number };
  }
  
  export interface CreateOrDeletePropertySpaceBathroomsDto {
    propertySpace: { id: number };
    spaceBathroomTypes: SpaceBathroomTypesCount[];
    updatedBy: { id: number | undefined };
  }

  export interface SpaceBathroomTypesCount{
    spaceBathroomType: { id: number };
    count: number;
  }
  
  export interface CreateSpaceBedTypeDto {
    name: string;
    description?: string;
    createdBy: { id: number };
  }
  
  export interface UpdateSpaceBedTypeDto {
    name?: string;
    description?: string;
    updatedBy: { id: number };
  }
  
  export interface CreateSpaceBathroomTypesDto {
    name: string;
    description?: string;
    createdBy: { id: number };
  }
  
  export interface UpdateSpaceBathroomTypesDto {
    name?: string;
    description?: string;
    updatedBy: { id: number };
  }