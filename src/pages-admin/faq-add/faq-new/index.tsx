import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader";
import { AiOutlineClose, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import {
  addQuestion,
  resetAddQuestionState,
} from "@/store/slice/auth/addfaqSlice";
import { addCategoryName, fetchCategories } from "@/store/slice/auth/addcategorySlice";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import styles from "./faqnew.module.css";

interface NewQuestionFormProps {
  onClose: () => void;
  onQuestionAdded: () => void;
  categories: {
      categoryName: string; id: number; name: string 
}[];
}

const NewQuestionForm: React.FC<NewQuestionFormProps> = ({
  onClose,
  onQuestionAdded,
  categories: initialCategories,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading: addQuestionLoading,
    error: addQuestionError,
    success: addQuestionSuccess,
  } = useSelector((state: RootState) => state.addQuestion);

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [error, setError] = useState("");

  // Initialize tempCategories based on initialCategories
//   const [tempCategories, setTempCategories] =
//     useState<{ id: number; name: string }[]>(initialCategories);

  useEffect(() => {
    if (addQuestionSuccess) {
      onClose();
      dispatch(resetAddQuestionState());
    }
  }, [addQuestionSuccess, onClose, dispatch]);

  useEffect(() => {
    if (addQuestionError) {
      setError(addQuestionError);
    }
  }, [addQuestionError]);

  const handleAddCustomCategory = async () => {
    if (customCategory) {
      const data = {
        createdBy: { id: 1 },
        categoryName: customCategory,
      };

      const resultAction = await dispatch(addCategoryName(data));
      if (addCategoryName.fulfilled.match(resultAction)) {
        // const newCategoryId = resultAction.payload.id; // Assuming the API returns the new category's ID
        // const newCategory = { id: newCategoryId, name: customCategory };

        // // Update the tempCategories state with the newly added category
        // // setTempCategories((prevCategories) => [...prevCategories, newCategory]);

        // // Set newly added category as selected
        // setSelectedCategory(newCategoryId);
        // setCustomCategory(""); // Clear the input
        setShowCustomCategoryInput(false); // Hide the custom category input
        console.log("temp")
        dispatch(fetchCategories())
      } else {
        setError("Failed to add category.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (customCategory) {
      await handleAddCustomCategory();
    }

    if (!selectedCategory || !questionText || !answerText) {
      setError("Category, Question, and Answer are required.");
      return;
    }

    const data = {
      categoryId: selectedCategory,
      question: questionText,
      answer: answerText,
      createdBy: { id: 1 }, 
    };

    console.log("Submitting question data:", data);
    await dispatch(addQuestion(data));
    onQuestionAdded();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        {addQuestionLoading && (
          <div className={styles.loaderOverlay}>
            <Loader />
          </div>
        )}
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Add New Question</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <AiOutlineClose />
          </button>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="categorySelect" className={styles.label}>
              Select Category*
            </label>
            <div className={styles.amenityTypeContainer}>
              <select
                id="categorySelect"
                value={selectedCategory || ""}
                onChange={(e) =>
                  setSelectedCategory(Number(e.target.value) || null)
                }
                className={styles.selectInput}
                required
              >
                <option value="">Select Category</option>
                {initialCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {!showCustomCategoryInput && (
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => setShowCustomCategoryInput(true)}
                >
                  <AiOutlinePlus /> Add New
                </button>
              )}
            </div>
            {showCustomCategoryInput && (
              <div className={styles.customCategoryContainer}>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category"
                  className={styles.customCategoryInput}
                />
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={handleAddCustomCategory}
                >
                  <AiOutlineSave />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowCustomCategoryInput(false)}
                >
                  <AiOutlineClose />
                </button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="questionText" className={styles.label}>
              Question*
            </label>
            <input
              type="text"
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              className={styles.input}
              placeholder="Enter question"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="answerText" className={styles.label}>
              Answer*
            </label>
            <textarea
              id="answerText"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              required
              className={styles.textarea}
              placeholder="Enter answer"
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewQuestionForm;
