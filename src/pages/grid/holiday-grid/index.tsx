import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchHolidaysApi, deleteHolidayApi } from '@/api';
import styles from './holiday.module.css';
import NewForm from '@/pages/grid/new-form';
import EditForm from '@/pages/grid/edit-form';
import PropertyImage from '@/pages/property-image';
import { Dialog, DialogContent, Button, IconButton, DialogTitle, DialogContentText, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
}

const Holidays: React.FC = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openNewForm, setOpenNewForm] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [holidayToDelete, setHolidayToDelete] = useState<number | null>(null);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | string>('all');

    const fetchHolidays = useCallback(async () => {
        try {
            const response = await fetchHolidaysApi();
            const mappedData = response.data.data.map((holiday: any) => ({
                id: holiday.id,
                name: holiday.name,
                year: holiday.year,
                start_date: holiday.startDate,
                end_date: holiday.endDate,
                created_at: holiday.createdAt,
                updated_at: holiday.updatedAt,
                created_by: holiday.createdBy ? holiday.createdBy.id : 'N/A',
                updated_by: holiday.updatedBy ? holiday.updatedBy.id : 'N/A',
                propertyId: holiday.propertyId,
            }));
            setHolidays(mappedData);
            setFilteredHolidays(mappedData);
        } catch (err) {
            console.error('Error fetching holidays:', err);
            setError('Failed to fetch holidays. Please try again.');
        }
    }, []);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    const handleHolidayAdded = () => {
        fetchHolidays();
    };

    const handleEditClick = (id: number) => {
        const holidayToEdit = holidays.find(holiday => holiday.id === id);
        if (holidayToEdit) {
            setSelectedHoliday(holidayToEdit);
            setOpenEditForm(true);
        }
    };

    const handleDeleteClick = (id: number) => {
        setHolidayToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (holidayToDelete === null) return;

        try {
            await deleteHolidayApi(holidayToDelete);
            await fetchHolidays();
            setOpenDeleteDialog(false);
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
        if (propertyId === 'all') {
            setFilteredHolidays(holidays);
        } else {
            const filtered = holidays.filter(holiday => holiday.propertyId === propertyId);
            setFilteredHolidays(filtered);
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', minWidth: 100 },
        { field: 'year', headerName: 'Year', width: 120 },
        { field: 'start_date', headerName: 'Start Date', width: 120 },
        { field: 'end_date', headerName: 'End Date', width: 130 },
        { field: 'created_at', headerName: 'Created At', width: 130 },
        { field: 'updated_at', headerName: 'Updated At', width: 150 },
        { field: 'created_by', headerName: 'Created By', width: 100 },
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
        <div className={styles.holidaysContainer}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Holidays</h1>
                <Button variant="contained" color="primary" onClick={() => setOpenNewForm(true)}>
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
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    className={styles.dataGrid}
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

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this holiday?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Holidays;
