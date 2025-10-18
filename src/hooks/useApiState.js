import { useState, useCallback } from 'react';

// ======================= 🎣 HOOK PARA MANEJO DE ESTADO DE API ==========================
export const useApiState = (initialState = {}) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    ...initialState
  });

  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setData = useCallback((data) => {
    setState(prev => ({ ...prev, data, error: null, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, loading: false, error: null }));
  }, []);

  const execute = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setData(result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      setError(error);
      if (onError) onError(error);
      throw error;
    }
  }, [setLoading, setData, setError]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
    execute
  };
};

// ======================= 🎣 HOOK PARA FORMULARIOS ==========================
export const useFormState = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const setAllErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setValue(field, value);
  }, [setValue]);

  const handleBlur = useCallback((field) => () => {
    setFieldTouched(field);
  }, [setFieldTouched]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldError,
    setFieldTouched,
    setAllErrors,
    reset,
    handleChange,
    handleBlur,
    handleSubmit
  };
};

// ======================= 🎣 HOOK PARA DEBOUNCE ==========================
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
