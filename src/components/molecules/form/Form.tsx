import { Field, Form, useFormikContext } from "formik";

import AppButton from "@atoms/appButton/appButton";
import type { BookFormValues } from "@features/homeFeature/homeFeature.types";
import { formClasses } from "./form.styling";
import "./form.css";

export type BookFormProps = {
  onCancel: () => void;
  submitLabel?: string;
  submittingLabel?: string;
};

export default function BookForm({
  onCancel,
  submitLabel = "Save",
  submittingLabel = "Saving...",
}: BookFormProps) {
  const { errors, touched, isSubmitting, status } =
    useFormikContext<BookFormValues>();

  return (
    <Form className={formClasses.formGrid}>
      <label>
        Title
        <Field name="title" />
        {touched.title && errors.title ? (
          <span className={formClasses.fieldError}>{errors.title}</span>
        ) : null}
      </label>
      <label>
        Author
        <Field name="author" />
        {touched.author && errors.author ? (
          <span className={formClasses.fieldError}>{errors.author}</span>
        ) : null}
      </label>
      <label>
        ISBN
        <Field name="isbn" />
        {touched.isbn && errors.isbn ? (
          <span className={formClasses.fieldError}>{errors.isbn}</span>
        ) : null}
      </label>
      <label>
        Published Year
        <Field name="publishedYear" type="number" />
        {touched.publishedYear && errors.publishedYear ? (
          <span className={formClasses.fieldError}>
            {errors.publishedYear}
          </span>
        ) : null}
      </label>
      <label>
        Genre
        <Field name="genre" />
        {touched.genre && errors.genre ? (
          <span className={formClasses.fieldError}>{errors.genre}</span>
        ) : null}
      </label>
      <label className={formClasses.fullWidth}>
        Description
        <Field name="description" as="textarea" rows={4} />
        {touched.description && errors.description ? (
          <span className={formClasses.fieldError}>
            {errors.description}
          </span>
        ) : null}
      </label>
      {status ? <p className={formClasses.formError}>{status}</p> : null}
      <div className={formClasses.modalActions}>
        <AppButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </AppButton>
        <AppButton
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </AppButton>
      </div>
    </Form>
  );
}
