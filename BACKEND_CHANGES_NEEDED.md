# Backend Changes Needed

## Overview
This document outlines the backend API changes needed to support the frontend updates for class management.

## 1. Class Creation API Changes

### Current Issue
- The frontend no longer sends `courseId` when creating a class since the class name is now the subject
- Need to create a base structure for materials when a new class is created

### Required Changes

#### Update POST /classes endpoint
- **Remove**: `courseId` field from request body (optional or removed)
- **Add**: Automatic creation of a materials folder/base structure when a class is created
- **Response**: Should return the created class with all fields populated

**Example Request:**
```json
{
  "name": "Web Development - Class A",
  "instructorId": 1,
  "semester": "HK2 2025",
  "studentIds": ["12345", "12346", "12347"]
}
```

**Example Response:**
```json
{
  "message": "Class created successfully",
  "data": {
    "id": 1,
    "name": "Web Development - Class A",
    "semester": "HK2 2025",
    "instructorId": 1,
    "instructorName": "Dr. Nguyễn Văn B",
    "studentCount": 3,
    "courseCount": 0,
    "createdAt": "2026-06-13T10:00:00Z"
  }
}
```

## 2. Class Materials API

### Current Issue
- No API endpoint exists for managing class-level materials
- Frontend has placeholder code for material upload

### Required Changes

#### Add Class Materials Endpoints

**GET /classes/{id}/materials**
- Get all materials for a class
- **Response**: Array of material objects

**POST /classes/{id}/materials**
- Upload a new material to a class
- **Request**: FormData with file and metadata
- **Response**: Created material object

**DELETE /classes/{id}/materials/{materialId}**
- Delete a material from a class
- **Response**: Success message

**Material Object Structure:**
```json
{
  "id": 1,
  "name": "Slide bài giảng tuần 1-4",
  "type": "PDF",
  "size": "2.4 MB",
  "date": "2026-02-05",
  "url": "https://example.com/materials/1.pdf"
}
```

## 3. Student Management API

### Current Issue
- Student import functionality exists but needs verification
- Need to ensure student data is properly returned with all required fields

### Required Changes

#### Verify POST /classes/{id}/members/import
- Ensure Excel file import works correctly
- Should accept .xlsx, .xls, .csv files
- Should return list of imported students

#### Verify GET /classes/{id}/members
- Ensure response includes all required fields:
  - `id`
  - `studentId` (MSSV)
  - `name`
  - `email`
  - `department`
  - `phone` (optional)
  - `enrolledAt`

**Example Response:**
```json
{
  "message": "Members retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 101,
      "studentId": "12345",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@university.edu",
      "department": "Công nghệ thông tin",
      "phone": "+84 123 456 789",
      "enrolledAt": "2026-02-01T10:00:00Z"
    }
  ]
}
```

## 4. Course Management API

### Current Issue
- Frontend needs to create courses within a class context
- Need to associate courses with classes

### Required Changes

#### Add Class-Course Association

**POST /classes/{id}/courses**
- Create a new course within a class
- **Request**: Course creation data
- **Response**: Created course with class association

**GET /classes/{id}/courses**
- Get all courses for a specific class
- **Response**: Array of courses with progress data

**Course Object Structure (with UI fields):**
```json
{
  "id": 1,
  "name": "Introduction to Web Development",
  "description": "Learn HTML, CSS, and JavaScript fundamentals",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "status": "Đang học",
  "lessons": 20,
  "duration": "8 tuần",
  "progress": 45,
  "chapters": []
}
```

## 5. Class Detail API Enhancement

### Current Issue
- Class detail response lacks some UI-specific fields

### Required Changes

#### Enhance GET /classes/{id} response
- Add additional fields for UI display:
  - `code` (class code)
  - `schedule` (class schedule)
  - `room` (room number)
  - `startDate` and `endDate`
  - `instructorEmail` and `instructorPhone`

**Example Enhanced Response:**
```json
{
  "message": "Class retrieved successfully",
  "data": {
    "id": 1,
    "name": "Web Development - Class A",
    "code": "IT4788",
    "semester": "HK2 2025",
    "instructorId": 1,
    "instructorName": "Dr. Nguyễn Văn B",
    "instructorEmail": "nguyenvanb@university.edu",
    "instructorPhone": "+84 123 456 789",
    "schedule": "Thứ 2, 13:00 - 15:00",
    "room": "Room A101",
    "startDate": "2026-02-01",
    "endDate": "2026-06-15",
    "studentCount": 45,
    "courseCount": 3,
    "createdAt": "2026-02-01T10:00:00Z"
  }
}
```

## 6. File Upload Configuration

### Required Changes

- Ensure multipart/form-data is properly handled for:
  - Material uploads
  - Student import files
  - Course thumbnails

- Configure file size limits and allowed file types:
  - Materials: PDF, DOCX, PPTX, ZIP, RAR (max 50MB)
  - Student import: XLSX, XLS, CSV (max 10MB)
  - Thumbnails: JPG, PNG, GIF (max 5MB)

## 7. Database Schema Updates

### Required Changes

#### Add Class Materials Table
```sql
CREATE TABLE class_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  size VARCHAR(50),
  url VARCHAR(500),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

#### Update Classes Table
```sql
ALTER TABLE classes
ADD COLUMN code VARCHAR(50),
ADD COLUMN schedule VARCHAR(100),
ADD COLUMN room VARCHAR(50),
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN instructor_email VARCHAR(100),
ADD COLUMN instructor_phone VARCHAR(20);
```

#### Add Class-Course Association Table
```sql
CREATE TABLE class_courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  class_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE KEY (class_id, course_id)
);
```

## Priority Order

1. **High Priority**: 
   - Update class creation API (remove courseId, add base structure)
   - Add class materials endpoints
   - Enhance class detail response

2. **Medium Priority**:
   - Verify student management endpoints
   - Add class-course association endpoints

3. **Low Priority**:
   - Database schema updates (if not already done)
   - File upload configuration improvements

## Testing Checklist

- [ ] Class creation without courseId works correctly
- [ ] Class creation automatically creates materials folder
- [ ] Material upload to class works
- [ ] Material retrieval from class works
- [ ] Material deletion works
- [ ] Student import from Excel works
- [ ] Student list retrieval includes all required fields
- [ ] Course creation within class works
- [ ] Course retrieval for class works
- [ ] Class detail includes all UI-specific fields
