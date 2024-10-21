import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface FaqQuestion {
  id: number;
  question: string;
  answer: string;
  category: { id: number; name: string }; 
}

interface EditQuestionFormProps {
  open: boolean;
  question: FaqQuestion | null; 
  onClose: () => void;
  onQuestionUpdated: (updatedQuestion: FaqQuestion) => void;
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({
  open,
  question,
  onClose,
  onQuestionUpdated,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<FaqQuestion | null>(null);

  useEffect(() => {
    if (question) {
      setEditedQuestion(question);
    }
  }, [question]);

  const handleSave = () => {
    if (editedQuestion) {
      onQuestionUpdated(editedQuestion);
      onClose();
    }
  };

  if (!editedQuestion) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Question</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question"
          type="text"
          fullWidth
          value={editedQuestion.question}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Answer"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={editedQuestion.answer}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, answer: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionForm;
