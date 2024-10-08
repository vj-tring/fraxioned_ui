import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Backdrop, Button, Grid } from "@mui/material";
import CancelPolicy from "../cancel-policy";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBookings,
} from "@/store/slice/auth/bookingSlice";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import EditBookingModal from "../modify-booking/bookingEdit";

interface BookingGridProps {
  bookings: Array<{
    id: number;
    bookingId: string;
    property: { id: number; propertyName: string };
    checkinDate: string;
    checkoutDate: string;
    noOfAdults: number;
    noOfChildren: number;
    noOfPets: number;
    isLastMinuteBooking: boolean;
    cleaningFee: number;
    petFee: number;
    notes?: string;
    createdAt: string;
    totalNights: number;
  }>;
  onEdit: (id: number) => void;
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
  const [gridBookings, setGridBookings] = useState(bookings);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch<AppDispatch>();

  const handleCancelClick = (id: number) => {
    setCancelBookingId(id);
    setShowCancelPopup(true);
  };

  const handleUpdateBooking = (updatedBooking: any) => {
    setGridBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === updatedBooking.id
          ? { ...booking, ...updatedBooking }
          : booking
      )
    );
  };

  const handleConfirmCancel = () => {
    if (cancelBookingId !== null) {
      onCancel(cancelBookingId);
      setCancelBookingId(null);
      setShowCancelPopup(false);
    }
  };

  const handleCloseCancelModal = () => {
    setCancelBookingId(null);
    setShowCancelPopup(false);
  };

  const handleEditClick = (id: number) => {
    setEditBookingId(id);
  };

  const handleCloseEditModal = () => {
    setEditBookingId(null);
  };

  const handleEditSuccess = (updatedBooking: any) => {
    handleUpdateBooking(updatedBooking);
    dispatch(fetchUserBookings(userId));
    handleCloseEditModal();
  };

  const columns: GridColDef[] = [
    {
      field: "bookingId",
      headerName: "BookingID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // { field: "propertyId", headerName: "PropertyID", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "property",
      headerName: "Property",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "checkinDate",
      headerName: "Check-in",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "checkoutDate",
      headerName: "Checkout",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "guest",
      headerName: "Guests",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Booked",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalNights",
      headerName: "TotalNights",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
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

  const editingBooking = editBookingId
    ? bookings.find((b) => b.id === editBookingId)
    : null;

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
{showCancelPopup && (
  <>
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000
      }}
    />
      <Backdrop
            open={showCancelPopup}
            style={{
              zIndex: 1000,
              color: '#fff',
            }}
       />
    <Grid 
      container 
      spacing={2} 
      direction="column" 
      justify="center" 
      alignItems="flex-start" 
      style={{
        position: "fixed",
        top: "52%",
        left: "50%",
        width: "70%",
        height: "80%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
        zIndex: 1001,
        // maxHeight: "80vh",
      }}
    >
      <CancelPolicy onConfirm={handleConfirmCancel} onCancel={handleCloseCancelModal} />
    </Grid>
  </>
)}
      {editingBooking && (
        <EditBookingModal
          open={editBookingId !== null}
          handleClose={handleCloseEditModal}
          booking={editingBooking}
          onUpdateSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default BookingGrid;