import { AppButton } from "@atoms";
import "./header.css"

interface HeaderProps {
  onCreate: () => void;
}

export default function Header({ onCreate }: HeaderProps) {
  return (
    <div className="page-header">
      <div>
        <h1>Mini Library Management System</h1>
        <p>Manage books, borrowing, and returns.</p>
      </div>
      <AppButton type="button" variant="primary" onClick={onCreate}>
        Create
      </AppButton>
    </div>
  );
}
