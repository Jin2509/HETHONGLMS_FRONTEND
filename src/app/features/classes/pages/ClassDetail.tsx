import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ChevronLeft,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Download,
  Search,
  Mail,
  Phone,
  User as UserIcon,
  Award,
  Clock,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Play,
  Upload,
  FileUp,
  Loader2,
} from "lucide-react";
import { Badge, DataTable, Modal } from "../../../components/shared";
import type { Column } from "../../../components/shared";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext";
import { canViewAllSubmissions, canManageContent } from "../../../utils/permissions";
import { TeacherGradeManagement } from "../components/TeacherGradeManagement";
import { useClasses } from "../hooks/useClasses";
import { getClassDetail, type ClassMember } from "../../../../service/class.service";
import { getCourses, type Course } from "../../../../service/course.service";

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
}

export interface Material {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  url?: string;
}

export interface CourseWithProgress extends Course {
  thumbnail?: string;
  status?: string;
  lessons?: number;
  duration?: string;
  progress?: number;
}

export interface ClassDetailData {
  id: number;
  name: string;
  code: string;
  course: string;
  instructor: string;
  instructorEmail: string;
  instructorPhone: string;
  semester: string;
  schedule: string;
  room: string;
  students: number;
  startDate: string;
  endDate: string;
}

export function ClassDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const canViewStudents = canViewAllSubmissions(userRole);
  const { fetchClassDetail, fetchClassMembers } = useClasses();
  
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "courses" | "materials" | "announcements" | "grades">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassDetailData | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    description: "",
    thumbnail: "",
    lessons: 20,
    duration: "",
  });
  const [materialFormData, setMaterialFormData] = useState({
    name: "",
    type: "PDF",
    file: null as File | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch class detail
        const classDetail = await getClassDetail(Number(id));
        setClassData({
          id: classDetail.id,
          name: classDetail.name,
          code: classDetail.name.split(' ')[0] || 'N/A',
          course: classDetail.name,
          instructor: classDetail.instructorName || 'N/A',
          instructorEmail: 'instructor@university.edu',
          instructorPhone: '+84 123 456 789',
          semester: classDetail.semester,
          schedule: 'Thứ 2, 13:00 - 15:00',
          room: 'Room A101',
          students: classDetail.studentCount || 0,
          startDate: '2026-02-01',
          endDate: '2026-06-15',
        });

        // Fetch class members
        await fetchClassMembers(Number(id));
        // Note: members are stored in the hook's state, we'll use them from there
        // For now, we'll use an empty array and the hook will update the state
        const students: Student[] = [];
        setClassStudents(students);
        setAllStudents(students);

        // Fetch courses for this class
        try {
          const classCourses = await getCourses();
          // Transform courses to include UI-specific properties
          const coursesWithProgress: CourseWithProgress[] = classCourses.map((course): CourseWithProgress => ({
            ...course,
            thumbnail: course.thumbnailUrl,
            status: 'Đang học',
            lessons: course.chapters?.reduce((acc, chapter) => acc + chapter.materials.length, 0) || 0,
            duration: '8 tuần',
            progress: 0,
          }));
          setCourses(coursesWithProgress);
        } catch (error) {
          console.error('Failed to fetch courses:', error);
          setCourses([]);
        }

        // TODO: Fetch materials from backend when API is available
        setMaterials([]);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
        toast.error('Không thể tải thông tin lớp học');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, fetchClassDetail, fetchClassMembers]);

  const filteredStudents = searchQuery.trim() === ""
    ? classStudents
    : allStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentId.includes(searchQuery)
      );

  const handleToggleStudent = (student: Student) => {
    const isMember = classStudents.some((s) => s.id === student.id);
    if (isMember) {
      setClassStudents(classStudents.filter((s) => s.id !== student.id));
      toast.success(`Đã xóa ${student.name} khỏi lớp học`);
    } else {
      setClassStudents([...classStudents, student]);
      toast.success(`Đã thêm ${student.name} vào lớp học`);
    }
  };

  const handleCreateCourse = () => {
    setCourseFormData({ name: "", description: "", thumbnail: "", lessons: 20, duration: "" });
    setShowCreateCourseModal(true);
  };

  const handleUploadMaterial = () => {
    setMaterialFormData({ name: "", type: "PDF", file: null });
    setShowUploadMaterialModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      try {
        toast.info(`Đang xử lý file: ${file.name}`);
        // TODO: Implement actual file upload API call
        // await handleImportMembers(Number(id), file);
        setTimeout(() => {
          toast.success(`Đã nhập dữ liệu thành công từ file ${file.name}`);
        }, 1000);
      } catch (error) {
        toast.error('Không thể tải lên file');
      }
    }
  };

  const handleEditCourse = (course: CourseWithProgress) => {
    setSelectedCourse(course);
    setCourseFormData({
      name: course.name,
      description: course.description || '',
      thumbnail: course.thumbnail || course.thumbnailUrl || '',
      lessons: course.lessons || 20,
      duration: course.duration || '',
    });
    setShowEditCourseModal(true);
  };

  const handleDeleteCourse = (course: CourseWithProgress) => {
    setSelectedCourse(course);
    setShowDeleteCourseModal(true);
  };

  const handleSaveCreateCourse = async () => {
    if (!courseFormData.name || !id) {
      toast.error("Vui lòng nhập tên khóa học");
      return;
    }
    try {
      // TODO: Implement actual course creation API call
      // const newCourse = await createCourse({
      //   name: courseFormData.name,
      //   description: courseFormData.description,
      //   thumbnailUrl: courseFormData.thumbnail,
      // });
      
      const newCourse: CourseWithProgress = {
        id: Date.now(),
        name: courseFormData.name,
        description: courseFormData.description,
        thumbnailUrl: courseFormData.thumbnail,
        thumbnail: courseFormData.thumbnail,
        status: 'Đang học',
        lessons: courseFormData.lessons,
        duration: courseFormData.duration,
        progress: 0,
        chapters: [],
      };
      
      setCourses([...courses, newCourse]);
      setShowCreateCourseModal(false);
      toast.success("Tạo khóa học thành công", {
        description: `Khóa học "${courseFormData.name}" đã được thêm vào lớp`,
      });
    } catch (error) {
      toast.error('Không thể tạo khóa học');
    }
  };

  const handleSaveEditCourse = async () => {
    if (!selectedCourse || !courseFormData.name) {
      toast.error("Vui lòng nhập tên khóa học");
      return;
    }
    try {
      // TODO: Implement actual course update API call
      // await updateCourse(selectedCourse.id, {
      //   name: courseFormData.name,
      //   description: courseFormData.description,
      //   thumbnailUrl: courseFormData.thumbnail,
      // });
      
      setCourses(courses.map(c => 
        c.id === selectedCourse.id 
          ? { 
              ...c, 
              name: courseFormData.name,
              description: courseFormData.description,
              thumbnail: courseFormData.thumbnail,
              thumbnailUrl: courseFormData.thumbnail,
            } 
          : c
      ));
      
      setShowEditCourseModal(false);
      toast.success("Cập nhật thành công", {
        description: "Thông tin khóa học đã được lưu",
      });
    } catch (error) {
      toast.error('Không thể cập nhật khóa học');
    }
  };

  const handleConfirmDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      // TODO: Implement actual course deletion API call
      // await deleteCourse(selectedCourse.id);
      
      const courseName = selectedCourse.name;
      setCourses(courses.filter(c => c.id !== selectedCourse.id));
      setShowDeleteCourseModal(false);
      toast.success("Xóa thành công", {
        description: `Khóa học "${courseName}" đã được xóa`,
      });
    } catch (error) {
      toast.error('Không thể xóa khóa học');
    }
  };

  const handleSaveUploadMaterial = async () => {
    if (!materialFormData.name || !materialFormData.file || !id) {
      toast.error('Vui lòng nhập tên tài liệu và chọn file');
      return;
    }
    try {
      // TODO: Implement actual material upload API call
      // const formData = new FormData();
      // formData.append('file', materialFormData.file);
      // formData.append('name', materialFormData.name);
      // formData.append('type', materialFormData.type);
      // await apiClient.post(`/classes/${id}/materials`, formData);
      
      const newMaterial: Material = {
        id: Date.now(),
        name: materialFormData.name,
        type: materialFormData.type,
        size: `${(materialFormData.file.size / 1024 / 1024).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0],
      };
      setMaterials([...materials, newMaterial]);
      setShowUploadMaterialModal(false);
      toast.success("Tải lên tài liệu thành công", {
        description: `Tài liệu "${materialFormData.name}" đã được lưu`,
      });
    } catch (error) {
      toast.error('Không thể tải lên tài liệu');
    }
  };

  const columns: Column<Student>[] = [
    {
      key: "studentId",
      label: "MSSV",
      sortable: true,
    },
    {
      key: "name",
      label: "Họ và tên",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {row.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{value as string}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Thao tác",
      render: (_, row) => {
        const isMember = classStudents.some((s) => s.id === row.id);
        if (!canManageContent(userRole)) return null;
        
        return (
          <button
            onClick={() => handleToggleStudent(row)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isMember 
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            }`}
          >
            {isMember ? (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Xóa khỏi lớp
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Thêm vào lớp
              </>
            )}
          </button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Đang tải thông tin lớp học...</p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Không tìm thấy thông tin lớp học</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/classes" className="text-sm text-primary hover:underline">
          ← Quay lại danh sách lớp học
        </Link>
      </div>

      {/* Class Header */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{classData.name}</h1>
                  <Badge variant="primary">{classData.semester}</Badge>
                </div>
                <p className="text-muted-foreground mb-1">
                  Mã lớp: <span className="font-medium text-foreground">{classData.code}</span>
                </p>
                <p className="text-muted-foreground">
                  {classData.startDate} - {classData.endDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{classData.instructor}</p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${classData.instructorEmail}`} className="hover:text-primary">
                        {classData.instructorEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{classData.instructorPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{classData.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span>{classData.room}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{classData.students} sinh viên</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Tham gia lớp học
            </button>
            <button className="px-6 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 transition-colors">
              Xuất danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6">
          {[
            { key: "overview", label: "Tổng quan", icon: BookOpen },
            { key: "students", label: "Sinh viên", icon: Users, teacherOnly: true },
            { key: "courses", label: "Khóa học", icon: Play },
            { key: "materials", label: "Tài liệu", icon: FileText },
            { key: "grades", label: "Điểm số", icon: Award, teacherOnly: true },
            { key: "announcements", label: "Thông báo", icon: MessageSquare },
          ]
            .filter((tab) => !tab.teacherOnly || canViewStudents)
            .map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <Award className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold mb-1">{classData.students}</p>
            <p className="text-sm text-muted-foreground">Sinh viên đăng ký</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <Award className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">8.4</p>
            <p className="text-sm text-muted-foreground">Điểm trung bình</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">92%</p>
            <p className="text-sm text-muted-foreground">Tỷ lệ điểm danh</p>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Tài liệu mới: Slide bài giảng tuần 1-4</p>
                  <p className="text-xs text-muted-foreground mt-1">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Award className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Đã chấm xong bài tập tuần 3</p>
                  <p className="text-xs text-muted-foreground mt-1">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Thông báo: Lịch thi giữa kỳ</p>
                  <p className="text-xs text-muted-foreground mt-1">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "students" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={canManageContent(userRole) ? "Tìm kiếm MSSV hoặc tên để thêm..." : "Tìm kiếm sinh viên..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 text-sm font-medium">
                <Download className="w-4 h-4" />
                Xuất Excel
              </button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredStudents}
            selectable
            emptyMessage="Không tìm thấy sinh viên nào"
          />
        </div>
      )}

      {activeTab === "courses" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Quản lý các khóa học trong lớp {classData.name}
            </p>
            {canManageContent(userRole) && (
              <button
                onClick={handleCreateCourse}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Tạo khóa học</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm card-hover group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={course.thumbnail || course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.status === "Đang học"
                          ? "bg-primary text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManageContent(userRole) && (
                      <>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 min-h-[3rem]">
                    {course.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} bài
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tiến độ</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-4 block w-full py-2 bg-slate-100 text-center rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có khóa học nào trong lớp này</p>
              <button
                onClick={handleCreateCourse}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Tạo khóa học đầu tiên
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "materials" && (
        <div className="space-y-4">
          {canManageContent(userRole) && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleUploadMaterial}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Thêm tài liệu
              </button>
            </div>
          )}
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{material.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{material.type}</span>
                    <span>{material.size}</span>
                    <span>{new Date(material.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  <Download className="w-4 h-4" />
                  Tải xuống
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "grades" && canViewStudents && (
        <TeacherGradeManagement classId={Number(id)} />
      )}

      {activeTab === "announcements" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Thông báo lịch thi giữa kỳ</h3>
                <p className="text-muted-foreground mb-3">
                  Kỳ thi giữa kỳ sẽ diễn ra vào ngày 15/04/2026, thời gian 90 phút. Sinh viên cần
                  mang theo thẻ sinh viên và đến đúng giờ.
                </p>
                <p className="text-xs text-muted-foreground">
                  Đăng bởi {classData.instructor} • 3 ngày trước
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Cập nhật tài liệu học tập</h3>
                <p className="text-muted-foreground mb-3">
                  Đã upload slide bài giảng tuần 1-4. Các bạn vào mục Tài liệu để tải về.
                </p>
                <p className="text-xs text-muted-foreground">
                  Đăng bởi {classData.instructor} • 1 tuần trước
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      <Modal
        isOpen={showCreateCourseModal}
        onClose={() => setShowCreateCourseModal(false)}
        title="Tạo khóa học mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên khóa học *</label>
            <input
              type="text"
              value={courseFormData.name}
              onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tên khóa học"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={courseFormData.description}
              onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              placeholder="Nhập mô tả khóa học"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ảnh thumbnail (URL)</label>
            <input
              type="text"
              value={courseFormData.thumbnail}
              onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số lượng bài học</label>
              <input
                type="number"
                value={courseFormData.lessons}
                onChange={(e) => setCourseFormData({ ...courseFormData, lessons: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng</label>
              <input
                type="text"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="8 tuần"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveCreateCourse}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Tạo khóa học
            </button>
            <button
              onClick={() => setShowCreateCourseModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={showEditCourseModal}
        onClose={() => setShowEditCourseModal(false)}
        title="Chỉnh sửa khóa học"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên khóa học *</label>
            <input
              type="text"
              value={courseFormData.name}
              onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={courseFormData.description}
              onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ảnh thumbnail (URL)</label>
            <input
              type="text"
              value={courseFormData.thumbnail}
              onChange={(e) => setCourseFormData({ ...courseFormData, thumbnail: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số lượng bài học</label>
              <input
                type="number"
                value={courseFormData.lessons}
                onChange={(e) => setCourseFormData({ ...courseFormData, lessons: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thời lượng</label>
              <input
                type="text"
                value={courseFormData.duration}
                onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveEditCourse}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => setShowEditCourseModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Course Modal */}
      <Modal
        isOpen={showDeleteCourseModal}
        onClose={() => setShowDeleteCourseModal(false)}
        title="Xác nhận xóa"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa khóa học <strong>{selectedCourse?.name}</strong>?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleConfirmDeleteCourse}
              className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Xóa
            </button>
            <button
              onClick={() => setShowDeleteCourseModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Material Modal */}
      <Modal
        isOpen={showUploadMaterialModal}
        onClose={() => setShowUploadMaterialModal(false)}
        title="Thêm tài liệu mới"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên tài liệu *</label>
            <input
              type="text"
              value={materialFormData.name}
              onChange={(e) => setMaterialFormData({ ...materialFormData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="VD: Slide bài giảng tuần 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Loại tài liệu</label>
            <select
              value={materialFormData.type}
              onChange={(e) => setMaterialFormData({ ...materialFormData, type: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="PDF">PDF</option>
              <option value="ZIP">ZIP</option>
              <option value="DOCX">DOCX</option>
              <option value="PPTX">PPTX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">File tài liệu *</label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setMaterialFormData({ ...materialFormData, file: e.target.files?.[0] || null })}
              />
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {materialFormData.file ? materialFormData.file.name : "Kéo thả hoặc click để chọn file"}
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveUploadMaterial}
              disabled={!materialFormData.name || !materialFormData.file}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Tải lên
            </button>
            <button
              onClick={() => setShowUploadMaterialModal(false)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}