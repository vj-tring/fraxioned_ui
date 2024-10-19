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
  Link,

} from "@mui/material";
import AssistantDirectionOutlinedIcon from "@mui/icons-material/AssistantDirectionOutlined";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationModal from "@/components/confirmation-modal";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ViewBookings from "@/components/userbooking-form";
import { Property, Booking } from './booking.types';
import { exportBookingsToCSV } from './bookings-export';
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { fetchUserDetails } from "@/store/slice/auth/userdetails";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormControl, Select, MenuItem } from "@mui/material";



const BookingsPage: React.FC<{ isSidebarOpen: boolean }> = ({
  isSidebarOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector((state: RootState) => state.property.properties);
  const propertiesStatus = useSelector((state: RootState) => state.property.status);
  const propertiesError = useSelector((state: RootState) => state.property.error);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  // Add these lines to get user details from Redux
  const users = useSelector((state: RootState) => state.userDetails.users);
  const userDetailsStatus = useSelector((state: RootState) => state.userDetails.status);
  const userDetailsError = useSelector((state: RootState) => state.userDetails.error);

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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [filterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [selectedOption, setSelectedOption] = useState<string>("all");
  const options = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsResponse = await getBookings();

        const userMap = new Map(
          users.map((user) => [user.id, `${user.firstName} ${user.lastName}`])
        );
        const propertyMap = new Map(
          properties.map((property: Property) => [property.id, property.propertyName])
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
        setError(
          "Failed to fetch bookings. Please try again."
        );
        setShowErrorSnackbar(true);
      }
    };

    if (propertiesStatus === 'succeeded' && properties.length > 0 &&
      userDetailsStatus === 'succeeded' && users.length > 0) {
      fetchBookings();
    } else if (propertiesStatus === 'failed') {
      setError(propertiesError || "Failed to fetch properties. Please try again.");
      setShowErrorSnackbar(true);
    } else if (userDetailsStatus === 'failed') {
      setError(userDetailsError || "Failed to fetch user details. Please try again.");
      setShowErrorSnackbar(true);
    }
  }, [propertiesStatus, properties, propertiesError, userDetailsStatus, users, userDetailsError]);

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

      if (selectedDate) {
        const bookingDate = new Date(booking.checkinDate);
        return (
          matchesSearch &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getFullYear() === selectedDate.getFullYear()
        );
      }

      return matchesSearch;
    });
    setFilteredBookings(filtered);
  }, [filterValue, bookings, selectedDate]);

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

      return matchesSearch && matchesStatus;
    });

    setFilteredBookings(filtered);
  }, [filterValue, bookings, selectedOption]);

  const handleEditClick = (id: number) => {
    console.log("Edit booking with id:", id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };



  const handleSearchClear = () => {
    setFilterValue("");
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleClearDateFilter = () => {
    setSelectedDate(null);
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

  const handleCalendarClick = () => {
    navigate("/admin/bookings");
  };


  const handleExportCSV = () => {
    exportBookingsToCSV(filteredBookings);
  };


  const columns: GridColDef[] = [
    {
      field: "bookingId",
      headerName: "Booking ID",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "propertyName",
      headerName: "Property Name",
      width: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "checkinDate",
      headerName: "Check-in Date",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "checkoutDate",
      headerName: "Check-out Date",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isLastMinuteBooking",
      headerName: "Last Min Booking",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isLastMinuteBooking ? "Yes" : "No"),
    },
    {
      field: "isCancelled",
      headerName: "Cancelled",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isCancelled ? "Yes" : "No"),
    },
    {
      field: "isCompleted",
      headerName: "Completed",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isCompleted ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      width: 200,

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
    <div
      className={`${styles.bookingsContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        }`}
    >
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Booking Details</h1>
        <div className={styles.actionsContainer}>
          <div className={styles.gridActionContainer}>



            <Paper className={styles.searchContainer} elevation={1}>
              <IconButton
                className={styles.searchIcon}
                size="small"
                disableRipple
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                className={styles.searchInput}
                placeholder="Search..."
                value={filterValue}
                onChange={handleSearchChange}
              />
              {filterValue && (
                <IconButton
                  className={styles.clearIcon}
                  size="small"
                  onClick={handleSearchClear}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Paper>
            <FormControl variant="outlined" className={styles.selectContainer}>
              <Select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                
                sx={{
                  
                    marginBottom:'10px',

                 
                  

                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    height: '5px',
                    width:'50px',
                    padding: '5px',


                  },
                  
                  
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className={styles.datePickerContainer}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['month', 'year']}
                  label="Month/Year"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { helperText: null } }}
                  className={styles.monthPicker}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '35px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '13px',
                    },
                    '& .MuiInputLabel-root': {
                      transform: 'translate(14px, 9px) scale(1)',
                      position: 'absolute',
                      top: '-5px'

                    },
                    '& .MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  }}
                />


              </LocalizationProvider>
              {selectedDate && (
                <IconButton
                  className={styles.clearDateFilter}
                  size="small"
                  onClick={handleClearDateFilter}
                  aria-label="Clear date filter"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </div>




            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              className={styles.actionButton}
            >
              Export
            </Button>
            <Link
              component="button"
              onClick={handleCalendarClick}
              className={styles.calendarLink}
            >
              <>Go to Calendar</>
              <AssistantDirectionOutlinedIcon
                fontSize="small"
                sx={{

                }}
              />
            </Link>
          </div>
        </div>
      </div>

      <ViewBookings
        openEvent={isViewModalOpen}
        handleClose={handleCloseViewModal}
        eventId={selectedBookingId || 0}
      />

      <div className={styles.dataGridWrapper}>
        <DataGrid
          rows={filteredBookings}
          columns={columns}
          rowHeight={40}
          columnHeaderHeight={40}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "grey",
              color: "white",
              fontSize: "small",
              textTransform: "uppercase",

              fontFamily: " 'Roboto', sans-serif !important",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "small",
              fontFamily: " 'Roboto', sans-serif !important ",
            },

          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          getRowClassName={(params) => {
            if (params.indexRelativeToCurrentPage % 2 === 0) {
              return styles.evenRow;
            } else {
              return styles.oddRow;
            }
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          disableColumnMenu
          disableDensitySelector
          filterModel={filterModel}
          className={`${styles.dataGrid} ${styles.dataGridPadding}`}
        />
      </div>

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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowErrorSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Booking cancelled successfully.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookingsPage;
