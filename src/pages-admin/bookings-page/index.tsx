import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { getBookings, userbookingCancelapi } from "@/api/api-endpoints";
import styles from "./booking.module.css";
import {
  Alert,
  Snackbar,
  IconButton,
  Paper,
  InputBase,
  Button,
  

} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationModal from "@/components/confirmation-modal";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ViewBookings from "@/components/userbooking-form";
import { Property, Booking } from "./booking.types";
import { exportBookingsToCSV } from "./bookings-export";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { fetchUserDetails } from "@/store/slice/auth/userdetails";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormControl, Select, MenuItem } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Box, Typography } from '@mui/material';
import Calendar from '@/components/big-calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddIcon from "@mui/icons-material/Add";
import CreateBookingModal from "./create-booking";






 


const BookingsPage: React.FC<{ isSidebarOpen: boolean }> = ({
  isSidebarOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);



  const properties = useSelector(
    (state: RootState) => state.property.properties
  );
  const propertiesStatus = useSelector(
    (state: RootState) => state.property.status
  );
  const propertiesError = useSelector(
    (state: RootState) => state.property.error
  );

  // Add these lines to get user details from Redux
  const users = useSelector((state: RootState) => state.userDetails.users);
  const userDetailsStatus = useSelector(
    (state: RootState) => state.userDetails.status
  );
  const userDetailsError = useSelector(
    (state: RootState) => state.userDetails.error
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [filterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [selectedOption, setSelectedOption] = useState<string>("all");
  const options = [
    { value: "all", label: "All Bookings" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const getStatusColor = (params: any) => {
    if (params.row.isCancelled) {
      return '#dd5c5c;';
    } else if (params.row.isCompleted) {
      return '#2d6aa0';
    }
    return '#1a95538a';
  };


  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsResponse = await getBookings();

        const userMap = new Map(
          users.map((user: { id: any; firstName: any; lastName: any; }) => [user.id, `${user.firstName} ${user.lastName}`])
        );
        const propertyMap = new Map(
          properties.map((property: Property) => [
            property.id,
            property.propertyName,
          ])
        );

        const mappedData = bookingsResponse.data.map((booking: any) => ({
          id: booking.id,
          bookingId: booking.bookingId,
          checkinDate: new Date(booking.checkinDate).toLocaleString(),
          checkoutDate: new Date(booking.checkoutDate).toLocaleString(),
          totalNights: booking.totalNights,
          noOfGuests: booking.noOfGuests,
          noOfPets: booking.noOfPets,
          isCancelled: booking.isCancelled,
          isCompleted: booking.isCompleted,
          cleaningFee: booking.cleaningFee,
          isLastMinuteBooking: booking.isLastMinuteBooking === 1,
          petFee: booking.petFee,
          userId: booking.user.id,
          propertyId: booking.property.id,
          userName: userMap.get(booking.user.id) || "Unknown User",
          propertyName:
            propertyMap.get(booking.property.id) || "Unknown Property",
        }));

        setBookings(mappedData);
        setFilteredBookings(mappedData);
      } catch (err) {
        setError("No bookings Found. Please try again.");
        setShowErrorSnackbar(true);
      }
    };

    if (
      propertiesStatus === "succeeded" &&
      properties.length > 0 &&
      userDetailsStatus === "succeeded" &&
      users.length > 0
    ) {
      fetchBookings();
    } else if (propertiesStatus === "failed") {
      setError(
        propertiesError || "Failed to fetch properties. Please try again."
      );
      setShowErrorSnackbar(true);
    } else if (userDetailsStatus === "failed") {
      setError(
        userDetailsError || "Failed to fetch user details. Please try again."
      );
      setShowErrorSnackbar(true);
    }
  }, [
    propertiesStatus,
    properties,
    propertiesError,
    userDetailsStatus,
    users,
    userDetailsError,
  ]);

  useEffect(() => {
    const lowercasedFilter = filterValue.toLowerCase();
    const filtered = bookings.filter(
      (booking) =>
        booking.bookingId.toLowerCase().includes(lowercasedFilter) ||
        booking.userName.toLowerCase().includes(lowercasedFilter) ||
        booking.propertyName.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredBookings(filtered);
  }, [filterValue, bookings]);



  useEffect(() => {
    const lowercasedFilter = filterValue.toLowerCase();

    const filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.bookingId.toLowerCase().includes(lowercasedFilter) ||
        booking.userName.toLowerCase().includes(lowercasedFilter) ||
        booking.propertyName.toLowerCase().includes(lowercasedFilter);

      const matchesStatus = (() => {
        switch (selectedOption) {
          case "active":
            return !booking.isCompleted && !booking.isCancelled;
          case "completed":
            return booking.isCompleted;
          case "cancelled":
            return booking.isCancelled;
          default:
            return true;
        }
      })();

      const bookingCheckinDate = new Date(booking.checkinDate);
      const bookingCheckoutDate = new Date(booking.checkoutDate);

      const matchesDateRange =
        (!startDate || bookingCheckoutDate >= startDate) &&
        (!endDate || bookingCheckinDate <= endDate);

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    setFilteredBookings(filtered);
  }, [filterValue, bookings, selectedOption, startDate, endDate]);

  


  const handleEditClick = (id: number) => {
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleSearchClear = () => {
    setFilterValue("");
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleClearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirmation(true);
  };

  const handleViewClick = (id: number) => {
    setSelectedBookingId(id);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleCreateClick = () => {
  setIsCreateModalOpen(true);
};

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  

  const handleConfirmDelete = async () => {
    if (bookingToDelete === null) return;

    try {
      await userbookingCancelapi(bookingToDelete.id, bookingToDelete.userId);

      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingToDelete.id
          ? { ...booking, isCancelled: true }
          : booking
      );
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);

      setShowSuccessSnackbar(true);
    } catch (err) {
      setError("Failed to cancel the booking. Please try again.");
      setShowErrorSnackbar(true);
    }

    setShowDeleteConfirmation(false);
    setBookingToDelete(null);
  };

  

  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings);
  };


  const columns: GridColDef[] = [
    {
      field: "bookingId",
      headerName: "Booking ID",
      flex: 1,
      renderCell: (params) => {
        const color = getStatusColor(params);
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: "center",
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <BookmarkIcon
                sx={{
                  color,
                  marginLeft: '-18px',
                  transform: 'rotate(-90deg)',
                  fontSize: 50,
                }}
              />
              <Typography
                sx={{
                  fontSize: 'small',
                  fontFamily: "'Roboto', sans-serif !important",
                  flexGrow: 1,
                  textAlign: 'center',
                  marginRight: '20px',
                }}
              >
                {params.value}
              </Typography>
            </Box>
          </Box>
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "propertyName",
      headerName: "Property Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalNights",
      headerName: "No of Nights",
      flex: 1,
      align: "center",
      headerAlign: "center"
    },
    {
      field: "checkinDate",
      headerName: "Check-in Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "checkoutDate",
      headerName: "Check-out Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isLastMinuteBooking",
      headerName: "Last Min Booking",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isLastMinuteBooking ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div>
          <IconButton
            aria-label="view"
            color="primary"
            onClick={() => handleViewClick(params.row.id)}
          >
            <VisibilityIcon
              sx={{
                color: "#8DC2F7",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon
              sx={{
                color: "#709C7E",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={() => handleDeleteClick(params.row)}
            disabled={params.row.isCancelled}
          >
            <DeleteIcon
              sx={{
                color: "#F08486",
              }}
            />
          </IconButton>
        </div>
      ),
    },
  ];




  return (
    <div className={`${styles.bookingsContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs defaultValue="0" className={styles.fullWidthTabs}>
          <TabsList className={styles.fullWidthTabsList}>
            <TabsTrigger value="0" onClick={() => setTabValue(0)} className={styles.fullWidthTabsTrigger}>
              Calendar
            </TabsTrigger>
            <TabsTrigger value="1" onClick={() => setTabValue(1)} className={styles.fullWidthTabsTrigger}>
              Booking Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value={String(tabValue)} className={styles.fullWidthTabsContent}>
            {tabValue === 0 && <Calendar isSidebarOpen={isSidebarOpen} />}
            {tabValue === 1 && (
              <>
                <div className={styles.titleContainer}>
                  <div className={styles.actionsContainer}>
                    <div className={styles.gridActionContainer}>
                      <Paper className={styles.searchContainer} elevation={1}>
                        <IconButton className={styles.searchIcon} size="small" disableRipple>
                          <SearchIcon />
                        </IconButton>
                        <InputBase
                          className={styles.searchInput}
                          placeholder="Search..."
                          value={filterValue}
                          onChange={handleSearchChange}
                        />
                        {filterValue && (
                          <IconButton className={styles.clearIcon} size="small" onClick={handleSearchClear}>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </Paper>
  
                      <div style={{ flex: 1 }} />
  
                      <div className={styles.filtersContainer}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Check-in Date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            slotProps={{ textField: { helperText: null } }}
                            className={styles.datePicker}
                            sx={{
                              '& .MuiInputBase-root': { height: '35px' },
                              '& .MuiInputLabel-root': {
                                transform: 'translate(14px, 9px) scale(1)',
                                position: 'absolute',
                                top: '-5px',
                              },
                              '& .MuiInputLabel-shrink': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                              },
                            }}
                          />
                          <DatePicker
                            label="Check-Out Date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            slotProps={{ textField: { helperText: null } }}
                            className={styles.datePicker}
                            sx={{
                              
                              '& .MuiInputBase-root': { height: '35px' },
                              '& .MuiInputLabel-root': {
                                transform: 'translate(14px, 9px) scale(1)',
                                position: 'absolute',
                                top: '-5px',
                              },
                              '& .MuiInputLabel-shrink': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                              },
                            }}
                          />
                        </LocalizationProvider>
                        {startDate && endDate && (
                          <IconButton 
                            className={styles.clearDateFilter} 
                            size="small" 
                            onClick={handleClearDateFilter} 
                            aria-label="Clear date filter"
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
  
                        <FormControl variant="outlined" className={styles.selectContainer}>
                          <Select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value as string)}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            sx={{
                              padding: '0px',
                              marginBottom: '8px',
                              height: '37px',
                              
                              '& .MuiInputBase-input': {
                                fontSize: '14px',
                                height: '4px',
                                padding: '5px',
                              },
                              '& .MuiInputLabel-shrink': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <Box sx={{ display: 'flex', justifyContent: option.value === 'all' ? 'center' : 'center' }}>
                                  {option.value !== 'all' && (
                                    <BookmarkIcon
                                      sx={{
                                        color: option.value === 'active' ? '#1a95538a'
                                          : option.value === 'completed' ? '#2d6aa0'
                                          : option.value === 'cancelled' ? '#dd5c5c'
                                          : 'inherit',
                                        transform: 'rotate(-90deg)',
                                        fontSize: 22,
                                        alignItems: 'center',
                                      }}
                                    />
                                  )}
                                  <Box sx={{ marginLeft: option.value !== 'all' ? 1 : 0 }}>
                                    {option.label}
                                  </Box>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleCreateClick}
                          className={styles.actionButton}
                          
                        >
                          Create Booking
                        </Button>
  
                        <Button
                          variant="contained"
                          startIcon={<FileDownloadIcon />}
                          onClick={handleExportCSV}
                          className={styles.actionButton}
                          
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className={styles.dataGridWrapper}>
                  <DataGrid
                    rows={filteredBookings}
                    columns={columns}
                    rowHeight={40}
                    columnHeaderHeight={40}
                    sx={{
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: 'grey',
                        color: 'white',
                        fontSize: 'small',
                        textTransform: 'uppercase',
                        fontFamily: "'Roboto', sans-serif !important",
                      },
                      '& .MuiDataGrid-cell': {
                        fontSize: 'small',
                        fontFamily: "'Roboto', sans-serif !important",
                      },
                    }}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0 ? styles.evenRow : styles.oddRow
                    }
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableDensitySelector
                    filterModel={filterModel}
                    className={`${styles.dataGrid} ${styles.dataGridPadding}`}
                    slots={{
                      noRowsOverlay: () => (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                          <Typography>No bookings found. Try changing the date range, status, or search restrictions.</Typography>
                        </Box>
                      ),
                    }}
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </Box>
  
      <ViewBookings
        openEvent={isViewModalOpen}
        handleClose={handleCloseViewModal}
        eventId={selectedBookingId || 0}
      />

     <CreateBookingModal
        openEvent={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
      />
  
      <ConfirmationModal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this booking?"
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
      />
  
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
  
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Action completed successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};


export default BookingsPage;
