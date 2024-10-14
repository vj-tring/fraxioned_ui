import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPropertyCodes } from '@/store/slice/auth/propertycodeSlice';
import styles from './propertycode.module.css';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';
import PropertyCodeCategoryModal from './new-propertycode';

interface PropertyCode {
  id: number;
  propertyCode: string;
  property: {
    id: number;
  };
  propertyCodeCategory: {
    name: string;
  };
}

const PropertyCode: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: propertyId } = useParams<{ id: string }>();
  const propertyCodes = useSelector((state: RootState) => state.propertycode.propertyCodes);
  const status = useSelector((state: RootState) => state.propertycode.status);
  const [filteredCodes, setFilteredCodes] = useState<PropertyCode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    dispatch(fetchPropertyCodes());
  }, [dispatch, refreshTrigger]);

  useEffect(() => {
    if (propertyCodes.length > 0 && propertyId) {
      const filtered = propertyCodes.filter((code): code is PropertyCode =>
        code &&
        typeof code === 'object' &&
        'property' in code &&
        code.property &&
        typeof code.property === 'object' &&
        'id' in code.property &&
        typeof code.property.id === 'number' &&
        code.property.id === parseInt(propertyId)
      );
      setFilteredCodes(filtered);
    }
  }, [propertyCodes, propertyId]);

  const handleCreateCode = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };
  const handleEdit = (codeId: number) => console.log('Edit code', codeId);
  const handleDelete = (codeId: number) => console.log('Delete code', codeId);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.content}>
        <div className={styles.header}>
          <Typography variant="h6" component="h2">Property Codes</Typography>
          <Button
            className={styles.addbutton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateCode}
            size="small"
          >
            Create Code
          </Button>
        </div>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Code</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <Chip
                      label={code.propertyCodeCategory.name}
                      size="small"
                      className={styles.categoryChip}
                    />
                  </TableCell>
                  <TableCell>{code.propertyCode}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(code.id)}
                      className={styles.actionButton}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(code.id)}
                      className={styles.actionButton}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {propertyId && (
        <PropertyCodeCategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          propertyId={parseInt(propertyId)}
        />
      )}
    </div>
  );
};

export default PropertyCode;