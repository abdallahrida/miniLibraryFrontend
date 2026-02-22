import { AppSearchInput } from "@atoms";
import "./tableToolbar.css";

interface TableToolbarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  statusFilter: "all" | "available" | "borrowed";
  setStatusFilter: (value: "all" | "available" | "borrowed") => void;
  loading: boolean;
}

export default function TableToolbar({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  loading,
}: TableToolbarProps) {
  return (
    <div className="table-toolbar">
      <AppSearchInput
        value={searchInput}
        onChange={setSearchInput}
        placeholder="Search by title, author, ISBN, genre, description, borrower…"
      />
      <label className="table-toolbar__status">
        Status
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "available" | "borrowed")
          }
          disabled={loading}
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </label>
    </div>
  );
}
