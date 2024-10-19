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
import { Property, Booking } from "./booking.types";
import { exportBookingsToCSV } from "./bookings-export";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { fetchUserDetails } from "@/store/slice/auth/userdetails";

const BookingsPage: React.FC<{ isSidebarOpen: boolean }> = ({
  isSidebarOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [filterModel] = useState<GridFilterModel>({
    items: [],
  });
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
        setError("Failed to fetch bookings. Please try again.");
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

  const handleEditClick = (id: number) => {
    console.log("Edit booking with id:", id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleSearchClear = () => {
    setFilterValue("");
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
      flex: 1,
      align: "center",
      headerAlign: "center",
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
      field: "isCancelled",
      headerName: "Cancelled",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isCancelled ? "Yes" : "No"),
    },
    {
      field: "isCompleted",
      headerName: "Completed",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.row.isCompleted ? "Yes" : "No"),
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
    <div
      className={`${styles.bookingsContainer} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
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
              <AssistantDirectionOutlinedIcon fontSize="small" sx={{}} />
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
