import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { normalizeRole } from "../../utils/permissions";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  ClipboardList,
  FileCheck,
  Award,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  Edit3,
} from "lucide-react";
import { Modal } from "../shared";
import { toast } from "sonner";

const navigationGroups = [
  {
    label: "HỌC TẬP",
    items: [
      { path: "/", icon: LayoutDashboard, label: "Bảng điều khiển" },
      { path: "/schedule", icon: Calendar, label: "Lịch học" },
    ],
  },
  {
    label: "ĐÁNH GIÁ",
    items: [
      { path: "/assignments", icon: ClipboardList, label: "Bài tập" },
      { path: "/exams", icon: FileCheck, label: "Kỳ thi" },
      { path: "/grades", icon: Award, label: "Điểm số" },
    ],
  },
  {
    label: "CỘNG ĐỒNG",
    items: [
      { path: "/discussions", icon: MessageSquare, label: "Thảo luận" },
      { path: "/classes", icon: Users, label: "Lớp học" },
    ],
  },
  {
    label: "QUẢN TRỊ",
    items: [
      { path: "/reports", icon: BarChart3, label: "Báo cáo" },
      { path: "/admin", icon: Settings, label: "Quản trị" },
    ],
  },
];

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userRole = normalizeRole(user?.role);
  const displayName = user?.name || user?.email || "Người dùng";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setProfileFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      studentId: "",
    });
    setShowProfileModal(true);
  };

  const handleSaveProfile = () => {
    setShowProfileModal(false);
    toast.success("Cập nhật thành công", {
      description: "Thông tin cá nhân đã được lưu",
    });
  };

  // Filter navigation based on user role
  const filteredGroups = navigationGroups.filter((group) => {
    if (group.label === "QUẢN TRỊ") {
      // Báo cáo chỉ dành cho Admin, trang Admin chỉ dành cho Admin
      return userRole === "admin";
    }
    return true;
  });

  const filteredNavigationGroups = filteredGroups.map((group) => {
    // ASSESSMENT group: all roles can see Grades now
    return group;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-250 z-40 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
            {!sidebarCollapsed && (
              <h1 className="font-heading font-semibold text-lg text-sidebar-foreground">
                LMS Platform
              </h1>
            )}
            {sidebarCollapsed && (
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {filteredNavigationGroups.map((group) => (
              <div key={group.label} className="mb-6">
                {!sidebarCollapsed && (
                  <div className="px-5 mb-2">
                    <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      {group.label}
                    </span>
                  </div>
                )}
                <div className="space-y-1 px-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-4 bg-sidebar">
            {!sidebarCollapsed ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={handleOpenProfile}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <span className="text-sm font-semibold">
                      {avatarInitial}
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar-foreground truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-sidebar-muted">
                      {userRole === "admin"
                        ? "Quản trị viên"
                        : userRole === "teacher"
                          ? "Giảng viên"
                          : "Sinh viên"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenProfile}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-sidebar-hover hover:bg-sidebar-accent text-sidebar-foreground rounded-lg transition-all hover:shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Hồ sơ</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-sidebar-hover hover:bg-red-500/10 hover:text-red-400 text-sidebar-foreground rounded-lg transition-all"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleOpenProfile}
                  className="w-full flex justify-center"
                  title="Hồ sơ cá nhân"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all">
                    <span className="text-xs font-semibold">
                      {avatarInitial}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center p-2 hover:bg-red-500/10 rounded-lg transition-all group"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4 text-sidebar-foreground group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-7 h-7 bg-sidebar-hover border-2 border-sidebar-border rounded-full flex items-center justify-center shadow-lg hover:bg-sidebar-accent hover:scale-110 transition-all"
          >
            <ChevronLeft
              className={`w-4 h-4 text-sidebar-foreground transition-transform duration-300 ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-250 ${
          sidebarCollapsed ? "ml-16" : "ml-60"
        }`}
      >
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="lg:hidden p-2 hover:bg-slate-100 rounded">
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb would go here */}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, bài tập..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-slate-100 rounded-lg p-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate text-white/70">
                      {displayName}
                      </p>
                      <p className="text-xs text-white/70">
                        {userRole === "admin"
                          ? "Quản trị viên"
                          : userRole === "teacher"
                            ? "Giảng viên"
                            : "Sinh viên"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleOpenProfile();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Hồ sơ cá nhân</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Thông tin cá nhân"
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-medium">
                {avatarInitial}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center hover:bg-slate-50">
                <Edit3 className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              value={profileFormData.name}
              onChange={(e) =>
                setProfileFormData({ ...profileFormData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={profileFormData.email}
              onChange={(e) =>
                setProfileFormData({
                  ...profileFormData,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="email@example.com"
            />
          </div>

          {userRole === "student" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Mã sinh viên
              </label>
              <input
                type="text"
                value={profileFormData.studentId}
                onChange={(e) =>
                  setProfileFormData({
                    ...profileFormData,
                    studentId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nhập mã sinh viên"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={profileFormData.phone}
              onChange={(e) =>
                setProfileFormData({
                  ...profileFormData,
                  phone: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+84 123 456 789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <input
              type="text"
              value={
                userRole === "admin"
                  ? "Quản trị viên"
                  : userRole === "teacher"
                    ? "Giảng viên"
                    : "Sinh viên"
              }
              disabled
              className="w-full px-3 py-2 border border-input rounded-lg bg-slate-50 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="border-t border-border pt-4">
            <button
              onClick={handleOpenProfile}
              className="w-full text-sm text-primary hover:underline mb-2"
            >
              Đổi mật khẩu
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSaveProfile}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => setShowProfileModal(false)}
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
