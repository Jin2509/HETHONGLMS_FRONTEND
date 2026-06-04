import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <div className="w-16 h-16 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {description && <p className="text-muted-foreground mb-6 max-w-md">{description}</p>}

      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
