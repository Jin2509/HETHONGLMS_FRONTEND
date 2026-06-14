# Backend commands/spec to match current FE

Use this as the implementation prompt for BE:

```text
Update LMS backend to match the current frontend API contract.

General response format:
- Every list endpoint may return either { "data": [...] } or a Spring Page { "data": { "content": [...], "totalElements": n } }.
- Every detail/create/update endpoint should return { "data": object }.
- Use JWT Bearer auth for all endpoints below.
- CORS: allow FE origins http://localhost:5173 and http://127.0.0.1:5173 (preflight with Authorization header must return 200, not 403).

1) Users / students
- GET /api/users?role=student&limit=10000
- Return all student users with fields:
  id, name, email, role, status, studentId, phone, createdAt, updatedAt.
- role must be one of: student, teacher, admin.

2) Classes
- GET /api/classes
- GET /api/classes/{id}
- POST /api/classes
  Request:
  {
    "name": "Web Development - Class A",
    "instructorId": 1,
    "semester": "HK2 2025",
    "studentIds": ["20210001", "20210002"]
  }
  Behavior:
  - Create class.
  - If studentIds is present, enroll matching students by studentId/code.
  Response data fields:
  id, name, semester, instructorId, instructorName, studentCount, courseCount, createdAt.

- GET /api/classes/{id}/members
  Return members with:
  id, userId, name, email, studentId, phone, department, enrolledAt.

- POST /api/classes/{id}/enroll
  Accept either:
  { "studentId": 123 } or { "codeId": "20210001" }
  Behavior:
  - Enroll the student into class if not already enrolled.
  - Return success without duplicating existing enrollment.

3) Courses inside a class
- GET /api/courses?classId={classId}
  Return only courses that belong to this class.
  Course fields:
  id, classId, name, description, thumbnailUrl, instructor, chapters.
  chapters should default to [] if no chapters exist.

- POST /api/courses
  Request:
  {
    "classId": 1,
    "name": "React Fundamentals",
    "description": "Intro course",
    "thumbnailUrl": "https://example.com/image.jpg",
    "studentIds": ["20210001", "20210002"]
  }
  Behavior:
  - Create the course with classId.
  - If studentIds is present, ensure those students are enrolled in the class.
  Response data fields:
  id, classId, name, description, thumbnailUrl, instructor, chapters.

- PATCH /api/courses/{id}
  Accept name, description, thumbnailUrl.

- DELETE /api/courses/{id}
  Delete course.

4) Report/dashboard endpoints
- GET /api/reports/stats
  Return:
  {
    "totalUsers": 0,
    "totalClasses": 0,
    "totalCourses": 0,
    "totalAssignments": 0,
    "totalExams": 0,
    "totalDiscussions": 0,
    "completionRate": 0,
    "monthlySubmissions": 0,
    "activeUsers": 0,
    "newUsersToday": 0
  }
- GET /api/reports/enrollment -> [{ "id": 1, "month": "06/2026", "students": 20 }]
- GET /api/reports/submissions -> [{ "id": 1, "course": "React Fundamentals", "count": 12 }]
- GET /api/reports/top-students -> [{ "rank": 1, "name": "Nguyen Van A", "gpa": 9.2, "completion": 98 }]
```

SQL reminders if missing:

```sql
ALTER TABLE courses ADD COLUMN class_id BIGINT NULL;
ALTER TABLE courses ADD CONSTRAINT fk_courses_class FOREIGN KEY (class_id) REFERENCES classes(id);

CREATE TABLE IF NOT EXISTS class_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  class_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_class_user (class_id, user_id)
);
```
