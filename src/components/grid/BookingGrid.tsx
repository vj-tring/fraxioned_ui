import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../grid/BookingGrid.css";
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
}

const BookingGrid: React.FC<BookingGridProps> = ({
  bookings,
  onEdit,
  onCancel,
}) => {
  const columns: GridColDef[] = [
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
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "checkoutDate",
      headerName: "Checkout",
      flex: 1,
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
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <>
          {/* <IconButton>
                          <MoreVertIcon />
                      </IconButton> */}
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
    },
  ];

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
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#c4eaf4",
            fontWeight: "bold",
            color: "#808080",
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
