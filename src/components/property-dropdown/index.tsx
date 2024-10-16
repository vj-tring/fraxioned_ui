import React, { useState, useEffect } from "react";
import { getProperties } from "@/api/api-endpoints";
import { AxiosResponse } from "axios";
import styles from "./propertydropdown.module.css";

interface Property {
  id: number;
  propertyName: string;
  ownerRezPropId: number;
  address: string;
  city: string;
  state: string;
}

interface PropertyDropdownProps {
  onPropertySelect: (propertyId: number | null) => void;
}

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
    <div className={styles.propertyDropdownContainer}>
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
          <li
            style={{
              backgroundColor: "#428BCA",
              color: "white",
            }}
            key="all"
            onClick={() => handleSelect(null)}
          >
            All Properties
          </li>
          {properties.map((property) => (
            <li key={property.id} onClick={() => handleSelect(property.id)}>
              {property.propertyName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertyDropdown;
