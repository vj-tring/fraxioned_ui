import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProperties } from '@/api';
import styles from './property.module.css';

const Property: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                const fetchedProperties = response.data.map((property: any) => ({
                    id: property.id,
                    name: property.propertyName,
                    address: property.address,
                    city: property.city,
                    state: property.state,
                    Property_share: property.propertyShare,
                    country: property.country,
                    created_by: property.createdBy.id,
                    updated_by: property.updatedBy.id,
                }));
                setProperties(fetchedProperties);
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
    }, []);

    const handleEditClick = (id: number) => {
        console.log('Edit clicked for property id:', id);
    };

    const handleDeleteClick = (id: number) => {
        console.log('Delete clicked for property id:', id);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Property Name', minWidth: 180 },
        { field: 'address', headerName: 'Address', minWidth: 200 },
        { field: 'city', headerName: 'City', width: 120 },
        { field: 'state', headerName: 'State', width: 120 },
        { field: 'country', headerName: 'Country', width: 120 },
        { field: 'Property_share', headerName: 'Property Share', width: 140 },
        { field: 'created_by', headerName: 'Created By', width: 120 },
        { field: 'updated_by', headerName: 'Updated By', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
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
        </div>
    );
};

export default Property;
