import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import {
  getBookings,
  userdetails,
  getProperties,
  userbookingCancelapi,
} from "@/api";
import styles from "./bookingsgrid.module.css";
import {
  Alert,
  Snackbar,
  IconButton,
  Paper,
  InputBase,
  Button,
  Link,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationModal from "@/components/confirmation-modal";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewBookings from "@/components/userbooking-form";
import InlineFilter from "@/components/filterbox";
import RefreshIcon from "@mui/icons-material/Refresh";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Property {
  id: number;
  propertyName: string;
}

interface Booking {
  id: number;
  bookingId: string;
  checkinDate: string;
  checkoutDate: string;
  totalNights: number;
  noOfGuests: number;
  isLastMinuteBooking: number;
  noOfPets: number;
  isCancelled: boolean;
  isCompleted: boolean;
  cleaningFee: number;
  petFee: number;
  userId: number;
  propertyId: number;
  userName: string;
  propertyName: string;
}

const BookingGrid: React.FC<{ isSidebarOpen: boolean }> = ({
  isSidebarOpen,
}) => {
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
  const [showFilter, setShowFilter] = useState(false);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingsUsersAndProperties = async () => {
      try {
        const [bookingsResponse, usersResponse, propertiesResponse] =
          await Promise.all([getBookings(), userdetails(), getProperties()]);

        const users: User[] = usersResponse.data.users;
        const properties: Property[] = propertiesResponse.data;

        const userMap = new Map(
          users.map((user) => [user.id, `${user.firstName} ${user.lastName}`])
        );
        const propertyMap = new Map(
          properties.map((property) => [property.id, property.propertyName])
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
          "Failed to fetch bookings, user, or property details. Please try again."
        );
        setShowErrorSnackbar(true);
      }
    };

    fetchBookingsUsersAndProperties();
  }, []);

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

  const handleApplyFilter = (
    field: string,
    operator: string,
    value: string
  ) => {
    const newFilterModel: GridFilterModel = {
      items: [
        {
          field,
          operator: operator as any,
          value,
        },
      ],
    };
    setFilterModel(newFilterModel);

    const filteredData = bookings.filter((booking) => {
      const bookingValue = booking[field as keyof Booking];
      if (typeof bookingValue === "string") {
        switch (operator) {
          case "contains":
            return bookingValue.toLowerCase().includes(value.toLowerCase());
          case "equals":
            return bookingValue.toLowerCase() === value.toLowerCase();
          case "startsWith":
            return bookingValue.toLowerCase().startsWith(value.toLowerCase());
          case "endsWith":
            return bookingValue.toLowerCase().endsWith(value.toLowerCase());
          default:
            return true;
        }
      }
      return true;
    });

    setFilteredBookings(filteredData);
  };

  const handleSearchClear = () => {
    setFilterValue("");
  };

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirmation(true);
  };
  const handleFilterClick = () => {
    setShowFilter(!showFilter);
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

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setBookingToDelete(null);
  };

  const handleExportCSV = () => {
    const headers = [
      "Booking ID",
      "User Name",
      "Property Name",
      "Check-in Date",
      "Check-out Date",
      "LastMinuteBooking",
      "Total Nights",
      "Number of Guests",
      "Number of Pets",
      "Cancelled",
      "Completed",
      "Cleaning Fee",
      "Pet Fee",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredBookings.map((booking) =>
        [
          booking.bookingId,
          booking.userName,
          booking.propertyName,
          booking.isLastMinuteBooking,
          booking.checkinDate,
          booking.checkoutDate,
          booking.totalNights,
          booking.noOfGuests,
          booking.noOfPets,
          booking.isCancelled ? "Yes" : "No",
          booking.isCompleted ? "Yes" : "No",
          booking.cleaningFee,
          booking.petFee,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "bookings.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      width: 150,
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
      width: 150,

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
          <Paper className={styles.searchContainer} elevation={1}>
            <IconButton className={styles.searchIcon} size="small">
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
          <Link
            component="button"
            variant="body2"
            onClick={handleCalendarClick}
            className={styles.calendarLink}
          >
            Go to Calendar
          </Link>
          <div className={styles.gridActionContainer}>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              className={styles.actionButton}
            >
              Export
            </Button>

            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={handleFilterClick}
                className={styles.actionButton}
              >
                Filter
              </Button>
              {showFilter && (
                <InlineFilter
                  columns={columns}
                  onFilter={handleApplyFilter}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </Box>

            <IconButton
              onClick={() => window.location.reload()}
              className={styles.refreshIcon}
              aria-label="refresh"
            >
              <RefreshIcon />
            </IconButton>
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
              textTransform: "uppercase",
              fontFamily: " 'Montserrat', sans-serif !important",
            
            },
            "& .MuiDataGrid-cell": {
              fontFamily: " 'Montserrat', sans-serif !important",
           
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
        children={undefined}
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

export default BookingGrid;
