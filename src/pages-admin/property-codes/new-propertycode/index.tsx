import React, { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import styles from './newpropertycode.module.css';

const PropertyCodeCatogory: React.FC = () => {
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

  const handleDeleteNewCategory = () => {
    setShowNewCategory(false);
    setNewCategory('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { category, propertyCode });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>Property Category</label>
        <div className={styles.categoryContainer}>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a category</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
          <button type="button" onClick={handleAddNew} className={styles.addNewBtn}>
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>
      
      {showNewCategory && (
        <div className={styles.newCategoryContainer}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className={styles.input}
          />
          <button type="button" onClick={handleSaveNewCategory} className={styles.iconBtn}>
            <Save size={16} />
          </button>
          <button type="button" onClick={handleDeleteNewCategory} className={styles.iconBtn}>
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="propertyCode" className={styles.label}>Property Code</label>
        <input
          type="text"
          id="propertyCode"
          value={propertyCode}
          onChange={(e) => setPropertyCode(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitBtn}>Add</button>
        <button type="button" className={styles.cancelBtn}>Cancel</button>
      </div>
    </form>
  );
};

export default PropertyCodeCatogory;