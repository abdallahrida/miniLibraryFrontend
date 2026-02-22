import axios from 'axios'

import type { BookFormValues, BooksQueryParams, BooksResponse, CheckoutFormValues } from './homeFeature.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
})

export const homeFeatureService = {
  getBooks(params: BooksQueryParams) {
    return api.get<BooksResponse>('/api/books', { params })
  },

  createBook(payload: BookFormValues) {
    return api.post('/api/books', payload)
  },

  updateBook(bookId: string, payload: BookFormValues) {
    return api.put(`/api/books/${bookId}`, payload)
  },

  deleteBook(bookId: string) {
    return api.delete(`/api/books/${bookId}`)
  },

  checkoutBook(bookId: string, payload: CheckoutFormValues) {
    return api.patch(`/api/books/${bookId}/checkout`, payload)
  },

  checkinBook(bookId: string) {
    return api.patch(`/api/books/${bookId}/checkin`, {})
  },
}
