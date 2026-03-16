import { useState, useCallback, useRef, useEffect } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseUndoRedoResult<T> {
  state: T;
  setState: (newState: T | ((prev: T) => T), recordHistory?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

export function useUndoRedo<T>(
  initialState: T,
  debounceMs: number = 500
): UseUndoRedoResult<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<T | null>(null);
  const lastRecordedRef = useRef<T>(initialState);

  // Sync with external initial state changes
  useEffect(() => {
    setHistory((prev) => ({
      ...prev,
      present: initialState,
    }));
  }, [initialState]);

  const recordHistory = useCallback((newState: T) => {
    setHistory((prev) => {
      // Don't record if state hasn't changed
      if (JSON.stringify(prev.present) === JSON.stringify(newState)) {
        return prev;
      }

      const newPast = [...prev.past, prev.present].slice(-MAX_HISTORY_SIZE);
      lastRecordedRef.current = newState;

      return {
        past: newPast,
        present: newState,
        future: [],
      };
    });
  }, []);

  const setState = useCallback(
    (newState: T | ((prev: T) => T), shouldRecord: boolean = true) => {
      setHistory((prev) => {
        const resolvedState =
          typeof newState === 'function'
            ? (newState as (prev: T) => T)(prev.present)
            : newState;

        if (!shouldRecord) {
          return { ...prev, present: resolvedState };
        }

        // Store pending state for debounced recording
        pendingStateRef.current = resolvedState;

        // Clear existing debounce
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        // Debounce history recording
        debounceRef.current = setTimeout(() => {
          if (pendingStateRef.current !== null) {
            recordHistory(pendingStateRef.current);
            pendingStateRef.current = null;
          }
        }, debounceMs);

        return { ...prev, present: resolvedState };
      });
    },
    [debounceMs, recordHistory]
  );

  const undo = useCallback(() => {
    // Clear any pending debounced state
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    pendingStateRef.current = null;

    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory((prev) => ({
      past: [],
      present: prev.present,
      future: [],
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    clearHistory,
  };
}
