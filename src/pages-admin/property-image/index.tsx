import React, { useState, useEffect } from 'react';
import styles from './property-image.module.css';
import { getProperties } from '@/api';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

interface PropertyType {
    id: number | string;
    propertyName: string;
    color: string;
}

interface PropertyImageProps {
    onPropertySelect: (propertyId: number | string) => void;
    selectedPropertyId: number | string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ onPropertySelect, selectedPropertyId }) => {
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [dropdownValue, setDropdownValue] = useState<number | string>('');

    useEffect(() => {
        const colors = [
            '#FF9999', '#9999FF', '#99FF99', '#FFB266', '#FF6666', '#FF99FF', '#999999', '#66FFB2', '#FFA07A', '#20B2AA', '#99FF99', '#FFB266'
        ];

        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                const fetchedProperties = response.data.map((property: any, index: number) => ({
                    id: property.id,
                    propertyName: property.propertyName,
                    color: colors[index % colors.length]
                }));

                const allHolidaysProperty: PropertyType = {
                    id: 'all',
                    propertyName: 'All Holidays',
                    color: '#4CAF50'
                };

                setPropertyTypes([allHolidaysProperty, ...fetchedProperties]);
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
        const intervalId = setInterval(fetchProperties, 60000);
        return () => clearInterval(intervalId);
    }, []);

    const handleChange = (event: SelectChangeEvent<number | string>) => {
        const selectedValue = event.target.value as number | string;
        setDropdownValue(selectedValue);
        onPropertySelect(selectedValue);
    };

    return (
        <div className={styles.container}>
            <FormControl variant="outlined" className={styles.dropdownContainer}>
                <InputLabel id="property-select-label">Select Property</InputLabel>
                <Select
                    labelId="property-select-label"
                    value={dropdownValue}
                    onChange={handleChange}
                    label="Select Property"
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                borderColor:'grey'
                            },
                        },
                    }}
                    sx={{ height: '45px',
                        borderRadius:"10px",
                        // paddingTop:"10px",
                        width:"300px",
                        fontSize:"small"
                     }}
                >
                    {propertyTypes.map((property) => (
                        <MenuItem key={property.id} value={property.id}>
                            {property.propertyName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default PropertyImage;
