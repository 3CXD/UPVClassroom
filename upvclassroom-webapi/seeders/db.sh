CREATE DATABASE IF NOT EXISTS `upvclassroom`;
USE `upvclassroom`;

CREATE TABLE IF NOT EXISTS `Topics` (
    `topic_id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`topic_id`)
);

CREATE TABLE IF NOT EXISTS `Submissions` (
    `submission_id` INT NOT NULL AUTO_INCREMENT,
    `assignment_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `submitted_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `grade` DECIMAL,
    `feedback` TEXT,
    `graded_at` DATETIME,
    PRIMARY KEY (`submission_id`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'student',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`)
);

CREATE UNIQUE INDEX `idx_Users_email_unique`
ON `Users` (`email`);

CREATE TABLE IF NOT EXISTS `Enrollment` (
    `enrollment_id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `enrolled_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`enrollment_id`),
    UNIQUE (`class_id`, `student_id`)
);

CREATE TABLE IF NOT EXISTS `Classes` (
    `class_id` INT NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(255) NOT NULL,
    `progam` VARCHAR(255) NOT NULL, #carrera
    `semester` VARCHAR(255) NOT NULL, #cuatri(semestre)   
    `description` TEXT,
    `teacher_id` INT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`class_id`)
);

CREATE TABLE IF NOT EXISTS `Materials` ( #se enseña en 'tablon' y al abrir la clase (puede pertecer a un tema)
    `material_id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT NOT NULL,
    `topic_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`material_id`)
);

CREATE TABLE IF NOT EXISTS `Announcements` ( #se enseña en al abrir la clase y nunca en 'tablon'
    `announcement_id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`announcement_id`)
);

CREATE TABLE IF NOT EXISTS `Assignments` ( #se enseña en 'tablon' y al abrir la clase (puede pertenecer a un tema)
    `assignment_id` INT NOT NULL AUTO_INCREMENT,
    `class_id` INT NOT NULL,
    `topic_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `due_date` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`assignment_id`)
);

CREATE TABLE IF NOT EXISTS `MaterialFiles` (
    `file_id` INT NOT NULL AUTO_INCREMENT,
    `generated_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `material_id` INT NOT NULL,
    `uploaded_by` INT NOT NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`file_id`),
    FOREIGN KEY (`material_id`) REFERENCES `Materials`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `AnnouncementFiles` (
    `file_id` INT NOT NULL AUTO_INCREMENT,
    `generated_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `announcement_id` INT NOT NULL,
    `uploaded_by` INT NOT NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`file_id`),
    FOREIGN KEY (`announcement_id`) REFERENCES `Announcements`(`announcement_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `AssignmentFiles` (
    `file_id` INT NOT NULL AUTO_INCREMENT,
    `generated_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `assignment_id` INT NOT NULL,
    `uploaded_by` INT NOT NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`file_id`),
    FOREIGN KEY (`assignment_id`) REFERENCES `Assignments`(`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `SubmissionFiles` (
    `file_id` INT NOT NULL AUTO_INCREMENT,
    `generated_name` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `submission_id` INT NOT NULL,
    `uploaded_by` INT NOT NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`file_id`),
    FOREIGN KEY (`submission_id`) REFERENCES `Submissions`(`submission_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Foreign key constraints
ALTER TABLE `Announcements`
ADD CONSTRAINT `fk_Announcements_class_id` FOREIGN KEY(`class_id`) REFERENCES `Classes`(`class_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Assignments`
ADD CONSTRAINT `fk_Assignments_class_id` FOREIGN KEY(`class_id`) REFERENCES `Classes`(`class_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Assignments`
ADD CONSTRAINT `fk_Assignments_topic_id` FOREIGN KEY(`topic_id`) REFERENCES `Topics`(`topic_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Classes`
ADD CONSTRAINT `fk_Classes_teacher_id` FOREIGN KEY(`teacher_id`) REFERENCES `Users`(`user_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Enrollment`
ADD CONSTRAINT `fk_Enrollment_class_id` FOREIGN KEY(`class_id`) REFERENCES `Classes`(`class_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Enrollment`
ADD CONSTRAINT `fk_Enrollment_student_id` FOREIGN KEY(`student_id`) REFERENCES `Users`(`user_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Materials`
ADD CONSTRAINT `fk_Materials_class_id` FOREIGN KEY(`class_id`) REFERENCES `Classes`(`class_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Materials`
ADD CONSTRAINT `fk_Materials_topic_id` FOREIGN KEY(`topic_id`) REFERENCES `Topics`(`topic_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Submissions`
ADD CONSTRAINT `fk_Submissions_assignment_id` FOREIGN KEY(`assignment_id`) REFERENCES `Assignments`(`assignment_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Submissions`
ADD CONSTRAINT `fk_Submissions_student_id` FOREIGN KEY(`student_id`) REFERENCES `Users`(`user_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `Topics`
ADD CONSTRAINT `fk_Topics_class_id` FOREIGN KEY(`class_id`) REFERENCES `Classes`(`class_id`)
ON UPDATE CASCADE ON DELETE RESTRICT;
