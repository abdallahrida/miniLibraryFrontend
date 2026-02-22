export const formClasses = {
  formGrid: "form-grid",
  fullWidth: "full-width",
  fieldError: "field-error",
  formError: "form-error",
  modalActions: "modal-actions",
} as const;

export type FormClasses = typeof formClasses;
