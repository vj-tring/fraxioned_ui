import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./property.module.css";
import NewPropertyForm from "./NewPropertyForm";
import ConfirmationModal from "@/components/confirmation-modal";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "@/store/slice/auth/propertiesSlice";
import type { Property } from "@/store/slice/auth/propertiesSlice";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";

interface PropertyComponentProps {
  isSidebarOpen: boolean;
}

const Property: React.FC<PropertyComponentProps> = ({ isSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const properties = useSelector((state: RootState) => state.property.properties);
  const status = useSelector((state: RootState) => state.property.status);
  const error = useSelector((state: RootState) => state.property.error);

  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProperties());
    }
  }, [status, dispatch]);

  const handleEditClick = (id: number) => {
    navigate(`/admin/property/${id}`);
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete === null) return;

    // Implement delete functionality here
    console.log('Delete property:', propertyToDelete.id);
    setShowDeleteConfirmation(false);
    setPropertyToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPropertyToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: "propertyName",
      headerName: "Property Name",
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      minWidth: 240,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "country",
      headerName: "Country",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "propertyShare",
      headerName: "Property Share",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 190,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
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
          >
            <DeleteIcon
              sx={{
                color: "#F08486",
              }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div
      className={`${styles.propertiesContainer} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Properties</h1>
        <Button
          className={styles.AddPropertyBtn}
          variant="contained"
          color="primary"
          onClick={() => setIsNewFormOpen(true)}
          sx={{
            backgroundColor: "darkgrey",
            "&:hover": { backgroundColor: "darkgrey" },
          }}
        >
          Add Property
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.dataGridWrapper}>
        <DataGrid
          rows={properties}
          rowHeight={40}
          columnHeaderHeight={40}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          className={`${styles.dataGrid} ${styles.dataGridPadding}`}
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
              textTransform: "uppercase",
              fontFamily: " 'Montserrat', sans-serif !important",
           
            },
            "& .MuiDataGrid-cell": {
              fontFamily: " 'Montserrat', sans-serif !important",
           
            },
          }}
        />
      </div>
      {isNewFormOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsNewFormOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <NewPropertyForm
              onClose={() => setIsNewFormOpen(false)}
              onPropertyAdded={() => dispatch(fetchProperties())}
            />
          </div>
        </div>
      )}
      <ConfirmationModal
        show={showDeleteConfirmation}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this property?"
        confirmLabel="Delete"
        cancelLabel="Cancel" children={undefined}      />
    </div>
  );
};

export default Property;