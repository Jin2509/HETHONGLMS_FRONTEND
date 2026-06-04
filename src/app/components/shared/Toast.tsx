import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    className: "border-l-4 border-success bg-success/5",
    iconColor: "text-success",
  },
  error: {
    icon: XCircle,
    className: "border-l-4 border-destructive bg-destructive/5",
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertCircle,
    className: "border-l-4 border-warning bg-warning/5",
    iconColor: "text-warning",
  },
  info: {
    icon: Info,
    className: "border-l-4 border-primary bg-primary/5",
    iconColor: "text-primary",
  },
};

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 p-4 bg-card border border-border rounded-lg shadow-lg max-w-md ${config.className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <p className="flex-1 text-sm text-card-foreground">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 hover:bg-slate-100 rounded transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.slice(0, 3).map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
