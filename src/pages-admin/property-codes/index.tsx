import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { fetchPropertyCodes, editPropertyCode, deletePropertyCode } from '@/store/slice/auth/propertycodeSlice';
import styles from './propertycode.module.css';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';
import PropertyCodeCategoryModal from './new-propertycode';

interface PropertyCode {
  id: number;
  propertyCode: string;
  property: {
    id: number;
    propertyName: string;
  };
  propertyCodeCategory: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: number;
  };
  updatedBy: null | {
    id: number;
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const handleEdit = (code: PropertyCode) => {
    setEditingId(code.id);
    setEditValue(code.propertyCode);
  };

  const handleSave = async (code: PropertyCode) => {
    if (editValue !== code.propertyCode) {
      try {
        await dispatch(editPropertyCode({
          id: code.id,
          property: { id: code.property.id },
          propertyCodeCategory: { id: code.propertyCodeCategory.id },
          updatedBy: { id: 1 },
          propertyCode: editValue
        })).unwrap();
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Failed to edit property code:', error);
      }
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (codeId: number) => {
    try {
      await dispatch(deletePropertyCode(codeId)).unwrap();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete property code:', error);
    }
  };

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Paper elevation={3} className={styles.content}>
        <div className={styles.header}>
          <Typography variant="h6" component="h2" className={styles.title}>
            Property Codes
          </Typography>
          <Button
            className={styles.createButton}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCode}
            size="small"
          >
            Create Code
          </Button>
        </div>
        <TableContainer className={styles.tableContainer}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeader}>Category</TableCell>
                <TableCell className={styles.tableHeader}>Code</TableCell>
                <TableCell align="right" className={styles.tableHeader}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id} className={styles.tableRow}>
                  <TableCell>
                    <Chip
                      label={code.propertyCodeCategory.name}
                      size="small"
                      className={styles.categoryChip}
                    />
                  </TableCell>
                  <TableCell>
                    {editingId === code.id ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        size="small"
                        fullWidth
                        variant="outlined"
                        className={styles.editInput}
                      />
                    ) : (
                      code.propertyCode
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingId === code.id ? (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleSave(code)}
                          className={styles.actionButton}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleCancel}
                          className={styles.actionButton}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(code)}
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
                      </>
                    )}
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