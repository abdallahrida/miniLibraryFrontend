import { Field, Form, Formik, type FormikHelpers } from "formik";
import type { ObjectSchema } from "yup";

import type { Book, CheckoutFormValues } from "@features/homeFeature/homeFeature.types";
import { formClasses } from "@molecules/form";
import AppButton from "@atoms/appButton/appButton";

export type CheckoutBookFormProps = {
  book: Book;
  onCancel: () => void;
  validationSchema: ObjectSchema<CheckoutFormValues>;
  onSubmit: (
    values: CheckoutFormValues,
    helpers: FormikHelpers<CheckoutFormValues>,
  ) => void | Promise<void>;
};

const initialValues: CheckoutFormValues = {
  borrowedBy: "",
};

export default function CheckoutBookForm({
  book,
  onCancel,
  validationSchema,
  onSubmit,
}: CheckoutBookFormProps) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Check Out Book</h2>
        <p>
          <strong>{book.title}</strong>
        </p>
        <Formik<CheckoutFormValues>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <Form className={formClasses.formGrid}>
              <label>
                Borrowed By
                <Field
                  name="borrowedBy"
                  placeholder="Borrower full name"
                />
                {touched.borrowedBy && errors.borrowedBy ? (
                  <span className={formClasses.fieldError}>
                    {errors.borrowedBy}
                  </span>
                ) : null}
              </label>
              {status ? (
                <p className={formClasses.formError}>{status}</p>
              ) : null}
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
                  {isSubmitting ? "Checking out..." : "Confirm"}
                </AppButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
