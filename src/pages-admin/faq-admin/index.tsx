import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { getCategories, getQuestions } from "@/api";
import "./faq-admin.module.css";

interface FaqCategory {
  id: number;
  categoryName: string;
}

interface FaqQuestion {
  id: number;
  question: string;
  answer: string;
}

const FaqPage: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [questions, setQuestions] = useState<FaqQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<FaqQuestion[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions();
        setQuestions(response.data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  //   if (selectedCategoryId !== null) {
  //     const filtered = questions.filter(
  //       (question) =>
  //         question.categoryId === selectedCategoryId &&
  //         question.question.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setFilteredQuestions(filtered);
  //   }

  const filteredques = (id: number) => {
    const res = questions.filter((filt) =>
      filt.id === id
    );
    setFilteredQuestions(res);
  };

  return (
    <Container className="faq-container">
      <Grid container spacing={3}>
        {/* Categories */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Category
          </Typography>
          <List className="category-list">
            {categories.map((category) => (
              <ListItem
                button
                key={category.id}
                selected={selectedCategoryId === category.id}
                onClick={() => filteredques(category.id)}
              >
                <ListItemText primary={category.categoryName} />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Questions */}
        <Grid item xs={12} md={8}>
          <Typography className="Title" variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>

          {/* Search Bar 
          <TextField
            fullWidth
            label="Search Questions"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />*/}

          {/* Questions List */}
          <div className="questions-list">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <div key={question.id} className="question-item">
                  <Typography variant="subtitle1" className="question">
                    {question.question}
                  </Typography>
                  <Typography variant="body2" className="answer">
                    {question.answer}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="body1" className="no-questions">
                No questions found for this category.
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FaqPage;
