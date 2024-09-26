import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getProperties, deletePropertyApi, getPropertyById } from "@/api";
import styles from "./property.module.css";
import NewPropertyForm from "./NewPropertyForm";
import ConfirmationModal from "@/components/confirmation-modal";
import { useNavigate } from "react-router-dom";

interface PropertyData {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  Property_share: string;
  country: string;
  created_by: string;
}

const Property: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await getProperties();
      const fetchedProperties = response.data.map((property: any) => ({
        id: property?.id,
        name: property.propertyName,
        address: property.address,
        city: property.city,
        state: property.state,
        Property_share: property.propertyShare,
        country: property.country,
        created_by: property.createdBy.id,
      }));
      setProperties(fetchedProperties);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again.");
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const response = await getPropertyById(id);
      const propertyData = response.data;
      navigate(`/admin/property/${id}`, { state: { propertyData } });
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError("Failed to fetch property details. Please try again.");
    }
  };

  const handleDeleteClick = (property: PropertyData) => {
    setPropertyToDelete(property);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (propertyToDelete === null) return;

    try {
      await deletePropertyApi(propertyToDelete.id);
      await fetchProperties();
      setShowDeleteConfirmation(false);
      setPropertyToDelete(null);
    } catch (err) {
      console.error("Failed to delete property. Please try again.", err);
      setError("Failed to delete property. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setPropertyToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Property Name",
      minWidth: 180,
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
      field: "Property_share",
      headerName: "Property Share",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEditClick(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon />
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
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
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
              onPropertyAdded={fetchProperties}
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
