import { useState, useCallback, useEffect } from "react";
import { getMyGrades, type UserGrade } from "../../../../service/grade.service";
import { toast } from "sonner";

export function useGrades() {
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<UserGrade[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "assignment" | "exam">("all");

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const typeParam = filterType === "all" ? undefined : filterType === "assignment" ? "Bài tập" : "Bài thi";
      const data = await getMyGrades({ 
        query: searchQuery, 
        type: typeParam 
      });
      setGrades(data);
    } catch (error: any) {
      console.error("Failed to fetch grades:", error);
      const message = error.response?.data?.message || "Không thể tải danh sách điểm";
      toast.error(message);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGrades();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchGrades]);

  return {
    loading,
    grades,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    refreshGrades: fetchGrades,
  };
}
