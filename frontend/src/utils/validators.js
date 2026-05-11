// src/utils/validators.js
export const validators = {
  required: (value) => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "This field is required.";
    }
    return null;
  },

  email: (value) => {
    if (!value) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address.";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) {
      return `Must be at least ${min} characters.`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must not exceed ${max} characters.`;
    }
    return null;
  },

  positiveNumber: (value) => {
    if (value === "" || value === null || value === undefined) {
      return "This field is required.";
    }
    if (isNaN(value) || Number(value) < 0) {
      return "Must be a positive number.";
    }
    return null;
  },
};

export const validateForm = (values, rules) => {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return errors;
};