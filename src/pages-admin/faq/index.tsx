import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Typography,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Edit2, Trash2, Plus } from "lucide-react";
import ConfirmationModal from "@/components/confirmation-modal";
import NewQuestionForm from "../faq-add/faq-new";
import CustomizedSnackbars from "@/components/customized-snackbar";
import EditQuestionForm from "../faq-add/faq-edit";
import styles from "./faq.module.css";
import {
  fetchFaqAsync,
  updateFaq,
  UpdateFaqPayload,
  deleteFaqAsync,
} from "@/store/slice/auth/faqpageSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { deleteCategoryAsync, editCategoryAsync, fetchCategories } from "@/store/slice/auth/addcategorySlice";

interface FaqCategory {
  id: number;
  name: string;
}

interface FaqQuestion {
  category: FaqCategory;
  id: number;
  question: string;
  answer: string;
}

const FAQPage: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const questions = useSelector((state: RootState) => state.faqPage.faqs);
  const categories = useSelector((state: RootState) => state.addCategory.data);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null); 
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<FaqQuestion | null>(
    null
  );
  const [showNewQuestionForm, setShowNewQuestionForm] =
    useState<boolean>(false);
  const [showEditQuestionForm, setShowEditQuestionForm] =
    useState<boolean>(false);
  const [questionToEdit, setQuestionToEdit] = useState<FaqQuestion | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFaqAsync());
  }, [dispatch]);

  const handleDeleteClick = (question: FaqQuestion) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (questionToDelete) {
      await dispatch(deleteFaqAsync(questionToDelete.id));
      setSnackbar({
        open: true,
        message: "Deleted successfully",
        severity: "success",
      });
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  const handleAddQuestionClick = () => {
    setShowNewQuestionForm(true);
  };

  const handleEditClick = (question: FaqQuestion) => {
    setQuestionToEdit(question);
    setShowEditQuestionForm(true);
  };

  const handleQuestionUpdated = (updatedQuestion: FaqQuestion) => {
    const updateData: UpdateFaqPayload = {
      id: updatedQuestion.id,
      updateData: {
        question: updatedQuestion.question,
        answer: updatedQuestion.answer,
        updatedBy: {
          id: 1,
        },
        categoryId: updatedQuestion.category.id,
      },
    };

    dispatch(updateFaq(updateData));

    setSnackbar({
      open: true,
      message: "Updated successfully",
      severity: "success",
    });

    setShowEditQuestionForm(false);
    setQuestionToEdit(null);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditCategory = (category: FaqCategory) => {
    const newCategoryName = prompt(`Edit category name for ${category.name}:`, category.name);
    
    if (newCategoryName && newCategoryName !== category.name) {
      dispatch(editCategoryAsync({ id: category.id, categoryName: newCategoryName }));
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success',
      });
    }
  };
  
  const handleDeleteCategory = async (category: FaqCategory) => {
    await dispatch(deleteCategoryAsync(category.id));
    setSnackbar({
      open: true,
      message: `Category  deleted successfully`,
      severity: 'success',
    });
  };
  
  const handleEditCategoryClick = (category: FaqCategory) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name); // Pre-fill with the existing category name
  };

  const handleCategoryNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditCategoryName(event.target.value); // Update the category name as the user types
  };

  const handleCategoryNameUpdate = async (category: FaqCategory) => {
    if (editCategoryName.trim() && editCategoryName !== category.name) {
      await dispatch(editCategoryAsync({ id: category.id, categoryName: editCategoryName.trim() }));
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success',
      });
    }
    setEditCategoryId(null); // Exit edit mode
  };

  const handleCategoryNameKeyDown = (event: React.KeyboardEvent, category: FaqCategory) => {
    if (event.key === 'Enter') {
      handleCategoryNameUpdate(category); // Save on Enter key press
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <div className={styles.actions}>
          <Tooltip title="Add New" arrow>
            <button
              className={styles.addButton}
              onClick={handleAddQuestionClick}
            >
              <Plus size={20} />
              <span className={styles.buttonText}>New FAQ</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {showNewQuestionForm && (
        <NewQuestionForm
          onClose={() => setShowNewQuestionForm(false)}
          onQuestionAdded={() => {
            setSnackbar({
              open: true,
              message: "Added successfully",
              severity: "success",
            });
            setShowNewQuestionForm(false);
          }}
          categories={categories}
        />
      )}

      {showEditQuestionForm && questionToEdit && (
        <EditQuestionForm
          open={showEditQuestionForm}
          question={questionToEdit}
          onClose={() => setShowEditQuestionForm(false)}
          onQuestionUpdated={handleQuestionUpdated}
        />
      )}

      <div className={styles.content}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            {!categories ? (
              <CircularProgress />
            ) : (
              <List component="nav">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <ListItem
                      key={category.id}
                      button
                      selected={category.id === selectedCategory}
                      onClick={() => setSelectedCategory(category.id)}
                      className={styles.categoryItem}
                    >
                      <ListItemText primary={category.categoryName} />
                      <div className={styles.iconContainer}>
                        <Tooltip title="Edit Category" arrow>
                          <button
                            className={styles.editIcon}
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit2 size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete Category" arrow>
                          <button
                            className={styles.deleteIcon}
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">
                    No categories available
                  </Typography>
                )}
              </List>
            )}
          </Grid>

          {/* Questions Section */}
          <Grid item xs={12} sm={8}>
            {loadingQuestions ? (
              <CircularProgress />
            ) : (
              <>
                {questions !== undefined && questions.length > 0
                  ? questions
                      .filter(
                        (ques) =>
                          ques.category && ques.category.id === selectedCategory
                      )
                      .map((question) => (
                        <Grid
                          item
                          key={question.id}
                          xs={12}
                          className={`${styles.faqItem} ${
                            question.isNew ? styles.newQuestion : ""
                          }`}
                        >
                          <Typography
                            fontSize="h8"
                            fontWeight={600}
                            marginTop={"6px"}
                            marginBottom={"5px"}
                          >
                            {question.question}
                          </Typography>
                          <Typography variant="body2" marginLeft={"15px"}>
                            {question.answer}
                          </Typography>
                          <div className={styles.actionButtons}>
                            <Tooltip title="Edit" arrow>
                              <button
                                onClick={() => handleEditClick(question)}
                                className={styles.editButton}
                              >
                                <Edit2 size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <button
                                onClick={() => handleDeleteClick(question)}
                                className={styles.deleteButton}
                              >
                                <Trash2 size={16} />
                              </button>
                            </Tooltip>
                          </div>
                        </Grid>
                      ))
                  : selectedCategory && (
                      <Typography variant="body1">
                        No questions found for this category.
                      </Typography>
                    )}
              </>
            )}
          </Grid>
        </Grid>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message={`Are you sure you want to delete the question?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Snackbar for notifications */}
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default FAQPage;


