import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './property-image.module.css';
import { fetchProperties } from '@/store/slice/auth/propertiesSlice';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

interface PropertyImageProps {
    onPropertySelect: (propertyId: number | string) => void;
    selectedPropertyId: number | string;
}

interface PropertyType {
    id: number | string;
    propertyName: string;
    color: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ onPropertySelect, selectedPropertyId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { properties, loading, error } = useSelector((state: RootState) => state.property);

    useEffect(() => {
        dispatch(fetchProperties());
        const intervalId = setInterval(() => {
            dispatch(fetchProperties());
        }, 60000);
        return () => clearInterval(intervalId);
    }, [dispatch]);

    const handleChange = (event: SelectChangeEvent<number | string>) => {
        const selectedValue = event.target.value as number | string;
        onPropertySelect(selectedValue);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <FormControl variant="outlined" className={styles.dropdownContainer}>
                <InputLabel id="property-select-label">Select Property</InputLabel>
                <Select
                    labelId="property-select-label"
                    value={selectedPropertyId}
                    onChange={handleChange}
                    label="Select Property"
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 200,
                                borderColor: 'grey'
                            },
                        },
                    }}
                    sx={{ height: '50px' }}
                >
                    {properties.map((property: PropertyType) => (
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