import { useState, useCallback } from "react";
import { 
  getGradesByClass, 
  updateGrade, 
  type CourseGrade, 
  type StudentGradeUpdate 
} from "../../../../service/grade.service";
import { toast } from "sonner";

export function useTeacherGrades(classId: number) {
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<CourseGrade[]>([]);

  const fetchClassGrades = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const data = await getGradesByClass(classId);
      setGrades(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải danh sách điểm của lớp";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const handleUpdateGrade = async (data: StudentGradeUpdate) => {
    try {
      await updateGrade(classId, data);
      toast.success("Cập nhật điểm thành công");
      fetchClassGrades();
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể cập nhật điểm";
      toast.error(message);
      throw error;
    }
  };

  return {
    loading,
    grades,
    fetchClassGrades,
    handleUpdateGrade,
  };
}
