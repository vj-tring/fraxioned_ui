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
import {
  deleteCategoryAsync,
  editCategoryAsync,
  fetchCategories,
} from "@/store/slice/auth/addcategorySlice";
import Loader from "@/components/loader";

interface FaqCategory {
  id: number;
  categoryName: string;
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
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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
  const [questionToDelete, setQuestionToDelete] = useState<FaqQuestion | null>(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState<boolean>(false);
  const [showEditQuestionForm, setShowEditQuestionForm] = useState<boolean>(false);
  const [questionToEdit, setQuestionToEdit] = useState<FaqQuestion | null>(null);
  const [categoryName, setCategoryName] = useState("");

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
      await dispatch(fetchFaqAsync()); // Refresh FAQs
    }
  };

  const handleAddQuestionClick = () => {
    setShowNewQuestionForm(true);
  };

  const handleEditClick = (question: FaqQuestion) => {
    setQuestionToEdit(question);
    setShowEditQuestionForm(true);
  };

  const handleQuestionUpdated = async (updatedQuestion: FaqQuestion) => {
    setLoading(true); // Start loading

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

    await dispatch(updateFaq(updateData)); // Wait for the update to finish

    setSnackbar({
      open: true,
      message: "Updated successfully",
      severity: "success",
    });

    await dispatch(fetchFaqAsync()); // Refetch FAQs
    setLoading(false); // Stop loading
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

  const handleSaveCategory = async () => {
    if (selectedCategory && categoryName.trim() !== "") {
      const id: number = selectedCategory;
      const payload = {
        categoryName,
        updatedBy: { id: 1 },
      };
      const res = await dispatch(editCategoryAsync({ id, payload })).unwrap();
      if (res.success === true) {
        setSnackbar({
          open: true,
          message: `Category Updated successfully`,
          severity: "success",
        });
        dispatch(fetchCategories());
        setIsEdit(false);
      } else {
        setSnackbar({
          open: true,
          message: `Category not Updated`,
          severity: "error",
        });
      }
    }
  };

  const handleDeleteCategory = async (category: FaqCategory) => {
    setIsEdit(false);
    const res = await dispatch(deleteCategoryAsync(category.id)).unwrap();
    if (res.success === true) {
      setSnackbar({
        open: true,
        message: `Category Deleted successfully`,
        severity: "success",
      });
      dispatch(fetchCategories());
    } else {
      setSnackbar({
        open: true,
        message: `This category contains FAQ, So you cannot delete.`,
        severity: "error",
      });
    }
  };

  if (loading) return <Loader />; // Loader when saving data

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
          onQuestionAdded={async () => {
            setLoading(true); // Start loading
            await dispatch(fetchFaqAsync()); // Refresh FAQs
            setSnackbar({
              open: true,
              message: "Added successfully",
              severity: "success",
            });
            setShowNewQuestionForm(false);
            setLoading(false); // Stop loading
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
                  categories.map((category: any) => (
                    <ListItem
                      key={category.id}
                      button
                      selected={category.id === selectedCategory}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCategoryName(category.categoryName);
                      }}
                      className={styles.categoryItem}
                    >
                      {isEdit && selectedCategory === category.id ? (
                        <>
                          <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                          />
                          <button onClick={handleSaveCategory}>Save</button>
                        </>
                      ) : (
                        <ListItemText primary={category.categoryName} />
                      )}

                      <div className={styles.iconContainer}>
                        <Tooltip title="Edit" arrow>
                          <button
                            className={styles.editIcon}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setCategoryName(category.categoryName);
                              setIsEdit(true);
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
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
                  <Typography variant="body1">No categories available</Typography>
                )}
              </List>
            )}
          </Grid>

          <Grid item xs={12} sm={8}>
            {questions !== undefined && questions.length > 0 ? (
              questions
                .filter(
                  (ques: any) =>
                    ques.category && ques.category.id === selectedCategory
                )
                .map((question: any) => (
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
            ) : selectedCategory ? (
              <Typography variant="body1">
                No questions found for this category.
              </Typography>
            ) : null}
          </Grid>
        </Grid>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message={`Are you sure you want to delete the question?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

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
