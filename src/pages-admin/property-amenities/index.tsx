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
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [highlightedItemId, setHighlightedItemId] = useState<number | null>(null);

  const amenitiesContainerRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const highlightedItemRef = useRef<HTMLLabelElement | null>(null);

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

  useEffect(() => {
    if (highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [highlightedItemId]);

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByGroup(response.data.data);
      setAmenities(groupedAmenities);
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

  const scrollToGroup = (group: string) => {
    if (groupRefs.current[group] && amenitiesContainerRef.current) {
      const groupElement = groupRefs.current[group];
      const containerElement = amenitiesContainerRef.current;
      const containerTop = containerElement.getBoundingClientRect().top;
      const groupTop = groupElement.getBoundingClientRect().top;
      const scrollOffset = groupTop - containerTop - 20;

      containerElement.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  const toggleGroup = (group: string) => {
    setExpandedGroup(prev => {
      const newExpandedGroup = prev === group ? null : group;
      if (newExpandedGroup) {
        setTimeout(() => {
          scrollToGroup(group);
        }, 100);
      }
      return newExpandedGroup;
    });
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setHighlightedItemId(null);

    if (term === '') {
      setExpandedGroup(null);
      setNoResultsMessage('');
      return;
    }

    const lowerTerm = term.toLowerCase();
    let found = false;
    let foundItemId: number | null = null;
    let foundGroup: string | null = null;


    Object.entries(amenities).forEach(([group, amenitiesList]) => {
      const groupMatches = group.toLowerCase().includes(lowerTerm);
      const matchingAmenity = amenitiesList.find(amenity =>
        amenity.amenityName.toLowerCase().includes(lowerTerm)
      );

      if (groupMatches || matchingAmenity) {
        setExpandedGroup(group);
        found = true;
        foundGroup = group;


        if (matchingAmenity) {
          foundItemId = matchingAmenity.id;
          setHighlightedItemId(foundItemId);
        }

        setTimeout(() => {
          scrollToGroup(group);
        }, 100);
      }
    });

    if (!found) {
      setNoResultsMessage(`No "${term}" found`);
    } else {
      setNoResultsMessage('');
      setTimeout(() => {
        if (foundGroup) {
          scrollToGroup(foundGroup);
        }
      }, 100);
    }
  };


  const filterAmenities = (amenitiesList: Amenity[]) => {
    if (!searchTerm) return amenitiesList;
    return amenitiesList;
  };

  const getAmenityCount = (group: string) => {
    const totalCount = amenities[group].length;
    const selectedCount = amenities[group].filter(amenity =>
      selectedAmenities.includes(amenity.id)
    ).length;
    return `Selected: ${selectedCount}/${totalCount}`;
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
        <div className={styles.searchContainer}>
          <Search size={19} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search amenities or groups..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {noResultsMessage && (
          <div className={styles.noResults}>{noResultsMessage}</div>
        )}
        <div className={styles.amenitiesContainer} ref={amenitiesContainerRef}>
          {Object.entries(amenities).map(([group, amenitiesList]) => {
            const groupMatchesSearch = group.toLowerCase().includes(searchTerm.toLowerCase());

            return (
              <div
                key={group}
                className={`${styles.amenityGroup} ${groupMatchesSearch ? styles.highlightedGroup : ''}`}
                ref={el => groupRefs.current[group] = el}
              >
                <div className={styles.groupHeader}
                  onClick={() => toggleGroup(group)}>

                  <div className={styles.groupTitleContainer}>
                    <h3 className={styles.groupTitle}>{group}</h3>
                  </div>

                  <div className={styles.groupHeaderRight}>
                    <span className={styles.amenityCount}>{getAmenityCount(group)}</span>
                    {expandedGroup === group ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                {expandedGroup === group && (
                  <div className={styles.amenityList}>
                    {filterAmenities(amenitiesList).map((amenity) => (
                      <label
                        key={amenity.id}
                        className={`${styles.amenityItem} ${highlightedItemId === amenity.id ? styles.highlighted : ''}`}
                        ref={highlightedItemId === amenity.id ? highlightedItemRef : null}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => handleCheckboxChange(amenity.id)}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkmark}></span>
                        <span className={styles.amenityName}>{amenity.amenityName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertyAmenities;