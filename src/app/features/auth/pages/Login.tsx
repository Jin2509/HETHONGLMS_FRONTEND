import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { LogIn, User, Lock, Eye, EyeOff } from "lucide-react";

const demoUsers = [
  {
    role: "student",
    email: "student@lms.edu",
    password: "student123",
    name: "Nguyễn Văn A",
    description: "Xem khóa học, làm bài tập, thi và xem điểm",
  },
  {
    role: "teacher",
    email: "teacher@lms.edu",
    password: "teacher123",
    name: "Dr. Trần Thị B",
    description: "Chấm bài, xem báo cáo, quản lý lớp học",
  },
  {
    role: "admin",
    email: "admin@lms.edu",
    password: "admin123",
    name: "Admin User",
    description: "Quản lý người dùng và toàn bộ hệ thống",
  },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      login({
        email: user.email,
        name: user.name,
        role: user.role as "student" | "teacher" | "admin",
      });
      navigate("/");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }

    setLoading(false);
  };

  const handleQuickLogin = (user: typeof demoUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    login({
      email: user.email,
      name: user.name,
      role: user.role as "student" | "teacher" | "admin",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">L</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground">LMS Platform</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Hệ thống quản lý học tập hiện đại cho trường đại học
            </p>
            {/* <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-success text-lg">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Học tập linh hoạt</h3>
                  <p className="text-sm text-muted-foreground">
                    Truy cập khóa học, bài giảng mọi lúc mọi nơi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-lg">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Theo dõi tiến độ</h3>
                  <p className="text-sm text-muted-foreground">
                    Quản lý bài tập, lịch thi và điểm số dễ dàng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-warning text-lg">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cộng đồng học tập</h3>
                  <p className="text-sm text-muted-foreground">
                    Trao đổi, thảo luận với giảng viên và bạn bè
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Đăng nhập</h2>
              <p className="text-muted-foreground">
                Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="student@lms.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed button-press"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Hoặc đăng nhập nhanh
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {demoUsers.map((user) => (
                  <button
                    key={user.role}
                    onClick={() => handleQuickLogin(user)}
                    className="p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          user.role === "admin"
                            ? "bg-destructive/10 text-destructive"
                            : user.role === "teacher"
                            ? "bg-primary/10 text-primary"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold capitalize">
                            {user.role === "admin"
                              ? "Quản trị viên"
                              : user.role === "teacher"
                              ? "Giảng viên"
                              : "Sinh viên"}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {user.email}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Chưa có tài khoản?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
