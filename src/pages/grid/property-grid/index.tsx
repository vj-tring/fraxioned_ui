import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProperties } from '@/api';
import styles from './property.module.css';
import NewPropertyForm from './NewPropertyForm';

const Property: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [properties, setProperties] = useState([]);
    const [isNewFormOpen, setIsNewFormOpen] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await getProperties();
            console.log(response
            )
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
            console.log(properties);
        } catch (err) {
            console.error('Error fetching properties:', err);
        }
    };

    const handleEditClick = (id: number) => {
        console.log('Edit clicked for property id:', id);
    };

    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for property id:', id);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Property Name', minWidth: 180, align: 'center', headerAlign: 'center' },
        { field: 'address', headerName: 'Address', minWidth: 220, align: 'center', headerAlign: 'center' },
        { field: 'city', headerName: 'City', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'state', headerName: 'State', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'country', headerName: 'Country', width: 140, align: 'center', headerAlign: 'center' },
        { field: 'Property_share', headerName: 'Property Share', width: 140, align: 'center', headerAlign: 'center' },
        { field: 'created_by', headerName: 'Created By', width: 130, align: 'center', headerAlign: 'center' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            align: 'center',
            headerAlign: 'center',
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
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div className={`${styles.propertiesContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Properties</h1>
                <Button variant="contained" color="primary" onClick={() => setIsNewFormOpen(true)}>
                    Add Property
                </Button>
            </div>
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
                <div className={styles.modalOverlay} onClick={() => setIsNewFormOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <NewPropertyForm
                            onClose={() => setIsNewFormOpen(false)}
                            onPropertyAdded={fetchProperties}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Property;


