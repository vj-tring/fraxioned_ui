import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Grid, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPropertyCodes } from '@/store/slice/auth/propertycodeSlice';
import styles from './propertycode.module.css';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';
import PropertyCodeCategoryModal from './new-propertycode';

const PropertyCode: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: propertyId } = useParams<{ id: string }>();
  const propertyCodes = useSelector((state: RootState) => state.propertycode.propertyCodes);
  const status = useSelector((state: RootState) => state.propertycode.status);
  const [filteredCodes, setFilteredCodes] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPropertyCodes() as any);
  }, [dispatch]);

  useEffect(() => {
    if (propertyCodes.length > 0 && propertyId) {
      const filtered = propertyCodes.filter(code => code.property.id === parseInt(propertyId));
      setFilteredCodes(filtered);
    }
  }, [propertyCodes, propertyId]);

  const handleCreateCode = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (codeId: number) => {
    console.log('Edit code', codeId);
  };

  const handleDelete = (codeId: number) => {
    console.log('Delete code', codeId);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2">Property Codes</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateCode}>
          Create Code
        </Button>
      </div>
      <Paper className={styles.gridContainer}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1" className={styles.columnHeader}>
              Property Code Category
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" className={styles.columnHeader}>
              Property Code
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" className={styles.columnHeader}>
              Actions
            </Typography>
          </Grid>
          {filteredCodes.map((code) => (
            <React.Fragment key={code.id}>
              <Grid item xs={4}>
                <Typography>{code.propertyCodeCategory.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{code.propertyCode}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(code.id)}
                  className={styles.actionButton}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(code.id)}
                  className={styles.actionButton}
                >
                  Delete
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
      <PropertyCodeCategoryModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default PropertyCode;