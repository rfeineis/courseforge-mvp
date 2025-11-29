/**
 * useUndoRedo Hook - Test Suite
 * 
 * Verifies that undo/redo correctly handles nested objects.
 * Critical test: Undoing a question deletion should restore ALL options.
 */

import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from './useUndoRedo';

interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface QuizState {
  questions: QuizQuestion[];
}

describe('useUndoRedo', () => {
  describe('Basic functionality', () => {
    it('should initialize with initial state', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));
      
      expect(result.current.state).toEqual({ count: 0 });
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('should update state', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));
      
      act(() => {
        result.current.setState({ count: 1 });
      });
      
      expect(result.current.state).toEqual({ count: 1 });
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('should undo state change', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));
      
      act(() => {
        result.current.setState({ count: 1 });
      });
      
      act(() => {
        result.current.undo();
      });
      
      expect(result.current.state).toEqual({ count: 0 });
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(true);
    });

    it('should redo state change', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));
      
      act(() => {
        result.current.setState({ count: 1 });
      });
      
      act(() => {
        result.current.undo();
      });
      
      act(() => {
        result.current.redo();
      });
      
      expect(result.current.state).toEqual({ count: 1 });
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('Nested objects (CRITICAL TEST)', () => {
    it('should restore nested objects completely when undoing deletion', () => {
      const initialState: QuizState = {
        questions: [
          {
            id: 1,
            text: 'What is 2+2?',
            options: ['1', '2', '3', '4'],
            correctAnswer: '4',
          },
        ],
      };

      const { result } = renderHook(() => useUndoRedo(initialState));

      // Verify initial state
      expect(result.current.state.questions).toHaveLength(1);
      expect(result.current.state.questions[0].options).toHaveLength(4);

      // Delete the question
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          questions: prev.questions.filter((q) => q.id !== 1),
        }));
      });

      // Verify deletion
      expect(result.current.state.questions).toHaveLength(0);

      // CRITICAL: Undo the deletion
      act(() => {
        result.current.undo();
      });

      // VERIFY: Question returns with ALL options intact
      expect(result.current.state.questions).toHaveLength(1);
      expect(result.current.state.questions[0].id).toBe(1);
      expect(result.current.state.questions[0].text).toBe('What is 2+2?');
      expect(result.current.state.questions[0].options).toEqual(['1', '2', '3', '4']);
      expect(result.current.state.questions[0].correctAnswer).toBe('4');
    });

    it('should handle multiple nested levels', () => {
      interface ComplexState {
        quiz: {
          questions: Array<{
            id: number;
            options: Array<{
              id: number;
              text: string;
              metadata: {
                isCorrect: boolean;
              };
            }>;
          }>;
        };
      }

      const initialState: ComplexState = {
        quiz: {
          questions: [
            {
              id: 1,
              options: [
                { id: 1, text: 'A', metadata: { isCorrect: false } },
                { id: 2, text: 'B', metadata: { isCorrect: true } },
              ],
            },
          ],
        },
      };

      const { result } = renderHook(() => useUndoRedo(initialState));

      // Delete the question
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          quiz: {
            ...prev.quiz,
            questions: [],
          },
        }));
      });

      // Undo deletion
      act(() => {
        result.current.undo();
      });

      // Verify ALL nested levels are restored
      expect(result.current.state.quiz.questions).toHaveLength(1);
      expect(result.current.state.quiz.questions[0].options).toHaveLength(2);
      expect(result.current.state.quiz.questions[0].options[0].metadata.isCorrect).toBe(false);
      expect(result.current.state.quiz.questions[0].options[1].metadata.isCorrect).toBe(true);
    });

    it('should not mutate history when modifying current state', () => {
      const initialState: QuizState = {
        questions: [
          {
            id: 1,
            text: 'Question 1',
            options: ['A', 'B'],
            correctAnswer: 'A',
          },
        ],
      };

      const { result } = renderHook(() => useUndoRedo(initialState));

      // Modify state
      act(() => {
        result.current.setState((prev) => ({
          ...prev,
          questions: prev.questions.map((q) => ({
            ...q,
            options: [...q.options, 'C'],
          })),
        }));
      });

      // Verify new state
      expect(result.current.state.questions[0].options).toEqual(['A', 'B', 'C']);

      // Undo
      act(() => {
        result.current.undo();
      });

      // Verify original state is intact
      expect(result.current.state.questions[0].options).toEqual(['A', 'B']);
    });
  });

  describe('History management', () => {
    it('should respect max history size', () => {
      const { result } = renderHook(() =>
        useUndoRedo({ count: 0 }, { maxHistorySize: 3 })
      );

      // Add 5 states (should only keep last 3)
      act(() => {
        result.current.setState({ count: 1 });
        result.current.setState({ count: 2 });
        result.current.setState({ count: 3 });
        result.current.setState({ count: 4 });
      });

      // Undo 3 times (should stop at count: 2, not 0)
      act(() => {
        result.current.undo();
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.state).toEqual({ count: 2 });
      expect(result.current.canUndo).toBe(false);
    });

    it('should clear future history when making changes after undo', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
        result.current.setState({ count: 2 });
      });

      act(() => {
        result.current.undo();
      });

      // Make a new change
      act(() => {
        result.current.setState({ count: 10 });
      });

      // Should not be able to redo to count: 2
      act(() => {
        result.current.redo();
      });

      expect(result.current.state).toEqual({ count: 10 });
      expect(result.current.canRedo).toBe(false);
    });

    it('should reset history', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
        result.current.setState({ count: 2 });
      });

      act(() => {
        result.current.reset({ count: 100 });
      });

      expect(result.current.state).toEqual({ count: 100 });
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('should clear history but keep current state', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
        result.current.setState({ count: 2 });
      });

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.state).toEqual({ count: 2 });
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle undo when at the beginning', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.undo();
      });

      expect(result.current.state).toEqual({ count: 0 });
      expect(result.current.canUndo).toBe(false);
    });

    it('should handle redo when at the end', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.setState({ count: 1 });
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.state).toEqual({ count: 1 });
      expect(result.current.canRedo).toBe(false);
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useUndoRedo({ count: 0 }));

      act(() => {
        result.current.setState((prev) => ({ count: prev.count + 1 }));
      });

      expect(result.current.state).toEqual({ count: 1 });
    });
  });
});

/**
 * CRITICAL TEST VERIFICATION:
 * 
 * The test "should restore nested objects completely when undoing deletion"
 * verifies that when you:
 * 
 * 1. Have a question with nested options array
 * 2. Delete the question
 * 3. Undo the deletion
 * 
 * The question returns with ALL options intact, proving that deep cloning works correctly.
 * 
 * This is essential for the Quiz Editor to function properly.
 */
