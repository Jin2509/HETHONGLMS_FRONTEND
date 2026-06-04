import { Link } from "react-router";
import { Users, BookOpen, User } from "lucide-react";

const classes = [
  {
    id: 1,
    name: "Web Development - Class A",
    course: "Web Development",
    instructor: "Dr. Nguyễn Văn B",
    students: 45,
    courses: 3,
    semester: "HK2 2025",
  },
  {
    id: 2,
    name: "Data Structures - Class B",
    course: "Data Structures",
    instructor: "Prof. Trần Thị C",
    students: 38,
    courses: 2,
    semester: "HK2 2025",
  },
  {
    id: 3,
    name: "Database Systems - Class A",
    course: "Database Systems",
    instructor: "Dr. Phạm Thị E",
    students: 42,
    courses: 4,
    semester: "HK2 2025",
  },
];

export function Classes() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lớp học</h1>
        <p className="text-muted-foreground">
          Quản lý lớp học và các khóa học bên trong
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Link
            key={cls.id}
            to={`/classes/${cls.id}`}
            className="bg-card border border-border rounded-xl p-6 shadow-sm card-hover block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {cls.semester}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2">{cls.name}</h3>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{cls.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{cls.students} sinh viên</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{cls.courses} khóa học</span>
              </div>
            </div>

            <div className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center">
              Xem chi tiết
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
