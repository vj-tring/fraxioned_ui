import { axiosInstance } from "../axiosSetup";
import { CreatePropertySpaceBedDto, UpdatePropertySpaceBedDto, CreateOrDeletePropertySpaceBedsDto, CreatePropertySpaceBathroomDto, CreateOrDeletePropertySpaceBathroomsDto, CreateSpaceBedTypeDto, UpdateSpaceBedTypeDto, CreateSpaceBathroomTypesDto, UpdateSpaceBathroomTypesDto, UpdatePropertySpaceBathroomDto } from "@/store/model/space-types";


export const createPropertySpaceBed = (data: CreatePropertySpaceBedDto) =>
    axiosInstance.post('/property-space-beds/property-space-bed', data);

export const getAllPropertySpaceBeds = () =>
    axiosInstance.get('/property-space-beds/property-space-bed');

export const getAllPropertySpaceBedsByPropertySpace = (propertySpaceId: number) =>
    axiosInstance.get(`/property-space-beds/property-space/${propertySpaceId}/property-space-beds`);

export const getPropertySpaceBedById = (id: number) =>
    axiosInstance.get(`/property-space-beds/property-space-bed/${id}`);

export const updatePropertySpaceBedDetail = (id: number, data: UpdatePropertySpaceBedDto) =>
    axiosInstance.patch(`/property-space-beds/property-space-bed/${id}`, data);

export const deletePropertySpaceBed = (id: number) =>
    axiosInstance.delete(`/property-space-beds/property-space-bed/${id}`);

export const createOrDeletePropertySpaceBeds = (data: CreateOrDeletePropertySpaceBedsDto) =>
    axiosInstance.patch('/property-space-beds', data);

// Property Space Bathroom Endpoints
export const createPropertySpaceBathroom = (data: CreatePropertySpaceBathroomDto) =>
    axiosInstance.post('/property-space-bathrooms/property-space-bathroom', data);

export const getAllPropertySpaceBathroom = () =>
    axiosInstance.get('/property-space-bathrooms');

export const getPropertySpaceBathroomById = (id: number) =>
    axiosInstance.get(`/property-space-bathrooms/property-space-bathroom/${id}`);

export const updatePropertySpaceBathroomById = (id: number, data: UpdatePropertySpaceBathroomDto) =>
    axiosInstance.patch(`/property-space-bathrooms/property-space-bathroom/${id}`, data);

export const deletePropertySpaceBathroomById = (id: number) =>
    axiosInstance.delete(`/property-space-bathrooms/property-space-bathroom/${id}`);

export const createOrDeletePropertySpaceBathrooms = (data: CreateOrDeletePropertySpaceBathroomsDto) =>
    axiosInstance.patch('/property-space-bathrooms', data);

export const createSpaceBedType = (data: CreateSpaceBedTypeDto, imageFile: File) => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);

    formData.append('name', data.name);
    if (data.description) {
        formData.append('description', data.description);
    }
    formData.append('createdBy', JSON.stringify(data.createdBy));

    return axiosInstance.post('/space-bed-types/space-bed-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};


export const getAllSpaceBedTypes = () =>
    axiosInstance.get('/space-bed-types');

export const getSpaceBedTypeById = (id: number) =>
    axiosInstance.get(`/space-bed-types/space-bed-type/${id}`);

export const updateSpaceBedTypeDetail = (id: number, data: UpdateSpaceBedTypeDto, imageFile?: File) => {
    const formData = new FormData();
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }
    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.description) {
        formData.append('description', data.description);
    }
    if (data.updatedBy) {
        formData.append('updatedBy', JSON.stringify(data.updatedBy));
    }
    return axiosInstance.patch(`/space-bed-types/space-bed-type/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const deleteSpaceBedType = (id: number) =>
    axiosInstance.delete(`/space-bed-types/space-bed-type/${id}`);


export const createSpaceBathroomType = (data: CreateSpaceBathroomTypesDto, imageFile: File) => {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    formData.append('name', data.name);
    if (data.description) {
        formData.append('description', data.description);
    }
    formData.append('createdBy', JSON.stringify(data.createdBy));

    return axiosInstance.post('/space-bathroom-types/space-bathroom-type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getAllSpaceBathroomTypes = () =>
    axiosInstance.get('/space-bathroom-types');

export const getSpaceBathroomTypeById = (id: number) =>
    axiosInstance.get(`/space-bathroom-types/space-bathroom-type/${id}`);

export const updateSpaceBathroomTypeById = (id: number, data: UpdateSpaceBathroomTypesDto, imageFile?: File) => {
    const formData = new FormData();
    if (imageFile) {
        formData.append('imageFile', imageFile);
    }

    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.description) {
        formData.append('description', data.description);
    }
    formData.append('updatedBy', JSON.stringify(data.updatedBy));

    return axiosInstance.patch(`/space-bathroom-types/space-bathroom-type/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deleteSpaceBathroomTypeById = (id: number) =>
    axiosInstance.delete(`/space-bathroom-types/space-bathroom-type/${id}`);