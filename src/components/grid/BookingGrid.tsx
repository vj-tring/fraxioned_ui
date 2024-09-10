import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
    
interface BookingGridProps {
  bookings: Array<{
    property: { id: number };
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
      headerName: "Property ID",
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
            onClick={() => onEdit(params.row.id)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onCancel(params.row.id)}
          >
            Cancel
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={bookings} columns={columns} disableRowSelectionOnClick />
    </div>
  );
};

export default BookingGrid;
