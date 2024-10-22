import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./property-image.module.css";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import { PropertyImageProps, Property } from "./property-image.types";


const ALL_HOLIDAY_ID = 'all';

const PropertyImage: React.FC<PropertyImageProps> = ({
  onPropertySelect,
  selectedPropertyId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, status, error } = useSelector(
    (state: RootState) => state.property
  );

  useEffect(() => {
    dispatch(fetchProperties());
    const intervalId = setInterval(() => {
      dispatch(fetchProperties());
    }, 60000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleChange = (event: SelectChangeEvent<number | string>) => {
    const selectedValue = event.target.value;
    onPropertySelect(selectedValue);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
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
                borderColor: "grey",
              },
            },
          }}
          sx={{ height: "40px", fontSize: 'small' }}
        >
          <MenuItem value={ALL_HOLIDAY_ID}>All Properties</MenuItem>
          {properties.map((property: Property) => (
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