import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './propertyamenities.module.css';
import { amenitiesapi } from '@/api/api-endpoints';
import { AppDispatch } from '@/store';
import { RootState } from "@/store/reducers";
import { getByPropertyId, updatePropertyAmenities } from '@/store/slice/auth/propertyamenities';
import Loader from "@/components/loader";

interface Amenity {
  id: number;
  amenityName: string;
  amenityGroup: {
    id: number;
    name: string;
  };
}

const UpdateButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button className={styles.updateButton} onClick={onClick}>
    Update
  </button>
);

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: any) => state.auth.user?.id);

  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});

  const amenitiesContainerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { loading, error, amenities: propertyAmenities } = useSelector(
    (state: RootState) => state.propertyAmenities
  );

  useEffect(() => {
    if (id) {
      dispatch(getByPropertyId(Number(id)));
    }
    fetchAmenities();
  }, [id, dispatch]);

  useEffect(() => {
    if (propertyAmenities.length > 0) {
      setSelectedAmenities(propertyAmenities.map((item: { amenity: { id: any; }; }) => item.amenity.id));
    }
  }, [propertyAmenities]);

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByGroup(response.data.data);
      setAmenities(groupedAmenities);
      const initialSearchTerms = Object.keys(groupedAmenities).reduce((acc, group) => {
        acc[group] = '';
        return acc;
      }, {} as { [key: string]: string });
      setSearchTerms(initialSearchTerms);
    } catch (err) {
      console.error('Failed to fetch amenities:', err);
    }
  };

  const groupAmenitiesByGroup = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      const group = amenity.amenityGroup.name;
      if (!acc[group]) acc[group] = [];
      acc[group].push(amenity);
      return acc;
    }, {} as { [key: string]: Amenity[] });
  };

  const handleCheckboxChange = (amenityId: number) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const toggleGroup = (group: string) => {
    setExpandedGroup(prev => {
      const newExpandedGroup = prev === group ? null : group;
      if (newExpandedGroup && groupRefs.current[group]) {
        const groupElement = groupRefs.current[group];
        const containerElement = amenitiesContainerRef.current;
        if (groupElement && containerElement) {
          setTimeout(() => {
            const topPos = groupElement.offsetTop - containerElement.offsetTop;
            containerElement.scrollTo({
              top: topPos - 20,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
      return newExpandedGroup;
    });
  };

  const handleSearch = (term: string, group: string) => {
    setSearchTerms(prev => ({ ...prev, [group]: term }));
  };

  const filterAmenities = (amenitiesList: Amenity[], group: string) => {
    const searchTerm = searchTerms[group].toLowerCase();
    return amenitiesList.filter(amenity =>
      amenity.amenityName.toLowerCase().includes(searchTerm)
    );
  };

  const getAmenityCount = (group: string) => {
    const totalCount = amenities[group].length;
    const selectedCount = amenities[group].filter(amenity =>
      selectedAmenities.includes(amenity.id)
    ).length;
    return `Total: ${selectedCount}/${totalCount}`;
  };

  const handleUpdate = async () => {
    const updateData = {
      property: { id: Number(id) },
      propertySpace: { id: null },
      amenities: selectedAmenities.map(amenityId => ({ id: amenityId })),
      updatedBy: { id: userId }
    };
    dispatch(updatePropertyAmenities(updateData));
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Property Amenities</h2>
          <UpdateButton onClick={handleUpdate} />
        </div>
        <div className={styles.amenitiesContainer} ref={amenitiesContainerRef}>
          {Object.entries(amenities).map(([group, amenitiesList]) => (
            <div key={group} className={styles.amenityGroup} ref={el => groupRefs.current[group] = el}>
              <div className={styles.groupHeader} onClick={() => toggleGroup(group)}>
                <div className={styles.groupTitleContainer}>
                  <h3 className={styles.groupTitle}>{group}</h3>
                </div>
                <div className={styles.groupHeaderRight}>
                  <span className={styles.amenityCount}>{getAmenityCount(group)}</span>
                  {expandedGroup === group ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {expandedGroup === group && (
                <>
                  <div className={styles.searchContainer}>
                    <Search size={19} className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Search amenities..."
                      className={styles.searchInput}
                      value={searchTerms[group]}
                      onChange={(e) => handleSearch(e.target.value, group)}
                    />
                  </div>
                  <div className={styles.amenityList}>
                    {filterAmenities(amenitiesList, group).length > 0 ? (
                      filterAmenities(amenitiesList, group).map((amenity) => (
                        <label key={amenity.id} className={styles.amenityItem}>
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity.id)}
                            onChange={() => handleCheckboxChange(amenity.id)}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkmark}></span>
                          <span className={styles.amenityName}>{amenity.amenityName}</span>
                        </label>
                      ))
                    ) : (
                      <div className={styles.noResults}>Searched item not found</div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyAmenities;
