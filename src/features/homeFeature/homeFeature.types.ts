export type Book = {
  _id: string
  title: string
  author: string
  isbn: string
  publishedYear: number
  genre: string
  description: string
  status?: string
  borrowedBy?: string | null
}

export type BookFormValues = {
  title: string
  author: string
  isbn: string
  publishedYear: number
  genre: string
  description: string
}

export type CheckoutFormValues = {
  borrowedBy: string
}

export type BooksQueryParams = {
  page: number
  limit: number
  search?: string
  title?: string
  author?: string
  isbn?: string
  genre?: string
  status?: string
  q?: string
}

export type BooksResponse = {
  items: Book[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}
