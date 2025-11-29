/**
 * QuizBuilder Component
 * 
 * Provides a full-featured quiz editor with:
 * - Add/edit/delete questions
 * - Add/edit/delete options
 * - Set correct answers
 * - Undo/Redo with deep clone support for nested objects
 * - Drag-and-drop reordering (future enhancement)
 * 
 * CRITICAL: Uses useUndoRedo hook with deep cloning to ensure
 * that undoing a question deletion restores ALL nested options.
 */

import { useState } from 'react';
import { useUndoRedo } from '../hooks/useUndoRedo';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

interface QuizState {
  questions: QuizQuestion[];
}

interface QuizBuilderProps {
  initialQuestions?: QuizQuestion[];
  onSave?: (questions: QuizQuestion[]) => void;
}

export function QuizBuilder({ initialQuestions = [], onSave }: QuizBuilderProps) {
  const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<QuizState>({
    questions: initialQuestions,
  });

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  /**
   * Add a new question
   */
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: '',
      options: [
        { id: `opt_${Date.now()}_1`, text: '' },
        { id: `opt_${Date.now()}_2`, text: '' },
      ],
      correctAnswer: '',
      explanation: '',
    };

    setState((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setEditingQuestionId(newQuestion.id);
  };

  /**
   * Delete a question
   * CRITICAL: When undone, the question returns with ALL options intact
   * because useUndoRedo uses deep cloning
   */
  const deleteQuestion = (id: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  /**
   * Update question text
   */
  const updateQuestion = (id: string, question: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, question } : q
      ),
    }));
  };

  /**
   * Update question explanation
   */
  const updateExplanation = (id: string, explanation: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, explanation } : q
      ),
    }));
  };

  /**
   * Add option to a question
   */
  const addOption = (questionId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: `opt_${Date.now()}`, text: '' },
              ],
            }
          : q
      ),
    }));
  };

  /**
   * Delete option from a question
   * CRITICAL: When question deletion is undone, ALL options return intact
   */
  const deleteOption = (questionId: string, optionId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
            }
          : q
      ),
    }));
  };

  /**
   * Update option text
   */
  const updateOption = (questionId: string, optionId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      ),
    }));
  };

  /**
   * Set correct answer
   */
  const setCorrectAnswer = (questionId: string, optionId: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswer: optionId } : q
      ),
    }));
  };

  /**
   * Save quiz
   */
  const handleSave = () => {
    if (onSave) {
      onSave(state.questions);
    }
  };

  return (
    <div className="quiz-builder">
      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={addQuestion} className="btn-primary">
          + Add Question
        </button>
        <button onClick={undo} disabled={!canUndo} className="btn-secondary">
          ↶ Undo
        </button>
        <button onClick={redo} disabled={!canRedo} className="btn-secondary">
          ↷ Redo
        </button>
        <button onClick={handleSave} className="btn-success">
          💾 Save Quiz
        </button>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {state.questions.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <p>No questions yet. Click "Add Question" to get started.</p>
          </div>
        ) : (
          state.questions.map((question, qIndex) => (
            <div
              key={question.id}
              className="question-card"
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: editingQuestionId === question.id ? '#f9f9f9' : '#fff',
              }}
            >
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Question {qIndex + 1}</h3>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="btn-danger"
                  style={{ fontSize: '0.9rem' }}
                >
                  🗑️ Delete
                </button>
              </div>

              {/* Question Text */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Question:
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, e.target.value)}
                  placeholder="Enter your question here..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Options:
                </label>
                {question.options.map((option, optIndex) => (
                  <div
                    key={option.id}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="radio"
                      name={`correct_${question.id}`}
                      checked={question.correctAnswer === option.id}
                      onChange={() => setCorrectAnswer(question.id, option.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ minWidth: '20px', fontWeight: 500 }}>
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => deleteOption(question.id, option.id)}
                        className="btn-danger-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addOption(question.id)}
                  className="btn-secondary"
                  style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}
                >
                  + Add Option
                </button>
              </div>

              {/* Explanation */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Explanation (shown after answer):
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => updateExplanation(question.id, e.target.value)}
                  placeholder="Explain why this is the correct answer..."
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f0f0f0',
            borderRadius: '4px',
            fontSize: '0.85rem',
          }}
        >
          <strong>Debug Info:</strong>
          <div>Questions: {state.questions.length}</div>
          <div>Can Undo: {canUndo ? 'Yes' : 'No'}</div>
          <div>Can Redo: {canRedo ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}

/**
 * VERIFICATION TEST:
 * 
 * 1. Add a question with 4 options
 * 2. Delete the question
 * 3. Click Undo
 * 
 * EXPECTED RESULT:
 * ✅ Question returns with ALL 4 options intact
 * ✅ All option text is preserved
 * ✅ Correct answer selection is preserved
 * ✅ Explanation text is preserved
 * 
 * This works because useUndoRedo uses deep cloning (structuredClone or JSON.parse/stringify)
 * which creates completely independent copies of nested objects.
 */
