import React, { useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Backdrop, Button, Grid } from "@mui/material";
import EditBookingModal from "@/pages/booking/bookingEdit";
import CancelPolicy from "../cancel-policy";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "@/store/slice/auth/bookingSlice";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import styles from "./BookingGrid.module.css";

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
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    // { field: "propertyId", headerName: "PropertyID", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "property",
      headerName: "Property",
      width: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "checkinDate",
      headerName: "Check-in",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    {
      field: "checkoutDate",
      headerName: "Checkout",
      headerAlign: "center",
      align: "center",
      width: 180,
    },
    {
      field: "guest",
      headerName: "Guests",
      width: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Booked",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalNights",
      headerName: "TotalNights",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
  ];

  if (activeTab === 0) {
    columns.push({
      field: "actions",
      headerName: "Actions",
      // headerAlign: "center",
      // align: "center",
      width: 130,
      renderCell: (params) => (
        <div>
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
            onClick={() => handleCancelClick(params.row)}
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
        // boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"
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
        getRowClassName={(params) => {
          if (params.indexRelativeToCurrentPage % 2 === 0) {
            return styles.evenRow;
          } else {
            return styles.oddRow;
          }
        }}
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
          "&  .MuiDataGrid-cell--textLeft ": {
            position: "sticky",
            right: 0,
            backgroundColor: "#ebecec",
          },
          "& .MuiDataGrid-columnHeader--last": {
            // backgroundColor: "lightgrey",
            position: "sticky",
            right: 0,
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
              zIndex: 1000,
            }}
          />
          <Backdrop
            open={showCancelPopup}
            style={{
              zIndex: 1000,
              color: "#fff",
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
            <CancelPolicy
              onConfirm={handleConfirmCancel}
              onCancel={handleCloseCancelModal}
            />
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
