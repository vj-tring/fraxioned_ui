import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './propertyamenities.module.css';
import { amenitiesapi } from '@/api';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import CustomizedSnackbars from '@/components/customized-snackbar';
import ConfirmationModal from '@/components/confirmation-modal';
import {
  getAmenitiesById,
  updatePropertyAmenities,
  resetPropertyAmenities
} from '@/store/slice/auth/propertyamenities';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription?: string;
  amenityGroup: {
    id: number;
    name: string;
  };
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, amenities: propertyAmenities } = useSelector((state: RootState) => state.propertyAmenities);
  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getAmenitiesById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (propertyAmenities.length > 0) {
      const selected = propertyAmenities.map((item: { amenity: { id: any; }; }) => item.amenity.id);
      setSelectedAmenities(selected);
    }
  }, [propertyAmenities]);

  useEffect(() => {
    if (success) {
      showSnackbar('Amenities updated successfully!', 'success');
      setShowConfirmModal(false);
      dispatch(resetPropertyAmenities());
      if (id) {
        dispatch(getAmenitiesById(Number(id)));
      }
      fetchAmenities();
    }
    if (error) {
      showSnackbar(error, 'error');
      dispatch(resetPropertyAmenities());
    }
  }, [success, error, dispatch, id]);

  useEffect(() => {
    if (amenities && Object.keys(amenities).length > 0 && selectedAmenities.length > 0) {
      sortAmenities();
    }
  }, [amenities, selectedAmenities]);

  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 3000);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByGroup(response.data.data);
      setAmenities(groupedAmenities);
    } catch (err) {
      showSnackbar('Failed to fetch amenities. Please try again later.', 'error');
    }
  };

  const groupAmenitiesByGroup = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      const group = amenity.amenityGroup.name;
      if (!acc[group]) {
        acc[group] = [];
      }
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

  useEffect(() => {
    if (expandedGroup) {
      setTimeout(() => {
        const groupElement = groupRefs.current[expandedGroup];
        if (groupElement) {
          groupElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [expandedGroup]);

  const handleUpdateClick = () => {
    setShowConfirmModal(true);
  };

  const handleUpdate = async () => {
    const updateData = {
      property: {
        id: Number(id)
      },
      amenities: selectedAmenities.map(amenityId => ({ id: amenityId })),
      updatedBy: {
        id: 1
      }
    };

    dispatch(updatePropertyAmenities(updateData));
  };

  const toggleGroup = (group: string) => {
    setExpandedGroup(prev => prev === group ? null : group);
  };

  const handleSearch = (group: string, term: string) => {
    setSearchTerms(prev => ({ ...prev, [group]: term }));
  };

  const filterAmenities = useCallback((amenitiesList: Amenity[], searchTerm: string) => {
    return amenitiesList.filter(amenity =>
      amenity.amenityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  const sortAmenities = () => {
    const sortedAmenities = Object.entries(amenities).reduce((acc, [group, amenitiesList]) => {
      const sortedList = [...amenitiesList].sort((a, b) => {
        const aChecked = selectedAmenities.includes(a.id);
        const bChecked = selectedAmenities.includes(b.id);
        if (aChecked && !bChecked) return -1;
        if (!aChecked && bChecked) return 1;
        return a.amenityName.localeCompare(b.amenityName);
      });
      acc[group] = sortedList;
      return acc;
    }, {} as { [key: string]: Amenity[] });

    setAmenities(sortedAmenities);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Property Amenities</h1>
          <button className={styles.updateButton} onClick={handleUpdateClick}>Update</button>
        </div>
        <div className={styles.amenitiesScrollContainer} ref={scrollContainerRef}>
          {Object.entries(amenities).map(([group, amenitiesList]) => (
            <div
              key={group}
              className={`${styles.amenityGroup} ${expandedGroup === group ? styles.expanded : ''}`}
              ref={el => groupRefs.current[group] = el}
            >
              <div className={styles.groupHeader} onClick={() => toggleGroup(group)}>
                <h2 className={styles.groupTitle}>{group}</h2>
                {expandedGroup === group ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedGroup === group && (
                <>
                  <div className={styles.searchContainer}>
                    <Search size={19} className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder={`Search in ${group}...`}
                      className={styles.searchInput}
                      value={searchTerms[group] || ''}
                      onChange={(e) => handleSearch(group, e.target.value)}
                    />
                  </div>
                  <div className={styles.amenityList}>
                    {filterAmenities(amenitiesList, searchTerms[group] || '').map((amenity) => (
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
                    ))}
                    {filterAmenities(amenitiesList, searchTerms[group] || '').length === 0 && (
                      <p className={styles.noResults}>No "{searchTerms[group]}" found in {group} category</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleUpdate}
        title="Confirm Update"
        message="Are you sure you want to update the amenities for this property?"
        confirmLabel="Update"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default PropertyAmenities;