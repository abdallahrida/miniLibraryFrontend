import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { type PaginationState } from "@tanstack/react-table";

import type {
  Book,
  BookFormValues,
  CheckoutFormValues,
  BooksResponse,
} from "./homeFeature.types";
import "../../App.css";
import { homeFeatureService } from "./homeFeature.service";
import { BookForm } from "@molecules/form";
import { CheckoutBookForm } from "@molecules/checkoutBookForm";
import BooksTable from "@molecules/booksTable/booksTable";
import Header from "@molecules/header/header";
import TableToolbar from "@molecules/tableToolbar/tableToolbar";

const defaultBookValues: BookFormValues = {
  title: "",
  author: "",
  isbn: "",
  publishedYear: new Date().getFullYear(),
  genre: "",
  description: "",
};

const bookSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  author: Yup.string().trim().required("Author is required"),
  isbn: Yup.string().trim().required("ISBN is required"),
  publishedYear: Yup.number()
    .typeError("Published year must be a number")
    .integer("Published year must be a whole number")
    .min(0, "Published year cannot be negative")
    .max(new Date().getFullYear(), "Published year cannot be in the future")
    .required("Published year is required"),
  genre: Yup.string().trim().required("Genre is required"),
  description: Yup.string().trim().required("Description is required"),
});

const checkoutSchema = Yup.object({
  borrowedBy: Yup.string().trim().required("Borrower name is required"),
});

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string") {
      return serverMessage;
    }
  }
  return "Something went wrong. Please try again.";
};

const isBookCheckedOut = (book: Book): boolean => {
  if (book.status) {
    return book.status.toLowerCase() !== "available";
  }
  return Boolean(book.borrowedBy);
};

export default function HomeFeature() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [bookFormMode, setBookFormMode] = useState<"create" | "edit" | null>(
    null,
  );
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<Book | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "borrowed"
  >("all");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      const next = searchInput.trim();
      setSearch(next);
      setPagination((prev) =>
        prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
      );
      searchDebounceRef.current = null;
    }, 300);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchInput]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await homeFeatureService.getBooks({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...(search ? { search } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      });

      const payload: BooksResponse = response.data;
      const serverTotalPages = Math.max(payload.pagination.totalPages, 1);
      setTotalPages(serverTotalPages);
      setTotalItems(payload.pagination.totalItems);
      setBooks(payload.items);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, search, statusFilter]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    );
  }, [statusFilter]);

  const handleDelete = useCallback(
    async (bookId: string) => {
      const confirmed = window.confirm(
        "Delete this book? This cannot be undone.",
      );
      if (!confirmed) {
        return;
      }

      setActionLoadingId(bookId);
      setError(null);
      try {
        await homeFeatureService.deleteBook(bookId);
        await loadBooks();
      } catch (deleteError) {
        setError(getErrorMessage(deleteError));
      } finally {
        setActionLoadingId(null);
      }
    },
    [loadBooks],
  );

  const handleCheckIn = useCallback(
    async (bookId: string) => {
      setActionLoadingId(bookId);
      setError(null);
      try {
        await homeFeatureService.checkinBook(bookId);
        await loadBooks();
      } catch (checkinError) {
        setError(getErrorMessage(checkinError));
      } finally {
        setActionLoadingId(null);
      }
    },
    [loadBooks],
  );

  const handleBookSubmit = async (
    values: BookFormValues,
    helpers: FormikHelpers<BookFormValues>,
  ) => {
    setError(null);
    try {
      const payload: BookFormValues = {
        ...values,
        publishedYear: Number(values.publishedYear),
      };

      if (bookFormMode === "edit" && selectedBook) {
        await homeFeatureService.updateBook(selectedBook._id, payload);
      } else {
        await homeFeatureService.createBook(payload);
      }
      setBookFormMode(null);
      setSelectedBook(null);
      await loadBooks();
    } catch (submitError) {
      helpers.setStatus(getErrorMessage(submitError));
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const handleCheckoutSubmit = async (
    values: CheckoutFormValues,
    helpers: FormikHelpers<CheckoutFormValues>,
  ) => {
    if (!checkoutBook) {
      helpers.setSubmitting(false);
      return;
    }

    setError(null);
    try {
      await homeFeatureService.checkoutBook(checkoutBook._id, values);
      setCheckoutBook(null);
      await loadBooks();
    } catch (submitError) {
      helpers.setStatus(getErrorMessage(submitError));
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formInitialValues: BookFormValues =
    bookFormMode === "edit" && selectedBook
      ? {
          title: selectedBook.title,
          author: selectedBook.author,
          isbn: selectedBook.isbn,
          publishedYear: selectedBook.publishedYear,
          genre: selectedBook.genre,
          description: selectedBook.description,
        }
      : defaultBookValues;

  return (
    <main className="page">
      <Header
        onCreate={() => {
          setSelectedBook(null);
          setBookFormMode("create");
        }}
      />

      {error ? <div className="error-banner">{error}</div> : null}

      <TableToolbar
        loading={loading}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <BooksTable
        books={books}
        loading={loading}
        actionLoadingId={actionLoadingId}
        pagination={pagination}
        totalPages={totalPages}
        totalItems={totalItems}
        onPaginationChange={setPagination}
        onEdit={(book) => {
          setSelectedBook(book);
          setBookFormMode("edit");
        }}
        onDelete={(bookId) => {
          void handleDelete(bookId);
        }}
        onCheckIn={(bookId) => {
          void handleCheckIn(bookId);
        }}
        onCheckOut={(book) => {
          setCheckoutBook(book);
        }}
        isBookCheckedOut={isBookCheckedOut}
      />

      {bookFormMode && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{bookFormMode === "create" ? "Create Book" : "Edit Book"}</h2>
            <Formik
              initialValues={formInitialValues}
              validationSchema={bookSchema}
              onSubmit={handleBookSubmit}
              enableReinitialize
            >
              <BookForm
                onCancel={() => {
                  setBookFormMode(null);
                  setSelectedBook(null);
                }}
              />
            </Formik>
          </div>
        </div>
      )}

      {checkoutBook ? (
        <CheckoutBookForm
          book={checkoutBook}
          onCancel={() => setCheckoutBook(null)}
          validationSchema={checkoutSchema}
          onSubmit={handleCheckoutSubmit}
        />
      ) : null}
    </main>
  );
}
