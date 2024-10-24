import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./property.module.css";
import NewPropertyForm from "./NewPropertyForm";
import ConfirmationModal from "@/components/confirmation-modal";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "@/store/slice/property/action";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import { Property as PropertyType } from "@/store/model/properties.types";

interface PropertyComponentProps {
  isSidebarOpen: boolean;
}

const Property: React.FC<PropertyComponentProps> = ({ isSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { properties, status, error } = useSelector((state: RootState) => state.property);
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyType | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProperties());
    }
  }, [status, dispatch]);

  const handleEditClick = (id: number) => {
    navigate(`/admin/property/${id}`);
  };

  const handleDeleteClick = (property: PropertyType) => {
    setPropertyToDelete(property);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (propertyToDelete === null) return;

    // Implement delete functionality here
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
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "propertyShare",
      headerName: "Property Share",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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
        <h1 className={styles.title}>Properties Details</h1>
        <Button
          className={styles.AddPropertyBtn}
          variant="contained"
          color="primary"
          onClick={() => setIsNewFormOpen(true)}
          sx={{
            backgroundColor: "#00b8cc",
            "&:hover": { backgroundColor: "#00b8cc" },
          }}
        >
          Add Property
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.dataGridWrapper}>
        <DataGrid
          rows={properties}
          columns={columns}
          rowHeight={40}
          columnHeaderHeight={40}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "grey",
              color: "white",
              fontSize: "small",
              textTransform: "uppercase",
              fontFamily: "'Roboto', sans-serif !important",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "small",
              fontFamily: "'Roboto', sans-serif !important",
            },
          }}
          getRowClassName={(params) => {
            return params.indexRelativeToCurrentPage % 2 === 0
              ? styles.evenRow
              : styles.oddRow;
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          className={`${styles.dataGrid} ${styles.dataGridPadding}`}
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
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default Property;