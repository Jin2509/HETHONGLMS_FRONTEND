import { useState, useCallback } from "react";
import { 
  getCourses, 
  getCourseDetail, 
  createChapter, 
  uploadMaterial, 
  deleteMaterial,
  type Course,
  type CourseChapter,
  type CourseMaterial 
} from "../../../../service/course.service";
import { toast } from "sonner";

export function useCourses() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải danh sách khóa học";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourseDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await getCourseDetail(id);
      setCourseDetail(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải chi tiết khóa học";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateChapter = async (courseId: number, name: string) => {
    try {
      const newChapter = await createChapter(courseId, name);
      toast.success("Thêm chương mới thành công");
      fetchCourseDetail(courseId);
      return newChapter;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể thêm chương mới";
      toast.error(message);
    }
  };

  const handleUploadMaterial = async (courseId: number, chapterId: number, file: File, name: string) => {
    setLoading(true);
    try {
      const material = await uploadMaterial(courseId, chapterId, file, name);
      toast.success("Tải lên tài liệu thành công");
      fetchCourseDetail(courseId);
      return material;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải lên tài liệu";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (courseId: number, materialId: number) => {
    try {
      await deleteMaterial(courseId, materialId);
      toast.success("Xóa tài liệu thành công");
      fetchCourseDetail(courseId);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể xóa tài liệu";
      toast.error(message);
    }
  };

  return {
    loading,
    courses,
    courseDetail,
    fetchCourses,
    fetchCourseDetail,
    handleCreateChapter,
    handleUploadMaterial,
    handleDeleteMaterial,
  };
}
