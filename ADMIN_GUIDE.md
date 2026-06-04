# Admin User Management Guide

## 🔐 Overview

The Admin User Management system provides comprehensive tools for managing users in the LMS platform. Only users with **Admin role** have access to this feature.

---

## ✨ Features

### 1. **View All Users**
- Comprehensive table with sortable columns
- Real-time search by name, email, or student ID
- Filter by role (All / Student / Teacher / Admin)
- Display user details: name, email, phone, role, status
- Statistics dashboard showing:
  - Total users
  - Total students
  - Total teachers
  - Total admins

### 2. **Create User (Single)**
Click **"Tạo người dùng"** button to add a single user manually.

**Required Fields**:
- Họ và tên (Full Name) *
- Email *
- Vai trò (Role) *
- Trạng thái (Status)

**Optional Fields**:
- MSSV/Mã GV (Student ID / Teacher Code)
- Số điện thoại (Phone Number)

**Roles Available**:
- Sinh viên (Student)
- Giảng viên (Teacher)
- Quản trị viên (Admin)

**Status Options**:
- Hoạt động (Active)
- Ngừng (Inactive)

---

### 3. **Edit User**
Click the ✏️ **Edit** icon in the Actions column.

**Editable Fields**:
- Full name
- Email
- Role
- Status
- Student ID / Teacher Code
- Phone number

Changes are saved immediately and reflected in the table.

---

### 4. **Delete User**
Click the 🗑️ **Delete** icon in the Actions column.

**Process**:
1. Confirmation modal appears
2. Shows user name to confirm
3. Click "Xóa" to permanently delete
4. Click "Hủy" to cancel

⚠️ **Warning**: Deletion is permanent and cannot be undone.

---

### 5. **Import from Excel**
Click **"Import Excel"** button to bulk import users.

**Steps**:

**A. Download Template**
1. Click "Tải template mẫu" in the import modal
2. Template file `Template_Import_Users.xlsx` will download
3. Open in Excel/Google Sheets

**B. Prepare Your Data**

Template columns:
| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| MSSV/Mã GV | Student ID or Teacher Code | Optional | 20210001 |
| Họ và tên | Full name | Yes | Nguyễn Văn A |
| Email | Email address | Yes | student@example.com |
| Vai trò | Role (Sinh viên / Giảng viên / Quản trị viên) | Yes | Sinh viên |
| Số điện thoại | Phone number | Optional | +84 123 456 789 |

**C. Upload File**
1. Click "Click để chọn file Excel"
2. Select your .xlsx or .xls file
3. File name appears with green checkmark
4. Click "Import" to add users

**D. Result**
- All valid users are added to the system
- Users appear in the table immediately
- Duplicate emails are allowed (system generates unique IDs)

**Supported Formats**:
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

**Role Mapping**:
- "Sinh viên" or "student" → Student
- "Giảng viên" or "teacher" → Teacher
- "Quản trị viên" or "admin" → Admin

---

### 6. **Export to Excel**
Click **"Xuất Excel"** button to download current user list.

**Export Details**:
- File name: `DanhSachNguoiDung_YYYY-MM-DD.xlsx`
- Includes all filtered users (respects search and filter)
- Formatted columns with appropriate widths

**Exported Columns**:
1. MSSV/Mã GV (Student ID / Teacher Code)
2. Họ và tên (Full Name)
3. Email
4. Vai trò (Role - in Vietnamese)
5. Số điện thoại (Phone)
6. Trạng thái (Status - translated)
7. Ngày tạo (Created Date)

**Use Cases**:
- Backup user data
- Share user list with stakeholders
- Audit user accounts
- Prepare reports

---

## 🎯 Common Workflows

### Workflow 1: Add 100 New Students
1. Click "Import Excel"
2. Download template
3. Fill in 100 student records
4. Upload file
5. Click "Import"
6. ✅ All 100 students added instantly

### Workflow 2: Update User Role
1. Search for user by name or email
2. Click Edit icon
3. Change "Vai trò" dropdown
4. Click "Lưu"
5. ✅ User role updated

### Workflow 3: Deactivate Multiple Users
1. Use checkboxes to select users
2. (Future: Bulk action dropdown)
3. For now: Edit each user individually
4. Change status to "Ngừng"

### Workflow 4: Export Current Semester Students
1. Filter by role: "Sinh viên"
2. Search if needed (e.g., by class code)
3. Click "Xuất Excel"
4. ✅ Excel file downloads with filtered results

### Workflow 5: Delete Graduated Students
1. Search for students by graduation year
2. Click Delete icon for each
3. Confirm deletion
4. ✅ Users removed from system

---

## 📊 Table Features

### Sortable Columns
Click column headers to sort:
- Name (alphabetical)
- Email (alphabetical)
- Role (student → teacher → admin)
- Status (active → inactive)

### Selectable Rows
- Checkboxes on each row
- Select all checkbox in header
- (Future: Bulk operations on selected rows)

### Search
Real-time filtering by:
- Full name (partial match)
- Email (partial match)
- Student ID (exact or partial)

### Role Filter
Dropdown to show only:
- All users
- Students only
- Teachers only
- Admins only

---

## 🔒 Permissions

### Admin Only
- ✅ View all users
- ✅ Create users
- ✅ Edit any user
- ✅ Delete any user
- ✅ Import users
- ✅ Export users

### Teacher
- ❌ No access to admin panel

### Student
- ❌ No access to admin panel

---

## 📝 Data Validation

### Email Validation
- Must be valid email format
- Unique emails recommended (not enforced)

### Role Validation
- Must be one of: student, teacher, admin
- Case-insensitive for imports

### Student ID
- Optional for teachers and admins
- Recommended for students
- No format restrictions

### Phone Number
- Optional for all roles
- No format validation (accepts any text)

---

## 🚨 Error Handling

### Import Errors
**Missing Required Columns**:
- Import will fail if "Họ và tên" or "Email" missing
- Check template format

**Invalid Role**:
- Defaults to "student" if role not recognized
- Accepts: Sinh viên, Giảng viên, Quản trị viên, student, teacher, admin

**File Format Error**:
- Only .xlsx and .xls supported
- CSV not supported (convert to Excel first)

### Edit/Delete Errors
**Cannot Delete Self**:
- (Future feature: prevent admin from deleting own account)

**Cannot Change Own Role**:
- (Future feature: prevent role demotion)

---

## 💡 Tips & Best Practices

### For Import
1. **Always download template** - Ensures correct column names
2. **Test with 2-3 rows first** - Verify format before importing hundreds
3. **Keep a backup** - Export current users before bulk import
4. **Use consistent role names** - Stick to Vietnamese or English, not mixed

### For Export
1. **Filter before export** - Only exports visible (filtered) users
2. **Regular backups** - Export weekly for data safety
3. **Descriptive file names** - System adds date automatically

### For User Management
1. **Use search** - Faster than scrolling through long lists
2. **Deactivate instead of delete** - Preserves historical data
3. **Consistent naming** - Use full legal names
4. **Verify emails** - Ensure students can receive notifications

---

## 📱 Responsive Design

### Desktop
- Full table with all columns visible
- Side-by-side controls
- Wide modals for easy data entry

### Tablet
- Horizontal scroll for table
- Stacked controls
- Medium modals

### Mobile
- Card view (future enhancement)
- Vertical stacked controls
- Full-width modals

---

## 🔄 Data Flow

```
┌─────────────────┐
│  Create User    │──────┐
│  (Form)         │      │
└─────────────────┘      │
                         ▼
┌─────────────────┐   ┌──────────────┐
│  Import Excel   │──▶│  User List   │
│  (Bulk Upload)  │   │  (State)     │
└─────────────────┘   └──────────────┘
                         │
                         ▼
                    ┌──────────────┐
                    │  DataTable   │
                    │  (Display)   │
                    └──────────────┘
                         │
                         ▼
              ┌──────────┴──────────┐
              │                     │
         ┌────▼────┐          ┌────▼────┐
         │  Edit   │          │ Delete  │
         └─────────┘          └─────────┘
              │                     │
              └──────────┬──────────┘
                         ▼
                    ┌──────────────┐
                    │ Export Excel │
                    │ (Download)   │
                    └──────────────┘
```

---

## 🎨 UI Components Used

- **DataTable** - Main user list with sorting and selection
- **Modal** - Create, Edit, Delete, Import dialogs
- **Badge** - Role and status indicators
- **Search** - Real-time filter input
- **Dropdown** - Role filter selector
- **File Input** - Excel upload
- **Buttons** - Actions (Create, Import, Export, Edit, Delete)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Bulk actions (delete, activate, deactivate selected users)
- [ ] Advanced filters (by creation date, status, department)
- [ ] User profile pictures
- [ ] Email verification system
- [ ] Password reset for users
- [ ] Activity log (who created/edited/deleted)
- [ ] CSV import support
- [ ] User invitation system (send welcome email)
- [ ] Role permissions customization
- [ ] Audit trail (track all changes)

### Import Enhancements
- [ ] Preview imported data before confirmation
- [ ] Validation errors report (show which rows failed)
- [ ] Duplicate detection (warn about existing emails)
- [ ] Auto-generate usernames
- [ ] Bulk password generation

### Export Enhancements
- [ ] Export to PDF
- [ ] Export to CSV
- [ ] Custom column selection
- [ ] Export templates with formulas
- [ ] Scheduled exports (email weekly reports)

---

## 📚 Related Documentation

- [Authentication Guide](./AUTH_GUIDE.md) - User login and roles
- [README](./README.md) - General application overview
- [Features Guide](./FEATURES.md) - All platform features

---

## 🆘 Troubleshooting

### Import Not Working
**Problem**: Excel file won't upload
**Solution**: 
- Check file format (.xlsx or .xls only)
- Ensure file size < 10MB
- Try re-downloading template

### Missing Columns After Export
**Problem**: Exported file missing data
**Solution**:
- Check if search/filter was active
- Export shows only filtered results
- Clear filters to export all users

### Cannot Edit User
**Problem**: Edit button not working
**Solution**:
- Ensure you're logged in as Admin
- Refresh page
- Check browser console for errors

### Deleted User Still Appears
**Problem**: User reappears after deletion
**Solution**:
- Refresh page (F5)
- Check if backend connected (currently local state)
- In production, deletion would be permanent

---

**Last Updated**: 2026-06-03
**Version**: 1.0.0
