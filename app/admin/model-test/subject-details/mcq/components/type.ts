interface MCQFormProps {
  newQuestion: {
    question: string;
    options: string[];
    correctAnswer: string;
    explaination: string;
    tags: string;
    subject: string;
  };
  setNewQuestion: (q: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingMCQ?: boolean;
}