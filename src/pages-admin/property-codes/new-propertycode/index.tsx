import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Plus, Save, X } from 'lucide-react';
import { fetchPropertyCodeCategories, createPropertyCodeCategory } from '@/store/slice/auth/propertycodeCatogorySlice';
import { createPropertyCode } from '@/store/slice/auth/propertycodeSlice';
import styles from './newpropertycode.module.css';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

interface PropertyCodeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
}

const PropertyCodeCategoryModal: React.FC<PropertyCodeCategoryModalProps> = ({ isOpen, onClose, propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const propertyCodeCategories = useSelector((state: RootState) => state.propertycodecatogory.propertyCodeCategories);
  const status = useSelector((state: RootState) => state.propertycodecatogory.status);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const [category, setCategory] = useState<number | ''>('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [propertyCode, setPropertyCode] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPropertyCodeCategories());
    }
  }, [status, dispatch]);

  const handleAddNew = () => {
    setShowNewCategory(true);
  };

  const handleSaveNewCategory = async () => {
    if (newCategory.trim() && currentUserId) {
      try {
        await dispatch(createPropertyCodeCategory({
          name: newCategory.trim(),
          createdBy: { id: currentUserId },
        })).unwrap();
        await dispatch(fetchPropertyCodeCategories()).unwrap();
        setShowNewCategory(false);
        setCategory(propertyCodeCategories[propertyCodeCategories.length - 1]?.id || '');
        setNewCategory('');
      } catch (error) {
        console.error('Failed to create new category:', error);
      }
    }
  };

  const handleCancelNewCategory = () => {
    setShowNewCategory(false);
    setNewCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category && propertyCode && currentUserId) {
      try {
        await dispatch(createPropertyCode({
          property: { id: propertyId },
          propertyCodeCategory: { id: category as number },
          createdBy: { id: currentUserId },
          propertyCode: propertyCode
        })).unwrap();
        setCategory('');
        setPropertyCode('');
        onClose();
      } catch (error) {
        console.error('Failed to create new property code:', error);
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className={styles.modalWrapper}>
      <Box className={styles.modalContent}>
        <Typography variant="h6" component="h2" className={styles.modalTitle}>
          Add New Property Code
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="propertyCategory" className={styles.inputLabel}>Property Category*</label>
            <div className={styles.selectWrapper}>
              <select
                id="propertyCategory"
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
                className={styles.select}
              >
                <option value="">Select property category</option>
                {propertyCodeCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Button
                startIcon={<Plus size={16} />}
                onClick={handleAddNew}
                className={styles.addNewBtn}
              >
                ADD NEW
              </Button>
            </div>
          </div>
          {showNewCategory && (
            <div className={styles.newCategoryContainer}>
              <TextField
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new amenity group"
                className={styles.newCategoryInput}
              />
              <IconButton onClick={handleSaveNewCategory} className={styles.iconButton}>
                <Save size={20} />
              </IconButton>
              <IconButton onClick={handleCancelNewCategory} className={styles.iconButton}>
                <X size={20} />
              </IconButton>
            </div>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="propertyCode" className={styles.inputLabel}>Property code*</label>
            <TextField
              id="propertyCode"
              fullWidth
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value)}
              className={styles.propertyCodeInput}
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={onClose} className={styles.cancelBtn}>
              CANCEL
            </Button>
            <Button type="submit" variant="contained" className={styles.submitBtn}>
              ADD
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PropertyCodeCategoryModal;