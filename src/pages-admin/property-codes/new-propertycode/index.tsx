import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Plus, Save, X } from 'lucide-react';
import styles from './newpropertycode.module.css';

interface PropertyCodeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PropertyCodeCategoryModal: React.FC<PropertyCodeCategoryModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [propertyCode, setPropertyCode] = useState('');

  const handleAddNew = () => {
    setShowNewCategory(true);
  };

  const handleSaveNewCategory = () => {
    setShowNewCategory(false);
    setCategory(newCategory);
    setNewCategory('');
  };

  const handleCancelNewCategory = () => {
    setShowNewCategory(false);
    setNewCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { category, propertyCode });
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modal}>
        <Typography variant="h6" component="h2" className={styles.modalTitle}>
          Add New Amenity
        </Typography>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Box className={styles.dropdownContainer}>
            <FormControl className={styles.formControl}>
              <InputLabel id="category-label">Amenity Group*</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
              >
                <MenuItem value="">Select Amenity Group</MenuItem>
                <MenuItem value="bathroom">Bathroom</MenuItem>
                <MenuItem value="bedroom">Bedroom</MenuItem>
                <MenuItem value="kitchen">Kitchen</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={<Plus size={16} />}
              onClick={handleAddNew}
              className={styles.addNewBtn}
            >
              Add New
            </Button>
          </Box>
          {showNewCategory && (
            <Box className={styles.newCategoryContainer}>
              <TextField
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new amenity group"
                className={styles.input}
              />
              <Button
                onClick={handleSaveNewCategory}
                className={styles.iconButton}
              >
                <Save size={20} />
              </Button>
              <Button
                onClick={handleCancelNewCategory}
                className={styles.iconButton}
              >
                <X size={20} />
              </Button>
            </Box>
          )}
          <TextField
            fullWidth
            label="Amenity Name*"
            value={propertyCode}
            onChange={(e) => setPropertyCode(e.target.value)}
            className={styles.input}
          />
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={3}
            className={styles.input}
          />
          <div className={styles.buttonGroup}>
            <Button onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" className={styles.submitBtn}>
              Add Amenity
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PropertyCodeCategoryModal;