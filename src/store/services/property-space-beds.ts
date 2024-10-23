import { axiosInstance } from "../axiosSetup";
import {
    CreateOrDeletePropertySpaceBedsDto,
    CreatePropertySpaceBedDto,
    UpdatePropertySpaceBedDto,
} from "../model";

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
