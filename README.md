# LMS Web Application

A modern, feature-rich Learning Management System built with React, TypeScript, and Tailwind CSS.

## 🎨 Design System

### Visual Style
- **Theme**: Clean, professional, light theme
- **Typography**: 
  - Headings: DM Sans
  - Body: IBM Plex Sans
  - Code: JetBrains Mono
- **Colors**:
  - Primary: Indigo `#6D28D9`
  - Success: Emerald `#059669`
  - Warning: Amber `#D97706`
  - Danger: Rose `#E11D48`
  - Background: `#F8F9FC`

### Layout
- **Sidebar**: 240px (collapsible to 64px icon-only)
- **Topbar**: 64px fixed height
- **Content**: Max-width 1280px, centered
- **Spacing**: 8px grid system
- **Border Radius**: 8px (inputs), 12px (cards), 16px (modals)

## 🧩 Features

### For Students
- **Dashboard**: Overview with stats, course progress, upcoming deadlines, and activity heatmap
- **Courses**: Browse courses, track progress, access lessons, videos, and materials
- **Assignments**: View, submit, and track assignment status and grades
- **Exams**: Take timed exams with question navigation and review results
- **Grades**: View grades in table or chart format with GPA trends
- **Discussions**: Participate in course discussions with teachers and peers
- **Schedule**: Week/month/list calendar views for classes and events

### For Teachers
- **Grade Assignments**: Review submissions and provide feedback
- **Manage Exams**: Create and grade exams
- **Reports**: View enrollment trends and student performance analytics

### For Admins
- **User Management**: Create, edit, and manage user accounts
- **System Reports**: Monitor platform usage and metrics

## 📁 Project Structure

```
src/
├── app/
│   ├── features/              # Feature-based architecture
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── assignments/
│   │   ├── exams/
│   │   ├── grades/
│   │   ├── discussions/
│   │   ├── schedule/
│   │   ├── classes/
│   │   ├── reports/
│   │   └── admin/
│   ├── components/
│   │   ├── layout/            # MainLayout, Topbar, Sidebar
│   │   ├── shared/            # Reusable UI components
│   │   └── demo/              # Component showcase
│   ├── routes.tsx             # React Router configuration
│   └── App.tsx                # Root component
└── styles/
    ├── theme.css              # Design tokens and base styles
    └── fonts.css              # Typography imports
```

## 🎯 Shared Components

All components are available in `src/app/components/shared/`:

- **DataTable**: Sortable, selectable table with empty states
- **Badge**: Status badges with color variants
- **PageHeader**: Consistent page headers with breadcrumbs
- **Modal**: Animated modal dialogs with backdrop blur
- **Toast**: Stack-based toast notifications
- **Skeleton**: Loading states matching content shape
- **EmptyState**: Consistent empty state messaging
- **FileDropzone**: Drag-and-drop file upload

## 🎭 Animations

- **Page transitions**: Fade-in 200ms
- **Card hover**: Lift 2px with shadow deepening (150ms)
- **Modal**: Scale + fade animation (200ms)
- **Progress bars**: Animate on mount (600ms)
- **Button press**: Scale down on active (100ms)

## 🔐 Authentication

The application now includes a complete login system with role-based access control.

### Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Student** | student@lms.edu | student123 | View courses, submit assignments, take exams |
| **Teacher** | teacher@lms.edu | teacher123 | Grade assignments, view reports, manage classes |
| **Admin** | admin@lms.edu | admin123 | Full system access, user management |

### Quick Login
On the login page, click any role card for instant access (demo mode).

### Features
- ✅ Session persistence (survives page refresh)
- ✅ Protected routes (auto-redirect to login)
- ✅ Role-based navigation (shows/hides menu items)
- ✅ Personalized greeting (displays user name)
- ✅ Logout functionality

**See [AUTH_GUIDE.md](./AUTH_GUIDE.md) for complete authentication documentation.**

---

## 👥 Admin User Management

Admins have full control over user management with comprehensive CRUD operations and bulk import/export capabilities.

### Key Features

✅ **Create Users**
- Add users individually via form
- Required: Name, Email, Role
- Optional: Student ID, Phone number

✅ **Edit Users**
- Modify any user information
- Change roles and status
- Update contact details

✅ **Delete Users**
- Remove users with confirmation
- Permanent deletion

✅ **Import from Excel**
- Bulk upload hundreds of users at once
- Download Excel template
- Automatic role mapping
- Supports .xlsx and .xls formats

✅ **Export to Excel**
- Download complete user list
- Formatted columns with proper widths
- Respects current filters
- Date-stamped filename

✅ **Advanced Filtering**
- Search by name, email, or student ID
- Filter by role (Student/Teacher/Admin)
- Real-time results

✅ **Statistics Dashboard**
- Total users count
- Students, Teachers, Admins breakdown
- Visual overview

### Quick Start

1. Log in as Admin (`admin@lms.edu` / `admin123`)
2. Navigate to **Admin** in sidebar
3. Use **"Tạo người dùng"** to add single user
4. Use **"Import Excel"** for bulk upload
5. Use **"Xuất Excel"** to download user list

**See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed admin user management documentation.**

---

## 🚀 Getting Started

The application is already set up and running in Figma Make. First, log in with one of the demo accounts, then navigate through the sidebar to explore different features:

0. **Login** (`/login`) - Authentication with role selection
1. **Dashboard** (`/`) - Overview and quick actions
2. **Courses** (`/courses`) - Browse and access course content
3. **Assignments** (`/assignments`) - Manage assignments
4. **Exams** (`/exams`) - Take and review exams
5. **Grades** (`/grades`) - View academic performance
6. **Discussions** (`/discussions`) - Community forums
7. **Schedule** (`/schedule`) - Calendar and events
8. **Components** (`/components`) - UI component showcase

## 📱 Responsive Design

- **Desktop (≥1280px)**: Full sidebar, 3-column grids
- **Tablet (768-1279px)**: Icon-only sidebar, 2-column grids
- **Mobile (<768px)**: Bottom navigation bar, single column

## 🛠️ Technologies

- **React 18** - UI framework
- **React Router 7** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **Motion/React** - Smooth animations
- **Lucide React** - Icon library

## 📚 Design Patterns

- **Feature-based architecture**: Code organized by domain (not by role)
- **Shared component library**: Reusable UI components with consistent styling
- **Type-safe**: Full TypeScript coverage
- **Responsive-first**: Mobile, tablet, and desktop layouts
- **Accessible**: Keyboard navigation, semantic HTML, ARIA labels

## 🎨 Component Showcase

Visit `/components` to see all UI components in action with interactive demos.
