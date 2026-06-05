import { useState, useCallback } from "react";
import { 
  getClasses, 
  getClassDetail, 
  getClassMembers, 
  createClass, 
  enrollStudent, 
  importClassMembers,
  type Class,
  type ClassMember,
  type CreateClassData 
} from "../../../../service/class.service";
import { toast } from "sonner";

export function useClasses() {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classDetail, setClassDetail] = useState<Class | null>(null);
  const [members, setMembers] = useState<ClassMember[]>([]);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải danh sách lớp học";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassDetail = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await getClassDetail(id);
      setClassDetail(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải thông tin chi tiết lớp học";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassMembers = useCallback(async (classId: number) => {
    setLoading(true);
    try {
      const data = await getClassMembers(classId);
      setMembers(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tải danh sách thành viên";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateClass = async (data: CreateClassData) => {
    setLoading(true);
    try {
      const newClass = await createClass(data);
      toast.success("Tạo lớp học thành công");
      return newClass;
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể tạo lớp học";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (classId: number, studentId: number) => {
    try {
      await enrollStudent(classId, studentId);
      toast.success("Thêm sinh viên thành công");
      fetchClassMembers(classId);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể thêm sinh viên";
      toast.error(message);
    }
  };

  const handleImportMembers = async (classId: number, file: File) => {
    setLoading(true);
    try {
      await importClassMembers(classId, file);
      toast.success("Import danh sách sinh viên thành công");
      fetchClassMembers(classId);
    } catch (error: any) {
      const message = error.response?.data?.message || "Không thể import danh sách";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    classes,
    classDetail,
    members,
    fetchClasses,
    fetchClassDetail,
    fetchClassMembers,
    handleCreateClass,
    handleEnrollStudent,
    handleImportMembers,
  };
}
