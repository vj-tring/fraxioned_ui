import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchHolidaysApi, propertyseasonholiday, propertyseasonholidaydelete } from '@/api';
import styles from './holiday.module.css';
import NewForm from '@/pages-admin/grid/holiday-grid/new-form';
import EditForm from '@/pages-admin/grid/holiday-grid/edit-form';
import PropertyImage from '@/pages-admin/property-image';
import { Dialog, DialogContent, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '@/components/confirmation-modal';

interface Holiday {
    id: number;
    name: string;
    year: number;
    start_date: string;
    end_date: string;

    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string | null;
    propertyId: number;
    propertySeasonHolidayId: number;
}

const Holidays: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openNewForm, setOpenNewForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | string>('all');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


    const fetchHolidays = useCallback(async (propertyId: number | string = 'all') => {
        try {
            let response;
            if (propertyId === 'all') {
                response = await fetchHolidaysApi();
            } else {
                response = await propertyseasonholiday();
            }

            const mappedData = response.data.data.map((item: any) => {
                const holiday = item.holiday || item;
                return {
                    id: holiday.id,
                    name: holiday.name,
                    year: holiday.year,
                    start_date: holiday.startDate,
                    end_date: holiday.endDate,
                    created_at: holiday.createdAt,
                    updated_at: holiday.updatedAt,
                    created_by: holiday.createdBy ? holiday.createdBy.id : 'N/A',
                    updated_by: holiday.updatedBy ? holiday.updatedBy.id : 'N/A',
                    propertyId: item.property ? item.property.id : item.propertyId,
                    propertySeasonHolidayId: item.id,
                };
            });

            setHolidays(mappedData);
            setFilteredHolidays(propertyId === 'all' ? mappedData : mappedData.filter((h: { propertyId: string | number; }) => h.propertyId === propertyId));
        } catch (err) {
            console.error('Error fetching holidays:', err);
            setError('Failed to fetch holidays. Please try again.');
        }
    }, []);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    const handleHolidayAdded = () => {
        fetchHolidays(selectedPropertyId);
    };

    const handleEditClick = (id: number) => {
        const holidayToEdit = holidays.find(holiday => holiday.id === id);
        if (holidayToEdit) {
            setSelectedHoliday(holidayToEdit);
            setOpenEditForm(true);
        }
    };



    const handleDeleteClick = (holiday: Holiday) => {
        setHolidayToDelete(holiday);
        setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        if (holidayToDelete === null) return;

        try {
            await propertyseasonholidaydelete(holidayToDelete.propertySeasonHolidayId);
            await fetchHolidays(selectedPropertyId);
            setShowDeleteConfirmation(false);
            setHolidayToDelete(null);
        } catch (err) {
            console.error('Error deleting holiday:', err);
            setError('Failed to delete holiday. Please try again.');
        }
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
        setSelectedHoliday(null);
    };

    const handlePropertySelect = (propertyId: number | string) => {
        setSelectedPropertyId(propertyId);
        fetchHolidays(propertyId);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setHolidayToDelete(null);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', minWidth: 150, align: 'center', headerAlign: 'center' },
        { field: 'year', headerName: 'Year', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'start_date', headerName: 'Start Date', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'end_date', headerName: 'End Date', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'created_at', headerName: 'Created At', width: 150, align: 'center', headerAlign: 'center' },
        { field: 'updated_at', headerName: 'Updated At', width: 170, align: 'center', headerAlign: 'center' },
        { field: 'created_by', headerName: 'Created By', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'updated_by', headerName: 'Updated By', width: 120, align: 'center', headerAlign: 'center' },
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
                        onClick={() => handleDeleteClick(params.row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div className={`${styles.holidaysContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Holidays</h1>
                <Button variant="contained" color="primary" onClick={() => setOpenNewForm(true)} sx={{ backgroundColor: '#00b8cc', '&:hover': { backgroundColor: '#00b8cc' } }}>
                    Add Holiday
                </Button>
            </div>
            <PropertyImage onPropertySelect={handlePropertySelect} selectedPropertyId={selectedPropertyId} />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.dataGridWrapper}>
                <DataGrid
                    rows={filteredHolidays}
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

            <Dialog open={openNewForm} onClose={() => setOpenNewForm(false)}>
                <DialogContent sx={{ padding: 0 }}>
                    <NewForm onClose={() => setOpenNewForm(false)} onHolidayAdded={handleHolidayAdded} />
                </DialogContent>
            </Dialog>

            <Dialog open={openEditForm} onClose={handleCloseEditForm}>
                <DialogContent sx={{ padding: 0 }}>
                    {selectedHoliday && (
                        <EditForm
                            onClose={handleCloseEditForm}
                            onHolidayUpdated={handleHolidayAdded}
                            holidayData={{
                                id: selectedHoliday.id,
                                name: selectedHoliday.name,
                                year: selectedHoliday.year,
                                startDate: selectedHoliday.start_date,
                                endDate: selectedHoliday.end_date,
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmationModal
                show={showDeleteConfirmation}
                onHide={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this holiday?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default Holidays;