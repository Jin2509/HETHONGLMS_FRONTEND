import { Link } from "react-router";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-muted-foreground mb-6">
        Trang bạn đang tìm kiếm không tồn tại.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
