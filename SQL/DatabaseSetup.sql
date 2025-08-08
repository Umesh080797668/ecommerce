-- Skills International School Quiz System Database Setup
-- This script creates the Student database and all required tables

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Student')
BEGIN
    CREATE DATABASE Student;
END
GO

USE Student;
GO

-- Drop existing tables if they exist (for clean setup)
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'QuizResults')
    DROP TABLE QuizResults;
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
    DROP TABLE Questions;
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Logins')
    DROP TABLE Logins;
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Registration')
    DROP TABLE Registration;
GO

-- Create Registration table for students
CREATE TABLE Registration (
    regNo int PRIMARY KEY IDENTITY(1,1),
    firstName varchar(50) NOT NULL,
    lastName varchar(50) NOT NULL,
    dateOfBirth datetime NOT NULL,
    gender varchar(50) NOT NULL,
    address varchar(500) NOT NULL,
    email varchar(50) NOT NULL,
    mobilePhone bigint NOT NULL,
    homePhone bigint,
    parentName varchar(50) NOT NULL,
    nic varchar(50) NOT NULL,
    contactNo bigint NOT NULL,
    registrationDate datetime DEFAULT GETDATE()
);
GO

-- Create Logins table
CREATE TABLE Logins (
    id int PRIMARY KEY IDENTITY(1,1),
    username varchar(50) NOT NULL UNIQUE,
    password varchar(50) NOT NULL,
    role varchar(20) DEFAULT 'User',
    isActive bit DEFAULT 1,
    createdDate datetime DEFAULT GETDATE()
);
GO

-- Create Questions table for quiz
CREATE TABLE Questions (
    questionId int PRIMARY KEY IDENTITY(1,1),
    questionText varchar(500) NOT NULL,
    optionA varchar(200) NOT NULL,
    optionB varchar(200) NOT NULL,
    optionC varchar(200) NOT NULL,
    optionD varchar(200) NOT NULL,
    correctAnswer char(1) NOT NULL CHECK (correctAnswer IN ('A', 'B', 'C', 'D')),
    subject varchar(50) NOT NULL,
    difficulty varchar(20) DEFAULT 'Medium',
    isActive bit DEFAULT 1,
    createdDate datetime DEFAULT GETDATE()
);
GO

-- Create QuizResults table
CREATE TABLE QuizResults (
    resultId int PRIMARY KEY IDENTITY(1,1),
    studentRegNo int NOT NULL,
    score int NOT NULL,
    totalQuestions int NOT NULL,
    timeTaken int NOT NULL, -- in seconds
    quizDate datetime DEFAULT GETDATE(),
    FOREIGN KEY (studentRegNo) REFERENCES Registration(regNo) ON DELETE CASCADE
);
GO

-- Insert default login credentials
INSERT INTO Logins (username, password, role) VALUES ('Admin', 'Skills@123', 'Administrator');
INSERT INTO Logins (username, password, role) VALUES ('teacher', 'teacher123', 'Teacher');
GO

-- Insert sample questions for testing
INSERT INTO Questions (questionText, optionA, optionB, optionC, optionD, correctAnswer, subject) VALUES
('What is the capital of Sri Lanka?', 'Colombo', 'Kandy', 'Galle', 'Jaffna', 'A', 'Geography'),
('Who wrote the novel "1984"?', 'George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'H.G. Wells', 'A', 'Literature'),
('What is 15 + 25?', '30', '35', '40', '45', 'C', 'Mathematics'),
('Which planet is closest to the Sun?', 'Venus', 'Earth', 'Mercury', 'Mars', 'C', 'Science'),
('What is the largest mammal in the world?', 'African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear', 'B', 'Biology'),
('In which year did World War II end?', '1944', '1945', '1946', '1947', 'B', 'History'),
('What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 'C', 'Chemistry'),
('Which programming language is known as the "mother of all languages"?', 'C', 'Assembly', 'FORTRAN', 'COBOL', 'A', 'Computer Science'),
('What is the square root of 144?', '11', '12', '13', '14', 'B', 'Mathematics'),
('Who painted the Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 'C', 'Art');
GO

-- Insert sample student data
INSERT INTO Registration (firstName, lastName, dateOfBirth, gender, address, email, mobilePhone, homePhone, parentName, nic, contactNo) VALUES
('John', 'Doe', '2005-03-15', 'Male', '123 Main Street, Colombo', 'john.doe@email.com', 94771234567, 94112345678, 'Robert Doe', '200512345678', 94771234567),
('Jane', 'Smith', '2004-07-22', 'Female', '456 Oak Avenue, Kandy', 'jane.smith@email.com', 94779876543, 94812345678, 'Mary Smith', '200423456789', 94779876543),
('Mike', 'Johnson', '2005-11-08', 'Male', '789 Pine Road, Galle', 'mike.johnson@email.com', 94771111111, 94912345678, 'David Johnson', '200534567890', 94771111111);
GO

-- Create indexes for better performance
CREATE INDEX IX_Registration_Name ON Registration(firstName, lastName);
CREATE INDEX IX_Questions_Subject ON Questions(subject);
CREATE INDEX IX_QuizResults_Student ON QuizResults(studentRegNo);
CREATE INDEX IX_QuizResults_Date ON QuizResults(quizDate);
GO

PRINT 'Database setup completed successfully!';
PRINT 'Default login credentials:';
PRINT 'Username: Admin, Password: Skills@123';
PRINT 'Username: teacher, Password: teacher123';
GO