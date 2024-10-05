import React, { useState } from 'react';
import { Select, MenuItem, InputBase, Box, Button, Paper } from '@mui/material';
import styles from './filter.module.css'

interface Column {
    field: string;
    headerName: string;
}

interface InlineFilterProps {
    columns: Column[];
    onFilter: (field: string, operator: string, value: string) => void;
    onClose: () => void;
}

const InlineFilter: React.FC<InlineFilterProps> = ({ columns, onFilter, onClose }) => {
    const [field, setField] = useState('');
    const [operator, setOperator] = useState('contains');
    const [value, setValue] = useState('');

    const handleApplyFilter = () => {
        if (field && operator && value) {
            onFilter(field, operator, value);
            onClose();
        }
    };

    return (
        <Paper elevation={3} className={styles.filterContainer} sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            p: 2,
            zIndex: 1000,
            width: '300px',
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Select
                    value={field}
                    onChange={(e) => setField(e.target.value as string)}
                    displayEmpty
                    fullWidth
                    size="small"
                    className={styles.selectField}
                >
                    <MenuItem value="" disabled>Select Column</MenuItem>
                    {columns.map((col) => (
                        <MenuItem key={col.field} value={col.field}>{col.headerName}</MenuItem>
                    ))}
                </Select>
                <Select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as string)}
                    fullWidth
                    size="small"
                    className={styles.selectField}
                >
                    <MenuItem value="contains">contains</MenuItem>
                    <MenuItem value="equals">equals</MenuItem>
                    <MenuItem value="startsWith">starts with</MenuItem>
                    <MenuItem value="endsWith">ends with</MenuItem>
                </Select>
                <InputBase
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Filter value"
                    fullWidth
                    className={styles.inputField}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onClose}
                        className={`${styles.button} ${styles.cancelButton}`}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleApplyFilter}
                        className={`${styles.button} ${styles.applyButton}`}
                    >
                        Apply Filter
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default InlineFilter;