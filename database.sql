-- LMS Database Schema (MySQL)
-- Created based on frontend requirements and data structures
-- Recommended Spring Boot configuration:
-- spring.jpa.hibernate.ddl-auto=update
-- spring.jpa.show-sql=true
-- spring.jpa.properties.hibernate.format_sql=true
-- spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl (if you want to keep exact names)
-- OR use default (SpringPhysicalNamingStrategy) which maps camelCase to snake_case automatically.

CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    student_id VARCHAR(50) UNIQUE, -- Also used for Teacher ID
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. CLASSES TABLE (e.g., "Web Development - Class A")
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester VARCHAR(50) NOT NULL, -- e.g., "HK2 2025"
    instructor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. CLASS MEMBERS (Students enrolled in classes)
CREATE TABLE IF NOT EXISTS class_members (
    class_id INT,
    student_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. COURSES TABLE (Subjects within a class)
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- 5. COURSE CHAPTERS
CREATE TABLE IF NOT EXISTS course_chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 6. COURSE MATERIALS
CREATE TABLE IF NOT EXISTS course_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT,
    name VARCHAR(255) NOT NULL,
    type ENUM('pdf', 'folder', 'file', 'video') NOT NULL,
    url VARCHAR(255),
    size VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES course_chapters(id) ON DELETE CASCADE
);

-- 7. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 8. ASSIGNMENT ATTACHMENTS (Teacher uploads)
CREATE TABLE IF NOT EXISTS assignment_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

-- 9. SUBMISSIONS (Student work)
CREATE TABLE IF NOT EXISTS submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    student_id INT,
    file_url VARCHAR(255),
    note TEXT,
    grade DECIMAL(5,2),
    feedback TEXT,
    status ENUM('pending', 'submitted', 'graded') DEFAULT 'submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. EXAMS
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    total_points DECIMAL(5,2) DEFAULT 10.00,
    status ENUM('upcoming', 'active', 'finished') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 11. EXAM QUESTIONS
CREATE TABLE IF NOT EXISTS exam_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    text TEXT NOT NULL,
    type ENUM('single', 'multiple') NOT NULL,
    points DECIMAL(5,2) DEFAULT 1.00,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
);

-- 12. EXAM OPTIONS
CREATE TABLE IF NOT EXISTS exam_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE
);

-- 13. EXAM SUBMISSIONS (Attempts)
CREATE TABLE IF NOT EXISTS exam_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    student_id INT,
    score DECIMAL(5,2),
    passed BOOLEAN,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. EXAM ANSWERS (Specific student choices)
CREATE TABLE IF NOT EXISTS exam_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT,
    question_id INT,
    option_id INT, -- links to chosen option
    FOREIGN KEY (submission_id) REFERENCES exam_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES exam_options(id) ON DELETE CASCADE
);

-- 15. DISCUSSIONS (Threads)
CREATE TABLE IF NOT EXISTS discussions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    author_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. DISCUSSION REPLIES
CREATE TABLE IF NOT EXISTS discussion_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discussion_id INT,
    author_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 17. LIKES (For Threads and Replies)
CREATE TABLE IF NOT EXISTS discussion_likes (
    user_id INT,
    target_id INT,
    target_type ENUM('thread', 'reply') NOT NULL,
    PRIMARY KEY (user_id, target_id, target_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. SCHEDULE / EVENTS
CREATE TABLE IF NOT EXISTS schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    instructor_id INT,
    title VARCHAR(255) NOT NULL,
    type ENUM('lecture', 'lab', 'workshop', 'exam') NOT NULL,
    day_of_week INT NOT NULL, -- 1 (Mon) to 7 (Sun)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100),
    color VARCHAR(7) DEFAULT '#3B82F6',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- SEED DATA (Based on Frontend Mock Data)
-- ==========================================

-- Insert Users
INSERT INTO users (name, email, password, role, student_id, phone) VALUES 
('Nguyễn Văn A', 'student@lms.edu', 'student123', 'student', '20210001', '+84 123 456 789'),
('Trần Thị B', 'student2@lms.edu', 'student123', 'student', '20210002', '+84 123 456 790'),
('Dr. Trần Thị B', 'teacher@lms.edu', 'teacher123', 'teacher', 'TEA001', '+84 987 654 321'),
('Admin User', 'admin@lms.edu', 'admin123', 'admin', 'ADM001', '+84 999 888 777');

-- Insert Classes
INSERT INTO classes (name, semester, instructor_id) VALUES 
('Web Development - Class A', 'HK2 2025', 3),
('Data Structures - Class B', 'HK2 2025', 3),
('Database Systems - Class A', 'HK2 2025', 3);

-- Enroll Students
INSERT INTO class_members (class_id, student_id) VALUES (1, 1), (1, 2), (2, 1), (3, 2);

-- Insert Courses
INSERT INTO courses (class_id, name, description) VALUES 
(1, 'Web Development Fundamentals', 'Learn HTML, CSS, React and more.'),
(2, 'Data Structures & Algorithms', 'Master the core concepts of computer science.'),
(3, 'Database Systems', 'Design and optimize SQL databases.');

-- Insert Chapters
INSERT INTO course_chapters (course_id, name, sort_order) VALUES 
(1, 'Các thông báo', 1),
(1, 'Bài giảng', 2),
(1, 'Bài tập', 3);

-- Insert Assignments
INSERT INTO assignments (course_id, name, description, due_date, max_score) VALUES 
(1, 'React Component Design', 'Design a reusable button component.', '2026-06-05 23:59:59', 10.0),
(1, 'CSS Flexbox Practice', 'Implement a responsive layout.', '2026-06-08 23:59:59', 10.0),
(2, 'Algorithm Analysis', 'Analyze time complexity of sorting algorithms.', '2026-06-02 23:59:59', 10.0);

-- Insert Submissions
INSERT INTO submissions (assignment_id, student_id, grade, feedback, status) VALUES 
(1, 1, NULL, NULL, 'submitted'),
(1, 2, 9.5, 'Excellent work!', 'graded');

-- Insert Exams
INSERT INTO exams (course_id, name, date, duration, total_points, status) VALUES 
(1, 'Midterm Exam - Web Development', '2026-06-10 08:00:00', 90, 10.0, 'upcoming'),
(2, 'Final Exam - Data Structures', '2026-06-15 09:00:00', 120, 10.0, 'upcoming');

-- Insert Discussions
INSERT INTO discussions (course_id, author_id, title, content) VALUES 
(1, 1, 'How to optimize React performance?', 'What are the best practices for useMemo and useCallback?');

-- Insert Schedule
INSERT INTO schedule (course_id, instructor_id, title, type, day_of_week, start_time, end_time, room) VALUES 
(1, 3, 'Web Development Lecture', 'lecture', 1, '09:00:00', '11:00:00', 'Room A101'),
(2, 3, 'DSA Lab Session', 'lab', 1, '13:00:00', '15:00:00', 'Lab B202');
