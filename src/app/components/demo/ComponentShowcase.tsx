import { useState } from "react";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import {
  DataTable,
  Badge,
  PageHeader,
  Modal,
  ToastContainer,
  EmptyState,
  FileDropzone,
  Skeleton,
  TableSkeleton,
  CardSkeleton,
} from "../shared";
import type { Column, Toast } from "../shared";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "student", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "teacher", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "admin", status: "inactive" },
  ];

  const columns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (value) => (
        <Badge variant={value === "admin" ? "danger" : value === "teacher" ? "primary" : "success"}>
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <Badge variant={value === "active" ? "success" : "neutral"}>{value}</Badge>,
    },
  ];

  const addToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="animate-fade-in space-y-12">
      {/* Page Header Demo */}
      <PageHeader
        title="Component Showcase"
        subtitle="Explore all the shared UI components in the LMS design system"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Components" },
        ]}
        actions={
          <>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              New Item
            </button>
          </>
        }
      />

      {/* Badges */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Completed</Badge>
          <Badge variant="primary">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Overdue</Badge>
          <Badge variant="neutral">Inactive</Badge>
        </div>
      </section>

      {/* DataTable */}
      <section>
        <h2 className="text-xl font-semibold mb-4">DataTable</h2>
        <DataTable
          columns={columns}
          data={users}
          selectable
          onRowClick={(user) => console.log("Clicked:", user)}
        />
      </section>

      {/* Empty State */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Empty State</h2>
        <div className="bg-card border border-border rounded-xl p-6">
          <EmptyState
            icon={Edit}
            title="No assignments yet"
            description="Create your first assignment to get started with the course"
            action={{
              label: "Create Assignment",
              onClick: () => addToast("success", "Assignment created!"),
            }}
          />
        </div>
      </section>

      {/* File Dropzone */}
      <section>
        <h2 className="text-xl font-semibold mb-4">File Dropzone</h2>
        <div className="max-w-md">
          <FileDropzone
            onFileSelect={(file) => {
              setSelectedFile(file);
              addToast("success", `File "${file.name}" selected`);
            }}
            onFileRemove={() => {
              setSelectedFile(null);
              addToast("info", "File removed");
            }}
            selectedFile={selectedFile}
            accept=".pdf,.doc,.docx,.zip"
            maxSize={10}
          />
        </div>
      </section>

      {/* Modal & Toasts */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Modal & Toasts</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Open Modal
          </button>
          <button
            onClick={() => addToast("success", "Operation completed successfully!")}
            className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90"
          >
            Success Toast
          </button>
          <button
            onClick={() => addToast("error", "An error occurred. Please try again.")}
            className="px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90"
          >
            Error Toast
          </button>
          <button
            onClick={() => addToast("warning", "This action requires confirmation.")}
            className="px-4 py-2 bg-warning text-white rounded-lg hover:opacity-90"
          >
            Warning Toast
          </button>
          <button
            onClick={() => addToast("info", "You have 3 new notifications.")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Info Toast
          </button>
        </div>
      </section>

      {/* Skeletons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Skeletons</h2>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowLoading(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Show Loading
          </button>
          <button
            onClick={() => setShowLoading(false)}
            className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50"
          >
            Hide Loading
          </button>
        </div>
        {showLoading ? (
          <div className="space-y-6">
            <TableSkeleton rows={3} columns={4} />
            <div className="grid grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground italic">Click "Show Loading" to see skeleton states</p>
        )}
      </section>

      {/* Modal Component */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                addToast("success", "Action confirmed!");
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-muted-foreground">
          This is a modal dialog with a backdrop blur effect, scale animation, and keyboard support (ESC to close).
        </p>
      </Modal>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
