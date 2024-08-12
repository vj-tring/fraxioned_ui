import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchHolidaysApi } from 'utils/api';
import styles from './Holiday.module.css';
import NewForm from 'Components/NewForm/Newform';
import PropertyImage from 'Components/PropertyImage/PropertyImage';
import { Dialog, DialogContent, Button } from '@mui/material';

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
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'end_date', headerName: 'End Date', width: 120 },
    { field: 'created_at', headerName: 'Created At', width: 180 },
    { field: 'updated_at', headerName: 'Updated At', width: 180 },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    { field: 'updated_by', headerName: 'Updated By', width: 120 },
];

const Holidays: React.FC = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleClose = () => {
        setOpenForm(false);
    };

    useEffect(() => {
        const getHolidays = async () => {
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
                }));
                setHolidays(mappedData);
                console.log(mappedData);
            } catch (err) {
                console.error('Error fetching holidays:', err);
                setError('Failed to fetch holidays. Please try again.');
            }
        };

        getHolidays();
    }, []);

    return (
        <div className={styles.holidaysContainer}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Holidays</h1>
                <Button variant="contained" color="primary" onClick={handleOpenForm}>
                    Add Holiday
                </Button>
            </div>
            <PropertyImage />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.dataGridWrapper}>
                <DataGrid
                    rows={holidays}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    className={styles.dataGrid}
                />
            </div>

            <Dialog open={openForm} onClose={handleClose}>
                <DialogContent sx={{ padding: 0 }}>
                    <NewForm onClose={handleClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Holidays;
