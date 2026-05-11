// src/utils/errorHandler.js
import toast from "react-hot-toast";

export const extractErrorMessage = (error) => {
  if (typeof error === "string") return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.errors) {
    const errs = error.response.data.errors;
    if (Array.isArray(errs)) return errs.join(", ");
    if (typeof errs === "object") return Object.values(errs).flat().join(", ");
  }
  if (error?.message) return error.message;
  return "An unexpected error occurred.";
};

export const getFieldErrors = (error) => {
  if (error?.response?.data?.fieldErrors) return error.response.data.fieldErrors;
  if (
    error?.response?.data?.errors &&
    typeof error.response.data.errors === "object"
  ) {
    return error.response.data.errors;
  }
  return {};
};

export const showErrorToast = (error) => {
  const message = extractErrorMessage(error);
  toast.error(message);
};

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showLoadingToast = (message = "Loading...") => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};