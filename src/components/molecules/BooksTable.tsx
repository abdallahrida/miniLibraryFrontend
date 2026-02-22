import { useMemo, type Dispatch, type SetStateAction } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table'
import type { Book } from '../../homeFeature.types'
import AppButton from '../atoms/AppButton'
import './BooksTable.css'

type BooksTableProps = {
  books: Book[]
  loading: boolean
  actionLoadingId: string | null
  pagination: PaginationState
  totalPages: number
  totalItems: number
  onPaginationChange: Dispatch<SetStateAction<PaginationState>>
  onEdit: (book: Book) => void
  onDelete: (bookId: string) => void
  onCheckIn: (bookId: string) => void
  onCheckOut: (book: Book) => void
  isBookCheckedOut: (book: Book) => boolean
}

export default function BooksTable({
  books,
  loading,
  actionLoadingId,
  pagination,
  totalPages,
  totalItems,
  onPaginationChange,
  onEdit,
  onDelete,
  onCheckIn,
  onCheckOut,
  isBookCheckedOut,
}: BooksTableProps) {
  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'author', header: 'Author' },
      { accessorKey: 'isbn', header: 'ISBN' },
      { accessorKey: 'publishedYear', header: 'Year' },
      { accessorKey: 'genre', header: 'Genre' },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) =>
          isBookCheckedOut(row.original) ? 'Checked Out' : 'Available',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const book = row.original
          const isBusy = actionLoadingId === book._id
          const checkedOut = isBookCheckedOut(book)

          return (
            <div className="row-actions">
              <AppButton
                type="button"
                variant="secondary"
                onClick={() => onEdit(book)}
                disabled={isBusy}
              >
                Edit
              </AppButton>
              <AppButton
                type="button"
                variant="danger"
                onClick={() => onDelete(book._id)}
                disabled={isBusy}
              >
                Delete
              </AppButton>
              {checkedOut ? (
                <AppButton
                  type="button"
                  variant="success"
                  onClick={() => onCheckIn(book._id)}
                  disabled={isBusy}
                >
                  Check In
                </AppButton>
              ) : (
                <AppButton
                  type="button"
                  variant="primary"
                  onClick={() => onCheckOut(book)}
                  disabled={isBusy}
                >
                  Check Out
                </AppButton>
              )}
            </div>
          )
        },
      },
    ],
    [actionLoadingId, isBookCheckedOut, onCheckIn, onCheckOut, onDelete, onEdit],
  )

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination },
    onPaginationChange,
  })

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>Loading books...</td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>No books found.</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          Page {pagination.pageIndex + 1} of {totalPages} ({totalItems} total
          books)
        </span>
        <div className="pagination-controls">
          <AppButton
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            Previous
          </AppButton>
          <AppButton
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            Next
          </AppButton>
          <label>
            Rows:
            <select
              value={pagination.pageSize}
              onChange={(event) => {
                onPaginationChange({
                  pageIndex: 0,
                  pageSize: Number(event.target.value),
                })
              }}
              disabled={loading}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </>
  )
}
