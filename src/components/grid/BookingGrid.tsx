import React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface BookingGridProps {
  bookings: Array<{
    property: { id: number };
    propertyName: string;
    checkinDate: string;
    checkoutDate: string;
    noOfAdults: number;
    noOfChildren: number;
    noOfPets: number;
    isLastMinuteBooking: boolean;
    cleaningFee: number;
    petFee: number;
    notes?: string;
    guest: string;
  }>;
  onEdit: (id: number) => void;
  onCancel: (id: number) => void;
  activeTab: number;
}

const BookingGrid: React.FC<BookingGridProps> = ({
  bookings,
  onEdit,
  onCancel,
  activeTab,
}) => {
  const columns: GridColDef[] = [
    {
      field: "bookingId",
      headerName: "BookingID",
      flex: 1,
      // width:"10px",
      headerAlign: "center",
      align: "center",
    },
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
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "checkoutDate",
      headerName: "Checkout",
      // flex: 1,
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
            onClick={() => onEdit(params.row.id)}
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
            onClick={() => onCancel(params.row.id)}
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

  return (
    <div
      style={{
        height: 300,
        width: "100%",
        border: "none",
        // boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
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
    </div>
  );
};

export default BookingGrid;
