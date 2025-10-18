// ======================= 🔍 VALIDACIONES SIMPLES PARA MVP ==========================

// Validación básica de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación básica de contraseña (mínimo 6 caracteres)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validación básica de teléfono uruguayo (8 dígitos)
export const isValidPhone = (phone) => {
  return phone && /^[0-9]{8}$/.test(phone);
};

// Validación básica de campo requerido
export const isRequired = (value) => {
  return value && value.trim() !== '';
};

// Función simple para validar formulario de login
export const validateLogin = (email, password) => {
  const errors = {};
  
  if (!isRequired(email)) {
    errors.email = 'Email es requerido';
  } else if (!isValidEmail(email)) {
    errors.email = 'Email inválido';
  }
  
  if (!isRequired(password)) {
    errors.password = 'Contraseña es requerida';
  } else if (!isValidPassword(password)) {
    errors.password = 'Contraseña debe tener al menos 6 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Función simple para validar formulario de registro
export const validateRegister = (formData) => {
  const errors = {};
  
  // Validar nombre
  if (!isRequired(formData.nombre)) {
    errors.nombre = 'Nombre es requerido';
  }
  
  // Validar apellido
  if (!isRequired(formData.apellido)) {
    errors.apellido = 'Apellido es requerido';
  }
  
  // Validar email
  if (!isRequired(formData.email)) {
    errors.email = 'Email es requerido';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email inválido';
  }
  
  // Validar contraseña
  if (!isRequired(formData.password)) {
    errors.password = 'Contraseña es requerida';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Contraseña debe tener al menos 6 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
