import React, { useState, useEffect } from "react";
import { getProperties } from "@/api/api-endpoints";
import { AxiosResponse } from "axios";
import styles from "./property-dropdown.module.css";
import {Property,PropertyDropdownProps} from './property-dropdown.types.ts';

const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
  onPropertySelect,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response: AxiosResponse<Property[]> = await getProperties();
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const handleSelect = (propertyId: number | null) => {
    setSelectedProperty(propertyId);
    setIsOpen(false);
    onPropertySelect(propertyId);
  };

  return (
    <div className={styles.propertyDropdownContainer}
    tabIndex={0} 
    onBlur={() => setIsOpen(false)} >
      <div
        className={styles.propertyDropdown}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedProperty === null
            ? "All Properties"
            : properties.find((p) => p.id === selectedProperty)?.propertyName ||
              "Select Property"}
        </span>
        <i
          className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`}
        ></i>
      </div>
      {isOpen && (
        <ul className={styles.propertyDropdownList}>
           <li className={styles.allProperties}
              key="all"
              onClick={() => handleSelect(null)}
            >
            Select All Properties  
          </li>
          {properties.map((property) => (         
            <li key={property.id} onClick={() => handleSelect(property.id)}>
              <div className={styles.propertyDropdownListDisplay}>
                <div>
                    <img src={
                        property.coverImageUrl! ||
                        "https://placehold.jp/150x150.png"
                      }
                      alt={property.propertyName}
                      className={styles.propertyImage}
                      loading="lazy"
                    />
                </div>         
                <span className={styles.propertyDropdownListName}>{property.propertyName}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyDropdown;
