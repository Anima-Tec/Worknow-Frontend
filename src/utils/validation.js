// ======================= 🔍 VALIDACIONES FRONTEND ==========================

// ======================= 📧 VALIDACIÓN DE EMAIL ==========================
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// ======================= 🔒 VALIDACIÓN DE CONTRASEÑA ==========================
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
  } else {
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (password.length > 128) {
      errors.push('La contraseña no puede tener más de 128 caracteres');
    }
    if (!/[A-Za-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 📱 VALIDACIÓN DE TELÉFONO ==========================
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phone);
};

// ======================= 📝 VALIDACIÓN DE CAMPOS REQUERIDOS ==========================
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
};

// ======================= 🔤 VALIDACIÓN DE NOMBRE ==========================
export const validateName = (name) => {
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('El nombre es requerido');
  } else {
    if (name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }
    if (name.trim().length > 50) {
      errors.push('El nombre no puede tener más de 50 caracteres');
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
      errors.push('El nombre solo puede contener letras y espacios');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 🏢 VALIDACIÓN DE EMPRESA ==========================
export const validateCompanyName = (name) => {
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('El nombre de la empresa es requerido');
  } else {
    if (name.trim().length < 2) {
      errors.push('El nombre de la empresa debe tener al menos 2 caracteres');
    }
    if (name.trim().length > 100) {
      errors.push('El nombre de la empresa no puede tener más de 100 caracteres');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 📄 VALIDACIÓN DE DESCRIPCIÓN ==========================
export const validateDescription = (description, minLength = 10, maxLength = 1000) => {
  const errors = [];
  
  if (!description || description.trim() === '') {
    errors.push('La descripción es requerida');
  } else {
    if (description.trim().length < minLength) {
      errors.push(`La descripción debe tener al menos ${minLength} caracteres`);
    }
    if (description.trim().length > maxLength) {
      errors.push(`La descripción no puede tener más de ${maxLength} caracteres`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 💰 VALIDACIÓN DE SALARIO ==========================
export const validateSalary = (salary) => {
  const errors = [];
  
  if (!salary || salary === '') {
    errors.push('El salario es requerido');
  } else {
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary)) {
      errors.push('El salario debe ser un número válido');
    } else if (numSalary < 0) {
      errors.push('El salario no puede ser negativo');
    } else if (numSalary > 10000000) {
      errors.push('El salario no puede ser mayor a 10,000,000');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 📅 VALIDACIÓN DE FECHA ==========================
export const validateDate = (date, fieldName = 'fecha') => {
  const errors = [];
  
  if (!date) {
    errors.push(`${fieldName} es requerida`);
  } else {
    const dateObj = new Date(date);
    const today = new Date();
    
    if (isNaN(dateObj.getTime())) {
      errors.push(`${fieldName} no es una fecha válida`);
    } else if (dateObj > today) {
      errors.push(`${fieldName} no puede ser futura`);
    } else if (dateObj < new Date('1900-01-01')) {
      errors.push(`${fieldName} no puede ser anterior a 1900`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ======================= 🔧 SANITIZACIÓN DE INPUTS ==========================
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
    .replace(/\s+/g, ' '); // Normalizar espacios
};

// ======================= 📊 VALIDACIÓN DE FORMULARIO COMPLETO ==========================
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const rule = validationRules[field];
    const value = formData[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = [`${rule.label || field} es requerido`];
      isValid = false;
    } else if (value && value.trim() !== '') {
      let fieldErrors = [];
      
      if (rule.email && !validateEmail(value)) {
        fieldErrors.push('Email inválido');
      }
      
      if (rule.password) {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          fieldErrors.push(...passwordValidation.errors);
        }
      }
      
      if (rule.phone && !validatePhone(value)) {
        fieldErrors.push('Teléfono inválido (debe tener 8 dígitos)');
      }
      
      if (rule.name) {
        const nameValidation = validateName(value);
        if (!nameValidation.isValid) {
          fieldErrors.push(...nameValidation.errors);
        }
      }
      
      if (rule.minLength && value.length < rule.minLength) {
        fieldErrors.push(`Debe tener al menos ${rule.minLength} caracteres`);
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        fieldErrors.push(`No puede tener más de ${rule.maxLength} caracteres`);
      }
      
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }
  });
  
  return {
    isValid,
    errors
  };
};

// ======================= 🎯 VALIDACIÓN EN TIEMPO REAL ==========================
export const createRealTimeValidator = (validationRules) => {
  return (field, value) => {
    const rule = validationRules[field];
    if (!rule) return { isValid: true, errors: [] };
    
    const errors = [];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors.push(`${rule.label || field} es requerido`);
    } else if (value && value.trim() !== '') {
      if (rule.email && !validateEmail(value)) {
        errors.push('Email inválido');
      }
      
      if (rule.password) {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          errors.push(...passwordValidation.errors);
        }
      }
      
      if (rule.phone && !validatePhone(value)) {
        errors.push('Teléfono inválido (debe tener 8 dígitos)');
      }
      
      if (rule.name) {
        const nameValidation = validateName(value);
        if (!nameValidation.isValid) {
          errors.push(...nameValidation.errors);
        }
      }
      
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`Debe tener al menos ${rule.minLength} caracteres`);
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`No puede tener más de ${rule.maxLength} caracteres`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
};
