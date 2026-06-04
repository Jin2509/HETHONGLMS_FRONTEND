# Authentication & Authorization Guide

## 🔐 Overview

The LMS platform now includes a complete authentication system with role-based access control (RBAC). Users can log in as Student, Teacher, or Admin, with different permissions and UI for each role.

---

## 👥 User Roles

### 1. Student (Sinh viên)
**Credentials**: 
- Email: `student@lms.edu`
- Password: `student123`

**Access**:
- ✅ Dashboard
- ✅ Courses (view and learn)
- ✅ Assignments (submit)
- ✅ Exams (take exams)
- ✅ Grades (view own grades)
- ✅ Discussions (participate)
- ✅ Schedule (view)
- ✅ Classes (view enrolled classes)
- ❌ Reports (no access)
- ❌ Admin (no access)

### 2. Teacher (Giảng viên)
**Credentials**:
- Email: `teacher@lms.edu`
- Password: `teacher123`

**Access**:
- ✅ Dashboard
- ✅ Courses (view and manage)
- ✅ Assignments (grade submissions)
- ✅ Exams (create and grade)
- ✅ Grades (view all students)
- ✅ Discussions (moderate)
- ✅ Schedule (manage)
- ✅ Classes (manage)
- ✅ Reports (view analytics)
- ❌ Admin (no access)

### 3. Admin (Quản trị viên)
**Credentials**:
- Email: `admin@lms.edu`
- Password: `admin123`

**Access**:
- ✅ **Full access to all features**
- ✅ User Management
- ✅ System Reports
- ✅ All student and teacher features

---

## 🚀 How to Login

### Method 1: Quick Login (Demo)
On the login page, click one of the three role cards to instantly log in:
- **Sinh viên** - Student access
- **Giảng viên** - Teacher access
- **Quản trị viên** - Admin access

### Method 2: Manual Login
1. Enter email and password
2. Click "Đăng nhập"
3. Use credentials from the table above

---

## 🔒 Protected Routes

### Public Routes
- `/login` - Login page (accessible to all)

### Protected Routes (Require Authentication)
All routes below require login:
- `/` - Dashboard
- `/courses` - Courses
- `/assignments` - Assignments
- `/exams` - Exams
- `/grades` - Grades
- `/discussions` - Discussions
- `/schedule` - Schedule
- `/classes` - Classes

### Role-Restricted Routes
These routes check user role:
- `/reports` - **Teacher or Admin only**
- `/admin` - **Admin only**

If a user tries to access a restricted route, they are redirected to the dashboard.

---

## 🎨 UI Changes Based on Role

### Sidebar Navigation
The sidebar dynamically shows/hides sections based on role:

**All Roles See**:
- Learning (Dashboard, Courses, Schedule)
- Assessment (Assignments, Exams, Grades)
- Community (Discussions, Classes)

**Teacher + Admin See**:
- Manage (Reports, Admin*)

**Admin Only Sees**:
- Manage → Admin

### User Badge
The sidebar footer displays:
- User's first name initial in a circle
- Full name
- Role badge (Sinh viên / Giảng viên / Quản trị viên)
- Logout button

### Greeting
Dashboard greeting shows the logged-in user's name.

---

## 🛠️ Technical Implementation

### Auth Context (`/src/app/contexts/AuthContext.tsx`)
Provides authentication state and methods:
```typescript
interface User {
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
}

const { user, isAuthenticated, login, logout } = useAuth();
```

### Protected Route Wrapper (`/src/app/components/ProtectedRoute.tsx`)
Protects routes and checks roles:
```typescript
<ProtectedRoute allowedRoles={["teacher", "admin"]}>
  <Reports />
</ProtectedRoute>
```

### Session Persistence
User session is saved to `localStorage` as `lms_user`:
- Persists across page refreshes
- Cleared on logout
- Auto-loads on app mount

---

## 🔄 Login Flow

1. **User visits any protected route** → Redirected to `/login`
2. **User enters credentials or clicks quick login**
3. **Credentials validated** against demo users
4. **User object stored** in AuthContext + localStorage
5. **Redirect to dashboard** (`/`)
6. **Navigation filtered** based on user role

---

## 🚪 Logout Flow

1. **User clicks logout** button in sidebar
2. **AuthContext.logout()** called
3. **User object cleared** from state + localStorage
4. **Redirect to `/login`**

---

## 🎯 Demo Accounts Summary

| Role | Email | Password | Name | Description |
|------|-------|----------|------|-------------|
| Student | student@lms.edu | student123 | Nguyễn Văn A | View courses, submit assignments, take exams |
| Teacher | teacher@lms.edu | teacher123 | Dr. Trần Thị B | Grade assignments, view reports, manage classes |
| Admin | admin@lms.edu | admin123 | Admin User | Full system access, user management |

---

## 🔐 Security Notes

### Current Implementation (Demo)
- ⚠️ Passwords stored in plain text (demo only)
- ⚠️ No backend API (client-side only)
- ⚠️ Demo users hardcoded

### Production Recommendations
- 🔒 Hash passwords (bcrypt)
- 🔒 Use JWT or session tokens
- 🔒 Implement backend authentication API
- 🔒 Add CSRF protection
- 🔒 Rate limiting on login
- 🔒 Two-factor authentication (2FA)
- 🔒 Password reset flow
- 🔒 Account lockout after failed attempts
- 🔒 Secure session management
- 🔒 HTTPS only

---

## 📱 Features by Role

### Student Can:
- Browse and enroll in courses
- Watch video lessons
- Submit assignments
- Take exams
- View grades and GPA
- Participate in discussions
- Check schedule
- View class roster

### Teacher Can:
- All student features +
- Grade assignments
- Create and grade exams
- View class reports
- Manage course content
- Moderate discussions
- View enrollment analytics

### Admin Can:
- All teacher features +
- **Full User Management**:
  - Create users (individual or bulk via Excel)
  - Edit any user's information
  - Delete users with confirmation
  - Import hundreds of users from Excel file
  - Export user list to Excel
  - Search and filter users by role
  - View user statistics dashboard
- View system-wide reports
- Configure platform settings
- Monitor platform usage
- Export data

**📚 See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for complete admin user management guide.**

---

## 🎨 Login Page Design

### Visual Elements
- **Left Side (Desktop)**:
  - LMS branding and logo
  - Feature highlights with checkmarks
  - Gradient background

- **Right Side**:
  - Login form card
  - Email and password fields
  - Remember me checkbox
  - Forgot password link
  - Quick login demo cards

### Responsive
- **Desktop**: Two-column layout
- **Tablet/Mobile**: Stacked layout, branding hidden

---

## 🧪 Testing Guide

### Test Scenario 1: Student Access
1. Log in as student
2. Verify sidebar shows only student sections
3. Try accessing `/reports` → redirected to `/`
4. Try accessing `/admin` → redirected to `/`
5. Submit an assignment
6. Take an exam

### Test Scenario 2: Teacher Access
1. Log in as teacher
2. Verify "Reports" appears in sidebar
3. Access `/reports` successfully
4. Try accessing `/admin` → redirected to `/`
5. Grade student submissions

### Test Scenario 3: Admin Access
1. Log in as admin
2. Verify all sidebar sections visible
3. Access `/reports` successfully
4. Access `/admin` successfully
5. View and manage users

### Test Scenario 4: Persistence
1. Log in as any role
2. Refresh page
3. Verify still logged in
4. Check user data persists

### Test Scenario 5: Logout
1. Log in
2. Click logout
3. Verify redirected to `/login`
4. Verify cannot access protected routes
5. Verify localStorage cleared

---

## 🔧 Customization

### Adding a New Role
1. Update `User` interface in `AuthContext.tsx`
2. Add demo user to `demoUsers` array in `Login.tsx`
3. Update `ProtectedRoute` allowedRoles checks
4. Filter navigation in `MainLayout.tsx`
5. Create role-specific UI components

### Changing Role Labels
Edit the role display text in `MainLayout.tsx`:
```typescript
{user?.role === "admin"
  ? "Quản trị viên"
  : user?.role === "teacher"
  ? "Giảng viên"
  : "Sinh viên"}
```

### Adding New Protected Routes
```typescript
{
  path: "new-feature",
  element: (
    <ProtectedRoute allowedRoles={["admin"]}>
      <NewFeature />
    </ProtectedRoute>
  ),
}
```

---

## 📚 Related Files

- `/src/app/features/auth/pages/Login.tsx` - Login UI
- `/src/app/contexts/AuthContext.tsx` - Auth state management
- `/src/app/components/ProtectedRoute.tsx` - Route protection
- `/src/app/components/layout/MainLayout.tsx` - Role-based navigation
- `/src/app/routes.tsx` - Route configuration
- `/src/app/App.tsx` - AuthProvider wrapper

---

## 🎯 Next Steps

### Potential Enhancements
1. **Backend Integration**
   - Connect to real authentication API
   - Implement JWT token refresh
   - Add OAuth providers (Google, Microsoft)

2. **Password Management**
   - Forgot password flow
   - Email verification
   - Password strength requirements
   - Password reset

3. **User Profile**
   - Profile page
   - Avatar upload
   - Edit personal info
   - Notification preferences

4. **Security**
   - 2FA support
   - Login history
   - Active sessions management
   - IP whitelist/blacklist

5. **Onboarding**
   - Registration flow
   - Email verification
   - Welcome tour
   - Role selection

---

**Happy Learning! 🎓**
