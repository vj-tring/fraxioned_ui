import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Report.module.css';
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';


const ReportsGrid: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [reportType, setReportType] = useState<'PROPERTY' | 'OWNER' | 'DATE'>('PROPERTY');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [format, setFormat] = useState<'EXCEL' | 'PDF' | 'XML'>('EXCEL');
  const [content, setContent] = useState<'AllDetails' | 'OnlyBookingDetails'>('AllDetails');


  const [propertiesMap, setPropertiesMap] = useState<Map<string, string>>(new Map());
  const [usersMap, setUsersMap] = useState<Map<string, string>>(new Map());

  const [includeCanceled, setIncludeCanceled] = useState<boolean>(false);
  const [includeModifiedBooking, setIncludeModifiedBooking] = useState<boolean>(false);
  const [isLastminBooking, setIsLastminBooking] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [withPets, setWithPets] = useState<boolean>(false);
  const [withoutPets, setWithoutPets] = useState<boolean>(false);

  const [excludeCanceledBookings, setExcludeCanceledBookings] = useState(false);

  const [filterByOwner, setFilterByOwner] = useState<boolean>(false); // New state for filtering by owner
  const [filterByProperty, setFilterByProperty] = useState<boolean>(false); // New state for filtering by owner


  const [usersPropertyMap, setUserPropertyMap] = useState<Map<number, number[]>>(new Map());



  useEffect(() => {
    const fetchUsersAndProperties = async () => {
      try {
        const sessionData = localStorage.getItem('session');
        const userData = localStorage.getItem('user');
        const session = sessionData ? JSON.parse(sessionData) : null;
        const user = userData ? JSON.parse(userData) : null;

        const accessToken = session ? session.token : '';
        const userIdFromStorage = user ? user.id : '';

        // Fetch properties
        const propertyResponse = await axios.get('http://192.168.1.47:3008/api/v1/properties', {
          headers: {
            'user-id': userIdFromStorage,
            'access-token': accessToken,
          }
        });

        // Fetch users
        const userResponse = await axios.get('http://192.168.1.47:3008/api/v1/users', {
          headers: {
            'user-id': userIdFromStorage,
            'access-token': accessToken,
          }
        });

        // Fetch user properties
        const userPropertyResponse = await axios.get('http://192.168.1.47:3008/api/v1/user-properties', {
          headers: {
            'user-id': userIdFromStorage,
            'access-token': accessToken,
          }
        });

        const properties: any[] = propertyResponse.data;
        const users: any[] = Array.isArray(userResponse.data.users) ? userResponse.data.users : [];
        const userProperties: any[] = Array.isArray(userPropertyResponse.data.userProperties) ? userPropertyResponse.data.userProperties : [];

        const propertyMap = new Map(properties.map(property => [property.id, property.propertyName]));
        const userMap = new Map(users.map(user => [user.id, `${user.firstName} ${user.lastName}`]));

        userProperties.forEach(item => {
          const userId = item.user?.id;
          const propertyId = item.property ? (item.property.id) : null;

          if (userId && propertyId) {
            if (!usersPropertyMap.has(userId)) {
              usersPropertyMap.set(userId, []);
            }
            usersPropertyMap.get(userId)?.push(propertyId);
          }
        });




        setPropertiesMap(propertyMap);
        setUsersMap(userMap);
        setUserPropertyMap(usersPropertyMap);

        console.log('reponse:', userPropertyResponse);


      } catch (error) {
        console.error('Error fetching users or properties:', error);
      }
    };

    fetchUsersAndProperties();
  }, []);

  const filteredOwners = () => {
    if (!selectedPropertyId) return Array.from(usersMap.entries());

    const filtered = Array.from(usersMap.entries()).filter(([userId]) => {
      const userProperties = usersPropertyMap.get(Number(userId)) || [];
      const userPropertiesAsNumbers = userProperties.map(Number); 
      const hasProperty = userPropertiesAsNumbers.includes(Number(selectedPropertyId)); 
      return hasProperty;
    });

    return filtered;
  };



  const filteredPropertiesByOwner = () => {
    if (!selectedUserId) return Array.from(propertiesMap.entries());

    const userProperties = usersPropertyMap.get(Number(selectedUserId)) || []; 

    console.log('Selected User ID:', selectedUserId);
    console.log('User Properties:', userProperties);

    
    return Array.from(propertiesMap.entries()).filter(([propertyId]) => {
      const isIncluded = userProperties.includes(Number(propertyId)); 
      console.log(`Checking Property ID: ${propertyId}, Included: ${isIncluded}`);
      return isIncluded;
    });
  };










  useEffect(() => {
    if (isLastminBooking) {
      setIncludeCanceled(false);
    }
  }, [isLastminBooking]);

  const handleFilter = async () => {
    try {
      const sessionData = localStorage.getItem('session');
      const userData = localStorage.getItem('user');
      const session = sessionData ? JSON.parse(sessionData) : null;
      const user = userData ? JSON.parse(userData) : null;

      const accessToken = session ? session.token : '';
      const userIdFromStorage = user ? user.id : '';

      const requestData: any = {
        format: format.toLowerCase(),
        content: content.toLowerCase()

      };

      if (reportType === 'PROPERTY' && selectedPropertyId) {
        requestData.propertyId = selectedPropertyId;
      }
      if (reportType === 'OWNER' && selectedUserId) {
        requestData.userId = selectedUserId;
      }
      if (selectedPropertyId) {
        requestData.propertyId = selectedPropertyId;
      }
      if (selectedUserId) {
        requestData.userId = selectedUserId;
      }

      if (fromDate) requestData.fromDate = fromDate.toISOString().split('T')[0];
      if (toDate) requestData.toDate = toDate.toISOString().split('T')[0];

      if (includeCanceled) {
        requestData.isCancelled = true;
      } else if (excludeCanceledBookings) {
        requestData.isCancelled = false;
      }
      if (withPets) {
        requestData.withPets = true;
      } else if (withoutPets) {
        requestData.withPets = false;
      }


      if (isLastminBooking) requestData.isLastminBooking = isLastminBooking;
      if (includeModifiedBooking) requestData.includeModifiedBooking = includeModifiedBooking;
      if (isCompleted) requestData.isCompleted = isCompleted;
      if (withPets) requestData.withPets = withPets;

      console.log('Request Data:', requestData);

      const response = await axios.post('http://192.168.1.47:3008/api/v1/bookings-report', requestData, {
        headers: {
          'user-id': userIdFromStorage,
          'access-token': accessToken,
          'Accept': 'application/json',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const isFormValid = () => {
    if (!fromDate || !toDate) return false;
    if (reportType === 'PROPERTY' && !selectedPropertyId) return false;
    if (reportType === 'OWNER' && !selectedUserId) return false;
    return true;
  };


  return (
    <div className={`${styles.reportsContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <h2 className={styles.reportsHeader}>Bookings Report</h2>

      <div className={styles.formSection}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Sort By"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value as 'PROPERTY' | 'OWNER' | 'DATE');
                setSelectedPropertyId(null);
                setSelectedUserId(null);
                setFilterByOwner(false);
              }}
              fullWidth
            >
              <MenuItem value="PROPERTY">Property</MenuItem>
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="DATE">Date</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={10} sm={3}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(date) => setFromDate(date)}
              sx={{ width: '300px' }}

            />
          </Grid>

          <Grid item xs={10} sm={4}>
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(date) => setToDate(date)}
              sx={{ width: '300px' }}

            />
          </Grid>



          
          {reportType === 'PROPERTY' && (
            <Grid item xs={12} sm={8.3}>
              <TextField
                select
                label="Select Property"
                value={selectedPropertyId || ''}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  setSelectedUserId(''); 
                }}
                fullWidth
              >
                {Array.from(propertiesMap.entries()).map(([id, name]) => (
                  <MenuItem key={id} value={id.toString()}>{name}</MenuItem>
                ))}
              </TextField>




            </Grid>
          )}

        
          {reportType === 'OWNER' && (
            <Grid item xs={12} sm={8.3}>
              <TextField
                select
                label="Select Owner"
                value={selectedUserId || ''}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setSelectedPropertyId(null); 
                }}
                fullWidth
              >
                {Array.from(usersMap.entries()).map(([id, name]) => (
                  <MenuItem key={id} value={id.toString()}>{name}</MenuItem>
                ))}
              </TextField>



            </Grid>
          )}
          <Grid item xs={10} sm={4}>
            <FormControlLabel
              control={<Checkbox checked={includeCanceled} onChange={(e) => setIncludeCanceled(e.target.checked)} />}
              label="Only Cancelled Bookings"

            />
          </Grid>

          <Grid item xs={10} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={excludeCanceledBookings} onChange={(e) => setExcludeCanceledBookings(e.target.checked)} />}
              label="Exclude Cancelled Bookings"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Checkbox checked={isLastminBooking} onChange={(e) => setIsLastminBooking(e.target.checked)} />}
              label="Only Last-Minute Bookings"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={includeModifiedBooking} onChange={(e) => setIncludeModifiedBooking(e.target.checked)} />}
              label="Only Modified Bookings"
            />
          </Grid>

          <Grid item xs={10} sm={4}>
            <FormControlLabel
              control={<Checkbox checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} />}
              label="Only Completed Bookings"
            />
          </Grid>

          <Grid item xs={10} sm={5}>
            <FormControlLabel
              control={<Checkbox checked={withPets} onChange={(e) => setWithPets(e.target.checked)} />}
              label="Only Bookings with Pets"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Checkbox checked={withoutPets} onChange={(e) => setWithoutPets(e.target.checked)} />}
              label="Only Bookings without Pets"
            />


          </Grid>

          <Grid item xs={12} sm={4}>
            
            {reportType === 'PROPERTY' && (
              <FormControlLabel
                control={<Checkbox checked={filterByOwner} onChange={(e) => setFilterByOwner(e.target.checked)} />}
                label="Filter by Owner"
              />
            )}

            {reportType === 'OWNER' && (
              <FormControlLabel
                control={<Checkbox checked={filterByProperty} onChange={(e) => setFilterByProperty(e.target.checked)} />}
                label="Filter by Property"
              />
            )}



          </Grid>


          <Grid item xs={12} sm={8}>


          <Grid item xs={12} sm={10} className={styles.reportFilter}>
          
             {filterByOwner && selectedPropertyId && (
              <TextField
                select
                label="Select Owner"
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value)}
                fullWidth
              >
                {filteredOwners().length === 0 ? (
                  <MenuItem disabled>No owners available</MenuItem>
                ) : (
                  filteredOwners().map(([id, name]) => (
                    <MenuItem key={id} value={id.toString()}>{name}</MenuItem>
                  ))
                )}
              </TextField>
            )}

            {/* Properties corresponding to selected owner */}
            {filterByProperty && selectedUserId && (
              <TextField
                select
                label="Select Property"
                value={selectedPropertyId || ''}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                fullWidth
              >
                {filteredPropertiesByOwner().length === 0 ? (
                  <MenuItem disabled>No property available</MenuItem>
                ) : (
                  filteredPropertiesByOwner().map(([id, name]) => (
                    <MenuItem key={id} value={id.toString()}>{name}</MenuItem>
                  ))
                )}
              </TextField>
            )}


          </Grid>

           
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select Content</FormLabel>
                <RadioGroup row value={content} onChange={(e) => setContent(e.target.value as 'AllDetails' | 'OnlyBookingDetails')}>
                  <FormControlLabel value="AllDetails" control={<Radio />} label="All Details" />
                  <FormControlLabel value="OnlyBookingDetails" control={<Radio />} label="Only Booking Details" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Format</FormLabel>
              <RadioGroup row value={format} onChange={(e) => setFormat(e.target.value as 'EXCEL' | 'PDF' | 'XML')}>
                <FormControlLabel value="EXCEL" control={<Radio />} label="Excel" />
                <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
                <FormControlLabel value="XML" control={<Radio />} label="XML" />
              </RadioGroup>
            </FormControl>

          </Grid>






          <Grid item xs={12}>
            <Button
              className={styles.generateReport}
              variant="contained"
              color="primary"
              onClick={handleFilter}
              disabled={!isFormValid()}

            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );




};

export default ReportsGrid;
