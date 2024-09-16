import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { getProperties } from '@/api';

interface Property {
  id: string;
  propertyName: string;
}

const PropertySearchBar: React.FC<{ onSelectProperty: (property: Property) => void }> = ({ onSelectProperty }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [value, setValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data || []);
        setFilteredProperties(response.data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      }
    };
    fetchProperties();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setValue(searchTerm);
    const filtered = properties.filter((property) =>
      property.propertyName.toLowerCase().includes(searchTerm)
    );
    setFilteredProperties(filtered);
    setShowDropdown(true);
  };

  const handleSelectProperty = (property: Property) => {
    onSelectProperty(property);
    setSelectedProperty(property);
    setValue(property.propertyName);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setValue('');
    setSelectedProperty(null);
    setFilteredProperties(properties);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search properties..."
          value={value}
          onChange={handleInputChange}
          onClick={() => setShowDropdown(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {selectedProperty ? (
            <button onClick={clearSelection} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          ) : (
            <Search className="text-gray-400" size={18} />
          )}
        </div>
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredProperties.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-700">No property found</div>
          ) : (
            filteredProperties.map(property => (
              <div
                key={property.id}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelectProperty(property)}
              >
                {property.propertyName}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySearchBar;