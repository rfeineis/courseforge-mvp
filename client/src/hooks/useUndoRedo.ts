/**
 * useUndoRedo Hook
 * 
 * Provides undo/redo functionality with deep cloning for nested objects.
 * Critical for Quiz Editor where questions have nested options arrays.
 * 
 * Features:
 * - Deep cloning to preserve nested object integrity
 * - Configurable history limit
 * - Type-safe state management
 * - Efficient memory usage
 */

import { useState, useCallback, useRef } from 'react';

interface UseUndoRedoOptions {
  maxHistorySize?: number;
}

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
  clearHistory: () => void;
}

/**
 * Deep clone utility using structuredClone (fastest native method)
 * Falls back to JSON parse/stringify for older browsers
 */
function deepClone<T>(obj: T): T {
  if (typeof structuredClone !== 'undefined') {
    // Modern browsers - fastest and most accurate
    return structuredClone(obj);
  }
  
  // Fallback for older environments
  return JSON.parse(JSON.stringify(obj));
}

/**
 * useUndoRedo Hook
 * 
 * @param initialState - Initial state value
 * @param options - Configuration options
 * @returns Undo/redo state management utilities
 * 
 * @example
 * ```tsx
 * const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo({
 *   questions: [
 *     { id: 1, text: 'Question 1', options: ['A', 'B', 'C'] }
 *   ]
 * });
 * 
 * // Modify state
 * setState(prev => ({
 *   ...prev,
 *   questions: [...prev.questions, newQuestion]
 * }));
 * 
 * // Undo deletion - question returns with all options intact
 * undo();
 * ```
 */
export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
): UseUndoRedoReturn<T> {
  const { maxHistorySize = 50 } = options;

  // State management
  const [state, setStateInternal] = useState<T>(initialState);
  
  // History stacks
  const historyRef = useRef<T[]>([deepClone(initialState)]);
  const currentIndexRef = useRef<number>(0);

  /**
   * Set state with history tracking
   * CRITICAL: Deep clones the state to preserve nested objects
   */
  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setStateInternal((prevState) => {
      // Resolve new state (handle function or direct value)
      const resolvedState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      // Deep clone to prevent reference mutations
      const clonedState = deepClone(resolvedState);

      // Remove any future history (when making changes after undo)
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);

      // Add new state to history
      historyRef.current.push(clonedState);

      // Enforce max history size
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current.shift();
      } else {
        currentIndexRef.current++;
      }

      return clonedState;
    });
  }, [maxHistorySize]);

  /**
   * Undo to previous state
   * Returns a deep clone to ensure nested objects are restored correctly
   */
  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      const previousState = historyRef.current[currentIndexRef.current];
      
      // Deep clone to prevent mutations affecting history
      setStateInternal(deepClone(previousState));
    }
  }, []);

  /**
   * Redo to next state
   * Returns a deep clone to ensure nested objects are restored correctly
   */
  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      const nextState = historyRef.current[currentIndexRef.current];
      
      // Deep clone to prevent mutations affecting history
      setStateInternal(deepClone(nextState));
    }
  }, []);

  /**
   * Reset to a new initial state
   * Clears all history
   */
  const reset = useCallback((newInitialState: T) => {
    const clonedState = deepClone(newInitialState);
    historyRef.current = [clonedState];
    currentIndexRef.current = 0;
    setStateInternal(clonedState);
  }, []);

  /**
   * Clear all history but keep current state
   */
  const clearHistory = useCallback(() => {
    const currentState = deepClone(state);
    historyRef.current = [currentState];
    currentIndexRef.current = 0;
  }, [state]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo: currentIndexRef.current > 0,
    canRedo: currentIndexRef.current < historyRef.current.length - 1,
    reset,
    clearHistory,
  };
}

/**
 * Example Usage in Quiz Editor:
 * 
 * ```tsx
 * interface QuizState {
 *   questions: Array<{
 *     id: number;
 *     text: string;
 *     options: string[];
 *     correctAnswer: string;
 *   }>;
 * }
 * 
 * function QuizEditor() {
 *   const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo<QuizState>({
 *     questions: []
 *   });
 * 
 *   const deleteQuestion = (id: number) => {
 *     setState(prev => ({
 *       ...prev,
 *       questions: prev.questions.filter(q => q.id !== id)
 *     }));
 *   };
 * 
 *   // If user undoes deletion, question returns with ALL options intact
 *   // because we use deep cloning
 * 
 *   return (
 *     <div>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *       <button onClick={redo} disabled={!canRedo}>Redo</button>
 *       {state.questions.map(q => (
 *         <QuestionCard key={q.id} question={q} onDelete={deleteQuestion} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
