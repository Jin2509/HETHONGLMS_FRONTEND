import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Download, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { Modal, Badge, DataTable } from "../../../components/shared";
import type { Column } from "../../../components/shared";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  importUsers, 
  exportUsers,
  type User,
  type CreateUserData 
} from "../../../../service/admin.service";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    role: "student",
    status: "active",
    studentId: "",
    phone: "",
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getUsers({
        search: searchQuery,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      const message = error.response?.data?.message || "Không thể tải danh sách người dùng";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "danger";
      case "teacher":
        return "primary";
      case "student":
        return "success";
      default:
        return "neutral";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Quản trị viên";
      case "teacher":
        return "Giảng viên";
      case "student":
        return "Sinh viên";
      default:
        return role;
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setIsActionLoading(true);
      await createUser(formData);
      toast.success("Tạo người dùng thành công");
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tạo người dùng");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    
    try {
      setIsActionLoading(true);
      await updateUser(selectedUser.id, formData);
      toast.success("Cập nhật thành công");
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể cập nhật thông tin");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setIsActionLoading(true);
      await deleteUser(selectedUser.id);
      toast.success("Xóa người dùng thành công");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xóa người dùng");
    } finally {
      setIsActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "student",
      status: "active",
      studentId: "",
      phone: "",
    });
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: (user.role?.toLowerCase() || "student") as CreateUserData["role"],
      status: (user.status?.toLowerCase() || "active") as CreateUserData["status"],
      studentId: user.studentId || "",
      phone: user.phone || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleExport = async () => {
    try {
      toast.loading("Đang chuẩn bị file...");
      const blob = await exportUsers();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `DanhSachNguoiDung_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Xuất file thành công");
    } catch (error) {
      toast.dismiss();
      toast.error("Không thể xuất file");
    }
  };

  // Import from Excel
  const handleImport = async () => {
    if (!importFile) return;

    try {
      setIsActionLoading(true);
      const result = await importUsers(importFile);
      toast.success(`Import thành công ${result.imported} người dùng`);
      if (result.failed > 0) {
        toast.warning(`Có ${result.failed} người dùng bị lỗi khi import`);
      }
      setShowImportModal(false);
      setImportFile(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể import người dùng");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Download template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "MSSV/Mã GV": "20210001",
        "Họ và tên": "Nguyễn Văn A",
        "Email": "student@example.com",
        "Vai trò": "Sinh viên",
        "Số điện thoại": "+84 123 456 789",
      },
      {
        "MSSV/Mã GV": "GV001",
        "Họ và tên": "Trần Thị B",
        "Email": "teacher@example.com",
        "Vai trò": "Giảng viên",
        "Số điện thoại": "+84 987 654 321",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    ws["!cols"] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];

    XLSX.writeFile(wb, "Template_Import_Users.xlsx");
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Tên",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
            {(row.name || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{value as string}</p>
            {row.studentId && (
              <p className="text-xs text-muted-foreground">{row.studentId}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (value) => (
        <span className="text-muted-foreground">{value as string}</span>
      ),
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (value) => (
        <span className="text-sm">{value || "-"}</span>
      ),
    },
    {
      key: "role",
      label: "Vai trò",
      sortable: true,
      render: (value) => (
        <Badge variant={getRoleBadge(value as string)}>
          {getRoleLabel(value as string)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) =>
        String(value).toLowerCase() === "active" ? (
          <span className="flex items-center gap-1 text-success">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Hoạt động</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Ngừng</span>
          </span>
        ),
    },
    {
      key: "id",
      label: "Hành động",
      render: (_, user) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(user)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(user)}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tài khoản và quyền của người dùng trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-foreground mb-1">
            {isLoading ? "..." : users.length}
          </p>
          <p className="text-sm text-muted-foreground">Tổng người dùng</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-success mb-1">
            {isLoading ? "..." : users.filter((u) => u.role?.toLowerCase() === "student").length}
          </p>
          <p className="text-sm text-muted-foreground">Sinh viên</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-primary mb-1">
            {isLoading ? "..." : users.filter((u) => u.role?.toLowerCase() === "teacher").length}
          </p>
          <p className="text-sm text-muted-foreground">Giảng viên</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-bold text-destructive mb-1">
            {isLoading ? "..." : users.filter((u) => u.role?.toLowerCase() === "admin").length}
          </p>
          <p className="text-sm text-muted-foreground">Quản trị viên</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="student">Sinh viên</option>
          <option value="teacher">Giảng viên</option>
          <option value="admin">Quản trị viên</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng</option>
        </select>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo người dùng</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl shadow-sm">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Đang tải danh sách người dùng...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          selectable
          emptyMessage="Không tìm thấy người dùng nào"
        />
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          if (!isActionLoading) {
            setShowCreateModal(false);
            resetForm();
          }
        }}
        title="Tạo người dùng mới"
        footer={
          <>
            <button
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={isActionLoading}
              className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              disabled={isActionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Tạo</span>
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nguyễn Văn A"
              disabled={isActionLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="email@example.com"
              disabled={isActionLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vai trò *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isActionLoading}
              >
                <option value="student">Sinh viên</option>
                <option value="teacher">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isActionLoading}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              MSSV / Mã GV
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="20210001"
              disabled={isActionLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="+84 123 456 789"
              disabled={isActionLoading}
            />
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          if (!isActionLoading) {
            setShowEditModal(false);
            setSelectedUser(null);
            resetForm();
          }
        }}
        title="Chỉnh sửa người dùng"
        footer={
          <>
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
                resetForm();
              }}
              disabled={isActionLoading}
              className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleEdit}
              disabled={isActionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Lưu</span>
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isActionLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isActionLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Vai trò *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isActionLoading}
              >
                <option value="student">Sinh viên</option>
                <option value="teacher">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isActionLoading}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">MSSV / Mã GV</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isActionLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Số điện thoại</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isActionLoading}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isActionLoading) {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }
        }}
        title="Xác nhận xóa"
        maxWidth="sm"
        footer={
          <>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
              disabled={isActionLoading}
              className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              disabled={isActionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Xóa ngay</span>
            </button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Bạn có chắc chắn muốn xóa người dùng{" "}
          <span className="font-medium text-foreground">{selectedUser?.name}</span>? Hành
          động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Import Excel Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          if (!isActionLoading) {
            setShowImportModal(false);
            setImportFile(null);
          }
        }}
        title="Import người dùng từ Excel"
        footer={
          <>
            <button
              onClick={() => {
                setShowImportModal(false);
                setImportFile(null);
              }}
              disabled={isActionLoading}
              className="px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleImport}
              disabled={!importFile || isActionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Import</span>
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              <strong>Lưu ý:</strong> File Excel cần có các cột sau:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Họ và tên</li>
              <li>Email</li>
              <li>Vai trò (Sinh viên / Giảng viên / Quản trị viên)</li>
              <li>MSSV/Mã GV (tùy chọn)</li>
              <li>Số điện thoại (tùy chọn)</li>
            </ul>
          </div>

          <button
            onClick={handleDownloadTemplate}
            disabled={isActionLoading}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-input rounded-lg hover:bg-slate-50 w-full justify-center disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tải template mẫu</span>
          </button>

          <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImportFile(e.target.files[0]);
                }
              }}
              className="hidden"
              id="excel-upload"
              disabled={isActionLoading}
            />
            <label htmlFor="excel-upload" className={isActionLoading ? "cursor-not-allowed" : "cursor-pointer"}>
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">
                Click để chọn file Excel
              </p>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ: .xlsx, .xls
              </p>
            </label>
          </div>

          {importFile && (
            <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-success" />
              <span className="text-sm font-medium flex-1">{importFile.name}</span>
              {!isActionLoading && (
                <button
                  onClick={() => setImportFile(null)}
                  className="text-sm text-destructive hover:underline"
                >
                  Xóa
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
