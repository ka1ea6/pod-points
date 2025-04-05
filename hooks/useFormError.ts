import { useReducer } from "react";

// Define action types
enum ACTIONS {
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
  CLEAR_ALL_ERRORS = "CLEAR_ALL_ERRORS",
}

// Define types
interface ErrorState<T extends string> {
  [key: string]: string[] | null;
}

interface SetErrorAction<T extends string> {
  type: ACTIONS.SET_ERROR;
  field: T;
  errors: string | string[];
}

interface ClearErrorAction<T extends string> {
  type: ACTIONS.CLEAR_ERROR;
  field: T;
}

interface ClearAllErrorsAction {
  type: ACTIONS.CLEAR_ALL_ERRORS;
}

type ErrorAction<T extends string> =
  | SetErrorAction<T>
  | ClearErrorAction<T>
  | ClearAllErrorsAction;

// Reducer function to manage error state
const errorReducer = <T extends string>(
  state: ErrorState<T>,
  action: ErrorAction<T>
): ErrorState<T> => {
  switch (action.type) {
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        [action.field]: Array.isArray(action.errors)
          ? action.errors
          : [action.errors],
      };
    case ACTIONS.CLEAR_ERROR:
      const newState = { ...state };
      delete newState[action.field];
      return newState;
    case ACTIONS.CLEAR_ALL_ERRORS:
      return {};
    default:
      return state;
  }
};

const useFormErrors = <T extends string, V = any>(fields: readonly T[]) => {
  // Initialize state with empty errors for specified fields
  const initialState: ErrorState<T> = fields.reduce(
    (acc, field) => ({
      ...acc,
      [field]: null,
    }),
    {} as ErrorState<T>
  );

  const [errors, dispatch] = useReducer(errorReducer<T>, initialState);

  // Set errors for a specific field
  const setError = (field: T, errors: string | string[]) => {
    dispatch({
      type: ACTIONS.SET_ERROR,
      field,
      errors,
    });
  };

  // Clear errors for a specific field
  const clearError = (field: T) => {
    dispatch({
      type: ACTIONS.CLEAR_ERROR,
      field,
    });
  };

  // Clear all errors
  const clearAllErrors = () => {
    dispatch({ type: ACTIONS.CLEAR_ALL_ERRORS });
  };

  // Check if there are any errors
  const hasErrors = (): boolean => {
    return Object.values(errors).some(
      (error) => error !== null && error !== undefined && error.length > 0
    );
  };
  // Check if a field has  any errors
  const fieldHasErrors = (field: T): boolean => {
    return getFieldErrors(field).length > 0;
  };

  // Get errors for a specific field
  const getFieldErrors = (field: T): string[] => {
    return errors[field] || [];
  };

  return {
    errors, // Current error state
    setError, // Set error(s) for a field
    clearError, // Clear errors for a field
    clearAllErrors, // Clear all errors
    hasErrors, // Boolean indicating if any errors exist
    getFieldErrors, // Get errors for specific field
    fieldHasErrors,
  };
};

export default useFormErrors;
