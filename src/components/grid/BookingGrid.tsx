import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import ConfirmationModal from "../confirmation-modal";
import EditBookingModal from "@/pages/booking/bookingEdit";

interface BookingGridProps {
  bookings: Array<{
    id: number;
    bookingId: string;
    property: string;
    checkinDate: string;
    checkoutDate: string;
    guest: string;
    createdAt: string;
    totalNights: number;
  }>;
  onCancel: (id: number) => void;
  activeTab: number;
}

const BookingGrid: React.FC<BookingGridProps> = ({
  bookings,
  onCancel,
  activeTab,
}) => {
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);

  const handleCancelClick = (id: number) => {
    setCancelBookingId(id);
  };

  const handleConfirmCancel = () => {
    if (cancelBookingId !== null) {
      onCancel(cancelBookingId);
      setCancelBookingId(null);
    }
  };

  const handleCloseCancelModal = () => {
    setCancelBookingId(null);
  };

  const handleEditClick = (id: number) => {
    setEditBookingId(id);
  };

  const handleCloseEditModal = () => {
    setEditBookingId(null);
  };

  const columns: GridColDef[] = [
    { field: "bookingId", headerName: "BookingID", flex: 1, headerAlign: "center", align: "center" },
    { field: "property", headerName: "Property", flex: 1, headerAlign: "center", align: "center" },
    { field: "checkinDate", headerName: "Check-in", headerAlign: "center", align: "center" },
    { field: "checkoutDate", headerName: "Checkout", headerAlign: "center", align: "center" },
    { field: "guest", headerName: "Guests", flex: 1, headerAlign: "center", align: "center" },
    { field: "createdAt", headerName: "Booked", flex: 1, headerAlign: "center", align: "center" },
    { field: "totalNights", headerName: "TotalNights", flex: 1, headerAlign: "center", align: "center" },
  ];

  if (activeTab === 0) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            disableRipple
            onClick={() => handleEditClick(params.row.id)}
            sx={{
              marginRight: 1,
              height: "25px",
              fontSize: "12px",
              borderRadius: "15px",
              border: "1px solid black",
              color: "#808080",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disableRipple
            onClick={() => handleCancelClick(params.row.id)}
            sx={{
              borderRadius: "15px",
              height: "25px",
              fontSize: "12px",
              border: "1px solid black",
              color: "#808080",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Cancel
          </Button>
        </>
      ),
    });
  }

  const editingBooking = editBookingId ? bookings.find(b => b.id === editBookingId) : null;

  return (
    <div
      style={{
        height: 300,
        width: "100%",
        border: "none",
        marginTop: "2rem",
      }}
    >
      <DataGrid
        rows={bookings}
        columns={columns}
        disableRowSelectionOnClick
        rowHeight={40}
        columnHeaderHeight={40}
        disableDensitySelector
        disableColumnSelector
        disableColumnMenu
        disableColumnFilter
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#46696E",
            fontWeight: "bold",
            color: "white",
            textTransform: "capitalize",
            paddingRight: "50px",
            fontFamily: "Montserrat, sans-serif",
          },
          "& .MuiDataGrid-footerContainer": {
            display: "none",
          },
          "& .MuiDataGrid": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            fontFamily: "Montserrat, sans-serif",
            color: "#808080",
          },
        }}
      />
      <ConfirmationModal
        show={cancelBookingId !== null}
        onHide={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this booking?"
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
      />
      {editingBooking && (
        <EditBookingModal
          open={editBookingId !== null}
          handleClose={handleCloseEditModal}
          booking={editingBooking}
        />
      )}
    </div>
  );
};

export default BookingGrid;